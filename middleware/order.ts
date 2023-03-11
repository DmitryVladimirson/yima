import { useNuxtApp, navigateTo, useYimaSettings } from '#imports'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const {
    $order: { state: orderState, refreshOrder },
  } = useNuxtApp()
  if (orderState.value.products.length === 0) {
    refreshOrder()
  }

  const { getSettings } = useYimaSettings()
  const { data: settings } = await getSettings()

  if (
    (orderState.value.products.length === 0 && to.path !== '/order') ||
    (from.path !== '/order/contact' && to.path === '/order/complete') ||
    (settings.value?.minPurchasePrice &&
      orderState.value.total &&
      settings.value.minPurchasePrice > orderState.value.total &&
      to.path !== '/order')
  ) {
    return navigateTo(`/order`)
  }
})
