import { where, documentId } from 'firebase/firestore'
import { queryByCollection } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'
import { getOrderProductsNames } from '~/server/lib/utils'

export default defineEventHandler(async (event): Promise<AdminOrder> => {
  const whereOption = where(documentId(), '==', event.context.params.id)
  const orders = await queryByCollection<AdminOrder>('order', { where: whereOption })

  const order = orders.member[0]
  if (!order) {
    throw createYimaError({ statusCode: 404, statusMessage: 'Not Found', data: { message: 'noOrderFound' } })
  }

  order.products = await getOrderProductsNames(order.products)

  return order
})
