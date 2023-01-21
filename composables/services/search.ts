import { useYimaApiProduct } from '#imports'
import { type SearchParams } from 'typesense/lib/Typesense/Documents'

const searchProductsByName = async (name: string, parameters?: SearchParams) => {
  const { getProducts } = useYimaApiProduct()

  return getProducts({ params: { ...parameters, q: name } })
}

export const useYimaSearch = () => {
  return { searchProductsByName }
}
