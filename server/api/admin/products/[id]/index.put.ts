import { documentId, where } from 'firebase/firestore'
import { queryByCollection, set } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'
import { yimaReadBody } from '~/server/utils/h3'

export default defineEventHandler(async (event) => {
  const productCollection = 'product'
  const productId = event.context.params.id

  const [body, productResponse] = await Promise.all([
    yimaReadBody(event),
    queryByCollection<ServerCategory>(productCollection, { where: where(documentId(), '==', productId) }),
  ])
  const currentProduct = productResponse.member[0]

  if (!currentProduct) {
    throw createYimaError({
      statusCode: 404,
      message: "Product doesn't exist",
      data: { message: 'productDoesntExist' },
    })
  }

  await set(productCollection, body, productId)

  return {}
})
