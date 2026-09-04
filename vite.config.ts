import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Use esbuild for minification (faster and doesn't require terser)
    minify: 'esbuild',
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1500,
    // Output directory for Cloudflare Pages
    outDir: 'dist',
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      '@supabase/supabase-js',
      'react-helmet-async',
    ],
  },
  // Enable gzip compression
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
});
