// Variables globales
let currentWidget = null;
let backgroundVideo = null;
let isVideoBackground = false;
let isMinimized = false;
let isPlayerMinimized = false;
let loadingProgress = 0;
let musicLoaded = false;
let videoLoaded = false;
const CLIENT_ID = 'a3e059563d7fd3fd21b7448916353fc3'; // Client ID público de SoundCloud

// Canción por defecto
const DEFAULT_TRACK_URL = 'https://soundcloud.com/fumbumfumbum/aoyama-killer-story?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing';
const DEFAULT_TRACK_ID = '293';
const DEFAULT_TRACK_TITLE = 'Rolling Stone';
const DEFAULT_TRACK_ARTIST = 'Default Playlist';

// ==========================================
// VIDEO INICIAL - CAMBIA AQUÍ TU VIDEO PREFERIDO
// ==========================================
const INITIAL_VIDEO = {
    url: 'https://d3o8hbmq1ueggw.cloudfront.net/6zxj4%2Ffile%2Fe6846f52f810d13b3408a86905c8875e_d2efdff9f2d63024035ca595c8ab1904.mp4?response-content-disposition=inline%3Bfilename%3D%22e6846f52f810d13b3408a86905c8875e_d2efdff9f2d63024035ca595c8ab1904.mp4%22%3B&response-content-type=video%2Fmp4&Expires=1758792080&Signature=HCRR2iIKyZOpO4B8ZfhhBGeJh-CwZT9wE0BRFc5WCl0Nt1AFz31XNSL0ubnmqi-NfQjb84iqYBA-tTCrM9hgK4w~EtQoNWjlwV88xVP2usK1peG3Wlt~CHWdulSIW34~7a3GGLfOqGm9ldVRbND0CzKjF5JpooayIVUpd3-kpjbfx3sIXCIMPWgjGF8koPS5COnjW9tl8Xdnki9bPpMfyZffZ6VuhumPitUniD2S0H1292MymYVdQiQ7seuWAxrO1BuKXd8Q1OsbFv1dSm~YCOh4d8pN1s6XyLYtgJu8QK6fxQg8pK~u669u27mImI0clVL6MSlNOedLQtVqkUwF~w__&Key-Pair-Id=APKAJT5WQLLEOADKLHBQ',
    title: 'Video Inicial',
    type: 'initial'
};

// Para cambiar el video inicial, reemplaza la URL arriba con tu video preferido:
// Ejemplos de URLs que puedes usar:
// - BigBuckBunny: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
// - ElephantsDream: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
// - Sintel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
// - ForBiggerBlazes: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
// O cualquier URL de video .mp4 que tengas

// ==========================================
// SISTEMA DE LOADING
// ==========================================

// Actualizar progreso de carga
function updateLoadingProgress(percent, message) {
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.getElementById('loadingText');
    const loadingPercent = document.getElementById('loadingPercent');
    
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (loadingText) loadingText.textContent = message;
    if (loadingPercent) loadingPercent.textContent = `${Math.round(percent)}%`;
    
    loadingProgress = percent;
}

// Verificar si todo está cargado
function checkLoadingComplete() {
    if (musicLoaded && videoLoaded) {
        // Todo cargado, ocultar loading
        setTimeout(() => {
            hideLoadingScreen();
        }, 500);
    }
}

// Ocultar pantalla de loading
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        updateLoadingProgress(100, 'Experiencia lista!');
        
        // Animación de fade out
        loadingScreen.style.transition = 'opacity 1s ease-out';
        loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            showNotification('🎵 ¡Experiencia completa cargada!');
        }, 1000);
    }
}

// Marcar música como cargada
function markMusicLoaded() {
    musicLoaded = true;
    updateLoadingProgress(50, 'Música cargada, preparando video...');
    checkLoadingComplete();
}

// Marcar video como cargado
function markVideoLoaded() {
    videoLoaded = true;
    updateLoadingProgress(90, 'Video cargado, finalizando...');
    checkLoadingComplete();
}

// Videos adicionales que salen al presionar "Video por defecto"
const DEFAULT_VIDEOS = [
    {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        title: 'Elephants Dream',
        type: 'sample'
    },
    {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        title: 'For Bigger Blazes',
        type: 'sample'
    },
    {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        title: 'Sintel',
        type: 'sample'
    }
];

