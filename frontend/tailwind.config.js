/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bloodRed: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#ef4444',
          600: '#dc2626', // Primary Red
          700: '#b91c1c',
          800: '#991b1b', // Dark Red
          900: '#7f1d1d'
        },
        slateBg: '#F8FAFC',
        textPrimary: '#1E293B',
        textSecondary: '#64748B',
        brandSuccess: '#16A34A',
        brandWarning: '#F59E0B'
      }
    },
  },
  plugins: [],
}
