/* eslint-disable new-cap */

import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Components from 'unplugin-vue-components/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/fontaine',
    '@nuxtjs/i18n',
    '@formkit/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-swiper',
    'nuxt-headlessui',
  ],
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
      meta: [
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: false,
    injectPosition: 0,
    viewer: true,
  },
  vite: {
    plugins: [
      Icons({
        compiler: 'vue3',
        customCollections: {
          yima: FileSystemIconLoader('assets/images/icons'),
        },
      }),
      Components({
        dts: true,
        resolvers: [
          IconsResolver({
            customCollections: ['yima'],
          }),
        ],
      }),
    ],
  },
  i18n: {
    locales: [
      { code: 'uk', iso: 'uk-UA', file: 'uk-UA.json' },
      { code: 'ru', iso: 'ru-RU', file: 'ru-RU.json' },
    ],
    defaultLocale: 'uk',
    baseUrl: '/',
    lazy: true,
    langDir: 'lang/',
  },
  imports: {
    dirs: ['composables/**'],
  },
  css: ['@vueform/slider/themes/default.css'],
})
