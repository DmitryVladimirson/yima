import { documentId, where } from 'firebase/firestore'
import { queryByCollection, set } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'

export default defineEventHandler(async (event) => {
  const attributeId = event.context.params.id

  const [body, attributes] = await Promise.all([
    readBody(event),
    queryByCollection('attribute', {
      where: where(documentId(), '==', attributeId),
    }),
  ])

  if (attributes.totalItems === 0) {
    throw createYimaError({
      statusCode: 404,
      message: "Attribute doesn't exist",
      data: { message: 'attributeDoesntExist' },
    })
  }

  await set('attribute', body, attributeId)

  return {}
})
