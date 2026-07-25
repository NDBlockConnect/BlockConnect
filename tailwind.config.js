/** @type {import('tailwindcss').Config} */

// BlockConnect org site — "Engineering Broadsheet" aesthetic.
// Warm dark slate base, cream ink, lime/tangerine/iris accents.
// Distinct from the MnMCP "Voxel Bridge" palette.
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // Surface system — warm dark slate
        bg: '#0c0e13',
        surface: '#151821',
        'surface-2': '#1c2030',
        line: '#252a37',
        'line-soft': '#1d2130',
        // Brand accents
        lime: '#bef264',        // primary - slime / glowstone nod
        tangerine: '#fb923c',   // secondary - warm contrast
        iris: '#a78bfa',        // tertiary - cool contrast
        rose: '#fb7185',        // category: ai
        sky: '#38bdf8',         // category: launcher
        magenta: '#e879f9',     // category: meta
        // Text — warm cream
        ink: '#f4f1ea',
        muted: '#9098a8',
        'muted-2': '#5c6373',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        '8': '8px',
        '10': '10px',
        '12': '12px',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      letterSpacing: {
        'tight-2': '-0.022em',
        'tight-3': '-0.035em',
        'wide-2': '0.14em',
        'wide-3': '0.28em',
      },
      boxShadow: {
        'inner-glow': 'inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 24px rgba(190,242,100,0.05)',
        'card-hover': '0 1px 0 0 rgba(255,255,255,0.04), 0 0 0 1px rgba(190,242,100,0.14), 0 24px 60px -24px rgba(190,242,100,0.20)',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        'drift': {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-6px,0)' },
        },
        'sweep': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'pulse-soft': 'pulse-soft 2.6s ease-in-out infinite',
        'drift': 'drift 9s ease-in-out infinite',
        'sweep': 'sweep 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
