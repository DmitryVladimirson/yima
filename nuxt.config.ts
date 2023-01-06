// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@formkit/nuxt', '@nuxtjs/tailwindcss', 'nuxt-swiper', 'nuxt-headlessui', '@nuxtjs/html-validator', '@nuxtjs/fontaine'],
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
      meta: [
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
      ]
    }
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: false,
    injectPosition: 0,
    viewer: true
  },
  imports: {
    dirs: [
      'composables/**'
    ]
  }
})
