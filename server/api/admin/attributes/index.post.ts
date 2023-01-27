import { createError } from '#imports'
import { queryByCollection, set } from '~/server/lib/firestore'

export default defineEventHandler(async (event) => {
  const { id, ...body } = await readBody(event)

  const collection = 'attribute'

  const attributes = await queryByCollection(collection)

  const existingProduct = attributes.find((attribute) => attribute.id === id)

  if (existingProduct) {
    throw createError({
      statusCode: 400,
      data: { violations: [{ propertyPath: 'id', message: 'attributeCodeExists' }] },
    })
  }

  await set(collection, body, id)

  return { id, ...body }
})
