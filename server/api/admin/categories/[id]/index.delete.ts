import { where, documentId } from 'firebase/firestore'
import { del, queryByCollection } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'
import {ClientCategoryCache} from "~/server/lib/clientCategoryCache";

export default defineEventHandler(async (event) => {
  const categoryId = event.context.params.id
  const categoryCollection = 'category'

  const existingCategoryResponse = await queryByCollection<ServerCategory>(categoryCollection, {
    where: where(documentId(), '==', categoryId),
  })
  const existingCategory = existingCategoryResponse.member[0]

  if (!existingCategory) {
    throw createYimaError({
      statusCode: 404,
      message: "Category doesn't exist",
      data: { message: 'categoryDoesntExist' },
    })
  }

  await del(categoryCollection, categoryId)
  ClientCategoryCache.invalidateCustomerCategories();

  return {}
})
