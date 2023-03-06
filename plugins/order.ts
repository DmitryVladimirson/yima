import { watch, useYimaOrder } from '#imports'

export function order() {
  const order = useYimaOrder()

  return {
    ...order,
    state: order.useOrderState(),
    cookie: order.useOrderCookie(),
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const plugin = order()

  const { state, cookie } = plugin

  watch(
    () => [state.value.products, state.value.shippingAddress],
    () => {
      const { products, shippingAddress } = state.value

      cookie.value = JSON.stringify({
        products,
        shippingAddress,
      })
    },
    { deep: true }
  )

  watchEffect(() => {
    state.value.total = state.value.products.reduce((result, product) => result + product.price * product.quantity, 0)
  })

  nuxtApp.provide('order', plugin)
})
