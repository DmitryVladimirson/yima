import { useCookie } from '#imports'

const useOrderCookie = () =>
  useCookie('order', {
    expires: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    secure: true
  })
const useOrderState = () =>
  useState<Record<string, any>>('order', () => {
    return { products: [] }
  })

const refreshOrder = () => {
  const orderState = useOrderState()

  const orderCookie = useOrderCookie()

  if (orderCookie.value) {
    orderState.value.products = orderCookie.value
  }
}

const updateCookie = () => {
  const orderState = useOrderState()

  const orderCookie = useOrderCookie()

  orderCookie.value = JSON.stringify(orderState.value.products)
}

export const useYimaOrder = () => {
  return {
    refreshOrder,
    updateCookie,
    useOrderCookie,
    useOrderState
  }
}
