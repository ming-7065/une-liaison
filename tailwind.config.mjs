/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#66BB6A', // Light Green (Sunshine base)
          dark: '#4CAF50',    // Slightly darker green for dark mode elements
        },
        secondary: {
          DEFAULT: '#FFD54F', // Amber (Sunshine secondary)
          dark: '#FFC107',    // Slightly darker amber for dark mode elements
        },
        accent: {
          DEFAULT: '#FF8A65',  // Coral (Sunshine accent)
          dark: '#FF7043',     // Slightly darker coral for dark mode elements
        },
        // Define a set of 'harvest' colors for an alternative theme
        harvestPrimary: '#FB8C00',   // Rich Orange (for harvest theme)
        harvestSecondary: '#FFD835', // Golden Yellow (for harvest theme)
        harvestAccent: '#6D4C41',  // Earthy Brown (for harvest theme)
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}