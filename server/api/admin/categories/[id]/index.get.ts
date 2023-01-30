import { where, documentId } from 'firebase/firestore'
import { queryByCollection } from '~/server/lib/firestore'

export default defineEventHandler(async (event) => {
  const whereOption = where(documentId(), '==', event.context.params.id)
  const categories = await queryByCollection<AdminCategory>('category', { where: whereOption })

  return categories.member[0]
})
