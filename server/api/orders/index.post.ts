import { add } from '~/server/lib/firestore'
import { yimaReadBody } from '~/server/lib/utils'

export default defineEventHandler(async (event) => {
  const body = await yimaReadBody(event)

  const collection = 'order'

  await add(collection, body)

  return {}
})
