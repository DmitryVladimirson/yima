import { watch } from '#imports'

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
    () => [state.value.products, state.value.shippingAddress, state.value.deliveryId],
    () => {
      const { products, shippingAddress, deliveryId } = state.value

      cookie.value = JSON.stringify({
        products,
        shippingAddress,
        deliveryId,
      })
    },
    { deep: true }
  )

  watchEffect(() => {
    state.value.total = 0

    for (const product of state.value.products) {
      state.value.total += product.price * product.quantity
    }
  })

  nuxtApp.provide('order', plugin)
})
