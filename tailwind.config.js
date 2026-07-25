/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        fundo: '#FDFBF7',
        primaria: '#C17B7B',
        secundaria: '#D4AF37',
        texto: '#3A3A3A',
        sucesso: '#7B8D7B'
      },
      fontFamily: {
        titulo: ['Playfair Display', 'serif'],
        corpo: ['Nunito', 'sans-serif']
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pop': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '60%': { transform: 'scale(1.03)', opacity: '1' },
          '100%': { transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.35s ease-out',
        'pop': 'pop 0.3s ease-out'
      }
    }
  },
  plugins: []
};
