import { getCategories } from '~/server/lib/utils'

export default defineEventHandler(async () => {
  return getCategories()
})
