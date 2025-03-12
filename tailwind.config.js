/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8',    // Couleur principale (bleu Google)
        secondary: '#5f6368',  // Couleur secondaire
        success: '#34a853',    // Couleur succès (vert)
        warning: '#fbbc05',    // Couleur avertissement (jaune)
        error: '#ea4335',      // Couleur erreur (rouge)
      },
    },
  },
  plugins: [],
}