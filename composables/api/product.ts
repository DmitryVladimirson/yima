import { useNuxtApp, urlPrefix } from '#imports'
import type { AsyncDataOptions } from '#app'
import type { YimaFetchOptions } from '~/plugins/http'

const getProducts = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<MemberResponse<Product>>(`${urlPrefix}/products`, options, asyncDataOptions)
}

const getProductBySlug = async (slug: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<Product>(`${urlPrefix}/products/${slug}`, options, asyncDataOptions)
}

const getProductFilters = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<Filter[]>(`${urlPrefix}/products/filters`, options, asyncDataOptions)
}

export const useYimaApiProduct = () => {
  return {
    getProductBySlug,
    getProductFilters,
    getProducts,
  }
}
