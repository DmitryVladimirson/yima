import { where, documentId } from 'firebase/firestore'
import { queryByCollection } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'

export default defineEventHandler(async (event) => {
  const attributes = await queryByCollection<AdminAttribute>('attribute', {
    where: where(documentId(), '==', event.context.params.id),
  })

  if (attributes.totalItems === 0) {
    throw createYimaError({
      statusCode: 404,
      message: "Attribute doesn't exist",
      data: { message: 'attributeDoesntExist' },
    })
  }

  return attributes.member[0]
})
