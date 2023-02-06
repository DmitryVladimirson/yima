import { where, documentId } from 'firebase/firestore'
import { del, queryByCollection } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'

export default defineEventHandler(async (event) => {
  const orderId = event.context.params.id

  const whereOption = where(documentId(), '==', orderId)
  const existingOrderResponse = await queryByCollection<AdminOrder>('order', { where: whereOption })

  const existingOrder = existingOrderResponse.member[0]

  if (!existingOrder) {
    throw createYimaError({
      statusCode: 404,
      message: "Order doesn't exist",
      data: { message: 'orderDoesntExist' },
    })
  }

  await del('order', orderId)

  return {}
})
