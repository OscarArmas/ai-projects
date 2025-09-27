// ==========================================
// GLOBAL VARIABLES
// ==========================================
let currentWidget = null;
let backgroundVideo = null;
let isVideoBackground = false;
let isMinimized = true; // Start with the UI minimized
let isPlayerMinimized = false;
let loadingProgress = 0;
let musicLoaded = false;
let videoLoaded = false;
let musicMutedByUser = false; // To track if the user intentionally mutes
let experienceStarted = false; // Flag to ensure completion logic runs only once
let programmaticPlay = false; // Flag to distinguish between user clicks and programmatic play
let albumPresentationShown = false; // Flag to track if album presentation has been shown
const CLIENT_ID = 'iZIs9mchVcX5lhVRyQGGAYlNPVldzAoJ'; // SoundCloud Public Client ID (Updated 2024)

// Default track
const DEFAULT_TRACK_URL = 'https://soundcloud.com/brentfaiyaz/rolling-stone-8?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing';
const DEFAULT_TRACK_ID = '293';
const DEFAULT_TRACK_TITLE = 'Rollingds Stone';
const DEFAULT_TRACK_ARTIST = 'Default Playlist';

// ==========================================
// INITIAL VIDEO - CHANGE YOUR PREFERRED VIDEO HERE
// ==========================================
const INITIAL_VIDEO = {
    url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    title: 'Initial Video',
    type: 'initial'
};

// To change the initial video, replace the URL above with your preferred video:
// Examples of URLs you can use:
// - BigBuckBunny: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
// - ElephantsDream: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
// - Sintel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
// - ForBiggerBlazes: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
// Or any .mp4 video URL you have

// ==========================================
// LOADING SYSTEM
// ==========================================

// Update loading progress
function updateLoadingProgress(percent, message) {
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.getElementById('loadingText');
    const loadingPercent = document.getElementById('loadingPercent');
    
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (loadingText) loadingText.textContent = message;
    if (loadingPercent) loadingPercent.textContent = `♪ ${Math.round(percent)}%`;
    
    loadingProgress = percent;
}

// Check if everything is loaded
function checkLoadingComplete() {
    // Only run this if both assets are loaded AND the experience hasn't been marked as started
    if (musicLoaded && videoLoaded && !experienceStarted) {
        // Set the flag immediately to prevent this block from ever running again
        experienceStarted = true; 

        // Everything is pre-loaded. Hide the main loading screen animations
        // and then show the "Start Music" button overlay.
        
        const loadingScreen = document.getElementById('loadingScreen');
        const startButtonOverlay = document.getElementById('start-button-overlay');
        
        if (loadingScreen) {
            // Fade out loading screen
            loadingScreen.style.transition = 'opacity 0.5s ease-out';
            loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                
                // Now, fade in the "Start Music" button overlay
                if (startButtonOverlay) {
                    startButtonOverlay.style.display = 'flex';
                    setTimeout(() => {
                        startButtonOverlay.style.opacity = '1';
                    }, 50); // Short delay to ensure display:flex is applied
                }
            }, 500);
        }
    }
}

// Mark music as loaded
function markMusicLoaded() {
    musicLoaded = true;
    updateLoadingProgress(50, 'Music loaded, preparing video...');
    checkLoadingComplete();
}

// Mark video as loaded
function markVideoLoaded() {
    videoLoaded = true;
    updateLoadingProgress(90, 'Video loaded, finishing up...');
    checkLoadingComplete();
}

// ==========================================
// ALBUM BANNER INTEGRATION
// ==========================================

// Show the album banner using static configuration only
function showAlbumPresentationFromTrack() {
    if (albumPresentationShown) {
        console.log('📚 Album banner already shown in this session');
        return;
    }
    
    // Always show banner with static configuration (WASTELAND)
    console.log('📚 Showing static album banner: WASTELAND');
    if (window.AlbumBanner) {
        window.AlbumBanner.show();
    }
    
    // Mark as shown to prevent showing again in the same session
    albumPresentationShown = true;
}

