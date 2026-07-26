// ============================================================
// LeafTally — Vite build configuration
// ============================================================
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',

  resolve: {
    alias: {
      '@': '/src',
      '@data': '/src/data',
      '@modules': '/src/modules',
      '@utils': '/src/utils',
      '@components': '/src/components',
      '@styles': '/src/styles',
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true },
    },

    rollupOptions: {
      input: { main: './public/index.html' },
      output: {
        // Chunk by module group for better caching
        manualChunks(id) {
          if (id.includes('/src/data/'))       return 'vendor-data';
          if (id.includes('/src/utils/'))      return 'vendor-utils';
          if (id.includes('/src/components/')) return 'vendor-components';
          if (id.includes('/src/modules/accounting')) return 'module-accounting';
          if (id.includes('/src/modules/sales'))      return 'module-sales';
          if (id.includes('/src/modules/purchases'))  return 'module-purchases';
          if (id.includes('/src/modules/hr'))         return 'module-hr';
          if (id.includes('/src/modules/inventory'))  return 'module-inventory';
          if (id.includes('/src/modules/settings'))   return 'module-settings';
          if (id.includes('/src/modules/corporate'))  return 'module-corporate';
          if (id.includes('/src/modules/admin'))      return 'module-admin';
          if (id.includes('/src/modules/superadmin')) return 'module-superadmin';
        },
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
  },

  server: {
    port: 5173,
    open: true,
    cors: true,
  },

  preview: {
    port: 4173,
    open: true,
  },

  // Copy CSS to assets on build
  assetsInclude: ['**/*.css'],
});
