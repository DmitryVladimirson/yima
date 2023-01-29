import { useNuxtApp, urlPrefix } from '#imports'
import { type YimaFetchOptions } from '~/plugins/http'
import { type AsyncDataOptions } from '#app'

const completeOrder = async (
  data: OrderToSend,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  return useNuxtApp().$http.post(
    `${urlPrefix}/orders`,
    {
      body: data,
      ...options,
    },
    asyncDataOptions
  )
}

export const useYimaApiOrder = () => {
  return {
    completeOrder,
  }
}
