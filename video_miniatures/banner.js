/**
 * =====================================================
 * ALBUM BANNER COMPONENT - FUNCIONALIDAD JAVASCRIPT
 * =====================================================
 * Módulo independiente para manejar el banner del álbum
 * Incluye animaciones, interacciones y API de integración
 * Autor: Sistema de IA
 * Fecha: 2025
 * =====================================================
 */

// ==========================================
// VARIABLES GLOBALES DEL BANNER
// ==========================================
let bannerExpanded = false;
let bannerVisible = false;
let bannerAutoHideTimeout = null;

/**
 * =====================================================
 * FUNCIONES PRINCIPALES DEL BANNER
 * =====================================================
 */

/**
 * Alterna entre el estado expandido y minimizado del banner
 * Incluye manejo de scroll y animaciones suaves
 */
function toggleBanner() {
    const banner = document.getElementById('albumBanner');
    
    if (!banner) {
        console.error('❌ Banner element not found');
        return;
    }
    
    if (!bannerExpanded) {
        // Expandir banner
        banner.classList.add('expanded');
        bannerExpanded = true;
        
        // Prevenir scroll del body cuando está expandido
        document.body.style.overflow = 'hidden';
        
        // Cancelar auto-hide si está activo
        if (bannerAutoHideTimeout) {
            clearTimeout(bannerAutoHideTimeout);
            bannerAutoHideTimeout = null;
        }
        
        console.log('🎭 Banner expandido - Mostrando contenido completo del álbum');
    } else {
        // Contraer banner
        banner.classList.remove('expanded');
        bannerExpanded = false;
        
        // Restaurar scroll del body
        document.body.style.overflow = 'auto';
        
        // Programar auto-hide después de contraer
        scheduleAutoHide();
        
        console.log('🎭 Banner contraído - Volviendo a vista minimizada');
    }
}

/**
 * Mostrar banner con animación de entrada
 * @param {number} duration - Duración en ms antes de auto-hide (default: 5000)
 */
function showBanner(duration = 5000) {
    const banner = document.getElementById('albumBanner');
    
    if (!banner) {
        console.error('❌ Banner element not found');
        return;
    }
    
    banner.classList.add('visible');
    bannerVisible = true;
    
    // Programar auto-hide si no está expandido
    if (!bannerExpanded && duration > 0) {
        scheduleAutoHide(duration);
    }
    
    console.log('🎭 Banner del álbum mostrado');
}

/**
 * Ocultar banner con animación de salida
 */
function hideBanner() {
    const banner = document.getElementById('albumBanner');
    
    if (!banner) {
        console.error('❌ Banner element not found');
        return;
    }
    
    banner.classList.remove('visible');
    bannerVisible = false;
    
    // Cancelar auto-hide
    if (bannerAutoHideTimeout) {
        clearTimeout(bannerAutoHideTimeout);
        bannerAutoHideTimeout = null;
    }
    
    // Si estaba expandido, contraerlo primero
    if (bannerExpanded) {
        banner.classList.remove('expanded');
        bannerExpanded = false;
        document.body.style.overflow = 'auto';
    }
    
    console.log('🎭 Banner del álbum ocultado');
}

/**
 * Programar auto-hide del banner
 * @param {number} delay - Retraso en ms (default: 5000)
 */
function scheduleAutoHide(delay = 5000) {
    // Cancelar timeout existente
    if (bannerAutoHideTimeout) {
        clearTimeout(bannerAutoHideTimeout);
    }
    
    // Solo programar auto-hide si no está expandido
    if (!bannerExpanded) {
        bannerAutoHideTimeout = setTimeout(() => {
            hideBanner();
        }, delay);
    }
}

/**
 * =====================================================
 * FUNCIONES DE CONTENIDO DINÁMICO
 * =====================================================
 */

/**
 * Actualizar información del banner dinámicamente
 * @param {string} albumTitle - Título del álbum
 * @param {string} artistName - Nombre del artista  
 * @param {Array} tracks - Array de tracks (opcional)
 */
