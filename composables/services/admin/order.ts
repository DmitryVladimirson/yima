declare global {
  interface AdminOrder {
    products: Array<{ id: string; name: string; quantity: number; imgUrl: string }>
    shippingAddress: ShippingAddress
    createdAt: number
  }
}

export const useYimaAdminOrder = () => {
  return {
    ...useYimaAdminApiOrder(),
  }
}
