/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'moltbook-bg': '#0f0f1a',
        'moltbook-bg-alt': '#1a1a2e',
        'moltbook-primary': '#00ffd5',
        'moltbook-cyan': '#4fc3f7',
        'moltbook-red': '#ff4444',
        'moltbook-border': '#333355',
      },
      fontFamily: {
        'mono': ['"Courier New"', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #00ffd5, 0 0 10px #00ffd5' },
          '50%': { boxShadow: '0 0 20px #00ffd5, 0 0 30px #00ffd5' },
        },
      },
    },
  },
  plugins: [],
}
