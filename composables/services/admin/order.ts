import { useYimaAdminApiOrder, useYimaUtils, useNuxtApp } from '#imports'
import { type RowInfo } from 'xlsx-js-style'

declare global {
  interface AdminOrder {
    id: string
    products: Array<{ id: string; name: string; quantity: number; imgUrl: string; price: number }>
    shippingAddress: ShippingAddress
    createdAt: number
    total: number
  }
}

const exportOrders = async () => {
  const { getOrders } = useYimaAdminOrder()
  const { getDateStringFromUnix } = useYimaUtils()
  const {
    $i18n: { t },
  } = useNuxtApp()

  const ordersResponse = await getOrders({ params: { per_page: -1, withProductNames: true } })

  if (ordersResponse.error.value || !ordersResponse.data.value) {
    return ordersResponse
  }

  const orders = ordersResponse.data.value?.member ?? []

  const ws_data = []
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

  for (const order of orders) {
    ws_data.push(
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
      ['', { v: `Доставка: ${t(order.shippingAddress.shippingMethod)}`, s: { ...borderCellStyle, ...fontBoldStyle } }],
      [
        '',
        {
          v: `Адреса: ${order.shippingAddress.novaPoshtaAddress ?? order.shippingAddress.address}`,
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
      ws_data.push([
        '',
        { v: product.name, s: { ...borderCellStyle } },
        { v: product.quantity, s: { ...textRightStyle, ...borderCellStyle } },
        { v: `${product.price} грн`, s: { ...textRightStyle, ...borderCellStyle } },
        { v: `${product.price * product.quantity} грн`, s: { ...textRightStyle, ...borderCellStyle } },
      ])
    }

    ws_data.push([
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
  }

  const ws_name = `Випис замовлень ${new Date().toLocaleString('uk-UA', { dateStyle: 'short' })}`

  /* Create worksheet */

  const XLSX = await import('xlsx-js-style')

  const ws = XLSX.utils.aoa_to_sheet(ws_data, { cellStyles: true })

  ws['!cols'] = [{ wpx: 20 }, { wpx: 350 }, { wpx: 60 }, { wpx: 60 }, { wpx: 60 }]
  ws['!rows'] = Array.from({ length: ws_data.length }).fill({ hpx: 20 }) as RowInfo[]

  /* Create workbook */
  const wb = XLSX.utils.book_new()

  /* Add the worksheet to the workbook */
  XLSX.utils.book_append_sheet(wb, ws, ws_name)

  /* Write to file */
  XLSX.writeFile(wb, `${ws_name}.xlsx`)
}

export const useYimaAdminOrder = () => {
  return {
    ...useYimaAdminApiOrder(),
    exportOrders,
  }
}
