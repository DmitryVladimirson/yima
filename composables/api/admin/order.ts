import { useNuxtApp, urlPrefix } from '#imports'
import { type YimaFetchOptions } from '~/plugins/http'
import { type AsyncDataOptions } from '#app'

const getOrders = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get(`${urlPrefix}/orders`, options, asyncDataOptions)
}

const getOrder = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get(`${urlPrefix}/orders/${id}`, options, asyncDataOptions)
}

const deleteOrder = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.delete(`${urlPrefix}/orders/${id}`, options, asyncDataOptions)
}

export const useYimaAdminApiOrder = () => {
  return {
    getOrders,
    getOrder,
    deleteOrder,
  }
}
