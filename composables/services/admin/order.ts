import { useYimaAdminApiOrder, useYimaUtils } from '#imports'
import XLSX from 'xlsx-js-style'
import type { RowInfo } from 'xlsx-js-style'

declare global {
  interface AdminOrder {
    id: string
    products: Array<{ id: string; name: string; quantity: number; imgUrl: string; price: number }>
    shippingAddress: ShippingAddress
    createdAt: number
    total: number
  }
}

const getOrderRows = (order: AdminOrder) => {
  const { getDateStringFromUnix } = useYimaUtils()

  const rows: any[][] = []
  const borderCellStyle = {
    border: {
      right: { style: 'medium' },
      left: { style: 'medium' },
      top: { style: 'medium' },
      bottom: { style: 'medium' },
    },
  }
  const textCenterStyle = { alignment: { horizontal: 'center' } }
  const textRightStyle = { alignment: { horizontal: 'right' } }
  const fontBoldStyle = { font: { bold: true } }

  rows.push(
    [],
    ['', { v: `Замовлення №${order.id}`, s: { ...borderCellStyle, ...fontBoldStyle } }],
    ['', { v: `Дата: ${getDateStringFromUnix(order.createdAt)}`, s: { ...borderCellStyle, ...fontBoldStyle } }],
    [
      '',
      {
        v: `Отримувач: ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        s: { ...borderCellStyle, ...fontBoldStyle },
      },
    ],
    ['', { v: `Доставка: ${order.shippingAddress.shippingMethod}`, s: { ...borderCellStyle, ...fontBoldStyle } }],
    [
      '',
      {
        v: `Адреса: ${order.shippingAddress.address}`,
        s: { ...borderCellStyle, ...fontBoldStyle },
      },
    ],
    ['', { v: `Номер телефону: ${order.shippingAddress.phoneNumber}`, s: { ...borderCellStyle, ...fontBoldStyle } }],
    [
      '',
      { v: 'Назва', s: { ...textCenterStyle, ...borderCellStyle, ...fontBoldStyle } },
      { v: 'Кількість', s: { ...textCenterStyle, ...borderCellStyle, ...fontBoldStyle } },
      { v: 'Ціна', s: { ...textCenterStyle, ...borderCellStyle, ...fontBoldStyle } },
      { v: 'Сума', s: { ...textCenterStyle, ...borderCellStyle, ...fontBoldStyle } },
    ]
  )
  for (const product of order.products) {
    rows.push([
      '',
      { v: product.name, s: { ...borderCellStyle } },
      { v: product.quantity, s: { ...textRightStyle, ...borderCellStyle } },
      { v: `${product.price} грн`, s: { ...textRightStyle, ...borderCellStyle } },
      { v: `${product.price * product.quantity} грн`, s: { ...textRightStyle, ...borderCellStyle } },
    ])
  }

  rows.push([
    '',
    '',
    '',
    {
      v: 'заг. сума:',
      s: {
        ...borderCellStyle,
        ...textCenterStyle,
        ...fontBoldStyle,
      },
    },
    {
      v: `${order.total} грн`,
      s: {
        ...borderCellStyle,
        ...textRightStyle,
        ...fontBoldStyle,
      },
    },
  ])

  return rows
}

const exportOrders = async (fromDate?: number) => {
  const { getOrders } = useYimaAdminOrder()

  const ordersResponse = await getOrders({
    params: { per_page: -1, withProductNames: true, fromDate },
  })

  if (ordersResponse.error.value || !ordersResponse.data.value) {
    return ordersResponse
  }

  const orders = ordersResponse.data.value?.member ?? []

  const ws_data = []

  for (const order of orders) {
    ws_data.push(...getOrderRows(order))
  }

  const ws_name = `Випис замовлень ${new Date().toLocaleString('uk-UA', { dateStyle: 'short' })}`

  downloadOrderInvoiceFile(ws_data, ws_name)
}

const exportOrder = async (id: string) => {
  const { getOrder } = useYimaAdminOrder()

  const ordersResponse = await getOrder(id)

  if (ordersResponse.error.value || !ordersResponse.data.value) {
    return ordersResponse
  }

  const order = ordersResponse.data.value

  const ws_data = [...getOrderRows(order)]

  const ws_name = `Замовлення ${id}`

  downloadOrderInvoiceFile(ws_data, ws_name)
}

const downloadOrderInvoiceFile = (data: any[][], documentName: string) => {
  const ws = XLSX.utils.aoa_to_sheet(data, { cellStyles: true })

  ws['!cols'] = [{ wpx: 20 }, { wpx: 350 }, { wpx: 60 }, { wpx: 60 }, { wpx: 60 }]
  ws['!rows'] = Array.from({ length: data.length }).fill({ hpx: 20 }) as RowInfo[]

  /* Create workbook */
  const wb = XLSX.utils.book_new()

  /* Add the worksheet to the workbook */
  XLSX.utils.book_append_sheet(wb, ws, documentName)

  /* Write to file */
  XLSX.writeFile(wb, `${documentName}.xlsx`)
}

export const useYimaAdminOrder = () => {
  return {
    ...useYimaAdminApiOrder(),
    exportOrders,
    exportOrder,
  }
}
