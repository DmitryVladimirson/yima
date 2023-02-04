import { type SearchParams } from 'typesense/lib/Typesense/Documents'
import { getQuery } from 'h3'
import { collection, documentId, getDocs, query, type QuerySnapshot, where } from 'firebase/firestore'
import { client } from '~/server/lib/typesense'
import { createYimaError } from '~/composables/services/admin/utils'
import { firestoreDatabase } from '~/server/lib/firebase'

const setCategoriesNamesInsteadOfIDs = async (products: Product[]) => {
  const foundProductCategoriesCodes = new Set<string>()

  for (const product of products) {
    for (const categoryId of product.categories) {
      foundProductCategoriesCodes.add(categoryId)
    }
  }

  if (foundProductCategoriesCodes.size === 0) {
    return products
  }

  const categoryCollectionReference = collection(firestoreDatabase, 'category')

  const getDocumentsPromiseArray: Array<Promise<QuerySnapshot>> = []

  const foundProductCategoriesCodesArray = [...foundProductCategoriesCodes]

  let index = 10
  do {
    const categoriesQuery = query(
      categoryCollectionReference,
      where(documentId(), 'in', foundProductCategoriesCodesArray.slice(0, index))
    )

    getDocumentsPromiseArray.push(getDocs(categoriesQuery))

    index += 10
  } while (index < foundProductCategoriesCodes.size)

  const categoriesResponse = await Promise.all(getDocumentsPromiseArray)

  const foundCategories = []
  for (const categoriesSnap of categoriesResponse) {
    foundCategories.push(
      ...[...categoriesSnap.docs].map((document_) => {
        return {
          id: document_.id,
          name: document_.data().name,
        }
      })
    )
  }

  for (const product of products) {
    const filteredCategories = foundCategories.filter((foundCategory) =>
      product.categories.find((productCategory) => productCategory === foundCategory.id)
    )

    product.categories = filteredCategories.map((category) => category.name)
  }

  return products
}

export default defineEventHandler(async (event): Promise<MemberResponse<Product>> => {
  try {
    const parameters = getQuery(event)

    const search: SearchParams = {
      ...parameters,
      q: typeof parameters.q === 'string' ? parameters.q : '',
      query_by: typeof parameters.query_by === 'string' ? parameters.query_by : 'name',
    }

    const searchResults = await client.collections('products').documents().search(search)

    let products = [...(searchResults.hits?.map((hit) => hit.document) ?? [])] as Product[]

    products = await setCategoriesNamesInsteadOfIDs(products)

    return {
      totalItems: searchResults.found,
      member: products,
    }
  } catch (error: any) {
    throw createYimaError({ statusCode: error.statusCode, message: error.message, data: { message: error.message } })
  }
})
