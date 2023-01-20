import { queryByCollection, set } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'

export default defineEventHandler(async (event) => {
  const [body, products] = (await Promise.all([readBody(event), queryByCollection('product')])) as [
    Record<string, any>,
    AdminProduct[]
  ]
  const productId = event.context.params.id

  const existingProduct = products.find((product) => product.id === productId)

  if (!existingProduct) {
    throw createYimaError({
      statusCode: 404,
      message: "Product doesn't exist",
      data: { message: 'productDoesntExist' },
    })
  }

  await set('product', body, productId)

  return {}
})
