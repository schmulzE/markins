import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  nitro: {
    preset: 'netlify',
    compressPublicAssets: true,
  },
  runtimeConfig: {
    // Public keys that are exposed to the client
    public: {
      apiUrl: process.env.SUPABASE_URL
    }
  },
  build: {
    transpile: [
      'vue-toastification', 
      'gsap'
    ]
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    build: {
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true
    },
  },
  modules: [
    // '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/google-fonts', // Add the module here
    '@nuxtjs/color-mode',
  ],                                                                                                                                                
  googleFonts: {
    families: {
      Mali: [400, 600, 700],
      Varela: true,
      Quicksand: [300, 400, 500, 600, 700],
      Rubik: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    display: 'swap',
    subsets: 'latin',
  },
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/signin',
      callback: '/confirm',
      include: undefined,
      exclude: [],
      saveRedirectToCookie: false,
    },
  },
  css: ['~/assets/css/main.css']
})