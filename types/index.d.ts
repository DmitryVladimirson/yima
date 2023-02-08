import type { order } from '~/plugins/order'
import type { http } from '~/plugins/http'
import type { authPlugin } from '~/plugins/auth'
import type { NuxtI18nOptions } from '@nuxtjs/i18n'

interface PluginsInjections {
  $order: ReturnType<typeof order>
  $http: ReturnType<typeof http>
  $auth: ReturnType<typeof authPlugin>
  $i18n: ReturnType<NuxtI18nOptions>
}

declare module '#app' {
  interface NuxtApp extends PluginsInjections {}

  interface RuntimeNuxtHooks {
    'yima:form:error': any
  }
}

declare module 'nuxt/dist/app/nuxt' {
  interface NuxtApp extends PluginsInjections {}
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends PluginsInjections {}
}

declare module '@nuxt/schema' {
  interface AppConfig {
    [key: string]: any
    theme: {
      [key: string]: any
      colors: Record<string, any>
      screens: Record<string, any>
    }
  }
}
