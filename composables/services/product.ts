import { useNuxtApp, useYimaApiProduct } from '#imports'
import type { UseFetchOptions } from '#app'

const getProducts = async (useFetchOptions?: UseFetchOptions<any>) => {
  const { getProducts } = useYimaApiProduct()

  return getProducts(useFetchOptions)
}

const addProductToOrder = (product: Record<string, any>, quantity: number) => {
  const {
    $order: { state: orderState },
  } = useNuxtApp()

  const existingProduct = orderState.value.products.find(
    (productItem: Record<string, any>) => productItem.id === product.id
  ) as Record<string, any>

  if (existingProduct) {
    ;(existingProduct.quantity as number) += quantity

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
