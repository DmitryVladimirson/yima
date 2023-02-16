import { useNuxtApp, useYimaApiProduct } from '#imports'

declare global {
  interface Product {
    attributes: Array<{ name: string; value: string | number; id: string }>
    categories: string[]
    flavours: string[]
    createdAt: number
    description: string
    id: string
    imgUrl: string
    inStock: boolean
    minAmountToPurchase: number
    name: string
    price: number
    slug: string
  }

  interface Filter {
    sectionName: string
    items: Array<Record<string, any>>
  }
}

const addProductToOrder = (product: Product, quantity: number, flavour?: string) => {
  const {
    $order: { state: orderState },
  } = useNuxtApp()

  const existingProduct = orderState.value.products.find(
    (productItem) => productItem.id === product.id && productItem.flavour === flavour
  )

  if (existingProduct) {
    existingProduct.quantity += quantity

    return
  }

  const orderProduct: OrderProduct = {
    slug: product.slug,
    name: product.name,
    id: product.id,
    price: product.price,
    imgUrl: product.imgUrl,
    quantity,
    flavour,
  }

  orderState.value.products.push(orderProduct)
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
