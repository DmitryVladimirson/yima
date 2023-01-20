import { useNuxtApp, urlAdminPrefix } from '#imports'
import type { AsyncDataOptions } from '#app'
import type { YimaFetchOptions } from '~/plugins/http'

type ExcludeChildren<T> = Omit<T, 'children'>

declare global {
  interface ServerCategory extends ExcludeChildren<AdminCategory> {
    children: string[]
  }
}

const getCategories = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<AdminCategory[]>(`${urlAdminPrefix}/categories`, options, asyncDataOptions)
}

const getCategory = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<AdminCategory>(`${urlAdminPrefix}/categories/${id}`, options, asyncDataOptions)
}

const setCategory = async (
  id: string,
  payload: Partial<AdminCategory>,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  return useNuxtApp().$http.put(
    `${urlAdminPrefix}/categories/${id}`,
    {
      body: payload,
      ...options,
    },
    asyncDataOptions
  )
}

const addCategory = async (
  data: AdminCategory,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  return useNuxtApp().$http.post(
    `${urlAdminPrefix}/categories`,
    {
      body: data,
      ...options,
    },
    asyncDataOptions
  )
}

const deleteCategory = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.delete(`${urlAdminPrefix}/categories/${id}`, options, asyncDataOptions)
}

export const useYimaApiAdminCategory = () => {
  return {
    addCategory,
    deleteCategory,
    getCategory,
    getCategories,
    setCategory,
  }
}
