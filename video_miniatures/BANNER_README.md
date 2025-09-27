# Album Banner Component

## 📋 Descripción

Componente independiente y modular para mostrar información de álbumes musicales con un diseño elegante, texturas dinámicas y funcionalidad interactiva. El banner se presenta inicialmente en modo minimizado y puede expandirse para mostrar contenido completo del álbum.

## ✨ Características Principales

### 🎨 Diseño Visual
- **Texturas dinámicas**: Capas superpuestas con animaciones sutiles
- **Tipografía elegante**: Múltiples fuentes que combinan caligrafía y serif
- **Efectos de vidrio**: Backdrop filters para un look moderno
- **Animaciones suaves**: Transiciones CSS cubicas y efectos de glow
- **Tema dorado**: Paleta de colores en oro y negro para elegancia

### 🖱️ Interactividad
- **Click to expand**: Indicador visual que invita a hacer clic
- **Estado expandido**: Vista completa con toda la información del álbum
- **Auto-hide**: Se oculta automáticamente después de unos segundos
- **Escape key**: Tecla ESC para cerrar cuando está expandido
- **Hover effects**: Cancelación de auto-hide al pasar el mouse

### 📱 Responsivo
- **Mobile-first**: Diseño optimizado para móviles
- **Breakpoints**: Adaptación automática a diferentes tamaños de pantalla
- **Touch-friendly**: Elementos táctiles optimizados para dispositivos móviles

## 🗂️ Estructura de Archivos

```
banner.html     # Componente independiente (para pruebas)
banner.css      # Estilos del banner
banner.js       # Funcionalidad JavaScript
index.html      # Página principal integrada
```

## 🏗️ Estructura del Banner

### Vista Minimizada
```html
<div class="banner-minimized">
    <h1 class="album-title">Título del Álbum</h1>
    <div class="banner-separator">•</div>
    <p class="artist-subtitle">by Artista</p>
</div>
```

### Vista Expandida
```html
<div class="banner-expanded">
    <!-- Título expandido -->
    <h1 class="album-title-expanded">Título del Álbum</h1>
    <h2 class="artist-subtitle">By Artista</h2>
    
    <!-- Portada del álbum -->
    <div class="album-cover-container">
        <div class="album-cover"></div>
    </div>
    
    <!-- Íconos de plataformas -->
    <div class="platforms-container">
        <a href="#" class="platform-icon spotify">♪</a>
        <a href="#" class="platform-icon apple-music">🎵</a>
        <a href="#" class="platform-icon soundcloud">🎧</a>
    </div>
    
    <!-- Tracklist como stickers -->
    <div class="tracklist-container">
        <h3 class="tracklist-title">Tracklist</h3>
        <div class="track-sticker">
            <span class="track-icon">🎵</span>
            <div class="track-info">
                <div class="track-name">Nombre del Track</div>
                <div class="track-duration">3:42</div>
            </div>
        </div>
        <!-- Más tracks... -->
    </div>
    
    <!-- Perfil del artista -->
    <div class="artist-profile">
        <div class="artist-photo"></div>
        <div class="social-links">
            <a href="#" class="social-icon">📷</a>
            <a href="#" class="social-icon">🐦</a>
            <a href="#" class="social-icon">📺</a>
            <a href="#" class="social-icon">🎬</a>
        </div>
    </div>
</div>
```

## 🛠️ API JavaScript

### Funciones Principales

```javascript
// Mostrar banner
AlbumBanner.show(duration = 5000)

// Ocultar banner
AlbumBanner.hide()

// Alternar expansión
AlbumBanner.toggle()

// Actualizar información
AlbumBanner.updateInfo(albumTitle, artistName, tracks)

// Mostrar para track específico
AlbumBanner.showForTrack({title, artist, duration})
```

### Funciones de Contenido

