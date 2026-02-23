/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#1e1b4b',
        },
        // Premium FinTech palette
        kb: {
          bg:     '#0e0e12',
          card:   '#16161a',
          border: '#26262a',
          purple: '#a855f7',
          violet: '#7c3aed',
          accent: '#9333ea',
        },
      },
      backgroundImage: {
        'balance-gradient': 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)',
        'purple-glow': 'radial-gradient(circle at 50% 50%, rgba(168,85,247,0.35) 0%, transparent 65%)',
      },
      animation: {
        'glow':         'glow 2s ease-in-out infinite alternate',
        'float':        'float 3s ease-in-out infinite',
        'shimmer':      'shimmer 1.5s linear infinite',
        'pulse-purple': 'pulse-purple 2s ease-in-out infinite',
        'count-up':     'count-up 0.6s ease-out forwards',
        'slide-up':     'slide-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':      'fade-in 0.3s ease-out forwards',
        'particle':     'particle 8s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%':   { boxShadow: '0 0 20px rgba(99,102,241,0.3)' },
          '100%': { boxShadow: '0 0 60px rgba(99,102,241,0.8), 0 0 100px rgba(99,102,241,0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-purple': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(168,85,247,0.4)' },
          '50%':      { boxShadow: '0 0 0 16px rgba(168,85,247,0)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        particle: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)', opacity: '0.3' },
          '25%':      { transform: 'translateY(-40px) translateX(20px)', opacity: '0.7' },
          '50%':      { transform: 'translateY(-20px) translateX(-15px)', opacity: '0.4' },
          '75%':      { transform: 'translateY(-60px) translateX(10px)', opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
