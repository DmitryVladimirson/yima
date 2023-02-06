import { getQueryByCollectionOptions, queryByCollection } from '~/server/lib/firestore'

export default defineEventHandler(async (event) => {
  const parameters: QueryByCollectionOptions = { ...getQueryByCollectionOptions(event), orderByPath: 'createdAt' }

  return queryByCollection<AdminOrder>('order', parameters)
})