```javascript
// Actualizar tracklist
AlbumBanner.updateTracklist([
    {name: "Track 1", duration: "3:42"},
    {name: "Track 2", duration: "4:15"}
])

// Actualizar enlaces de plataformas
AlbumBanner.updatePlatforms({
    spotify: "https://spotify.com/...",
    appleMusic: "https://music.apple.com/...",
    soundcloud: "https://soundcloud.com/..."
})

// Actualizar redes sociales
AlbumBanner.updateSocials({
    instagram: "https://instagram.com/...",
    twitter: "https://twitter.com/...",
    youtube: "https://youtube.com/...",
    tiktok: "https://tiktok.com/..."
})
```

### Funciones de Estado

```javascript
// Verificar si está expandido
AlbumBanner.isExpanded()

// Verificar si está visible
AlbumBanner.isVisible()
```

## 🎯 Integración

### 1. Incluir Archivos CSS y JS

```html
<head>
    <!-- Estilos del banner -->
    <link rel="stylesheet" href="banner.css">
</head>
<body>
    <!-- Banner HTML -->
    <div id="albumBanner" class="album-banner" onclick="toggleBanner()">
        <!-- Contenido del banner -->
    </div>
    
    <!-- Scripts -->
    <script src="banner.js"></script>
</body>
```

### 2. Inicialización Automática

El banner se inicializa automáticamente cuando el DOM está listo. No requiere configuración adicional.

### 3. Integración con Reproductor de Música

```javascript
// Cuando empieza a reproducir música
currentWidget.bind(SC.Widget.Events.PLAY, function() {
    // Obtener información del track
    currentWidget.getCurrentSound(function(sound) {
        if (sound && sound.title) {
            AlbumBanner.showForTrack({
                title: sound.title,
                artist: sound.user?.username || 'Artista',
                duration: sound.duration
            });
        }
    });
});
```

## 🎨 Personalización

### Variables CSS

```css
:root {
    --banner-primary-gold: #d4af37;
    --banner-secondary-gold: #f4e4bc;
    --banner-dark-bg: rgba(0, 0, 0, 0.9);
    --banner-text-primary: #ffffff;
    --banner-text-secondary: #cccccc;
    --banner-text-accent: #d4af37;
}
```

### Fuentes Utilizadas

- **Cinzel Decorative**: Títulos principales
- **Dancing Script**: Títulos expandidos
- **Playfair Display**: Subtítulos elegantes
- **EB Garamond**: Texto secundario
- **Crimson Text**: Labels y elementos menores

### Animaciones Principales

- `bannerTextureFloat`: Movimiento de texturas de fondo
- `bannerTitleGlow`: Efecto de brillo en títulos
- `bannerVinylSpin`: Rotación de la portada del álbum
- `bannerPulseIndicator`: Pulsación del indicador de click

## 📱 Responsive Design

### Breakpoints

- **768px**: Tablet - Ajustes de layout y tamaños
- **480px**: Mobile - Optimización máxima para móviles

### Adaptaciones Móviles

- Banner minimizado se convierte en vertical
- Íconos de plataformas más pequeños
- Tracklist con márgenes reducidos
- Indicador de click más discreto

## ♿ Accesibilidad

- **Focus visible**: Outlines para navegación por teclado
- **Reduced motion**: Respeta la preferencia de movimiento reducido
- **ARIA labels**: Elementos interactivos etiquetados
- **Contraste**: Colores que cumplen estándares de contraste

## 🐛 Debugging

### Console Logs

El componente incluye logs informativos:

```
🎭 Banner del álbum mostrado
🎭 Banner expandido - Mostrando contenido completo del álbum
🎭 Banner contraído - Volviendo a vista minimizada
🎭 Banner actualizado: [título] by [artista]
```

### Estados de Error

```javascript
// Banner element not found
❌ Banner element not found

// Tracklist container not found
❌ Tracklist container not found
```

## 📄 Licencia

Este componente forma parte del proyecto de reproductor musical y sigue las mejores prácticas de desarrollo frontend moderno.

## 🔄 Versionado

- **v1.0**: Implementación inicial con todas las funcionalidades core
- Diseño modular y escalable para futuras mejoras

---

**Desarrollado con ❤️ usando vanilla JavaScript, CSS3 y HTML5**
