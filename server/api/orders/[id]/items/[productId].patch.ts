import { documentId, where } from 'firebase/firestore'
import { queryByCollection, set } from '~/server/lib/firestore'
import { yimaReadBody } from '~/server/lib/utils'
import { createYimaError } from '~/composables/services/admin/utils'

export default defineEventHandler(async (event) => {
  try {
    const body = await yimaReadBody(event)
    const { id: orderId, productId } = event.context.params
    const collection = 'order'

    const orderResponse = await queryByCollection<AdminOrder>(collection, {
      where: where(documentId(), '==', orderId),
    })

    const order = orderResponse.member[0]
    if (!order) {
      throw createYimaError({ statusCode: 404, statusMessage: 'Not Found', data: { message: 'noOrderFound' } })
    }

    const existingProduct = order.products.find((product) => product.id === productId)
    if (!existingProduct) {
      throw createYimaError({ statusCode: 404, statusMessage: 'Not Found', data: { message: 'noProductFound' } })
    }

    existingProduct.quantity = Number(body.quantity)

    await set(collection, order, order.id)

    return {}
  } catch (error: any) {
    throw createYimaError({ statusCode: error.statusCode, message: error.message, data: { message: error.message } })
  }
})
