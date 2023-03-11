import { set } from '~/server/lib/firestore'
import { yimaReadBody } from '~/server/lib/utils'

export default defineEventHandler(async (event) => {
  const body = await yimaReadBody(event)

  const collection = 'settings'

  await set(collection, body, 'settings')

  return {}
})
