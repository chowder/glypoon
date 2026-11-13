import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Keep Tailwind 2's default palette, which mapped these names to
        // different colour scales than Tailwind 3 does.
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
        blueGray: colors.slate,
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        shuffle: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' }
        }
      },
      animation: {
        wiggle: 'wiggle 200ms ease-in-out',
        bounce: 'bounce 300ms ease-in-out',
        shuffle: 'shuffle 500ms cubic-bezier(0.65, 0, 0.35, 1)'
      }
    },
  },
  plugins: [],
}
