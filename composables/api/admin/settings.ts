import { useNuxtApp, urlAdminPrefix } from '#imports'
import type { AsyncDataOptions } from '#app'
import type { YimaFetchOptions } from '~/plugins/http'

const getSettings = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<YimaAdminSettings>(`${urlAdminPrefix}/settings`, options, asyncDataOptions)
}

const setSettings = async (
  payload: Partial<YimaAdminSettings>,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  return useNuxtApp().$http.put(
    `${urlAdminPrefix}/settings`,
    {
      body: payload,
      ...options,
    },
    asyncDataOptions
  )
}

export const useYimaAdminApiSettings = () => {
  return {
    getSettings,
    setSettings,
  }
}
