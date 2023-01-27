import { useNuxtApp, urlAdminPrefix } from '#imports'
import type { AsyncDataOptions } from '#app'
import type { YimaFetchOptions } from '~/plugins/http'

const getAttributes = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<AdminAttribute[]>(`${urlAdminPrefix}/attributes`, options, asyncDataOptions)
}

const getAttribute = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<AdminAttribute>(`${urlAdminPrefix}/attributes/${id}`, options, asyncDataOptions)
}

const setAttribute = async (
  id: string,
  payload: Partial<AdminAttribute>,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  return useNuxtApp().$http.put(
    `${urlAdminPrefix}/attributes/${id}`,
    {
      body: payload,
      ...options,
    },
    asyncDataOptions
  )
}

const addAttribute = async (
  data: AdminAttribute,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  return useNuxtApp().$http.post(
    `${urlAdminPrefix}/attributes`,
    {
      body: data,
      ...options,
    },
    asyncDataOptions
  )
}

const deleteAttribute = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.delete(`${urlAdminPrefix}/attributes/${id}`, options, asyncDataOptions)
}

export const useYimaApiAdminAttribute = () => {
  return {
    addAttribute,
    deleteAttribute,
    getAttribute,
    getAttributes,
    setAttribute,
  }
}
