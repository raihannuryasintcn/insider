module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ⬅️ penting agar JSX dikenali
  ],
  safelist: [
    'bg-emerald-200',
    'bg-orange-200',
    'bg-fuchsia-300',
    'bg-violet-300',
    'bg-pink-200',
    'bg-red-300',
    'bg-blue-300',
    'bg-zinc-300',
    'bg-indigo-300',
    'bg-amber-200',
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