// Función para cargar canción por defecto usando búsqueda
async function loadDefaultTrack() {
    const container = document.getElementById('playerContainer');
    const indicator = document.getElementById('playingIndicator');
    const player = document.getElementById('soundcloudPlayer');
    
    // Lista de términos de búsqueda para música por defecto
    const defaultSearchTerms = [
        'lofi hip hop',
        'chill music',
        'ambient music',
        'relaxing music',
        'study music',
        'chillhop'
    ];
    
    // Seleccionar un término de búsqueda aleatorio
    const randomIndex = Math.floor(Math.random() * defaultSearchTerms.length);
    const searchTerm = defaultSearchTerms[randomIndex];
    
    // Mostrar indicador de carga
    indicator.innerHTML = `♪ Cargando música por defecto...`;
    indicator.style.display = 'block';
    indicator.classList.remove('hidden');
    
    // Actualizar progreso de loading
    updateLoadingProgress(20, 'Cargando música por defecto...');
    
    try {
        // Buscar tracks usando el término seleccionado
        const response = await fetch(`https://api.soundcloud.com/tracks?q=${encodeURIComponent(searchTerm)}&client_id=${CLIENT_ID}&limit=10`);
        
        if (!response.ok) {
            throw new Error('Error en la búsqueda');
        }
        
        const tracks = await response.json();
        
        // Filtrar solo tracks reproducibles
        const playableTracks = tracks.filter(track => track.streamable);
        
        if (playableTracks.length === 0) {
            // Si no hay tracks reproducibles, usar URL directa como fallback
            useDirectUrlFallback();
            return;
        }
        
        // Seleccionar un track aleatorio de los resultados
        const randomTrackIndex = Math.floor(Math.random() * playableTracks.length);
        const selectedTrack = playableTracks[randomTrackIndex];
        
        // Reproducir el track seleccionado
        playTrack(selectedTrack.id, selectedTrack.title, selectedTrack.user.username);
        
        // Marcar música como cargada
        markMusicLoaded();
        
        showNotification('♪ Música por defecto cargada: ' + selectedTrack.title.substring(0, 30) + '...');
        
    } catch (error) {
        console.error('Error al cargar música por defecto:', error);
        // Usar URL directa como fallback
        useDirectUrlFallback();
    }
}

// Función fallback usando URL directa
function useDirectUrlFallback() {
    const container = document.getElementById('playerContainer');
    const indicator = document.getElementById('playingIndicator');
    const player = document.getElementById('soundcloudPlayer');
    
    // Usar la URL que el usuario configuró
    const fallbackUrl = DEFAULT_TRACK_URL;
    
    // Actualizar indicador
    indicator.innerHTML = `♪ ${DEFAULT_TRACK_TITLE} - ${DEFAULT_TRACK_ARTIST}`;
    
    // Mostrar reproductor
    container.style.display = 'block';
    container.classList.remove('hidden');
    indicator.style.display = 'block';
    indicator.classList.remove('hidden');
    
    // Crear URL del widget
    const widgetUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(fallbackUrl)}&client_id=${CLIENT_ID}&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
    
    player.src = widgetUrl;
    
    // Limpiar resultados de búsqueda
    clearSearchResults();
    
    // Inicializar widget
    player.onload = function() {
        currentWidget = SC.Widget(player);
        markMusicLoaded();
        showNotification('♪ Música por defecto cargada: ' + DEFAULT_TRACK_TITLE);
    };
}

