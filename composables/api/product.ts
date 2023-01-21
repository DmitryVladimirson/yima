import { useNuxtApp, urlPrefix } from '#imports'
import type { AsyncDataOptions } from '#app'
import type { YimaFetchOptions } from '~/plugins/http'

const getProducts = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<MemberResponse<Product[]>>(`${urlPrefix}/products`, options, asyncDataOptions)
}

export const useYimaApiProduct = () => {
  return {
    getProducts,
  }
}
