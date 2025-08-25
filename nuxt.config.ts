export default defineNuxtConfig({
  // Nuxt 4 相容性
  compatibilityDate: '2024-08-25',
  future: {
    compatibilityVersion: 4
  },
  
  // TypeScript 設定
  typescript: {
    strict: true,
    typeCheck: true
  },
  
  // 模組設定
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode'
  ],
  
  // CSS 框架
  css: ['~/assets/css/main.css'],
  
  // 擴充功能特定設定
  ssr: false,
  
  // Vite 設定
  vite: {
    build: {
      rollupOptions: {
        output: {
          format: 'iife'
        }
      }
    }
  }
})