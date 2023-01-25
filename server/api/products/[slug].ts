import { type SearchParams } from 'typesense/lib/Typesense/Documents'
import { client } from '~/server/lib/typesense'
import { createYimaError } from '~/composables/services/admin/utils'

export default defineEventHandler(async (event): Promise<Product | undefined> => {
  try {
    const { slug } = event.context.params

    const search: SearchParams = {
      q: '*',
      query_by: 'name',
      filter_by: `slug:=${slug}`,
    }

    const searchResults = await client.collections('products').documents().search(search)

    const product = searchResults.hits[0]?.document as Product
    if (product) {
      return product
    }
  } catch (error) {
    throw createYimaError({ statusCode: error.statusCode, message: error.message, data: { message: error.message } })
  }
})
