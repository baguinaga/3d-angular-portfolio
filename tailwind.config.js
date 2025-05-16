/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      boxShadow: {
        custom: '8px 4px 12px #55555596',
      },
      maxHeight: {
        120: '30rem',
      },
      fontFamily: {
        sans: ['Khula', 'sans-serif'],
        khula: ['Khula', 'sans-serif'],
        ubuntu: ['Ubuntu', 'sans-serif'],
        prompt: ['Prompt', 'sans-serif'],
      },
    },
  },
};
