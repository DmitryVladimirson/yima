import { useYimaApiAdminAttribute } from '#imports'
import type { AsyncDataOptions } from '#app'
import type { YimaFetchOptions } from '~/plugins/http'

declare global {
  interface Attribute {
    name: string
  }
  interface AdminAttribute extends Attribute {
    id: string
    type: 'number' | 'text'
  }
}

const getAttributes = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  const { getAttributes } = useYimaApiAdminAttribute()

  return getAttributes(options, asyncDataOptions)
}

const getAttribute = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  const { getAttribute } = useYimaApiAdminAttribute()

  return getAttribute(id, options, asyncDataOptions)
}

const setAttribute = async (
  id: string,
  payload: Partial<AdminAttribute>,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  const { setAttribute } = useYimaApiAdminAttribute()

  return setAttribute(id, payload, options, asyncDataOptions)
}

const addAttribute = async (
  data: AdminAttribute,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  const { addAttribute } = useYimaApiAdminAttribute()

  return addAttribute(data, options, asyncDataOptions)
}

const deleteAttribute = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  const { deleteAttribute } = useYimaApiAdminAttribute()

  return deleteAttribute(id, options, asyncDataOptions)
}

export const useYimaAdminAttribute = () => {
  return {
    addAttribute,
    deleteAttribute,
    getAttribute,
    getAttributes,
    setAttribute,
  }
}
