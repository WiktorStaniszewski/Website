import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Website/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      src: "/src",
      styles: "/src/styles",
      components: "/src/components",
      assets: "/src/assets",
      pages: "/src/pages",
      hooks: "/src/components/hooks",
    },
  },
})
