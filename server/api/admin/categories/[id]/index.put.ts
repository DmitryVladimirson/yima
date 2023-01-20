import { queryByCollection, set } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'

const deleteChildFromParent = (parentCategory: ServerCategory, childIdToDelete: string) => {
  const collection = 'category'
  const changes = [] as Array<Promise<any>>

  const existingCategoryIndex = parentCategory.children.indexOf(childIdToDelete)
  if (existingCategoryIndex === -1) {
    return changes
  }

  parentCategory.children.splice(existingCategoryIndex, 1)
  changes.push(set(collection, { children: parentCategory.children }, parentCategory.id))

  return changes
}

const setChildToParent = (parentCategory: ServerCategory, childId: string) => {
  const collection = 'category'
  const changes = [] as Array<Promise<any>>

  parentCategory.children.push(childId)
  changes.push(set(collection, { children: parentCategory.children }, parentCategory.id))

  return changes
}

export default defineEventHandler(async (event) => {
  const categoryCollection = 'category'

  const [body, categories] = await Promise.all([
    readBody(event),
    queryByCollection(categoryCollection) as Promise<ServerCategory[]>,
  ])

  const categoryId = event.context.params.id
  const changes = [] as Array<Promise<any>>

  changes.push(set(categoryCollection, body, categoryId))

  const currentCategory = categories.find((category) => category.id === categoryId)

  if (!currentCategory) {
    throw createYimaError({
      statusCode: 404,
      message: "Category doesn't exist",
      data: { message: 'categoryDoesntExist' },
    })
  }

  const parentChanged = currentCategory.parent !== body.parent

  // Reset parent (delete categories from old parent and push to a new one)
  if (parentChanged) {
    const currentParentCategory = categories.find((category) => category.id === currentCategory.parent)
    if (currentParentCategory) {
      changes.push(...deleteChildFromParent(currentParentCategory, categoryId))
    }

    const parentCategoryNew = categories.find((category) => category.id === body.parent)
    if (parentCategoryNew) {
      changes.push(...setChildToParent(parentCategoryNew, categoryId))
    }
  }

  await Promise.all(changes)

  return {}
})
