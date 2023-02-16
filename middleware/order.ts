import { useNuxtApp, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const {
    $order: { state: orderState, refreshOrder },
  } = useNuxtApp()
  if (orderState.value.products.length === 0) {
    refreshOrder()
  }

  if (
    (orderState.value.products.length === 0 && to.path !== '/order') ||
    (from.path !== '/order/contact' && to.path === '/order/complete')
  ) {
    return navigateTo(`/order`)
  }
})
