import { useYimaApiAdminProduct } from '#imports'
import type { AsyncDataOptions } from '#app'
import type { YimaFetchOptions } from '~/plugins/http'
import { uploadFile } from '~/server/lib/firestorage'

declare global {
  interface AdminProduct extends Omit<Product, 'attributes'> {
    isVisible: boolean
    attributes: Array<{ id: string; value: string | number }>
  }
}

const getProducts = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  const { getProducts } = useYimaApiAdminProduct()

  return getProducts(options, asyncDataOptions)
}

const getProduct = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  const { getProduct } = useYimaApiAdminProduct()

  return getProduct(id, options, asyncDataOptions)
}

const setProduct = async (
  id: string,
  payload: Partial<AdminProduct>,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  const { setProduct } = useYimaApiAdminProduct()

  return setProduct(id, payload, options, asyncDataOptions)
}

const addProduct = async (data: AdminProduct, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  const { addProduct } = useYimaApiAdminProduct()

  return addProduct(data, options, asyncDataOptions)
}

const deleteProduct = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  const { deleteProduct } = useYimaApiAdminProduct()

  return deleteProduct(id, options, asyncDataOptions)
}

const uploadImage = async (image: File, name: string) => {
  return uploadFile(image, `/images/${name}`)
}

export const useYimaAdminProduct = () => {
  return {
    addProduct,
    deleteProduct,
    getProduct,
    getProducts,
    setProduct,
    uploadImage,
  }
}
