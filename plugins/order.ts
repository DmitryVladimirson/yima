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

  watch(
    plugin.state,
    () => {
      plugin.updateCookie()
    },
    { deep: true }
  )

  nuxtApp.provide('order', plugin)
})
