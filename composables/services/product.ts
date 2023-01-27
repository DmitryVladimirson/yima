import { useNuxtApp, useYimaApiProduct } from '#imports'

declare global {
  interface Product {
    categories: string[]
    attributes: Array<{ name: string; value: string | number }>
    createdAt: number
    description: string
    id: string
    imgUrl: string
    inStock: boolean
    name: string
    price: number
    slug: string
  }

  interface Filter {
    sectionName: string
    items: Array<Record<string, any>>
  }
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
    ...useYimaApiProduct(),
    addProductToOrder,
    removeProductFromOrder,
    changeProductOrderQuantity,
  }
}
