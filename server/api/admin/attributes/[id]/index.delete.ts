import { del, queryByCollection, set } from '~/server/lib/firestore'
import { createYimaError } from '~/composables/services/admin/utils'

const productCollection = 'product'
const attributeCollection = 'attribute'

const deleteAttributeForProduct = (product: AdminProduct, attributeId: string) => {
  const changes = [] as Array<Promise<void>>

  const existingAttributeIndex = product.attributes.findIndex((attribute) => attribute.id === attributeId)
  if (existingAttributeIndex === -1) {
    return changes
  }

  product.attributes.splice(existingAttributeIndex, 1)
  changes.push(set(productCollection, { attributes: product.attributes }, product.id))

  return changes
}

export default defineEventHandler(async (event) => {
  const [attributes, products] = (await Promise.all([
    queryByCollection(attributeCollection),
    queryByCollection(productCollection),
  ])) as [AdminAttribute[], AdminProduct[]]
  const attributeId = event.context.params.id

  const existingAttribute = attributes.find((attribute) => attribute.id === attributeId)

  if (!existingAttribute) {
    throw createYimaError({
      statusCode: 404,
      message: "Attribute doesn't exist",
      data: { message: 'attributeDoesntExist' },
    })
  }

  const changes = [] as Array<Promise<void>>

  changes.push(del(attributeCollection, attributeId))

  // Delete attribute from products
  for (const product of products) {
    changes.push(...deleteAttributeForProduct(product, attributeId))
  }

  await Promise.all(changes)

  return {}
})
