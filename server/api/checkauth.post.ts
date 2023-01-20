import admin from 'firebase-admin'
import { createYimaError } from '~/composables/services/admin/utils'

export default defineEventHandler(async (event) => {
  const { sessionCookie } = await readBody(event)

  try {
    return await admin.auth().verifySessionCookie(sessionCookie)
  } catch {
    throw createYimaError({ statusCode: 401, data: { message: 'unauthorized' } })
  }
})
