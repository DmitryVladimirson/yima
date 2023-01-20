import { useYimaApiCategory } from '#imports'
import type { AsyncDataOptions } from '#app'
import type { YimaFetchOptions } from '~/plugins/http'

declare global {
  interface Category {
    id: string
    name: string
  }
}

const getCategories = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  const { getCategories } = useYimaApiCategory()

  return getCategories(options, asyncDataOptions)
}

export const useYimaCategory = () => {
  return {
    getCategories,
  }
}
