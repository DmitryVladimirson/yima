import { documentId, where } from 'firebase/firestore'
import { createYimaError } from '~/composables/services/admin/utils'
import { queryByCollection, set } from '~/server/lib/firestore'

export default defineEventHandler(async (event) => {
  try {
    const { id, ...body } = await readBody(event)
    const collection = 'attribute'

    const existingAttribute = await queryByCollection<AdminAttribute>(collection, {
      where: where(documentId(), '==', id),
    })

    if (existingAttribute.member[0]) {
      throw createYimaError({
        statusCode: 400,
        data: { violations: [{ propertyPath: 'id', message: 'attributeCodeExists' }] },
      })
    }

    await set(collection, body, id)

    return {}
  } catch (error: any) {
    throw createYimaError({
      statusCode: error.statusCode,
      message: error.message,
      data: { message: error.message, violations: error.data?.violations },
    })
  }
})
