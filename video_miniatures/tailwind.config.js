// Configuración personalizada de Tailwind CSS
// Este archivo muestra cómo extender Tailwind para proyectos más complejos

module.exports = {
  content: [
    './index.html',
    './components.html',
    './app.js'
  ],
  theme: {
    extend: {
      // Colores personalizados
      colors: {
        'glass': {
          50: 'rgba(255, 255, 255, 0.05)',
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          300: 'rgba(255, 255, 255, 0.3)',
          400: 'rgba(255, 255, 255, 0.4)',
          500: 'rgba(255, 255, 255, 0.5)',
          600: 'rgba(255, 255, 255, 0.6)',
          700: 'rgba(255, 255, 255, 0.7)',
          800: 'rgba(255, 255, 255, 0.8)',
          900: 'rgba(255, 255, 255, 0.9)',
        },
        'soundcloud': {
          orange: '#ff7e5f',
          gradient: {
            start: '#ff7e5f',
            end: '#feb47b'
          }
        }
      },
      
      // Espaciado personalizado
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      
      // Animaciones personalizadas
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-out': 'fadeInOut 3s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'glass-shine': 'glassShine 2s ease-in-out infinite'
      },
      
      // Keyframes para animaciones
      keyframes: {
        fadeInOut: {
          '0%': { 
            opacity: '0', 
            transform: 'translate(-50%, -50%) scale(0.8)' 
          },
          '20%': { 
            opacity: '1', 
            transform: 'translate(-50%, -50%) scale(1)' 
          },
          '80%': { 
            opacity: '1', 
            transform: 'translate(-50%, -50%) scale(1)' 
          },
          '100%': { 
            opacity: '0', 
            transform: 'translate(-50%, -50%) scale(0.8)' 
          }
        },
        slideUp: {
          'from': { 
            transform: 'translateY(100%)', 
            opacity: '0' 
          },
          'to': { 
            transform: 'translateY(0)', 
            opacity: '1' 
          }
        },
        slideRight: {
          'from': { 
            transform: 'translateX(-100%)', 
            opacity: '0' 
          },
          'to': { 
            transform: 'translateX(0)', 
            opacity: '1' 
          }
        },
        glassShine: {
          '0%': { 
            backgroundPosition: '-200% 0' 
          },
          '100%': { 
            backgroundPosition: '200% 0' 
          }
        }
      },
      
      // Blur personalizado
      backdropBlur: {
        'xs': '2px',
        '4xl': '72px'
      },
      
      // Tamaños personalizados
      width: {
        '128': '32rem',
        '144': '36rem'
      },
      height: {
        '128': '32rem',
        '144': '36rem'
      },
      
      // Box shadows personalizadas
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'neumorph': '20px 20px 60px #bebebe, -20px -20px 60px #ffffff'
      },
      
      // Gradientes personalizados
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'soundcloud-gradient': 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
        'dark-gradient': 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%)'
      },
      
      // Tipografía personalizada
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif']
      },
      
      // Tamaños de fuente personalizados
      fontSize: {
        'xxs': '0.625rem',
        '4xl': '2.5rem',
        '5xl': '3rem',
        '6xl': '4rem'
      }
    }
  },
  
  // Plugins personalizados
  plugins: [
    // Plugin para efectos glassmorphism
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.glass-effect': {
          'backdrop-filter': 'blur(15px)',
          '-webkit-backdrop-filter': 'blur(15px)',
          'background': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-effect-strong': {
          'backdrop-filter': 'blur(25px)',
          '-webkit-backdrop-filter': 'blur(25px)',
          'background': 'rgba(255, 255, 255, 0.15)',
          'border': '1px solid rgba(255, 255, 255, 0.3)',
        },
        '.minimized-slide': {
          'transform': 'translateY(-100vh)',
        },
        '.minimized-slide-x': {
          'transform': 'translateX(100%)',
        }
      }
      addUtilities(newUtilities)
    },
    
    // Plugin para estados hover mejorados
    function({ addUtilities }) {
      addUtilities({
        '.hover-lift': {
          'transition': 'all 0.3s ease',
          '&:hover': {
            'transform': 'translateY(-4px)',
            'box-shadow': '0 20px 40px rgba(0, 0, 0, 0.2)'
          }
        },
        '.hover-glow': {
          'transition': 'all 0.3s ease',
          '&:hover': {
            'box-shadow': '0 0 20px rgba(255, 126, 95, 0.6)',
            'transform': 'scale(1.05)'
          }
        }
      })
    }
  ],
  
  // Configuración para modo oscuro
  darkMode: 'class', // o 'media' para detección automática
  
  // Variantes adicionales (si usas Tailwind v2)
  variants: {
    extend: {
      backdropBlur: ['hover', 'focus'],
      scale: ['group-hover', 'group-focus'],
      translate: ['group-hover', 'group-focus']
    }
  }
}
