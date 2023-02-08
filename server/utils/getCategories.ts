import { where } from 'firebase/firestore'
import { queryByCollection } from '~/server/lib/firestore'

// eslint-disable-next-line sonarjs/cognitive-complexity
export const getCategories = async (client?: boolean) => {
  const categoriesResponse = await queryByCollection<AdminCategory>('category', {
    per_page: -1,
    ...(client ? { where: where('isVisible', '==', true) } : {}),
  })

  let categories = categoriesResponse.member

  const createChildren = (category: Record<string, any>) => {
    if (category.children.length === 0) {
      return
    }

    if (!category.childrenNew) {
      category.childrenNew = []
    }

    for (const children of category.children) {
      const existingCategory = categories.find((cat) => cat.id === children)
      if (!existingCategory) {
        continue
      }

      createChildren(existingCategory)

      category.childrenNew.push(
        client
          ? {
              name: existingCategory.name,
              id: existingCategory.id,
              children: existingCategory.children,
              parent: existingCategory.parent,
            }
          : existingCategory
      )
    }

    category.children = category.childrenNew
    delete category.childrenNew
  }

  for (const category of categories) {
    if (category.parent) {
      continue
    }

    createChildren(category)
  }

  categories = categories.filter((category) => !category.parent)

  if (client) {
    return categories.map((category) => {
      return { id: category.id, name: category.name, children: category.children }
    })
  }

  return categories
}
