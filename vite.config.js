import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function asyncCssPlugin() {
  return {
    name: 'async-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(.*?)">/g,
        '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
      ).replace(
        /<link rel="stylesheet" href="(.*?)">/g,
        '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
      );
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/Website/',
  plugins: [
    react(),
    tailwindcss(),
    asyncCssPlugin()
  ],
  build: {
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-forms': ['react-hook-form'],
          'vendor-slider': ['react-slider']
        }
      }
    }
  },
  resolve: {
    alias: {
      src: "/src",
      styles: "/src/styles",
      components: "/src/components",
      assets: "/src/assets",
      pages: "/src/pages",
      hooks: "/src/hooks",
      context: "/src/context",
      services: "/src/services",
      admin: "/src/pages/Admin",
      shop: "/src/pages/Shop",
    },
  },
})
