/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cemetery: {
          950: '#07080c',
          900: '#0b0c13',
          850: '#11131f',
          800: '#171929',
          700: '#23263b',
          border: '#2e334e',
          glow: '#9333ea',
          emerald: '#10b981',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          amber: '#f59e0b'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float-fog': 'floatFog 12s ease-in-out infinite alternate',
        'lightning-flash': 'lightningFlash 1.5s ease-in-out infinite'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' }
        },
        floatFog: {
          '0%': { transform: 'translateX(-5%) translateY(0%)' },
          '100%': { transform: 'translateX(5%) translateY(-3%)' }
        },
        lightningFlash: {
          '0%, 100%': { opacity: '0.3', filter: 'drop-shadow(0 0 5px #a855f7)' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px #c084fc)' }
        }
      }
    },
  },
  plugins: [],
}
