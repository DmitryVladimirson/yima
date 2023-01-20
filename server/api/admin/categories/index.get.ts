import { queryByCollection } from '~/server/lib/firestore'

export default defineEventHandler(async () => {
  const categories = await queryByCollection('category')

  function createChildren(category: Record<string, any>) {
    if (category.children.length === 0) {
      return
    }

    for (const children of category.children) {
      const existingCategory = categories.find((cat) => cat.id === children)
      if (existingCategory) {
        createChildren(existingCategory)

        if (!category.childrenNew) {
          category.childrenNew = []
        }

        category.childrenNew.push(existingCategory)
      }
    }

    category.children = category.childrenNew
    delete category.childrenNew
  }

  for (const category of categories) {
    if (!category.parent) {
      createChildren(category)
    }
  }

  return categories.filter((category) => !category.parent)
})
