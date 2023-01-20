import { queryByCollection } from '../lib/firestore'

export default defineEventHandler(async () => {
  const adminProducts = (await queryByCollection('product')) as AdminProduct[]

  const filteredProducts = adminProducts.filter((adminProduct) => adminProduct.isVisible)

  return filteredProducts.map(({ isVisible: _, ...product }) => {
    return product as Product
  })
})
