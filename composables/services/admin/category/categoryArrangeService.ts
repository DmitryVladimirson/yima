import { where } from 'firebase/firestore'
import { queryByCollection } from '~/server/lib/firestore'
import { ClientCategoryCache } from '~/server/lib/clientCategoryCache'

const { setCategory } = useYimaAdminCategory()

const CATEGORY_COLLECTION = 'category'

/**
 * Stores position changes in the db.
 * @param categories categories with modified positions
 */
export async function storeRepositioned(categories: AdminCategory[]) {
  fillPositionPropertyByOrder(categories)
  const updatePromises = categories.map(async (category) => {
    await setCategory(category.id, { position: category.position! })
  })

  await Promise.all(updatePromises)

  ClientCategoryCache.invalidateCustomerCategories()
}

/**
 * Fetch categories relative to the same parent (or root categories if provided category has no parent id)
 * @param category
 */
export async function fetchRelatives(category: AdminCategory): Promise<AdminCategory[]> {
  return category.parent === undefined ? fetchRootCategories() : fetchSameParentCategories(category.parent)
}

async function fetchSameParentCategories(parentId: string): Promise<AdminCategory[]> {
  const sameParentResponse = await queryByCollection<AdminCategory>(CATEGORY_COLLECTION, {
    where: where('parent', '==', parentId),
  })

  return sameParentResponse.member
}

async function fetchRootCategories(): Promise<AdminCategory[]> {
  const categoriesResponse = await queryByCollection<AdminCategory>(CATEGORY_COLLECTION)

  return categoriesResponse.member
}

export function fillPositionPropertyByOrder(categories: AdminCategory[]) {
  let index = 1
  for (const category of categories) {
    category.position = index++
  }

  return categories
}
