import { queryByCollection, set } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'

export default defineEventHandler(async (event) => {
  const [body, attributes] = (await Promise.all([readBody(event), queryByCollection('attribute')])) as [
    Record<string, any>,
    AdminAttribute[]
  ]
  const attributeId = event.context.params.id

  const existingAttribute = attributes.find((attribute) => attribute.id === attributeId)

  if (!existingAttribute) {
    throw createYimaError({
      statusCode: 404,
      message: "Attribute doesn't exist",
      data: { message: 'attributeDoesntExist' },
    })
  }

  await set('attribute', body, attributeId)

  return {}
})
