module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ⬅️ penting agar JSX dikenali
  ],
  theme: {
    extend: {
      fontFamily: {
        hiragino: ['var(--font-hiragino)'],
      },
      colors: {
        custom: "", // kalau ini belum dipakai, bisa dihapus
      },
    },
  },
  variants: {},
  plugins: [],
};
