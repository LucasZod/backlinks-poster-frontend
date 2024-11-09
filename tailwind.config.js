/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        primary: '#007AFF',
        ground: '#F2F2F7',
        success: '#58E276',
        error: '#FF6666',
        info: '#0CBCF2',
        alert: '#F7A23F',
        tagGround: '#9747FF0A',
        inProgress: '#007AFF08',
      },
      colors: {
        primary: '#334155',
        primaryBlue: '#007AFF',
        primarySoft: '#00000061',
        success: '#00a451',
        error: '#FF6666',
        info: '#0CBCF2',
        alert: '#F7A23F',
        tag: '#9747FF',
      },
      borderColor: {
        ground: '#E5E5EA',
        tag: '#9747FF',
        error: '#FF6666',
        primary: '#007AFF',
        warning: '#F7A23F',
        success: '#00a451',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
