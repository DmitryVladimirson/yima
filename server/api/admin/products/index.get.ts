import { queryByCollection } from '~/server/lib/firestore'

export default defineEventHandler(async () => {
  return queryByCollection('product')
})