function updateBannerInfo(albumTitle, artistName, tracks = []) {
    // Actualizar título en vista minimizada
    const minTitle = document.querySelector('.banner-minimized .album-title');
    const minArtist = document.querySelector('.banner-minimized .artist-subtitle');
    
    if (minTitle) minTitle.textContent = albumTitle;
    if (minArtist) minArtist.textContent = `by ${artistName}`;
    
    // Actualizar título en vista expandida
    const expTitle = document.querySelector('.album-title-expanded');
    const expArtist = document.querySelector('.banner-expanded .artist-subtitle');
    
    if (expTitle) expTitle.textContent = albumTitle;
    if (expArtist) expArtist.textContent = `By ${artistName}`;
    
    // Actualizar tracklist si se proporciona
    if (tracks.length > 0) {
        updateTracklist(tracks);
    }
    
    console.log(`🎭 Banner actualizado: ${albumTitle} by ${artistName}`);
}

/**
 * Actualizar tracklist dinámicamente
 * @param {Array} tracks - Array de objetos track con {name, duration}
 */
function updateTracklist(tracks) {
    const tracklistContainer = document.querySelector('.tracklist-container');
    
    if (!tracklistContainer) {
        console.error('❌ Tracklist container not found');
        return;
    }
    
    const trackStickers = tracklistContainer.querySelectorAll('.track-sticker');
    
    // Remover stickers existentes
    trackStickers.forEach(sticker => sticker.remove());
    
    // Iconos rotativos para los tracks
    const icons = ['🎵', '⚡', '💫'];
    
    // Agregar nuevos tracks
    tracks.forEach((track, index) => {
        const stickerHTML = `
            <div class="track-sticker">
                <span class="track-icon">${icons[index % icons.length]}</span>
                <div class="track-info">
                    <div class="track-name">${track.name || `Track ${index + 1}`}</div>
                    <div class="track-duration">${track.duration || '3:30'}</div>
                </div>
            </div>
        `;
        tracklistContainer.insertAdjacentHTML('beforeend', stickerHTML);
    });
    
    console.log(`🎭 Tracklist actualizada con ${tracks.length} tracks`);
}

/**
 * Actualizar enlaces de plataformas
 * @param {Object} platforms - Objeto con URLs de plataformas {spotify, appleMusic, soundcloud}
 */
function updatePlatformLinks(platforms = {}) {
    const spotifyLink = document.querySelector('.platform-icon.spotify');
    const appleMusicLink = document.querySelector('.platform-icon.apple-music');
    const soundcloudLink = document.querySelector('.platform-icon.soundcloud');
    
    if (spotifyLink && platforms.spotify) {
        spotifyLink.href = platforms.spotify;
        spotifyLink.target = '_blank';
    }
    
    if (appleMusicLink && platforms.appleMusic) {
        appleMusicLink.href = platforms.appleMusic;
        appleMusicLink.target = '_blank';
    }
    
    if (soundcloudLink && platforms.soundcloud) {
        soundcloudLink.href = platforms.soundcloud;
        soundcloudLink.target = '_blank';
    }
    
    console.log('🎭 Enlaces de plataformas actualizados');
}

/**
 * Actualizar redes sociales del artista
 * @param {Object} socials - Objeto con URLs de redes {instagram, twitter, youtube, tiktok}
 */
function updateSocialLinks(socials = {}) {
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach((icon, index) => {
        const platform = ['instagram', 'twitter', 'youtube', 'tiktok'][index];
        if (socials[platform]) {
            icon.href = socials[platform];
            icon.target = '_blank';
        }
    });
    
    console.log('🎭 Redes sociales actualizadas');
}

/**
 * =====================================================
 * EVENTOS Y LISTENERS
 * =====================================================
 */

/**
 * Inicializar eventos del banner
 */
