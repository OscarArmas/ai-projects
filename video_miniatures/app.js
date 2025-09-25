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
const CLIENT_ID = 'iZIs9mchVcX5lhVRyQGGAYlNPVldzAoJ'; // SoundCloud Public Client ID (Updated 2024)

// Default track
const DEFAULT_TRACK_URL = 'https://soundcloud.com/brentfaiyaz/rolling-stone-8?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing';
const DEFAULT_TRACK_ID = '293';
const DEFAULT_TRACK_TITLE = 'Rolling Stone';
const DEFAULT_TRACK_ARTIST = 'Default Playlist';

// ==========================================
// INITIAL VIDEO - CHANGE YOUR PREFERRED VIDEO HERE
// ==========================================
const INITIAL_VIDEO = {
    url: 'https://pouch.jumpshare.com/preview/1DfWCwmyAmMICA1opc3und6pkqoXzQ_3VeuIWm3jyeg4odKv5QG9Spid0RIyFX0pV5Ei84yOLcttRcS-QF-VRvkR1T-yFINJVvaCkbX2YqGt2HXjIx8bjXpG99p07D90GaAxh40BVZFpx9CEUTwQrW6yjbN-I2pg_cnoHs_AmgI.mp4',
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

// Additional videos that appear when "Default Video" is pressed
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
    const indicator = document.getElementById('playingIndicator');
    const player = document.getElementById('soundcloudPlayer');
    
    // Use the URL set by the user
    const fallbackUrl = DEFAULT_TRACK_URL;
    
    // Update indicator
    indicator.innerHTML = `♪ Loading ${DEFAULT_TRACK_TITLE}...`;
    
    // Show player
    container.style.display = 'block';
    container.classList.remove('hidden');
    indicator.style.display = 'block';
    indicator.classList.remove('hidden');
    
    // Create widget URL - using visual=false for the compact player
    const widgetUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(fallbackUrl)}&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false`;
    
    player.src = widgetUrl;
    
    // Clear search results
    clearSearchResults();
    
    // Initialize widget
    player.onload = function() {
        currentWidget = SC.Widget(player);
        currentWidget.bind(SC.Widget.Events.READY, function() {
            console.log('Default music widget loaded and ready');
            
            // Update the 'Now Playing' title
            currentWidget.getCurrentSound(function(sound) {
                if (sound && indicator) {
                    indicator.innerHTML = `♪ ${sound.title} - ${sound.user.username}`;
                    
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
    
    // Update loading progress
    updateLoadingProgress(60, 'Loading initial video...');
    
    // Get the video element
    const videoElement = document.getElementById('backgroundVideo');
    if (!videoElement) {
        console.error('ERROR: backgroundVideo element not found');
        markVideoLoaded(); // Mark as loaded even if it fails
        return;
    }
    
    // Configure video events
    videoElement.addEventListener('loadeddata', function() {
        console.log('Initial video loaded successfully');
        markVideoLoaded();
    }, { once: true });
    
    videoElement.addEventListener('error', function(e) {
        console.error('Error loading initial video:', e);
        console.log('Continuing without background video');
        markVideoLoaded(); // Mark as loaded even if it fails
    }, { once: true });
    
    // Load the video
    try {
        console.log('Calling setVideoBackground for initial video...');
        setVideoBackground(selectedVideo.url);
        console.log('Initial video configured');
    } catch (error) {
        console.error('Error in initial setVideoBackground:', error);
    }
}

// Function to load random default video (when button is pressed)
function loadDefaultVideo() {
    console.log('=== Starting loadDefaultVideo (button pressed) ===');
    
    // Select a random video from the additional list
    const randomIndex = Math.floor(Math.random() * DEFAULT_VIDEOS.length);
    const selectedVideo = DEFAULT_VIDEOS[randomIndex];
    
    console.log(`Loading random video: ${selectedVideo.title}`);
    console.log(`URL: ${selectedVideo.url}`);
    
    // Get the video element
    const videoElement = document.getElementById('backgroundVideo');
    if (!videoElement) {
        console.error('ERROR: backgroundVideo element not found');
        return;
    }
    
    // Configure video events
    videoElement.addEventListener('loadeddata', function() {
        console.log('Video loaded successfully');
    }, { once: true });
    
    videoElement.addEventListener('error', function(e) {
        console.error('Error loading video:', e);
    }, { once: true });
    
    // Try to use the existing function
    try {
        console.log('Calling setVideoBackground...');
        setVideoBackground(selectedVideo.url);
        console.log('setVideoBackground executed');
    } catch (error) {
        console.error('Error in setVideoBackground:', error);
    }
}

// Fallback function to load another video if the first one fails
function loadFallbackVideo(excludeIndex) {
    console.log('Trying fallback video...');
    
    const availableVideos = DEFAULT_VIDEOS.filter((_, index) => index !== excludeIndex);
    
    if (availableVideos.length === 0) {
        console.log('No more videos available');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    const selectedVideo = availableVideos[randomIndex];
    
    console.log(`Trying fallback video: ${selectedVideo.title}`);
    
    try {
        setVideoBackground(selectedVideo.url);
    } catch (error) {
        console.error('Error in fallback video:', error);
    }
}

// Function to minimize/show the UI
function toggleMinimize() {
    const container = document.getElementById('mainContainer');
    const minimizeBtn = document.getElementById('minimizeBtn');
    const minimizeIcon = document.getElementById('minimizeIcon');
    const indicator = document.getElementById('minimizedIndicator');
    const playerContainer = document.getElementById('playerContainer');
    const playingIndicator = document.getElementById('playingIndicator');
    
    isMinimized = !isMinimized;
    
    if (isMinimized) {
        // Minimize UI
        container.classList.add('minimized-slide', 'opacity-0', 'pointer-events-none');
        minimizeBtn.classList.add('bg-black/30');
        minimizeBtn.classList.remove('bg-white/10');
        minimizeIcon.textContent = '+';
        minimizeBtn.title = 'Show UI (M)';
        
        // Minimize player if visible
        if (playerContainer.style.display === 'block') {
            playerContainer.classList.add('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        }
        if (playingIndicator.style.display === 'block') {
            playingIndicator.classList.add('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        }
        
        // Show temporary indicator only if the page has already loaded
        if (loadingProgress >= 100) {
            indicator.classList.remove('hidden');
            indicator.classList.add('animate-fade-in-out');
            setTimeout(() => {
                indicator.classList.add('hidden');
                indicator.classList.remove('animate-fade-in-out');
            }, 3000);
        }
        
    } else {
        // Show UI
        container.classList.remove('minimized-slide', 'opacity-0', 'pointer-events-none');
        minimizeBtn.classList.remove('bg-black/30');
        minimizeBtn.classList.add('bg-white/10');
        minimizeIcon.textContent = '−';
        minimizeBtn.title = 'Minimize UI (M)';
        
        // Restore player if it was visible
        if (playerContainer.style.display === 'block') {
            playerContainer.classList.remove('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        }
        if (playingIndicator.style.display === 'block') {
            playingIndicator.classList.remove('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        }
    }
}

// Function to minimize only the player
function togglePlayerMinimize() {
    const playerContainer = document.getElementById('playerContainer');
    const playingIndicator = document.getElementById('playingIndicator');
    const minimizeBtn = document.querySelector('.minimize-player-btn') || 
                       playerContainer.querySelector('button[onclick="togglePlayerMinimize()"]');
    
    isPlayerMinimized = !isPlayerMinimized;
    
    if (isPlayerMinimized) {
        // Minimize player
        playerContainer.classList.add('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        playingIndicator.classList.add('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        if (minimizeBtn) {
            minimizeBtn.textContent = '+';
            minimizeBtn.title = 'Show player';
        }
    } else {
        // Show player
        playerContainer.classList.remove('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        playingIndicator.classList.remove('minimized-slide-x', 'opacity-0', 'pointer-events-none');
        if (minimizeBtn) {
            minimizeBtn.textContent = '−';
            minimizeBtn.title = 'Minimize player';
        }
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
    backgroundVideo = document.getElementById('backgroundVideo');
    backgroundVideo.src = videoUrl;
    backgroundVideo.classList.remove('hidden');
    document.getElementById('videoControls').classList.remove('hidden');
    document.getElementById('videoControls').classList.add('flex');
    
    // Hide background image
    document.body.style.backgroundImage = 'none';
    isVideoBackground = true;
    
    // Configure video - ALWAYS MUTED (no audio from video)
    backgroundVideo.muted = true;
    backgroundVideo.loop = true;
    backgroundVideo.play().catch(e => {
        console.log('Error playing video:', e);
        showNotification('⚠️ Error playing video automatically');
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

function removeVideoBackground() {
    hideVideoBackground();
    document.body.style.backgroundImage = `url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`;
    showNotification('✅ Background video removed');
    const removeBtn = document.getElementById('removeVideoBtn') || document.querySelector('button[title="Remove video"]');
    if (removeBtn) {
        removeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="18" x2="18" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
        removeBtn.className = 'w-10 h-10 rounded-full cursor-pointer text-base transition-all duration-300 border border-white/20 bg-white/10 glass-effect text-white hover:bg-white/20 hover:scale-110 hover:border-white/30 flex items-center justify-center';
    }
}

// Show/hide background options
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

// Clear search results and hide container
function clearSearchResults() {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.classList.add('hidden');
    resultsContainer.innerHTML = '';
}

// Search for tracks on SoundCloud
async function searchTracks() {
    const query = document.getElementById('searchInput').value.trim();
    
    if (!query) {
        alert('Please enter a search term');
        return;
    }
    
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.classList.remove('hidden');
    resultsContainer.innerHTML = '<div class="text-center text-gray-600 text-sm p-5">🔍 Searching for music...</div>';
    
    try {
        const response = await fetch(`https://api.soundcloud.com/tracks?q=${encodeURIComponent(query)}&client_id=${CLIENT_ID}&limit=5`);
        
        if (!response.ok) {
            throw new Error('Search error');
        }
        
        const tracks = await response.json();
        
        if (tracks.length === 0) {
            resultsContainer.innerHTML = '<div class="text-center text-gray-600 text-sm p-5">No results found</div>';
            
            // Hide the message automatically after 4 seconds
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
                        <div class="text-gray-600 text-xs mt-1">by ${track.user.username}</div>
                    </div>
                `;
            }
        });
        
        if (resultsHTML === '') {
            resultsContainer.innerHTML = '<div class="text-center text-gray-600 text-sm p-5">No streamable tracks available</div>';
            
            // Hide the message automatically after 4 seconds
            setTimeout(() => {
                clearSearchResults();
            }, 4000);
        } else {
            resultsContainer.innerHTML = resultsHTML;
        }
        
    } catch (error) {
        console.error('Error:', error);
        resultsContainer.innerHTML = '<div class="text-center text-gray-600 text-sm p-5">❌ Search error. Please try again.</div>';
        
        // Hide the error automatically after 5 seconds
        setTimeout(() => {
            clearSearchResults();
        }, 5000);
    }
}

// Play track by ID
function playTrack(trackId, title, artist, isAutoplay = false) {
    const container = document.getElementById('playerContainer');
    const indicator = document.getElementById('playingIndicator');
    const player = document.getElementById('soundcloudPlayer');
    
    // Update indicator with track info
    indicator.innerHTML = `♪ ${title} - ${artist}`;
    
    // Show player
    container.style.display = 'block';
    container.classList.remove('hidden');
    indicator.style.display = 'block';
    indicator.classList.remove('hidden');
    
    // Create widget URL
    const widgetUrl = `https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/${trackId}&client_id=${CLIENT_ID}&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
    
    player.src = widgetUrl;
    
    // Hide search results
    clearSearchResults();
    
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
    };
}

