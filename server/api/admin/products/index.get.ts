import { getQueryByCollectionOptions, queryByCollection } from '~/server/lib/firestore'

export default defineEventHandler(async (event) => {
  const parameters = getQueryByCollectionOptions(event)

  return queryByCollection<AdminProduct>('product', parameters)
})
