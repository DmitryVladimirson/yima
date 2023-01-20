import { queryByCollection } from '~/server/lib/firestore'

export default defineEventHandler(async (event) => {
  const categories = await queryByCollection('category')

  return categories.find((product) => product.id === event.context.params.id)
})
