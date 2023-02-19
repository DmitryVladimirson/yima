import { documentId, where } from 'firebase/firestore'
import { createYimaError } from '~/composables/services/admin/utils'
import { queryByCollection, set } from '~/server/lib/firestore'
import { yimaReadBody } from '~/server/lib/utils'

export default defineEventHandler(async (event) => {
  try {
    const categoryCollection = 'category'

    const { id, ...body } = await yimaReadBody(event)

    const existingCategory = await queryByCollection<AdminCategory>(categoryCollection, {
      where: where(documentId(), '==', id),
    })

    if (existingCategory.member[0]) {
      throw createYimaError({
        statusCode: 400,
        data: { violations: [{ propertyPath: 'id', message: 'categoryCodeExists' }] },
      })
    }

    await set(categoryCollection, body, id)

    return {}
  } catch (error: any) {
    throw createYimaError({
      statusCode: error.statusCode,
      message: error.message,
      data: { message: error.message, violations: error.data?.violations },
    })
  }
})
