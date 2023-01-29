import { add } from '~/server/lib/firestore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const collection = 'order'

  await add(collection, body)

  return {}
})
