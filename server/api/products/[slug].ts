import { type SearchParams } from 'typesense/lib/Typesense/Documents'
import { collection, query, where, getDocs, documentId } from 'firebase/firestore'
import { client } from '~/server/lib/typesense'
import { createYimaError } from '~/composables/services/admin/utils'
import { firestoreDatabase } from '~/server/lib/firebase'

export default defineEventHandler(async (event): Promise<Product | undefined> => {
  try {
    const { slug } = event.context.params

    const search: SearchParams = {
      q: '*',
      query_by: 'name',
      filter_by: `slug:=${slug}`,
    }

    const searchResults = await client.collections('products').documents().search(search)

    const product = searchResults.hits[0]?.document as AdminProduct

    if (!product) {
      return
    }

    if (product.categories.length === 0) {
      return product
    }

    const colReference = collection(firestoreDatabase, 'category')

    const queryResponse = query(colReference, where(documentId(), 'in', product.categories))

    const querySnapshot = await getDocs(queryResponse)

    product.categories = [...querySnapshot.docs].map((document_) => document_.data().name)

    return product
  } catch (error) {
    throw createYimaError({ statusCode: error.statusCode, message: error.message, data: { message: error.message } })
  }
})
