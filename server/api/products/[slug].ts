import { collection, query, where, getDocs, documentId } from 'firebase/firestore'
import { createYimaError } from '~/composables/services/admin/utils'
import { firestoreDatabase } from '~/server/lib/firebase'
import { queryByCollection } from '~/server/lib/firestore'

const setAttributes = async (product: AdminProduct) => {
  if (product.attributes.length === 0) {
    return []
  }

  const colReference = collection(firestoreDatabase, 'attribute')

  const productCategoriesId: string[] = []

  for (const attribute of product.attributes) {
    productCategoriesId.push(attribute.id)
  }

  const queryResponse = query(colReference, where(documentId(), 'in', productCategoriesId))

  const querySnapshot = await getDocs(queryResponse)

  const allAttributes = [...querySnapshot.docs].map((document_) => {
    return {
      id: document_.id,
      name: document_.data().name,
    }
  })

  return product.attributes.map((attribute) => {
    let name = attribute.id
    const existingAttribute = allAttributes.find((allAttribute) => allAttribute.id === attribute.id)
    if (existingAttribute) {
      name = existingAttribute.name
    }

    return {
      name,
      id: attribute.id,
      value: attribute.value,
    }
  })
}

const setCategories = async (product: AdminProduct) => {
  if (product.categories.length === 0) {
    return []
  }

  const categoryColReference = collection(firestoreDatabase, 'category')

  const categoryQueryResponse = query(
    categoryColReference,
    where(documentId(), 'in', product.categories),
    where('isVisible', '==', true)
  )

  const categoryQuerySnapshot = await getDocs(categoryQueryResponse)

  return [...categoryQuerySnapshot.docs].map((document_) => document_.data().name)
}

export default defineEventHandler(async (event): Promise<Product | undefined> => {
  try {
    const { slug } = event.context.params

    const products = await queryByCollection<AdminProduct>('product', { where: where(documentId(), '==', slug) })

    const product = products.member[0]

    if (!product?.isVisible) {
      return
    }

    const attributesNew = await setAttributes(product)

    const categoriesNew = await setCategories(product)

    return { ...product, attributes: attributesNew, categories: categoriesNew }
  } catch (error: any) {
    throw createYimaError({ statusCode: error.statusCode, message: error.message, data: { message: error.message } })
  }
})
