/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        neon: {
          green: '#00ff88',
          cyan: '#00eeff',
          pink: '#ff006e',
          yellow: '#ffea00',
          purple: '#bf00ff',
        },
        dark: {
          900: '#030712',
          800: '#060d1f',
          700: '#0a1628',
          600: '#0f1f3d',
          500: '#162447',
        }
      },
      boxShadow: {
        'neon-green': '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 40px #00ff88',
        'neon-cyan': '0 0 10px #00eeff, 0 0 20px #00eeff, 0 0 40px #00eeff',
        'neon-pink': '0 0 10px #ff006e, 0 0 20px #ff006e, 0 0 40px #ff006e',
        'neon-purple': '0 0 10px #bf00ff, 0 0 20px #bf00ff',
        'board': '0 0 60px rgba(0,255,136,0.15), inset 0 0 60px rgba(0,238,255,0.05)',
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.4' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
