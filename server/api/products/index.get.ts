import { type SearchParams } from 'typesense/lib/Typesense/Documents'
import { getQuery } from 'h3'
import { collection, documentId, getDocs, query, where } from 'firebase/firestore'
import { client } from '~/server/lib/typesense'
import { createYimaError } from '~/composables/services/admin/utils'
import { firestoreDatabase } from '~/server/lib/firebase'

export default defineEventHandler(async (event): Promise<MemberResponse<Product[]>> => {
  try {
    const parameters = getQuery(event)

    const search: SearchParams = {
      ...parameters,
      q: typeof parameters.q === 'string' ? parameters.q : '',
      query_by: typeof parameters.query_by === 'string' ? parameters.query_by : 'name',
    }

    const searchResults = await client.collections('products').documents().search(search)

    const products = [...(searchResults.hits?.map((hit) => hit.document) ?? [])] as Product[]

    const result = {
      totalItems: searchResults.found,
      member: products,
    }

    const foundProductCategoriesCodes: string[] = []

    for (const product of products) {
      foundProductCategoriesCodes.push(...product.categories)
    }

    if (foundProductCategoriesCodes.length === 0) {
      return result
    }

    const categoryCollectionReference = collection(firestoreDatabase, 'category')

    const productCategoriesResponse = query(
      categoryCollectionReference,
      where(documentId(), 'in', foundProductCategoriesCodes)
    )

    const querySnapshot = await getDocs(productCategoriesResponse)

    const foundCategories = [...querySnapshot.docs].map((document_) => {
      return {
        id: document_.id,
        name: document_.data().name,
      }
    })

    for (const product of products) {
      const filteredCategories = foundCategories.filter((foundCategory) =>
        product.categories.find((productCategory) => productCategory === foundCategory.id)
      )

      product.categories = filteredCategories.map((category) => category.name)
    }

    return result
  } catch (error) {
    throw createYimaError({ statusCode: error.statusCode, message: error.message, data: { message: error.message } })
  }
})
