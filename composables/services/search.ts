import { useRuntimeConfig } from '#imports'
import Typesense from 'typesense'

const getTypesenseApiKey = () => {
  const config = useRuntimeConfig()

  return config.public.typesenseApiKey
}

const client = new Typesense.Client({
  nodes: [
    {
      host: 'hl9vim30y7wqcbtkp-1.a1.typesense.net',
      port: 443,
      protocol: 'https',
    },
  ],
  apiKey: getTypesenseApiKey(),
  connectionTimeoutSeconds: 2,
})

const search = async (query: string) => {
  const search = {
    q: query,
    query_by: 'name',
    page: 1,
    per_page: 10,
  }

  const searchResults = await client.collections('products').documents().search(search)

  return {
    itemsFoundCount: searchResults.found,
    hits: [...(searchResults.hits?.map((hit) => hit.document) ?? [])] as Product[],
  }
}

export const useYimaSearch = () => {
  return { search }
}
