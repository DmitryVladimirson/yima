import { where, documentId } from 'firebase/firestore'
import { del, queryByCollection } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'

const attributeCollection = 'attribute'

export default defineEventHandler(async (event) => {
  const attributeId = event.context.params.id

  const whereAttributeIdOption = where(documentId(), '==', attributeId)

  const attributesResponse = await queryByCollection<AdminAttribute>(attributeCollection, {
    where: whereAttributeIdOption,
  })

  const existingAttribute = attributesResponse.member[0]

  if (!existingAttribute) {
    throw createYimaError({
      statusCode: 404,
      message: "Attribute doesn't exist",
      data: { message: 'attributeDoesntExist' },
    })
  }

  await del(attributeCollection, attributeId)

  return {}
})
