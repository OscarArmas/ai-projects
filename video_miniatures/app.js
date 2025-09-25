// Variables globales
let currentWidget = null;
let backgroundVideo = null;
let isVideoBackground = false;
let isMinimized = false;
let isPlayerMinimized = false;
const CLIENT_ID = 'a3e059563d7fd3fd21b7448916353fc3'; // Client ID público de SoundCloud

// Función para minimizar/mostrar la interfaz
function toggleMinimize() {
    const container = document.getElementById('mainContainer');
    const minimizeBtn = document.getElementById('minimizeBtn');
    const minimizeIcon = document.getElementById('minimizeIcon');
    const indicator = document.getElementById('minimizedIndicator');
    const playerContainer = document.getElementById('playerContainer');
    const playingIndicator = document.getElementById('playingIndicator');
    
    isMinimized = !isMinimized;
    
    if (isMinimized) {
        // Minimizar interfaz
        container.classList.add('minimized-slide', 'opacity-0', 'pointer-events-none');
        minimizeBtn.classList.add('bg-black/30');
        minimizeBtn.classList.remove('bg-white/10');
        minimizeIcon.textContent = '+';
        minimizeBtn.title = 'Mostrar interfaz (M)';
        
        // Minimizar reproductor si está visible
        if (playerContainer.style.display === 'block') {
            playerContainer.classList.add('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        }
        if (playingIndicator.style.display === 'block') {
            playingIndicator.classList.add('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        }
        
        // Mostrar indicador temporal
        indicator.classList.remove('hidden');
        indicator.classList.add('animate-fade-in-out');
        setTimeout(() => {
            indicator.classList.add('hidden');
            indicator.classList.remove('animate-fade-in-out');
        }, 3000);
        
    } else {
        // Mostrar interfaz
        container.classList.remove('minimized-slide', 'opacity-0', 'pointer-events-none');
        minimizeBtn.classList.remove('bg-black/30');
        minimizeBtn.classList.add('bg-white/10');
        minimizeIcon.textContent = '−';
        minimizeBtn.title = 'Minimizar interfaz (M)';
        
        // Restaurar reproductor si estaba visible
        if (playerContainer.style.display === 'block') {
            playerContainer.classList.remove('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        }
        if (playingIndicator.style.display === 'block') {
            playingIndicator.classList.remove('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        }
    }
}

// Función para minimizar solo el reproductor
function togglePlayerMinimize() {
    const playerContainer = document.getElementById('playerContainer');
    const playingIndicator = document.getElementById('playingIndicator');
    const minimizeBtn = document.querySelector('.minimize-player-btn') || 
                       playerContainer.querySelector('button[onclick="togglePlayerMinimize()"]');
    
    isPlayerMinimized = !isPlayerMinimized;
    
    if (isPlayerMinimized) {
        // Minimizar reproductor
        playerContainer.classList.add('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        playingIndicator.classList.add('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        if (minimizeBtn) {
            minimizeBtn.textContent = '+';
            minimizeBtn.title = 'Mostrar reproductor';
        }
    } else {
        // Mostrar reproductor
        playerContainer.classList.remove('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        playingIndicator.classList.remove('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        if (minimizeBtn) {
            minimizeBtn.textContent = '−';
            minimizeBtn.title = 'Minimizar reproductor';
        }
    }
}

// Función para cambiar la imagen de fondo
function changeBackground(imageUrl) {
    hideVideoBackground();
    document.body.style.backgroundImage = `url('${imageUrl}')`;
    isVideoBackground = false;
}

// Función para establecer video de fondo
function setVideoBackground(videoUrl) {
    backgroundVideo = document.getElementById('backgroundVideo');
    backgroundVideo.src = videoUrl;
    backgroundVideo.classList.remove('hidden');
    document.getElementById('videoControls').classList.remove('hidden');
    document.getElementById('videoControls').classList.add('flex');
    
    // Ocultar imagen de fondo
    document.body.style.backgroundImage = 'none';
    isVideoBackground = true;
    
    // Configurar video
    backgroundVideo.muted = true;
    backgroundVideo.loop = true;
    backgroundVideo.play().catch(e => {
        console.log('Error al reproducir video:', e);
        showNotification('⚠️ Error al reproducir video automáticamente');
    });
}

// Ocultar video de fondo
function hideVideoBackground() {
    if (backgroundVideo) {
        backgroundVideo.classList.add('hidden');
        backgroundVideo.src = '';
        document.getElementById('videoControls').classList.add('hidden');
        document.getElementById('videoControls').classList.remove('flex');
        isVideoBackground = false;
    }
}

// Manejar subida de imagen
function handleImageUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Verificar que sea una imagen
    if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
    }
    
    // Verificar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('La imagen es muy grande. Por favor selecciona una imagen menor a 10MB');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        changeBackground(imageUrl);
        closeBackgroundOptions();
        showNotification('✅ Imagen de fondo actualizada');
    };
    
    reader.onerror = function() {
        alert('Error al cargar la imagen. Intenta con otro archivo.');
    };
    
    reader.readAsDataURL(file);
}

// Manejar subida de video
function handleVideoUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Verificar que sea un video
    if (!file.type.startsWith('video/')) {
        alert('Por favor selecciona un archivo de video válido');
        return;
    }
    
    // Verificar tamaño (máximo 50MB)
    if (file.size > 50 * 1024 * 1024) {
        alert('El video es muy grande. Por favor selecciona un video menor a 50MB');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const videoUrl = e.target.result;
        setVideoBackground(videoUrl);
        closeBackgroundOptions();
        showNotification('✅ Video de fondo configurado');
    };
    
    reader.onerror = function() {
        alert('Error al cargar el video. Intenta con otro archivo.');
    };
    
    reader.readAsDataURL(file);
}

// Aplicar fondo desde URL (imagen o video)
function applyUrlBackground() {
    const urlInput = document.getElementById('urlInputBg');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Por favor ingresa una URL válida');
        return;
    }
    
    // Detectar si es video o imagen por extensión
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    
    const isVideoUrl = videoExtensions.some(ext => 
        url.toLowerCase().includes(ext)
    );
    
    const isImageUrl = imageExtensions.some(ext => 
        url.toLowerCase().includes(ext)
    );
    
    if (isVideoUrl) {
        // Probar cargar video
        const testVideo = document.createElement('video');
        
        testVideo.onloadeddata = function() {
            setVideoBackground(url);
            urlInput.value = '';
            closeBackgroundOptions();
            showNotification('✅ Video de fondo aplicado desde URL');
        };
        
        testVideo.onerror = function() {
            alert('No se pudo cargar el video desde esa URL. Verifica que sea correcta y accesible.');
        };
        
        testVideo.src = url;
        
    } else if (isImageUrl || url.includes('unsplash.com') || url.includes('images.')) {
        // Probar cargar imagen
        const testImage = new Image();
        
        testImage.onload = function() {
            changeBackground(url);
            urlInput.value = '';
            closeBackgroundOptions();
            showNotification('✅ Imagen de fondo aplicada desde URL');
        };
        
        testImage.onerror = function() {
            alert('No se pudo cargar la imagen desde esa URL. Verifica que sea correcta y accesible.');
        };
        
        testImage.src = url;
        
    } else {
        // Intentar detectar automáticamente
        const confirm = window.confirm('No se pudo detectar el tipo de archivo. ¿Es un video? (OK = Video, Cancelar = Imagen)');
        if (confirm) {
            setVideoBackground(url);
        } else {
            changeBackground(url);
        }
        urlInput.value = '';
        closeBackgroundOptions();
    }
}

// Controles de video
function toggleVideoPlayback() {
    if (backgroundVideo) {
        if (backgroundVideo.paused) {
            backgroundVideo.play();
            document.getElementById('playPauseBtn').textContent = '⏸️';
        } else {
            backgroundVideo.pause();
            document.getElementById('playPauseBtn').textContent = '▶️';
        }
    }
}

function toggleVideoMute() {
    if (backgroundVideo) {
        backgroundVideo.muted = !backgroundVideo.muted;
        document.getElementById('muteBtn').textContent = backgroundVideo.muted ? '🔇' : '🔊';
    }
}

function removeVideoBackground() {
    hideVideoBackground();
    // Volver a imagen por defecto
    document.body.style.backgroundImage = `url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`;
    showNotification('✅ Video de fondo removido');
}

// Mostrar/ocultar opciones de fondo
function toggleBackgroundOptions() {
    const options = document.getElementById('backgroundOptions');
    if (options.classList.contains('hidden')) {
        options.classList.remove('hidden');
    } else {
        options.classList.add('hidden');
    }
}

function closeBackgroundOptions() {
    document.getElementById('backgroundOptions').classList.add('hidden');
}

// Mostrar notificación temporal
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = `
        fixed top-5 left-1/2 transform -translate-x-1/2 
        bg-black/80 text-white px-6 py-3 rounded-lg z-50 text-sm 
        glass-effect
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Función para limpiar resultados y ocultar container
function clearSearchResults() {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.classList.add('hidden');
    resultsContainer.innerHTML = '';
}

// Buscar tracks en SoundCloud
async function searchTracks() {
    const query = document.getElementById('searchInput').value.trim();
    
    if (!query) {
        alert('Por favor ingresa un término de búsqueda');
        return;
    }
    
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.classList.remove('hidden');
    resultsContainer.innerHTML = '<div class="text-center text-gray-600 text-sm p-5">🔍 Buscando música...</div>';
    
    try {
        const response = await fetch(`https://api.soundcloud.com/tracks?q=${encodeURIComponent(query)}&client_id=${CLIENT_ID}&limit=5`);
        
        if (!response.ok) {
            throw new Error('Error en la búsqueda');
        }
        
        const tracks = await response.json();
        
        if (tracks.length === 0) {
            resultsContainer.innerHTML = '<div class="text-center text-gray-600 text-sm p-5">No se encontraron resultados</div>';
            
            // Ocultar el mensaje automáticamente después de 4 segundos
            setTimeout(() => {
                clearSearchResults();
            }, 4000);
            return;
        }
        
        let resultsHTML = '';
        tracks.forEach(track => {
            if (track.streamable) {
                resultsHTML += `
                    <div class="p-3 border-b border-gray-200 cursor-pointer text-left transition-all duration-200 hover:bg-orange-100/50 last:border-b-0" 
                         onclick="playTrack('${track.id}', '${track.title.replace(/'/g, "\\'")}', '${track.user.username.replace(/'/g, "\\'")}')">
                        <div class="font-medium text-gray-800 text-sm">${track.title}</div>
                        <div class="text-gray-600 text-xs mt-1">por ${track.user.username}</div>
                    </div>
                `;
            }
        });
        
        if (resultsHTML === '') {
            resultsContainer.innerHTML = '<div class="text-center text-gray-600 text-sm p-5">No hay tracks reproducibles disponibles</div>';
            
            // Ocultar el mensaje automáticamente después de 4 segundos
            setTimeout(() => {
                clearSearchResults();
            }, 4000);
        } else {
            resultsContainer.innerHTML = resultsHTML;
        }
        
    } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = '<div class="text-center text-gray-600 text-sm p-5">❌ Error en la búsqueda. Intenta de nuevo.</div>';
        
        // Ocultar el error automáticamente después de 5 segundos
        setTimeout(() => {
            clearSearchResults();
        }, 5000);
    }
}

// Reproducir track por ID
function playTrack(trackId, title, artist) {
    const container = document.getElementById('playerContainer');
    const indicator = document.getElementById('playingIndicator');
    const player = document.getElementById('soundcloudPlayer');
    
    // Actualizar indicador con información del track
    indicator.innerHTML = `♪ ${title} - ${artist}`;
    
    // Mostrar reproductor
    container.style.display = 'block';
    container.classList.remove('hidden');
    indicator.style.display = 'block';
    indicator.classList.remove('hidden');
    
    // Crear URL del widget
    const widgetUrl = `https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/${trackId}&client_id=${CLIENT_ID}&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
    
    player.src = widgetUrl;
    
    // Ocultar resultados de búsqueda
    clearSearchResults();
    
    // Inicializar widget cuando se cargue
    player.onload = function() {
        currentWidget = SC.Widget(player);
    };
}

// Reproducir desde URL directa
function playFromUrl() {
    const input = document.getElementById('searchInput');
    let url = input.value.trim();
    
    if (!url) {
        // Usar URL de ejemplo
        url = 'https://soundcloud.com/mt-marcy/cold-nights';
    }
    
    if (!url.includes('soundcloud.com')) {
        alert('Por favor ingresa una URL válida de SoundCloud');
        return;
    }
    
    const container = document.getElementById('playerContainer');
    const indicator = document.getElementById('playingIndicator');
    const player = document.getElementById('soundcloudPlayer');
    
    // Mostrar reproductor
    container.style.display = 'block';
    container.classList.remove('hidden');
    indicator.style.display = 'block';
    indicator.classList.remove('hidden');
    
    // Crear URL del widget
    const widgetUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&client_id=${CLIENT_ID}&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
    
    player.src = widgetUrl;
    
    // Limpiar input
    input.value = '';
    
    // Inicializar widget cuando se cargue
    player.onload = function() {
        currentWidget = SC.Widget(player);
    };
}

// Cerrar reproductor
function closePlayer() {
    const container = document.getElementById('playerContainer');
    const indicator = document.getElementById('playingIndicator');
    const player = document.getElementById('soundcloudPlayer');
    
    container.style.display = 'none';
    container.classList.add('hidden');
    indicator.style.display = 'none';
    indicator.classList.add('hidden');
    
    // Parar la música si está reproduciéndose
    if (currentWidget) {
        currentWidget.pause();
        currentWidget = null;
    }
    
    player.src = '';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    
    // Limpiar resultados cuando el usuario empiece a escribir
    searchInput.addEventListener('input', function(e) {
        // Si hay resultados visibles y el usuario está escribiendo, ocultarlos
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer.classList.contains('hidden') && e.target.value.length > 0) {
            // Solo limpiar si hay un mensaje de error visible
            const errorMessage = resultsContainer.innerHTML.includes('❌ Error en la búsqueda');
            if (errorMessage) {
                clearSearchResults();
            }
        }
    });
    
    // Permitir buscar con Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            // Verificar si parece una URL
            if (this.value.includes('soundcloud.com')) {
                playFromUrl();
            } else {
                searchTracks();
            }
        }
    });
    
    // Controles de teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePlayer();
            closeBackgroundOptions();
            clearSearchResults();
        }
        
        // Minimizar interfaz con tecla M
        if (e.key === 'm' || e.key === 'M') {
            e.preventDefault();
            toggleMinimize();
        }
        
        // Minimizar reproductor con tecla P
        if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            const playerContainer = document.getElementById('playerContainer');
            if (playerContainer.style.display === 'block') {
                togglePlayerMinimize();
            }
        }
        
        // Controles de video con teclas
        if (isVideoBackground && backgroundVideo) {
            if (e.code === 'Space') {
                e.preventDefault();
                toggleVideoPlayback();
            } else if (e.key === 'v' || e.key === 'V') {
                toggleVideoMute();
            }
        }
    });
    
    // Cerrar opciones y resultados al hacer clic fuera
    document.addEventListener('click', function(e) {
        const options = document.getElementById('backgroundOptions');
        const trigger = document.querySelector('[onclick="toggleBackgroundOptions()"]');
        const resultsContainer = document.getElementById('searchResults');
        const searchContainer = document.querySelector('.search-container') || searchInput.parentElement;
        
        // Cerrar opciones de fondo
        if (!options.classList.contains('hidden') && 
            !options.contains(e.target) && 
            !trigger.contains(e.target)) {
            closeBackgroundOptions();
        }
        
        // Cerrar resultados de búsqueda si se hace clic fuera
        if (!resultsContainer.classList.contains('hidden') && 
            !resultsContainer.contains(e.target) && 
            !searchContainer.contains(e.target)) {
            clearSearchResults();
        }
    });
});