// Load default track using direct URL (more reliable)
async function loadDefaultTrack() {
    console.log('Loading default track via direct URL...');
    
    // Update loading progress
    updateLoadingProgress(20, 'Loading default music...');
    
    // Use direct URL immediately (more reliable than API search)
    useDirectUrlFallback();
}

// Fallback function using direct URL
function useDirectUrlFallback() {
    console.log('Using direct URL fallback for default music');
    
    const container = document.getElementById('playerContainer');
    const player = document.getElementById('soundcloudPlayer');
    
    // Use the URL set by the user
    const fallbackUrl = DEFAULT_TRACK_URL;
    
    // Update indicator
    
    // Show player
    container.style.display = 'block';
    container.classList.remove('hidden');
    
    // Create widget URL - using visual=false for the compact player
    const widgetUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(fallbackUrl)}&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false`;
    
    player.src = widgetUrl;
    
    // Initialize widget
    player.onload = function() {
        currentWidget = SC.Widget(player);
        currentWidget.bind(SC.Widget.Events.READY, function() {
            console.log('Default music widget loaded and ready');
            
            // Update the 'Now Playing' title
            currentWidget.getCurrentSound(function(sound) {
                if (sound) {
                    
                    const nowPlayingEl = document.getElementById('nowPlaying');
                    if (nowPlayingEl) {
                        nowPlayingEl.textContent = sound.title;
                    }
                }
            });
            
            // Start muted for autoplay compliance
            currentWidget.setVolume(0);
            console.log('Default music loaded and muted, ready for Start button');
            markMusicLoaded();
        });
        
        // Auto-minimize when user clicks play in the SoundCloud widget
        currentWidget.bind(SC.Widget.Events.PLAY, function() {
            console.log('🎵 Music started playing from SoundCloud widget');
            console.log('Programmatic play flag:', programmaticPlay);
            
            // Show album presentation when music starts (with a small delay to ensure track info is available)
            setTimeout(() => {
                showAlbumPresentationFromTrack();
            }, 1000);
            
            // Only auto-minimize if it's NOT a programmatic play (user clicked play in widget)
            if (!programmaticPlay) {
                setTimeout(() => {
                    if (!isPlayerMinimized) {
                        console.log('🔄 Auto-minimizing player due to USER clicking play in SoundCloud widget');
                        togglePlayerMinimize();
                    }
                }, 1500); // 1.5 second delay to ensure play started successfully
            } else {
                console.log('⏭️ Skipping auto-minimize because this was a programmatic play (Start Button)');
                programmaticPlay = false; // Reset the flag
            }
        });
        
        currentWidget.bind(SC.Widget.Events.ERROR, function(error) {
            console.error('Error loading default track:', error);
            markMusicLoaded(); // Mark as loaded even if failed
        });
    };
}

// Function to load the initial video automatically
function loadInitialVideo() {
    console.log('=== Loading initial video automatically ===');
    
    const selectedVideo = INITIAL_VIDEO;
    
    console.log(`Loading initial video: ${selectedVideo.title}`);
    console.log(`URL: ${selectedVideo.url}`);
    
    updateLoadingProgress(60, 'Loading initial video...');
    
    const videoElement = document.getElementById('backgroundVideo');
    if (!videoElement) {
        console.error('ERROR: backgroundVideo element not found');
        markVideoLoaded(); // Mark as loaded even if it fails
        return;
    }
    
    videoElement.addEventListener('loadeddata', function() {
        console.log('Initial video loaded successfully');
        markVideoLoaded();
    }, { once: true });
    
    videoElement.addEventListener('error', function(e) {
        console.error('Error loading initial video:', e);
        console.log('Continuing without background video');
        markVideoLoaded(); // Mark as loaded even if it fails
    }, { once: true });
    
    try {
        console.log('Calling setVideoBackground for initial video...');
        setVideoBackground(selectedVideo.url);
        console.log('Initial video configured');
    } catch (error) {
        console.error('Error in initial setVideoBackground:', error);
    }
}

// Function to minimize/show the UI
function toggleMinimize() {
    const playerContainer = document.getElementById('playerContainer');
    
    isMinimized = !isMinimized;
    
    if (isMinimized) {
        // Minimize UI
        if (playerContainer.style.display === 'block') {
            playerContainer.classList.add('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        }
        
    } else {
        // Show UI
        if (playerContainer.style.display === 'block') {
            playerContainer.classList.remove('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        }
    }
}

// Function to minimize only the player
function togglePlayerMinimize() {
    const playerContainer = document.getElementById('playerContainer');
    const minimizeBtn = document.getElementById('minimizePlayerBtn');
    const restoreBtn = document.getElementById('restorePlayerBtn');
    
    isPlayerMinimized = !isPlayerMinimized;
    
    if (isPlayerMinimized) {
        // Minimize player
        playerContainer.classList.add('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        
        if (minimizeBtn) minimizeBtn.classList.add('hidden');
        if (restoreBtn) restoreBtn.classList.remove('hidden');

    } else {
        // Show player
        playerContainer.classList.remove('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        
        if (minimizeBtn) minimizeBtn.classList.remove('hidden');
        if (restoreBtn) restoreBtn.classList.add('hidden');
    }
}

// Function to change the background image
function changeBackground(imageUrl) {
    hideVideoBackground();
    document.body.style.backgroundImage = `url('${imageUrl}')`;
    isVideoBackground = false;
}

// Function to set video background
function setVideoBackground(videoUrl) {
    const backgroundVideo = document.getElementById('backgroundVideo');
    backgroundVideo.src = videoUrl;
    backgroundVideo.classList.remove('hidden');
    
    // Hide background image to ensure video is visible
    document.body.style.backgroundImage = 'none';
    
    backgroundVideo.muted = true;
    backgroundVideo.loop = true;
    backgroundVideo.play().catch(e => {
        console.log('Error playing video:', e);
    });
}

// Hide video background
function hideVideoBackground() {
    if (backgroundVideo) {
        backgroundVideo.classList.add('hidden');
        backgroundVideo.src = '';
        document.getElementById('videoControls').classList.add('hidden');
        document.getElementById('videoControls').classList.remove('flex');
        isVideoBackground = false;
    }
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
    }
    
    // Check size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('Image is too large. Please select an image smaller than 10MB');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        changeBackground(imageUrl);
        closeBackgroundOptions();
        showNotification('✅ Background image updated');
    };
    
    reader.onerror = function() {
        alert('Error loading image. Try another file.');
    };
    
    reader.readAsDataURL(file);
}

// Handle video upload
function handleVideoUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Check if it's a video
    if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file');
        return;
    }
    
    // Check size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
        alert('Video is too large. Please select a video smaller than 50MB');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const videoUrl = e.target.result;
        setVideoBackground(videoUrl);
        closeBackgroundOptions();
        showNotification('✅ Background video set');
    };
    
    reader.onerror = function() {
        alert('Error loading video. Try another file.');
    };
    
    reader.readAsDataURL(file);
}

// Apply background from URL (image or video)
function applyUrlBackground() {
    const urlInput = document.getElementById('urlInputBg');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Please enter a valid URL');
        return;
    }
    
    // Detect if it's a video or image by extension
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    
    const isVideoUrl = videoExtensions.some(ext => 
        url.toLowerCase().includes(ext)
    );
    
    const isImageUrl = imageExtensions.some(ext => 
        url.toLowerCase().includes(ext)
    );
    
    if (isVideoUrl) {
        // Try to load video
        const testVideo = document.createElement('video');
        
        testVideo.onloadeddata = function() {
            setVideoBackground(url);
            urlInput.value = '';
            closeBackgroundOptions();
            showNotification('✅ Background video applied from URL');
        };
        
        testVideo.onerror = function() {
            alert('Could not load video from that URL. Verify it\'s correct and accessible.');
        };
        
        testVideo.src = url;
        
    } else if (isImageUrl || url.includes('unsplash.com') || url.includes('images.')) {
        // Try to load image
        const testImage = new Image();
        
        testImage.onload = function() {
            changeBackground(url);
            urlInput.value = '';
            closeBackgroundOptions();
            showNotification('✅ Background image applied from URL');
        };
        
        testImage.onerror = function() {
            alert('Could not load image from that URL. Verify it\'s correct and accessible.');
        };
        
        testImage.src = url;
        
    } else {
        // Try to autodetect
        const confirm = window.confirm('Could not detect file type. Is it a video? (OK = Video, Cancel = Image)');
        if (confirm) {
            setVideoBackground(url);
        } else {
            changeBackground(url);
        }
        urlInput.value = '';
        closeBackgroundOptions();
    }
}

// Video controls
// Video playback function removed - videos now autoplay without manual controls

function toggleMusicPlayback() {
    if (!currentWidget) {
        console.log('No music widget available');
        return;
    }
    
    const toggleBtn = document.getElementById('pauseBtn');
    if (!toggleBtn) {
        console.error('Music toggle button not found');
        return;
    }
    
    // Add visual feedback for touch
    toggleBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        toggleBtn.style.transform = '';
    }, 150);
    
    // Check if music is currently playing and toggle
    currentWidget.isPaused(function(paused) {
            if (paused) {
                // Music is paused, so play it
                programmaticPlay = true; // This is a programmatic play from controls, not user clicking in widget
                currentWidget.play();
                currentWidget.setVolume(50);
            // Change to pause icon
            toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>`;
            toggleBtn.title = "Pause Music";
            console.log('Music playing');
        } else {
            // Music is playing, so pause it
            currentWidget.pause();
            // Change to play icon
            toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21"/>
            </svg>`;
            toggleBtn.title = "Play Music";
            console.log('Music paused');
        }
    });
}

// Show temporary notification
function showNotification(message, isError = false) {
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

// Play track by ID
function playTrack(trackId, title, artist, isAutoplay = false) {
    const container = document.getElementById('playerContainer');
    const player = document.getElementById('soundcloudPlayer');
    
    // Update indicator with track info
    
    // Show player
    container.style.display = 'block';
    container.classList.remove('hidden');
    
    // Create widget URL
    const widgetUrl = `https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/${trackId}&client_id=${CLIENT_ID}&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
    
    player.src = widgetUrl;
    
    // Initialize widget when it loads
    player.onload = function() {
        currentWidget = SC.Widget(player);
        currentWidget.bind(SC.Widget.Events.READY, function() {
            console.log('SoundCloud Widget is ready.');
            
            // Update the 'Now Playing' title
            currentWidget.getCurrentSound(function(sound) {
                if (sound) {
                    const nowPlayingEl = document.getElementById('nowPlaying');
                    if (nowPlayingEl) {
                        nowPlayingEl.textContent = sound.title;
                    }
                }
            });

            // Don't try to play here. Just set initial volume and wait for the user to click "Start Music".
            if (isAutoplay) {
                currentWidget.setVolume(0); // Start muted if it's autoplay
                console.log('Music widget loaded and muted.');
            } else {
                currentWidget.setVolume(50); // Set normal volume for manual plays
            }
        });
        
        // Auto-minimize when user clicks play in the SoundCloud widget
        currentWidget.bind(SC.Widget.Events.PLAY, function() {
            console.log('🎵 Music started playing from SoundCloud widget (selected track)');
            console.log('Programmatic play flag:', programmaticPlay);
            
            // Show album presentation when music starts (with a small delay to ensure track info is available)
            setTimeout(() => {
                showAlbumPresentationFromTrack();
            }, 1000);
            
            // Only auto-minimize if it's NOT a programmatic play (user clicked play in widget)
            if (!programmaticPlay) {
                setTimeout(() => {
                    if (!isPlayerMinimized) {
                        console.log('🔄 Auto-minimizing player due to USER clicking play in SoundCloud widget');
                        togglePlayerMinimize();
                    }
                }, 1500); // 1.5 second delay to ensure play started successfully
            } else {
                console.log('⏭️ Skipping auto-minimize because this was a programmatic play');
                programmaticPlay = false; // Reset the flag
            }
        });
    };
}

