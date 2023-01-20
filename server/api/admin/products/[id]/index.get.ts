import { queryByCollection } from '~/server/lib/firestore'

export default defineEventHandler(async (event) => {
  const products = await queryByCollection('product')

  return products.find((product) => product.id === event.context.params.id)
})
