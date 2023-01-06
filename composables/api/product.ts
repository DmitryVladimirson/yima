import type { UseFetchOptions } from '#app'

const getProducts = async (
  useFetchOptions?: UseFetchOptions<any>
) => {
  return useFetch('/api/products', useFetchOptions)
}

export const useYimaProduct = () => {
  return {
    getProducts
  }
}