// Función para cargar el video inicial automáticamente
function loadInitialVideo() {
    console.log('=== Cargando video inicial automáticamente ===');
    
    const selectedVideo = INITIAL_VIDEO;
    
    console.log(`Cargando video inicial: ${selectedVideo.title}`);
    console.log(`URL: ${selectedVideo.url}`);
    
    // Actualizar progreso de loading
    updateLoadingProgress(60, 'Cargando video inicial...');
    
    // Obtener el elemento de video
    const videoElement = document.getElementById('backgroundVideo');
    if (!videoElement) {
        console.error('ERROR: No se encontró el elemento backgroundVideo');
        markVideoLoaded(); // Marcar como cargado aunque falle
        return;
    }
    
    // Configurar eventos del video
    videoElement.addEventListener('loadeddata', function() {
        console.log('Video inicial cargado exitosamente');
        markVideoLoaded();
        showNotification(`🎬 Video inicial: ${selectedVideo.title}`);
    }, { once: true });
    
    videoElement.addEventListener('error', function(e) {
        console.error('Error al cargar video inicial:', e);
        console.log('Continuando sin video de fondo');
        markVideoLoaded(); // Marcar como cargado aunque falle
    }, { once: true });
    
    // Cargar el video
    try {
        console.log('Llamando a setVideoBackground para video inicial...');
        setVideoBackground(selectedVideo.url);
        console.log('Video inicial configurado');
    } catch (error) {
        console.error('Error en setVideoBackground inicial:', error);
    }
}

// Función para cargar video por defecto aleatorio (al presionar el botón)
function loadDefaultVideo() {
    console.log('=== Iniciando loadDefaultVideo (botón presionado) ===');
    
    // Seleccionar un video aleatorio de la lista adicional
    const randomIndex = Math.floor(Math.random() * DEFAULT_VIDEOS.length);
    const selectedVideo = DEFAULT_VIDEOS[randomIndex];
    
    console.log(`Cargando video aleatorio: ${selectedVideo.title}`);
    console.log(`URL: ${selectedVideo.url}`);
    
    // Obtener el elemento de video
    const videoElement = document.getElementById('backgroundVideo');
    if (!videoElement) {
        console.error('ERROR: No se encontró el elemento backgroundVideo');
        showNotification('❌ Error: Elemento de video no encontrado');
        return;
    }
    
    // Mostrar notificación de carga
    showNotification(`⏳ Cargando video: ${selectedVideo.title}...`);
    
    // Configurar eventos del video
    videoElement.addEventListener('loadeddata', function() {
        console.log('Video cargado exitosamente');
        showNotification(`✅ Video cargado: ${selectedVideo.title}`);
    }, { once: true });
    
    videoElement.addEventListener('error', function(e) {
        console.error('Error al cargar video:', e);
        showNotification(`❌ Error al cargar video: ${selectedVideo.title}`);
    }, { once: true });
    
    // Intentar usar la función existente
    try {
        console.log('Llamando a setVideoBackground...');
        setVideoBackground(selectedVideo.url);
        console.log('setVideoBackground ejecutado');
    } catch (error) {
        console.error('Error en setVideoBackground:', error);
        showNotification('❌ Error al configurar video de fondo');
    }
}

// Función fallback para cargar otro video si falla
function loadFallbackVideo(excludeIndex) {
    console.log('Intentando video fallback...');
    
    const availableVideos = DEFAULT_VIDEOS.filter((_, index) => index !== excludeIndex);
    
    if (availableVideos.length === 0) {
        showNotification('⚠️ No se pudieron cargar videos por defecto');
        console.log('No hay más videos disponibles');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    const selectedVideo = availableVideos[randomIndex];
    
    console.log(`Probando video fallback: ${selectedVideo.title}`);
    
    try {
        setVideoBackground(selectedVideo.url);
        showNotification(`✅ Video alternativo cargado: ${selectedVideo.title}`);
    } catch (error) {
        console.error('Error en video fallback:', error);
        showNotification('⚠️ Error cargando videos, manteniendo imagen por defecto');
    }
}

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
    
    // Inicializar pantalla de loading
    updateLoadingProgress(10, 'Iniciando aplicación...');
    
    // Cargar canción por defecto después de un pequeño delay
    setTimeout(() => {
        loadDefaultTrack();
    }, 800);
    
    // Cargar video inicial automáticamente después de la música
    setTimeout(() => {
        loadInitialVideo();
    }, 1500);
    
    // Fallback: Ocultar loading después de 6 segundos máximo
    setTimeout(() => {
        if (loadingProgress < 100) {
            console.log('Fallback: Ocultando loading por tiempo máximo');
            musicLoaded = true;
            videoLoaded = true;
            hideLoadingScreen();
        }
    }, 6000);
    
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
