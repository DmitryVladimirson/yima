import { where, documentId } from 'firebase/firestore'
import { queryByCollection } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'

export default defineEventHandler(async (event): Promise<AdminProduct> => {
  const whereOption = where(documentId(), '==', event.context.params.id)
  const products = await queryByCollection<AdminProduct>('product', { where: whereOption })

  const product = products.member[0]
  if (!product) {
    throw createYimaError({ statusCode: 404, statusMessage: 'Not Found', data: { message: 'noProductFound' } })
  }

  return product
})
