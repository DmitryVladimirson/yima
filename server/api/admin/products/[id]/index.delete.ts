import { where, documentId } from 'firebase/firestore'
import { del, queryByCollection } from '~/server/lib/firestore'
import { deleteFile } from '~/server/lib/firestorage'
import { createYimaError } from '~/composables/services/admin/utils'

export default defineEventHandler(async (event) => {
  const productId = event.context.params.id

  const whereOption = where(documentId(), '==', productId)
  const existingProductResponse = await queryByCollection<AdminProduct>('product', { where: whereOption })

  const existingProduct = existingProductResponse.member[0]

  if (!existingProduct) {
    throw createYimaError({
      statusCode: 404,
      message: "Product doesn't exist",
      data: { message: 'productDoesntExist' },
    })
  }

  const changes = [] as Array<Promise<void>>

  changes.push(del('product', productId))

  if (existingProduct.imgUrl) {
    changes.push(deleteFile(`/images/${productId}`))
  }

  await Promise.all(changes)

  return {}
})
