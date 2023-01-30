import { useNuxtApp, urlAdminPrefix } from '#imports'
import type { AsyncDataOptions } from '#app'
import type { YimaFetchOptions } from '~/plugins/http'

const getProducts = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<MemberResponse<AdminProduct>>(`${urlAdminPrefix}/products`, options, asyncDataOptions)
}

const getProduct = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<AdminProduct>(`${urlAdminPrefix}/products/${id}`, options, asyncDataOptions)
}

const setProduct = async (
  id: string,
  payload: Partial<AdminProduct>,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  return useNuxtApp().$http.put(
    `${urlAdminPrefix}/products/${id}`,
    {
      body: payload,
      ...options,
    },
    asyncDataOptions
  )
}

const addProduct = async (data: AdminProduct, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.post(
    `${urlAdminPrefix}/products`,
    {
      body: data,
      ...options,
    },
    asyncDataOptions
  )
}

const deleteProduct = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.delete(`${urlAdminPrefix}/products/${id}`, options, asyncDataOptions)
}

export const useYimaApiAdminProduct = () => {
  return {
    addProduct,
    deleteProduct,
    getProduct,
    getProducts,
    setProduct,
  }
}
