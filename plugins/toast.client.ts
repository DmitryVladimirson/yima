import { defineNuxtPlugin } from '#imports'
import type { PluginOptions } from 'vue-toastification'

export default defineNuxtPlugin(async (nuxtApp) => {
  const [{ default: Toast, POSITION, TYPE }] = await Promise.all([
    import('vue-toastification'),
    // @ts-expect-error This is ok
    import('vue-toastification/dist/index.css'),
  ])

  nuxtApp.vueApp.use(Toast, {
    maxToasts: 5,
    closeOnClick: false,
    closeButton: false,
    position: POSITION.TOP_CENTER,
    toastDefaults: {
      [TYPE.DEFAULT]: {
        timeout: 5000,
      },
      [TYPE.INFO]: {
        timeout: 3000,
      },
      [TYPE.SUCCESS]: {
        timeout: 3000,
      },
      [TYPE.WARNING]: {
        timeout: 5000,
        closeButton: false,
      },
      [TYPE.ERROR]: {
        timeout: 8000,
        closeButton: false,
      },
    },
  } as PluginOptions)
})
