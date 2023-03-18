/* eslint-disable new-cap */

import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Components from 'unplugin-vue-components/vite'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from './tailwind.config'

const resolvedConfig = resolveConfig(tailwindConfig)

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/fontaine',
    '@nuxtjs/i18n',
    '@formkit/nuxt',
    '@vueuse/nuxt',
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
  appConfig: {
    theme: {
      screens: resolvedConfig.theme?.screens,
      colors: {
        // @ts-expect-error This is ok
        primary: resolvedConfig.theme?.colors.primary,
      },
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
      { code: 'en', iso: 'en-US', file: 'en-US.json' },
    ],
    defaultLocale: 'uk',
    baseUrl: '/',
    lazy: true,
    langDir: 'lang/',
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['unplugin-icons/types/vue'],
      },
    },
  },
  runtimeConfig: {
    public: {
      typesenseApiKey: process.env.NUXT_PUBLIC_TYPESENSE_API_KEY ?? '',
      novaposhtaApiKey: process.env.NUXT_PUBLIC_NOVAPOSHTA_API_KEY ?? '',
    },
  },
  imports: {
    dirs: ['composables/**'],
  },
  css: ['@vueform/slider/themes/default.css', 'firebaseui/dist/firebaseui.css'],
  nitro: {
    preset: 'firebase',
  },
})
