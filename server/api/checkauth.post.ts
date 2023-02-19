import admin from 'firebase-admin'
import { createYimaError } from '~/composables/services/admin/utils'
import { yimaReadBody } from '~/server/lib/utils'

export default defineEventHandler(async (event) => {
  const body = await yimaReadBody(event)

  try {
    return await admin.auth().verifySessionCookie(body.sessionCookie)
  } catch {
    throw createYimaError({ statusCode: 401, data: { message: 'unauthorized' } })
  }
})
