import { where, documentId } from 'firebase/firestore'
import { queryByCollection, set } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'
import { yimaReadBody } from '~/server/lib/utils'
import {ClientCategoryCache} from "~/server/lib/clientCategoryCache";

export default defineEventHandler(async (event) => {
  const categoryCollection = 'category'
  const categoryId = event.context.params.id

  const [body, currentCategoryResponse] = await Promise.all([
    yimaReadBody(event),
    queryByCollection<ServerCategory>(categoryCollection, { where: where(documentId(), '==', categoryId) }),
  ])

  const currentCategory = currentCategoryResponse.member[0]

  if (!currentCategory) {
    throw createYimaError({
      statusCode: 404,
      message: "Category doesn't exist",
      data: { message: 'categoryDoesntExist' },
    })
  }

  await set(categoryCollection, body, categoryId);
  ClientCategoryCache.invalidateCustomerCategories();

  return {}
})
