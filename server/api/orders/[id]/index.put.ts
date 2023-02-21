import { documentId, where } from 'firebase/firestore'
import { queryByCollection, set } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'
import { yimaReadBody } from '~/server/lib/utils'

export default defineEventHandler(async (event) => {
  const orderCollection = 'order'
  const orderId = event.context.params.id

  const [body, orderResponse] = await Promise.all([
    yimaReadBody(event),
    queryByCollection<AdminOrder>(orderCollection, { where: where(documentId(), '==', orderId) }),
  ])
  const currentOrder = orderResponse.member[0]

  if (!currentOrder) {
    throw createYimaError({
      statusCode: 404,
      message: "Order doesn't exist",
      data: { message: 'orderDoesntExist' },
    })
  }

  await set(orderCollection, { shippingAddress: body.shippingAddress }, orderId)

  return {}
})
