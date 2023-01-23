import { getCategories } from '~/server/utils/getCategories'

export default defineEventHandler(async () => {
  return getCategories()
})
