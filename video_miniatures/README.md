# SoundCloud Music Player - Tailwind CSS Version

## 📁 File Structure

```
video_miniatures/
├── index.html          # Main file with Tailwind CSS
├── app.js              # Separate JavaScript logic
├── components.html     # Reusable components and style guide
├── page.html           # Original file (backup)
└── README.md           # This documentation
```

## 🚀 Features

- **Modern UI** with Tailwind CSS and glassmorphism effects
- **Music playback** from SoundCloud
- **Customizable backgrounds** (image/video)
- **Minimizable interface** for full background view
- **Fully responsive** for mobile, tablets, and desktop
- **Intuitive keyboard controls**

## 🎨 Technologies Used

- **HTML5**: Semantic structure
- **Tailwind CSS**: CSS utility framework
- **Vanilla JavaScript**: No external dependencies
- **SoundCloud API**: Music playback
- **Glassmorphism**: Modern glass-like effects

## 🔧 Setup

### 1. Using the player

1. Open `index.html` in your browser
2. The file already includes Tailwind CSS from a CDN
3. All files must be in the same folder

### 2. Customization

- **Components**: Check `components.html` for reusable elements
- **Styles**: Modify Tailwind classes in `index.html`
- **Functionality**: Edit `app.js` for logic changes

## 🎹 Keyboard Controls

| Key     | Function                      |
|---------|-------------------------------|
| `M`     | Minimize/show the entire UI   |
| `P`     | Minimize/show the player only |
| `V`     | Mute/unmute the background video |
| `Space` | Pause/play the background video  |
| `ESC`   | Close player and options      |
| `Enter` | Search for music or play URL  |

## 📱 Responsive Features

### Desktop (1024px+)
- Player: 280x180px
- Search bar: 500px width
- Buttons side-by-side

### Tablet (768px+)
- Player: 240x150px
- Search bar: 384px width
- Buttons stacked

### Mobile (640px-)
- Player: 220x130px
- Search bar: 320px width
- Touch-optimized interface

## 🎨 Design System

### Main Colors
- **Main Background**: White transparencies (white/70, white/90)
- **Accents**: Orange (#ff7e5f, orange-400)
- **Text**: Grays (gray-600, gray-800)
- **States**: Green for success, red for errors

### Glassmorphism Effects
```css
.glass-effect {
    backdrop-filter: blur(15px);
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Animations
- **Transitions**: 300ms ease for interactions
- **Hover**: Scale 1.1, elevation, and opacity change
- **Minimization**: Smooth slide with fade

## 📦 Main Components

### 1. Main Search
- Input with glassmorphism
- Action buttons
- Floating results

### 2. Mini Player
- Embedded SoundCloud iframe
- Minimization controls
- Playback indicator

### 3. Background Controls
- Local file selector
- Input for URLs
- Video controls

### 4. Minimization System
- Always-visible floating button
- Persistent states
- Fluid animations

## 🔄 Migration from Vanilla CSS

### Main Changes

1. **Utility classes**: Custom CSS → Tailwind classes
2. **Responsiveness**: Media queries → Responsive classes
3. **States**: CSS pseudo-classes → Tailwind modifiers
4. **Organization**: One file → Separate files

### CSS → Tailwind Equivalents

```css
/* Before */
.search-input {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(15px);
    border-radius: 50px;
    padding: 18px 25px;
}

/* After */
class="bg-white/70 glass-effect rounded-full px-6 py-4"
```

## 🐛 Troubleshooting

### Problem: Tailwind styles don't load
- **Solution**: Check your internet connection for the CDN
- **Alternative**: Download Tailwind CSS locally

### Problem: SoundCloud doesn't play
- **Cause**: The Client ID might expire
- **Solution**: Update `CLIENT_ID` in `app.js`

### Problem: Videos don't load
- **Cause**: CORS restrictions
- **Solution**: Use videos from compatible domains

## 📈 Future Improvements

- [ ] Offline mode with local Tailwind
- [ ] Customizable themes
- [ ] Automatic playlist
- [ ] Integration with other platforms
- [ ] PWA (Progressive Web App)

## 📄 License

This project is under the MIT License. You can use it freely for personal and commercial projects.

---

**Developed with ❤️ using Tailwind CSS**
