import { useYimaApiAdminProduct, useYimaProduct } from '#imports'
import XLSX from 'xlsx-js-style'
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

const getProductRows = (product: Product) => {
  const rows: any[][] = []

  // Add product information to rows
  rows.push([
    product.id,
    product.name,
    product.description, // Body (HTML) is not available in product data
    '', // Vendor is not available in product data
    '', // Concatenating categories as a string
    '', // Type is not available in product data
    '', // Tags are not available in product data
    product.inStock, // Published status based on inStock
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'deny',
    'manual',
    product.price,
    product.oldPrice,
    true,
    '',
    '',
    product.imgUrl,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'active',
  ])

  return rows
}

const exportProducts = async () => {
  const { getProducts } = useYimaProduct()
  // Replace this with your actual API call to get products
  const { data: productsResponse } = await getProducts()

  if (productsResponse.value.member.length === 0) {
    return
  }

  const products = productsResponse.value.member

  const ws_data = []

  // Add header
  ws_data.push([
    'Handle',
    'Title',
    'Body (HTML)',
    'Vendor',
    'Product Category',
    'Type',
    'Tags',
    'Published',
    'Option1 Name',
    'Option1 Value',
    'Option2 Name',
    'Option2 Value',
    'Option3 Name',
    'Option3 Value',
    'Variant SKU',
    'Variant Grams',
    'Variant Inventory Tracker',
    'Variant Inventory Qty',
    'Variant Inventory Policy',
    'Variant Fulfillment Service',
    'Variant Price',
    'Variant Compare At Price',
    'Variant Requires Shipping',
    'Variant Taxable',
    'Variant Barcode',
    'Image Src',
    'Image Position',
    'Image Alt Text',
    'Gift Card',
    'SEO Title',
    'SEO Description',
    'Google Shopping / Google Product Category',
    'Google Shopping / Gender',
    'Google Shopping / Age Group',
    'Google Shopping / MPN',
    'Google Shopping / AdWords Grouping',
    'Google Shopping / AdWords Labels',
    'Google Shopping / Condition',
    'Google Shopping / Custom Product',
    'Google Shopping / Custom Label 0',
    'Google Shopping / Custom Label 1',
    'Google Shopping / Custom Label 2',
    'Google Shopping / Custom Label 3',
    'Google Shopping / Custom Label 4',
    'Variant Image',
    'Variant Weight Unit',
    'Variant Tax Code',
    'Cost per item',
    'Price / International',
    'Compare At Price / International',
    'Status',
  ])

  for (const product of products) {
    ws_data.push(...getProductRows(product))
  }

  const ws_name = `Product List ${new Date().toLocaleString('uk-UA', { dateStyle: 'short' })}`

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(ws_data)

  // Create workbook
  const wb = XLSX.utils.book_new()

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, ws_name)

  // Write to file
  XLSX.writeFile(wb, `${ws_name}.csv`)
}

export const useYimaAdminProduct = () => {
  return {
    addProduct,
    deleteProduct,
    getProduct,
    getProducts,
    setProduct,
    uploadImage,
    exportProducts,
  }
}
