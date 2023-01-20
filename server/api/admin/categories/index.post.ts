import { createError } from '#imports'
import { queryByCollection, set } from '~/server/lib/firestore'

export default defineEventHandler(async (event) => {
  const categoryCollection = 'category'
  const changes = [] as Array<Promise<any>>

  const [{ id, ...body }, categories] = (await Promise.all([
    readBody(event),
    queryByCollection(categoryCollection),
  ])) as [Record<string, any>, ServerCategory[]]

  const existingCategory = categories.find((category) => category.id === id)

  if (existingCategory) {
    throw createError({
      statusCode: 400,
      data: { violations: [{ propertyPath: 'id', message: 'categoryCodeExists' }] },
    })
  }

  changes.push(set(categoryCollection, body, id))

  // Set parent
  if (body.parent) {
    const parentCategory = categories.find((category) => category.id === body.parent)
    if (parentCategory) {
      parentCategory.children.push(id)
      changes.push(set(categoryCollection, { children: parentCategory.children }, body.parent))
    }
  }

  await Promise.all(changes)

  return { id, ...body }
})
