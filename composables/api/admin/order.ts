import { useNuxtApp, urlPrefix } from '#imports'
import { type YimaFetchOptions } from '~/plugins/http'
import { type AsyncDataOptions } from '#app'

const getOrders = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<MemberResponse<AdminOrder>>(`${urlPrefix}/orders`, options, asyncDataOptions)
}

const getOrder = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<AdminOrder>(`${urlPrefix}/orders/${id}`, options, asyncDataOptions)
}

const deleteOrder = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.delete(`${urlPrefix}/orders/${id}`, options, asyncDataOptions)
}

const setOrderItemQuantity = async (
  orderId: string,
  productId: string,
  quantity: number,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  return useNuxtApp().$http.patch(
    `${urlPrefix}/orders/${orderId}/items/${productId}`,
    {
      body: { quantity },
      ...options,
    },
    asyncDataOptions
  )
}

const setOrderShippingAddress = async (
  orderId: string,
  shippingAddress: Partial<ShippingAddress>,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  return useNuxtApp().$http.put(
    `${urlPrefix}/orders/${orderId}`,
    {
      body: { shippingAddress },
      ...options,
    },
    asyncDataOptions
  )
}

export const useYimaAdminApiOrder = () => {
  return {
    deleteOrder,
    getOrder,
    getOrders,
    setOrderItemQuantity,
    setOrderShippingAddress,
  }
}
