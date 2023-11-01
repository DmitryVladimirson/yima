import { type SearchParams } from 'typesense/lib/Typesense/Documents'
import { client } from '~/server/lib/typesense'
import { createYimaError } from '~/composables/services/admin/utils'

export default defineEventHandler(async (event) => {
  try {
    const parameters = getQuery(event)

    const search: SearchParams = {
      ...parameters,
      q: typeof parameters.q === 'string' ? parameters.q : '*',
      query_by: typeof parameters.query_by === 'string' ? parameters.query_by : 'name',
    }

    const searchResults = await client.collections('products').documents().search(search)

    const products = [...(searchResults.hits?.map((hit) => hit.document) ?? [])] as AdminProduct[]

    return {
      totalItems: searchResults.found,
      member: products,
    }
  } catch (error: any) {
    throw createYimaError({ statusCode: error.statusCode, message: error.message, data: { message: error.message } })
  }
})
