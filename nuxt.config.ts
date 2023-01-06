// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/fontaine', '@nuxtjs/html-validator', '@nuxtjs/i18n', '@formkit/nuxt', '@nuxtjs/tailwindcss', 'nuxt-swiper', 'nuxt-headlessui'],
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
  i18n: {
    locales: [
      { code: 'uk', iso: 'uk-UA', file: 'uk-UA.json' },
      { code: 'ru', iso: 'ru-RU', file: 'ru-RU.json' }
    ],
    defaultLocale: 'uk',
    baseUrl: '/',
    lazy: true,
    langDir: 'lang/'
  },
  imports: {
    dirs: [
      'composables/**'
    ]
  }
})
