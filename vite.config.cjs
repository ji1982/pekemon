const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

// https://vitejs.dev/config/
module.exports = defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    },
    allowedHosts: ['jxrtop.top', 'www.jxrtop.top', 'all']
  },
  resolve: {
    alias: {
      '@': require('path').resolve(__dirname, 'src/client'),
      '@shared': require('path').resolve(__dirname, 'src/shared'),
      '@server': require('path').resolve(__dirname, 'src/server')
    }
  }
});