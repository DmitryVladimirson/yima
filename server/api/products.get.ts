import { queryByCollection } from '../lib/firestore'

export default defineEventHandler(async () => {
  return queryByCollection('product')
})
