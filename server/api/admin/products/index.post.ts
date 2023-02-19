import { createError } from '#imports'
import { where, documentId } from 'firebase/firestore'
import { queryByCollection, set } from '~/server/lib/firestore'
import { yimaReadBody } from '~/server/lib/utils'

export default defineEventHandler(async (event) => {
  const collection = 'product'

  const { id, ...body } = await yimaReadBody(event)
  const existingProduct = await queryByCollection<AdminProduct>(collection, { where: where(documentId(), '==', id) })

  if (existingProduct.member[0]) {
    throw createError({
      statusCode: 400,
      data: { violations: [{ propertyPath: 'id', message: 'productCodeExists' }] },
    })
  }

  await set(collection, body, id)

  return { id, ...body }
})
