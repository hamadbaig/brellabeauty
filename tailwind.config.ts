import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Beautiful rose gold and pink theme for beauty products
        rosegold: {
          50:  '#fef6f4',
          100: '#fde9e3',
          200: '#fbd4c8',
          300: '#f7b39d',
          400: '#f28c72',
          500: '#e96d52',
          600: '#d95138',
          DEFAULT: '#d95138',
          700: '#b43d28',
          800: '#933524',
          900: '#7a2f22',
        },
        blush: {
          50:  '#fff5f7',
          100: '#ffe3ec',
          200: '#ffcdd8',
          300: '#ffa3b8',
          400: '#ff6f94',
          500: '#f83d6f',
          DEFAULT: '#f83d6f',
          600: '#e6185a',
          700: '#c3104b',
          800: '#a01046',
          900: '#881142',
        },
        nude: {
          50:  '#faf8f6',
          100: '#f5f0ea',
          200: '#ebe1d4',
          300: '#dbc9b5',
          400: '#c9af93',
          500: '#b89878',
          DEFAULT: '#b89878',
          600: '#a37c5c',
          700: '#88674d',
          800: '#6d5340',
          900: '#5a4536',
        },
        mauve: {
          50:  '#f9f7f8',
          100: '#f2edee',
          200: '#e5dade',
          300: '#d1c0c7',
          400: '#b89da8',
          500: '#9e7d8b',
          DEFAULT: '#9e7d8b',
          600: '#856372',
          700: '#6d515e',
          800: '#5a444f',
          900: '#4c3a43',
        },
        pearl: {
          light: '#fefdfb',
          DEFAULT: '#faf9f7',
          dark: '#f5f3f0',
          deeper: '#efeae5',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans:  ['var(--font-montserrat)', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'beauty':    '0.15em',
        'widest':    '0.3em',
      },
      animation: {
        'shimmer':   'shimmer 2.5s linear infinite',
        'fade-up':   'fadeUp 0.6s ease forwards',
        'float':     'float 3s ease-in-out infinite',
        'glow':      'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(249, 61, 111, 0.3)' },
          to: { boxShadow: '0 0 30px rgba(249, 61, 111, 0.6), 0 0 40px rgba(249, 61, 111, 0.4)' },
        },
      },
      backgroundImage: {
        'rosegold-gradient': 'linear-gradient(135deg, #d95138 0%, #f7b39d 50%, #d95138 100%)',
        'beauty-gradient': 'linear-gradient(135deg, #f83d6f 0%, #ff6f94 50%, #f83d6f 100%)',
        'pearl-gradient': 'linear-gradient(to bottom, #fefdfb, #faf9f7)',
      },
      boxShadow: {
        'beauty':    '0 4px 40px rgba(249,61,111,0.12)',
        'beauty-lg': '0 8px 60px rgba(249,61,111,0.18)',
        'rosegold':  '0 0 0 2px #d95138',
        'glow':      '0 0 20px rgba(249,61,111,0.3)',
      },
    },
  },
  plugins: [],
}

export default config
