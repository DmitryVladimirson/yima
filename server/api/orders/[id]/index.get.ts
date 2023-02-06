import { where, documentId, collection, getDocs, query, type QuerySnapshot } from 'firebase/firestore'
import { queryByCollection } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'
import { firestoreDatabase } from '~/server/lib/firebase'

const getOrderProductsNames = async (orderProducts: Array<{ id: string; quantity: number }>) => {
  const colReference = 'product'

  const productIds: string[] = []

  for (const product of orderProducts) {
    productIds.push(product.id)
  }

  const getDocumentsPromiseArray: Array<Promise<QuerySnapshot>> = []
  const productsCollectionReference = collection(firestoreDatabase, colReference)

  let index = 0
  while (index < productIds.length) {
    index += 10

    const categoriesQuery = query(
      productsCollectionReference,
      where(documentId(), 'in', productIds.slice(index - 10, index))
    )

    getDocumentsPromiseArray.push(getDocs(categoriesQuery))
  }

  const productsResponse = await Promise.all(getDocumentsPromiseArray)

  const foundProducts = []
  for (const productsSnap of productsResponse) {
    foundProducts.push(
      ...[...productsSnap.docs].map((product) => {
        return {
          imgUrl: product.data().imgUrl,
          id: product.id,
          name: product.data().name,
          quantity: orderProducts.find((orderProduct) => orderProduct.id === product.id)!.quantity,
        }
      })
    )
  }

  return foundProducts
}

export default defineEventHandler(async (event): Promise<AdminOrder> => {
  const whereOption = where(documentId(), '==', event.context.params.id)
  const orders = await queryByCollection<AdminOrder>('order', { where: whereOption })

  const order = orders.member[0]
  if (!order) {
    throw createYimaError({ statusCode: 404, statusMessage: 'Not Found', data: { message: 'noProductFound' } })
  }

  order.products = await getOrderProductsNames(order.products)

  return order
})
