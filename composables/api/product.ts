import type { UseFetchOptions } from '#app'
import { useNuxtApp } from '#imports'

const getProducts = async (
  useFetchOptions?: UseFetchOptions<any>
) => {
  return await useFetch('/api/products', useFetchOptions)
}

const addProductToOrder = (product: Record<string, any>, quantity: number) => {
  const {
    $order: { state: orderState }
  } = useNuxtApp()

  const existingProduct = orderState.value.products.find((productItem: Record<string, any>) => productItem.id === product.id)

  if (existingProduct) {
    existingProduct.quantity += quantity

    return
  }

  orderState.value.products.push({ ...product, quantity })
}

const removeProductFromOrder = (id: string) => {
  const {
    $order: { state: orderState }
  } = useNuxtApp()

  const productIndex = orderState.value.products.findIndex((product: Record<string, any>) => product.id === id)

  if (productIndex >= 0) {
    orderState.value.products.splice(productIndex, 1)
  }
}

export const useYimaProduct = () => {
  return {
    addProductToOrder,
    getProducts,
    removeProductFromOrder
  }
}
