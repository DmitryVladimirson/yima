import { del, queryByCollection } from '~/server/lib/firestore'
import { deleteFile } from '~/server/lib/firestorage'
import { createYimaError } from '~/composables/services/admin/utils'

export default defineEventHandler(async (event) => {
  const products = (await queryByCollection('product')) as AdminProduct[]
  const productId = event.context.params.id

  const existingProduct = products.find((product) => product.id === productId)

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
