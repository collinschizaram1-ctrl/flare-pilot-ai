/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core brand palette — Solana-inspired futuristic dark
        flare: {
          bg:       '#080A0F',
          surface:  '#0E1117',
          card:     '#131720',
          border:   '#1E2535',
          purple:   '#9945FF',
          green:    '#14F195',
          blue:     '#00C2FF',
          pink:     '#FF6BBA',
          yellow:   '#FFD166',
          muted:    '#4B5568',
          text:     '#E2E8F0',
          subtext:  '#8892A4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'purple-glow': 'radial-gradient(ellipse at 50% 0%, rgba(153,69,255,0.15) 0%, transparent 70%)',
        'green-glow':  'radial-gradient(ellipse at 50% 100%, rgba(20,241,149,0.10) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(153,69,255,0.25)',
        'glow-green':  '0 0 30px rgba(20,241,149,0.20)',
        'glow-blue':   '0 0 20px rgba(0,194,255,0.20)',
        'glass':       '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