// Play from direct URL
function playFromUrl() {
    const input = document.getElementById('searchInput');
    let url = input.value.trim();
    
    if (!url) {
        // Use example URL
        url = 'https://soundcloud.com/mt-marcy/cold-nights';
    }
    
    if (!url.includes('soundcloud.com')) {
        alert('Please enter a valid SoundCloud URL');
        return;
    }
    
    const container = document.getElementById('playerContainer');
    const indicator = document.getElementById('playingIndicator');
    const player = document.getElementById('soundcloudPlayer');
    
    // Show player
    container.style.display = 'block';
    container.classList.remove('hidden');
    indicator.style.display = 'block';
    indicator.classList.remove('hidden');
    
    // Create widget URL
    const widgetUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&client_id=${CLIENT_ID}&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
    
    player.src = widgetUrl;
    
    // Clear input
    input.value = '';
    
    // Initialize widget when it loads
    player.onload = function() {
        currentWidget = SC.Widget(player);
        // User-initiated, so play with sound
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
    const searchInput = document.getElementById('searchInput');
    const startButton = document.getElementById('startButton');

    // Handle the "Click to Start" button
    if (startButton) {
        startButton.addEventListener('click', function() {
            // Unmute music
            if (currentWidget) {
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
    
    // Hide main container initially since it starts minimized
    const mainContainer = document.getElementById('mainContainer');
    if(mainContainer) {
        mainContainer.style.transition = 'none'; // Prevent animation on page load
    }

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
            
            // Restore transitions after load
            const mainContainer = document.getElementById('mainContainer');
            if(mainContainer) {
                setTimeout(() => {
                    mainContainer.style.transition = 'all 0.5s ease';
                }, 500);
            }
        }
    }, 8000); // Increased timeout to 8 seconds
    
    // Clear results when the user starts typing
    searchInput.addEventListener('input', function(e) {
        // If results are visible and the user is typing, hide them
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer.classList.contains('hidden') && e.target.value.length > 0) {
            // Only clear if an error message is visible
            const errorMessage = resultsContainer.innerHTML.includes('❌ Search error');
            if (errorMessage) {
                clearSearchResults();
            }
        }
    });
    
    // Allow searching with Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            // Check if it looks like a URL
            if (this.value.includes('soundcloud.com')) {
                playFromUrl();
            } else {
                searchTracks();
            }
        }
    });
    
    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePlayer();
            closeBackgroundOptions();
            clearSearchResults();
        }
        
        // Minimize UI with M key
        if (e.key === 'm' || e.key === 'M') {
            e.preventDefault();
            toggleMinimize();
        }
        
        // Minimize player with P key
        if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            const playerContainer = document.getElementById('playerContainer');
            if (playerContainer.style.display === 'block') {
                togglePlayerMinimize();
            }
        }
        
        // Video controls with keys
        if (isVideoBackground && backgroundVideo) {
            if (e.code === 'Space') {
                e.preventDefault();
                // Space bar no longer controls video playback
            } else if (e.key === 'v' || e.key === 'V') {
                toggleMusicPlayback();
            }
        }
    });
    
    // Close options and results when clicking outside
    document.addEventListener('click', function(e) {
        const options = document.getElementById('backgroundOptions');
        const trigger = document.querySelector('[onclick="toggleBackgroundOptions()"]');
        const resultsContainer = document.getElementById('searchResults');
        const searchContainer = document.querySelector('.search-container') || searchInput.parentElement;
        
        // Close background options
        if (!options.classList.contains('hidden') && 
            !options.contains(e.target) && 
            !trigger.contains(e.target)) {
            closeBackgroundOptions();
        }
        
        // Close search results if clicked outside
        if (!resultsContainer.classList.contains('hidden') && 
            !resultsContainer.contains(e.target) && 
            !searchContainer.contains(e.target)) {
            clearSearchResults();
        }
    });

    // Inicializar el botón toggle de música
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        // Set initial pause icon (assuming music will be playing after Start Music)
        pauseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
        </svg>`;
        
        // Improve accessibility
        pauseBtn.setAttribute('role', 'button');
        pauseBtn.setAttribute('aria-label', 'Toggle music playback');
    }
    
    // Botón de remover video
    const removeBtn = document.querySelector('button[title="Remove video"]') || document.getElementById('removeVideoBtn');
    if (removeBtn) {
        removeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="18" x2="18" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
        removeBtn.className = 'w-10 h-10 rounded-full cursor-pointer text-base transition-all duration-300 border border-white/20 bg-white/10 glass-effect text-white hover:bg-white/20 hover:scale-110 hover:border-white/30 flex items-center justify-center';
    }
});
