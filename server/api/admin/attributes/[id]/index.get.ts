import { queryByCollection } from '~/server/lib/firestore'

export default defineEventHandler(async (event) => {
  const attributes = await queryByCollection('attribute')

  return attributes.find((attribute) => attribute.id === event.context.params.id)
})
