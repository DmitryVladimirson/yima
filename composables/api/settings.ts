import { useNuxtApp, urlPrefix } from '#imports'
import type { AsyncDataOptions } from '#app'
import type { YimaFetchOptions } from '~/plugins/http'

const getSettings = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<YimaSettings>(`${urlPrefix}/settings`, options, asyncDataOptions)
}

const setSettings = async (
  payload: Partial<YimaSettings>,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  return useNuxtApp().$http.put(
    `${urlPrefix}/settings`,
    {
      body: payload,
      ...options,
    },
    asyncDataOptions
  )
}

export const useYimaApiSettings = () => {
  return {
    getSettings,
    setSettings,
  }
}