function initBannerEvents() {
    // Manejar teclas de escape para cerrar banner expandido
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bannerExpanded) {
            toggleBanner();
        }
    });
    
    // Manejar clicks en el banner
    document.addEventListener('click', function(e) {
        const banner = document.getElementById('albumBanner');
        
        if (!banner) return;
        
        // Click en el banner para expandir/contraer
        if (e.target === banner || banner.contains(e.target)) {
            // Solo toggle si no es contenido interactivo (enlaces, etc.)
            if (!e.target.closest('a') && !e.target.closest('.platform-icon') && !e.target.closest('.social-icon')) {
                // Si está expandido, solo contraer si click en fondo
                if (bannerExpanded) {
                    if (e.target === banner || e.target.classList.contains('banner-content')) {
                        toggleBanner();
                    }
                } else {
                    // Si está minimizado, expandir con cualquier click
                    toggleBanner();
                }
            }
        }
    });
    
    // Manejar hover para cancelar auto-hide
    const banner = document.getElementById('albumBanner');
    if (banner) {
        banner.addEventListener('mouseenter', function() {
            if (bannerAutoHideTimeout) {
                clearTimeout(bannerAutoHideTimeout);
                bannerAutoHideTimeout = null;
            }
        });
        
        banner.addEventListener('mouseleave', function() {
            if (bannerVisible && !bannerExpanded) {
                scheduleAutoHide();
            }
        });
    }
    
    console.log('🎭 Eventos del banner inicializados');
}

/**
 * =====================================================
 * INTEGRACIÓN CON MÚSICA
 * =====================================================
 */

/**
 * Mostrar banner cuando inicia la música
 * @param {Object} trackInfo - Información del track {title, artist, duration}
 */
function showBannerForTrack(trackInfo = {}) {
    if (!trackInfo.title || !trackInfo.artist) {
        console.log('🎭 Información de track incompleta, usando datos por defecto');
        showBanner();
        return;
    }
    
    // Actualizar información del banner
    updateBannerInfo(trackInfo.title, trackInfo.artist);
    
    // Mostrar banner
    showBanner();
    
    console.log(`🎭 Banner mostrado para: ${trackInfo.title} by ${trackInfo.artist}`);
}

/**
 * =====================================================
 * API PÚBLICA PARA INTEGRACIÓN
 * =====================================================
 */

// Crear namespace global para el banner
window.AlbumBanner = {
    // Funciones principales
    show: showBanner,
    hide: hideBanner,
    toggle: toggleBanner,
    
    // Funciones de contenido
    updateInfo: updateBannerInfo,
    updateTracklist: updateTracklist,
    updatePlatforms: updatePlatformLinks,
    updateSocials: updateSocialLinks,
    
    // Funciones de estado
    isExpanded: () => bannerExpanded,
    isVisible: () => bannerVisible,
    
    // Integración con música
    showForTrack: showBannerForTrack,
    
    // Inicialización
    init: initBannerEvents
};

/**
 * =====================================================
 * INICIALIZACIÓN AUTOMÁTICA
 * =====================================================
 */

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎭 Inicializando Album Banner Component');
    initBannerEvents();
});

/**
 * =====================================================
 * UTILIDADES ADICIONALES
 * =====================================================
 */

/**
 * Crear banner dinámicamente si no existe
 * @param {Object} config - Configuración del banner
 */
function createBanner(config = {}) {
    if (document.getElementById('albumBanner')) {
        console.log('🎭 Banner ya existe, actualizando contenido');
        updateBannerInfo(config.albumTitle || 'Midnight Symphony', config.artistName || 'Rekon');
        return;
    }
    
    // TODO: Implementar creación dinámica del banner
    console.log('🎭 Creación dinámica de banner no implementada aún');
}

/**
 * Obtener configuración del banner desde data attributes
 */
function loadBannerConfig() {
    const banner = document.getElementById('albumBanner');
    if (!banner) return {};
    
    return {
        albumTitle: banner.dataset.albumTitle || 'Midnight Symphony',
        artistName: banner.dataset.artistName || 'Rekon',
        autoHide: banner.dataset.autoHide !== 'false',
        autoHideDuration: parseInt(banner.dataset.autoHideDuration) || 5000
    };
}

// Exportar funciones para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.AlbumBanner;
}
