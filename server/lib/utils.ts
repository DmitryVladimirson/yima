import { collection, documentId, getDocs, query, type QuerySnapshot, where } from 'firebase/firestore'
import { type H3Event, readBody } from 'h3'
import { firestoreDatabase } from '~/server/lib/firebase'
import { queryByCollection } from '~/server/lib/firestore'
import { deepSortRelativesByPosition } from '~/server/lib/categorySortUtil'

export const getOrderProductsNames = async (orderProducts: Array<{ id: string; quantity?: number }>) => {
  const colReference = 'product'

  const productIds: string[] = []

  for (const product of orderProducts) {
    productIds.push(product.id)
  }

  const getDocumentsPromiseArray: Array<Promise<QuerySnapshot>> = []
  const productsCollectionReference = collection(firestoreDatabase, colReference)

  let index = 0
  while (index < productIds.length) {
    index += 10

    const categoriesQuery = query(
      productsCollectionReference,
      where(documentId(), 'in', productIds.slice(index - 10, index))
    )

    getDocumentsPromiseArray.push(getDocs(categoriesQuery))
  }

  const productsResponse = await Promise.all(getDocumentsPromiseArray)

  const foundProducts = []
  for (const productsSnap of productsResponse) {
    foundProducts.push(
      ...[...productsSnap.docs].map((product) => {
        const productData = product.data()

        return {
          slug: productData.slug,
          flavour: productData.flavour,
          minAmountToPurchase: productData.minAmountToPurchase,
          price: productData.price,
          imgUrl: productData.imgUrl,
          id: product.id,
          name: productData.name,
          quantity: orderProducts.find((orderProduct) => orderProduct.id === product.id)?.quantity ?? 1,
        }
      })
    )
  }

  return foundProducts
}

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

      category.childrenNew.push(client ? { ...existingCategory } : existingCategory)
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

  return deepSortRelativesByPosition(categories)
}

export const yimaReadBody = async (event: H3Event) => {
  let body = await readBody(event)

  if (Buffer.isBuffer(body)) {
    body = JSON.parse(body.toString())
  }

  return body
}
