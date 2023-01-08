import { useCookie, useState } from '#imports'

export interface Product {
  name: string
  description: string
  price: number
  quantity: number
  imgUrl: string
  inStock: boolean
}

const useOrderCookie = () =>
  useCookie('order', {
    expires: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    secure: true,
  })
const useOrderState = () =>
  useState('order', () => {
    return { products: [] as Product[] }
  })

const refreshOrder = () => {
  const orderState = useOrderState()

  const orderCookie = useOrderCookie()

  if (orderCookie.value) {
    orderState.value.products = orderCookie.value as unknown as Product[]
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
    useOrderState,
  }
}
