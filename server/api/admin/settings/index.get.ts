import { where, documentId } from 'firebase/firestore'
import { queryByCollection } from '~/server/lib/firestore'

export default defineEventHandler(async (): Promise<YimaSettings | Record<string, unknown>> => {
  const settingsResponse = await queryByCollection<YimaSettings>('settings', {
    where: where(documentId(), '==', 'settings'),
  })

  const settings = settingsResponse.member[0]
  if (!settings) {
    return {}
  }

  return settings
})
