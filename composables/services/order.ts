import { useCookie, useState, useYimaApiOrder, useYimaUtils } from '#imports'

declare global {
  interface OrderProduct {
    slug: string
    id: string
    name: string
    price: number
    imgUrl: string
    quantity: number
    flavour?: string
    minAmountToPurchase: number
  }

  interface ShippingAddress extends Record<string, any> {
    email?: string
    firstName?: string
    lastName?: string
    phoneNumber?: string
    address?: string
    shippingMethod?: string
    comment?: string
  }

  interface OrderState {
    products: OrderProduct[]
    shippingAddress?: ShippingAddress
    paymentMethod: string
    total?: number
  }

  interface OrderToSend extends Omit<OrderState, 'products'> {
    products: Array<{ id: string; quantity: number }>
  }
}

const useOrderCookie = () =>
  useCookie('order', {
    expires: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    secure: true,
  })
const useOrderState = () =>
  useState('order', (): OrderState => {
    return { products: [] }
  })

const refreshOrder = () => {
  const orderCookie = useOrderCookie()

  if (!orderCookie.value) {
    return
  }

  const orderState = useOrderState()

  orderState.value = { ...orderState.value, ...(orderCookie.value as unknown as Record<string, unknown>) }
}

const updateCookie = () => {
  const orderState = useOrderState()

  const orderCookie = useOrderCookie()

  orderCookie.value = JSON.stringify(orderState.value.products)
}

const setShippingAddress = (address: ShippingAddress) => {
  const state = useOrderState()

  state.value.shippingAddress = address
}

const completeOrder = async () => {
  const { completeOrder } = useYimaApiOrder()
  const { getUnixDate } = useYimaUtils()

  const state = useOrderState()

  const orderProducts: Array<{ id: string; quantity: number }> = []

  for (const product of state.value.products) {
    orderProducts.push({ id: product.id, quantity: product.quantity })
  }

  const orderToSend = { ...state.value, createdAt: getUnixDate(), products: orderProducts }

  return completeOrder(orderToSend)
}

const removeOrder = () => {
  const state = useOrderState()

  state.value.products = []
}

export const useYimaOrder = () => {
  return {
    completeOrder,
    refreshOrder,
    removeOrder,
    setShippingAddress,
    updateCookie,
    useOrderCookie,
    useOrderState,
  }
}
