import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom'],
  },
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge'],
          // Split dashboard components
          'dashboard': [
            './src/pages/jobseeker/JobSeekerLayout.tsx',
            './src/pages/recruiter/RecruiterLayout.tsx',
            './src/pages/AdminDashboard.tsx',
          ],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Enable source maps for debugging (can disable in production)
    sourcemap: false,
  },
  // Performance optimizations
  server: {
    fs: {
      strict: false,
    },
  },
});