// Close player
function closePlayer() {
    const playerContainer = document.getElementById('playerContainer');
    const nowPlayingEl = document.getElementById('nowPlaying');
    if (playerContainer) {
        playerContainer.classList.add('opacity-0', 'pointer-events-none');
        if (currentWidget) {
            currentWidget.pause();
        }
        // Reset the 'Now Playing' text for the next time
        if (nowPlayingEl) {
            nowPlayingEl.textContent = 'Now Playing...';
        }
    }
}

// Function to request fullscreen on mobile
function requestMobileFullscreen() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { // Safari
        element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    }
}

// Auto-detect mobile and suggest fullscreen
function initMobileFullscreen() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('Mobile device detected - optimized for full screen');
        
        // Add listener for double-tap to go fullscreen
        let lastTap = 0;
        document.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                // Double tap detected
                if (!document.fullscreenElement) {
                    requestMobileFullscreen();
                }
                e.preventDefault();
            }
            lastTap = currentTime;
        });
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');

    // Handle the "Click to Start" button
    if (startButton) {
        startButton.addEventListener('click', function() {
            // Unmute music
            if (currentWidget) {
                // Set flag to indicate this is a programmatic play, not user clicking in widget
                programmaticPlay = true;
                
                // This is a trusted user interaction, so we can now play and set volume.
                currentWidget.play(); // Explicitly start playback.
                currentWidget.setVolume(50); // Set a good volume.
                console.log('Music playing and unmuted via Start Button.');

                // Check if device is mobile (especially iOS)
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                
                if (!isMobile || !isIOS) {
                    // Only auto-minimize on desktop to avoid iOS audio issues
                    setTimeout(() => {
                        if (!isPlayerMinimized) {
                            togglePlayerMinimize();
                        }
                    }, 500); // 0.5 second delay
                } else {
                    console.log('Mobile/iOS detected - keeping player visible to maintain audio playback');
                }
            }
            
            // Hide the button overlay
            const startButtonOverlay = document.getElementById('start-button-overlay');
            if (startButtonOverlay) {
                startButtonOverlay.style.opacity = '0';
                setTimeout(() => {
                    startButtonOverlay.style.display = 'none';
                }, 500); // Wait for transition to finish
            }
        }, { once: true }); // Ensure this button can only be clicked once
    }
    
    // Initialize loading screen
    updateLoadingProgress(10, 'Initializing application...');
    
    // Initialize mobile fullscreen features
    initMobileFullscreen();
    
    // Load default track after a short delay
    setTimeout(() => {
        loadDefaultTrack();
    }, 800);

    // Load initial video automatically after music
    setTimeout(() => {
        loadInitialVideo();
    }, 1500);
    
    // Fallback: Hide loading after 8 seconds max and show start button
    setTimeout(() => {
        if (loadingProgress < 100) {
            console.log('Fallback: Forcing display of start button due to timeout');
            musicLoaded = true;
            videoLoaded = true; 
            checkLoadingComplete(); // This will now show the start button
        }
    }, 8000); // Increased timeout to 8 seconds
    
    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePlayer();
        }
        
        // Minimize player with P key
        if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            const playerContainer = document.getElementById('playerContainer');
            if (playerContainer.style.display === 'block') {
                togglePlayerMinimize();
            }
        }
        
    });
    
    // Close options and results when clicking outside
    document.addEventListener('click', function(e) {
        // All click outside logic removed
    });

    // We can remove the initialization for buttons that no longer exist
});
