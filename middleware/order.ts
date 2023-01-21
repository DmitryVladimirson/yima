import { useNuxtApp, useLocalePath, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
  const {
    $order: { state: orderState },
  } = useNuxtApp()

  if (orderState.value.products.length === 0 && to.path !== '/order') {
    const localePath = useLocalePath()

    return navigateTo(localePath('/order'))
  }
})
