import { useNuxtApp, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
  const {
    $order: { state: orderState },
  } = useNuxtApp()

  if (orderState.value.products.length === 0 && to.path !== '/order') {
    return navigateTo(`/order`)
  }
})
