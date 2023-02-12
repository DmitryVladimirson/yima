import { add } from '~/server/lib/firestore'
import { yimaReadBody } from '~/server/utils/h3'

export default defineEventHandler(async (event) => {
  const body = await yimaReadBody(event)

  const collection = 'order'

  await add(collection, body)

  return {}
})
