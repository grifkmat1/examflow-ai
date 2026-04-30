/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}','./components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { display: ['var(--font-display)'], body: ['var(--font-body)'] },
      colors: {
        ink: { 950:'#0a0a0f',900:'#111118',800:'#1a1a24',700:'#252535',600:'#363650' },
        acid: { 400:'#c8ff00',500:'#a8d900' },
        coral: { 400:'#ff6b6b' },
        sky: { 400:'#60cfff' }
      },
      animation: { 'fade-up':'fadeUp 0.5s ease forwards','pulse-slow':'pulse 3s ease-in-out infinite' },
      keyframes: { fadeUp: { '0%':{opacity:0,transform:'translateY(16px)'},'100%':{opacity:1,transform:'translateY(0)'} } }
    }
  },
  plugins: []
}
