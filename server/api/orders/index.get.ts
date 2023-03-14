import { getQuery } from 'h3'
import { where } from 'firebase/firestore'
import { getQueryByCollectionOptions, queryByCollection } from '~/server/lib/firestore'
import { getOrderProductsNames } from '~/server/lib/utils'

export default defineEventHandler(async (event) => {
  const queryOptions = getQuery(event)
  const fromDateQuery: QueryByCollectionOptions = {}
  fromDateQuery.where = []

  if (queryOptions.fromDate) {
    fromDateQuery.where.push(where('createdAt', '>=', Number(queryOptions.fromDate)))
  }

  if (queryOptions.toDate) {
    fromDateQuery.where.push(where('createdAt', '<=', Number(queryOptions.toDate)))
  }

  const parameters: QueryByCollectionOptions = {
    ...getQueryByCollectionOptions(event),
    orderByPath: 'createdAt',
    ...fromDateQuery,
  }

  const ordersResponse = await queryByCollection<AdminOrder>('order', parameters)

  if (!queryOptions.withProductNames) {
    return ordersResponse
  }

  const orders = ordersResponse.member

  const orderProducts = new Set<{ id: string }>()
  for (const order of orders) {
    for (const product of order.products) {
      orderProducts.add({ id: product.id })
    }
  }

  const namedProducts = await getOrderProductsNames([...orderProducts])

  for (const order of orders) {
    for (const product of order.products) {
      const existingProduct = namedProducts.find((namedProduct) => namedProduct.id === product.id)
      if (!existingProduct) {
        continue
      }

      product.name = existingProduct.name
      product.price = existingProduct.price
    }
  }

  return { member: orders, totalItems: ordersResponse.totalItems, fromDateQuery }
})
