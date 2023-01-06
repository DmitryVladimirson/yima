import { queryByCollection } from '../lib/firestore'

export default defineEventHandler(async () => {
  return await queryByCollection('product')
})
