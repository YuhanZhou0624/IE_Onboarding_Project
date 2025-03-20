import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['moment-timezone']
    }
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {
        //target:'http://localhost:3001',
        target:'https://ie-onboarding-project.onrender.com',
        changeOrigin: true,             // 允许跨域
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径，移除 '/api'
      }
    }
  }
})
