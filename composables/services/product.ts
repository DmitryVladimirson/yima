import { useNuxtApp, useYimaApiProduct } from '#imports'
import type { AsyncDataOptions } from '#app'
import type { YimaFetchOptions } from '~/plugins/http'

declare global {
  interface Product {
    id: string
    name: string
    description: string
    price: number
    imgUrl: string
    inStock: boolean
    slug: string
    categories: string[]
  }
}

const getProducts = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  const { getProducts } = useYimaApiProduct()

  return getProducts(options, asyncDataOptions)
}

const addProductToOrder = (product: Product, quantity: number) => {
  const {
    $order: { state: orderState },
  } = useNuxtApp()

  const existingProduct = orderState.value.products.find((productItem) => productItem.id === product.id)

  if (existingProduct) {
    existingProduct.quantity += quantity

    return
  }

  orderState.value.products.push({ ...product, quantity })
}

const removeProductFromOrder = (id: string) => {
  const {
    $order: { state: orderState },
  } = useNuxtApp()

  const productIndex = orderState.value.products.findIndex((product: Record<string, any>) => product.id === id)

  if (productIndex >= 0) {
    orderState.value.products.splice(productIndex, 1)
  }
}

const changeProductOrderQuantity = (id: string, quantity: number) => {
  const {
    $order: { state: orderState },
  } = useNuxtApp()

  const existingProduct = orderState.value.products.find((product: Record<string, any>) => product.id === id)

  if (existingProduct) {
    existingProduct.quantity = quantity
  }
}

export const useYimaProduct = () => {
  return {
    addProductToOrder,
    getProducts,
    removeProductFromOrder,
    changeProductOrderQuantity,
  }
}
