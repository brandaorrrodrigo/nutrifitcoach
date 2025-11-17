import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 🎨 DESIGN TOKENS NUTRIFIT
      colors: {
        nutrifit: {
          // Gradiente principal (Rosa → Verde → Roxo)
          pink: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899', // Principal
            600: '#db2777',
            700: '#be185d',
            800: '#9f1239',
            900: '#831843',
          },
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e', // Principal
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7', // Principal
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
          },
          cyan: {
            50: '#ecfeff',
            100: '#cffafe',
            200: '#a5f3fc',
            300: '#67e8f9',
            400: '#22d3ee',
            500: '#06b6d4', // Principal
            600: '#0891b2',
            700: '#0e7490',
            800: '#155e75',
            900: '#164e63',
          },
          // Preto premium
          black: {
            50: '#f8f9fa',
            100: '#f1f3f5',
            200: '#e9ecef',
            300: '#dee2e6',
            400: '#ced4da',
            500: '#adb5bd',
            600: '#6c757d',
            700: '#495057',
            800: '#343a40',
            900: '#212529', // Principal
          },
        },
      },
      // 📏 ESPAÇAMENTOS PADRONIZADOS
      spacing: {
        'page': '1.5rem', // p-6 = 24px
        'section': '2rem', // p-8 = 32px
        'card': '1rem', // p-4 = 16px
      },
      // 🔤 TIPOGRAFIA
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1', fontWeight: '800' }], // 64px
        'h1': ['3rem', { lineHeight: '1.1', fontWeight: '700' }], // 48px
        'h2': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }], // 36px
        'h3': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }], // 30px
        'h4': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }], // 24px
        'body-lg': ['1.125rem', { lineHeight: '1.75', fontWeight: '400' }], // 18px
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }], // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }], // 14px
      },
      // 🎭 ANIMAÇÕES
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        confetti: 'confetti 3s linear forwards',
        slideInUp: 'slideInUp 0.5s ease-out',
        bounceIn: 'bounceIn 0.6s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      // 🎨 GRADIENTES PREDEFINIDOS
      backgroundImage: {
        'gradient-nutrifit': 'linear-gradient(135deg, #ec4899 0%, #22c55e 50%, #a855f7 100%)',
        'gradient-nutrifit-subtle': 'linear-gradient(135deg, #fce7f3 0%, #dcfce7 50%, #f3e8ff 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
