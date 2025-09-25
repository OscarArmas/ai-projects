# SoundCloud Music Player - Versión Tailwind CSS

## 📁 Estructura de Archivos

```
video_miniatures/
├── index.html          # Archivo principal con Tailwind CSS
├── app.js             # Lógica JavaScript separada
├── components.html    # Componentes reutilizables y guía de estilos
├── page.html         # Archivo original (respaldo)
└── README.md         # Esta documentación
```

## 🚀 Características

- **Interfaz moderna** con Tailwind CSS y efectos glassmorphism
- **Reproducción de música** desde SoundCloud
- **Fondos personalizables** (imagen/video)
- **Interfaz minimizable** para visualización completa del fondo
- **Totalmente responsivo** para móviles, tablets y desktop
- **Controles de teclado** intuitivos

## 🎨 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **Tailwind CSS**: Framework de utilidades CSS
- **JavaScript Vanilla**: Sin dependencias adicionales
- **SoundCloud API**: Reproducción de música
- **Glassmorphism**: Efectos de cristal modernos

## 🔧 Configuración

### 1. Usar el reproductor

1. Abre `index.html` en tu navegador
2. El archivo ya incluye Tailwind CSS desde CDN
3. Todos los archivos deben estar en la misma carpeta

### 2. Personalización

- **Componentes**: Consulta `components.html` para elementos reutilizables
- **Estilos**: Modifica las clases de Tailwind en `index.html`
- **Funcionalidad**: Edita `app.js` para cambios en la lógica

## 🎹 Controles de Teclado

| Tecla | Función |
|-------|---------|
| `M` | Minimizar/mostrar interfaz completa |
| `P` | Minimizar/mostrar reproductor |
| `V` | Silenciar/activar video de fondo |
| `Espacio` | Pausar/reproducir video de fondo |
| `ESC` | Cerrar reproductor y opciones |
| `Enter` | Buscar música o reproducir URL |

## 📱 Características Responsivas

### Desktop (1024px+)
- Reproductor: 280x180px
- Buscador: 500px de ancho
- Botones lado a lado

### Tablet (768px+)
- Reproductor: 240x150px
- Buscador: 384px de ancho
- Botones apilados

### Móvil (640px-)
- Reproductor: 220x130px
- Buscador: 320px de ancho
- Interfaz optimizada para touch

## 🎨 Sistema de Diseño

### Colores Principales
- **Fondo principal**: Transparencias blancas (white/70, white/90)
- **Acentos**: Naranja (#ff7e5f, orange-400)
- **Texto**: Grises (gray-600, gray-800)
- **Estados**: Verde para éxito, rojo para errores

### Efectos Glassmorphism
```css
.glass-effect {
    backdrop-filter: blur(15px);
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Animaciones
- **Transiciones**: 300ms ease para interacciones
- **Hover**: Escala 1.1, elevación y cambio de opacidad
- **Minimización**: Deslizamiento suave con fade

## 📦 Componentes Principales

### 1. Buscador Principal
- Input con glassmorphism
- Botones de acción
- Resultados flotantes

### 2. Mini Reproductor
- Iframe de SoundCloud embebido
- Controles de minimización
- Indicador de reproducción

### 3. Controles de Fondo
- Selector de archivos locales
- Input para URLs
- Controles de video

### 4. Sistema de Minimización
- Botón flotante siempre visible
- Estados persistentes
- Animaciones fluidas

## 🔄 Migración desde CSS Vanilla

### Cambios Principales

1. **Clases de utilidad**: CSS personalizado → Clases Tailwind
2. **Responsividad**: Media queries → Clases responsivas
3. **Estados**: Pseudo-clases CSS → Modificadores Tailwind
4. **Organización**: Un archivo → Archivos separados

### Equivalencias CSS → Tailwind

```css
/* Antes */
.search-input {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(15px);
    border-radius: 50px;
    padding: 18px 25px;
}

/* Después */
class="bg-white/70 glass-effect rounded-full px-6 py-4"
```

## 🐛 Solución de Problemas

### Problema: Tailwind no carga estilos
- **Solución**: Verifica conexión a internet para CDN
- **Alternativa**: Descarga Tailwind CSS localmente

### Problema: SoundCloud no reproduce
- **Causa**: Client ID puede expirar
- **Solución**: Actualiza CLIENT_ID en `app.js`

### Problema: Videos no cargan
- **Causa**: Restricciones CORS
- **Solución**: Usa videos desde dominios compatibles

## 📈 Mejoras Futuras

- [ ] Modo offline con Tailwind local
- [ ] Themes personalizables
- [ ] Playlist automática
- [ ] Integración con otras plataformas
- [ ] PWA (Progressive Web App)

## 📄 Licencia

Este proyecto está bajo licencia MIT. Puedes usarlo libremente para proyectos personales y comerciales.

---

**Desarrollado con ❤️ usando Tailwind CSS**
