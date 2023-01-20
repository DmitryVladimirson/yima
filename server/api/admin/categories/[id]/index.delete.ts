import { del, queryByCollection, set } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'

const resetParentForCategoryChildren = (category: ServerCategory, currentParent: ServerCategory | undefined) => {
  const changes = [] as Array<Promise<void>>
  const categoryCollection = 'category'

  for (const childCategoryId of category.children) {
    changes.push(set(categoryCollection, { parent: category.parent }, childCategoryId))
  }

  if (!currentParent) {
    return changes
  }

  const currentParentChildren = currentParent.children

  for (const childCategoryId of category.children) {
    currentParentChildren.push(childCategoryId)
  }

  changes.push(set(categoryCollection, { children: currentParentChildren }, category.parent))

  return changes
}

const deleteCategoryForProduct = (product: AdminProduct, categoryId: string) => {
  const changes = [] as Array<Promise<void>>
  const productCollection = 'product'

  const existingCategoryIndex = product.categories.indexOf(categoryId)
  if (existingCategoryIndex === -1) {
    return changes
  }

  product.categories.splice(existingCategoryIndex, 1)
  changes.push(set(productCollection, { categories: product.categories }, product.id))

  return changes
}

const deleteChildCategory = (parentCategory: ServerCategory, categoryId: string) => {
  const changes = [] as Array<Promise<void>>
  const categoryCollection = 'category'

  const existingChildCategoryIndex = parentCategory.children.indexOf(categoryId)
  if (existingChildCategoryIndex === -1) {
    return changes
  }

  parentCategory.children.splice(existingChildCategoryIndex, 1)
  changes.push(set(categoryCollection, { children: parentCategory.children }, parentCategory.id))

  return changes
}

export default defineEventHandler(async (event) => {
  const [categories, products] = (await Promise.all([queryByCollection('category'), queryByCollection('product')])) as [
    ServerCategory[],
    AdminProduct[]
  ]
  const categoryCollection = 'category'

  const categoryId = event.context.params.id
  const existingCategory = categories.find((category) => category.id === categoryId)

  if (!existingCategory) {
    throw createYimaError({
      statusCode: 404,
      message: "Category doesn't exist",
      data: { message: 'categoryDoesntExist' },
    })
  }

  const externalChanges = [] as Array<Promise<void>>

  externalChanges.push(del(categoryCollection, categoryId))

  // Delete child for parent
  const parentCategory = categories.find((category) => category.id === existingCategory.parent)
  if (parentCategory) {
    externalChanges.push(...deleteChildCategory(parentCategory, categoryId))
  }

  // Reset parent for children
  const existingCategoryParent = categories.find((cat) => cat.id === existingCategory.parent)
  externalChanges.push(...resetParentForCategoryChildren(existingCategory, existingCategoryParent))

  // Delete category from products
  for (const product of products) {
    externalChanges.push(...deleteCategoryForProduct(product, categoryId))
  }

  if (externalChanges.length > 0) {
    await Promise.all(externalChanges)
  }

  return {}
})
