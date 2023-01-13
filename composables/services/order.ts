import { useCookie, useState, useFetch, useNuxtApp } from '#imports'

export interface Product {
  name: string
  description: string
  price: number
  quantity: number
  imgUrl: string
  inStock: boolean
}

export interface ShippingAddress extends Record<string, any> {
  city: string
  country: string
  email: string
  firstName: string
  lastName: string
  postCode: string
  streetAndNum: string
  phoneNumber: string
}

export interface OrderState {
  products: Product[]
  shippingAddress?: ShippingAddress
  deliveryId?: number
  paymentId?: number
  total?: number
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

async function completeOrder() {
  const {
    $i18n: { t },
  } = useNuxtApp()

  const state = useOrderState()
  const { shippingAddress, total, products } = state.value

  let text = `*Нове замовлення*\n_${total} грн_\n\n`

  for (const product of products) {
    text += `${product.name} | ${product.quantity} ${t('piece')}\n`
  }

  text += '\n'
  for (const key in shippingAddress) {
    if (key in shippingAddress) {
      text += `${t(key)}: ${shippingAddress[key]}\n`
    }
  }

  return useFetch('https://api.telegram.org/bot5786753022:AAE8nXSj3LNyg51qPVtSx6M43u_ng_kK5Y0/sendMessage', {
    query: {
      text,
      chat_id: -1_001_743_234_280,
      parse_mode: 'Markdown',
    },
  })
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
