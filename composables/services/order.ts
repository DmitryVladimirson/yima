import { useCookie, useState, useYimaApiOrder } from '#imports'

declare global {
  interface OrderProduct extends Product {
    quantity: number
  }

  interface ShippingAddress extends Record<string, any> {
    city: string
    country: string
    email: string
    firstName: string
    lastName: string
    postCode: string
    streetAndNum: string
    phoneNumber: string
  }

  interface OrderState {
    products: OrderProduct[]
    shippingAddress?: ShippingAddress
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

  const state = useOrderState()

  const orderProducts: Array<{ id: string; quantity: number }> = []

  for (const product of state.value.products) {
    orderProducts.push({ id: product.id, quantity: product.quantity })
  }

  const orderToSend = { ...state.value, products: orderProducts }

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
