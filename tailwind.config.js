/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"', '"Noto Sans TC"', '"PingFang TC"', '"Microsoft JhengHei"',
          'system-ui', 'sans-serif',
        ],
        serif: [
          '"Newsreader"', 'Georgia', '"Noto Serif TC"', '"Songti TC"', 'serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Claude-style warm paper backgrounds
        paper: {
          DEFAULT: '#FAF7F2',
          50: '#FDFCFA',
          100: '#F7F3EC',
          200: '#F0EBE0',
          300: '#E7DFD0',
        },
        // Clay / coral — primary brand accent (Claude vibe)
        clay: {
          50: '#FBF3EF',
          100: '#F6E4DA',
          200: '#EDC8B6',
          300: '#E1A98F',
          400: '#D68A6A',
          500: '#CC785C',
          600: '#B85F41',
          700: '#974A31',
          800: '#793C2A',
          900: '#633425',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(60,50,40,0.04), 0 8px 24px -12px rgba(60,50,40,0.12)',
        lift: '0 2px 4px rgba(60,50,40,0.05), 0 18px 40px -18px rgba(60,50,40,0.22)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        flowdash: {
          to: { strokeDashoffset: '-24' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        breathe: {
          '0%,100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
        flowdash: 'flowdash 0.9s linear infinite',
        floaty: 'floaty 4s ease-in-out infinite',
        breathe: 'breathe 2.4s ease-in-out infinite',
        riseIn: 'riseIn 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
