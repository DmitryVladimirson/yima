import { createError } from '#imports'
import { queryByCollection, set } from '~/server/lib/firestore'

export default defineEventHandler(async (event) => {
  const { id, ...body } = await readBody(event)

  const collection = 'product'

  const products = await queryByCollection(collection)

  const existingProduct = products.find((product) => product.id === id)

  if (existingProduct) {
    throw createError({
      statusCode: 400,
      data: { violations: [{ propertyPath: 'id', message: 'productCodeExists' }] },
    })
  }

  await set(collection, body, id)

  return { id, ...body }
})
