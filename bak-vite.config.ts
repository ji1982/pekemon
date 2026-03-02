import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      root: '.',
      base: '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
        // 允许外部主机访问
        allowedHosts: ['jxrtop.top', 'www.jxrtop.top', 'all'],
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src/client'),
          '@shared': path.resolve(__dirname, 'src/shared'),
          '@server': path.resolve(__dirname, 'src/server')
        }
      }
    };
});
