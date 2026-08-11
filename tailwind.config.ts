import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './App.tsx', './index.tsx', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"SF Mono"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      colors: {
        jet: '#353535',
        'raisin-black': '#232323',
        gunmetal: '#2B303A',
        'light-gray': '#D1D5DB',
        'cyber-yellow': '#FFD300',
        'mint-green': '#A2E8AE',
        'sky-blue': '#87CEEB',
        'coral-pink': '#FF7F50',
      },
    },
  },
  plugins: [],
} satisfies Config;
