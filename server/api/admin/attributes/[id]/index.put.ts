import { documentId, where } from 'firebase/firestore'
import { queryByCollection, set } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'
import { yimaReadBody } from '~/server/utils/h3'

export default defineEventHandler(async (event) => {
  const attributeId = event.context.params.id

  const [body, attributes] = await Promise.all([
    yimaReadBody(event),
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
