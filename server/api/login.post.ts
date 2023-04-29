import admin from 'firebase-admin'
import { setCookie } from 'h3'
import serviceAccount from '~/serviceAccountKey.json'
import { yimaReadBody } from '~/server/lib/utils'

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

export default defineEventHandler(async (event) => {
  let body = await yimaReadBody(event)
  // One week
  const expiresIn = 604_800_000

  if (Buffer.isBuffer(body)) {
    body = JSON.parse(body.toString())
  }

  const sessionCookie = await admin.auth().createSessionCookie(body.idToken, { expiresIn })

  setCookie(event, '__session', sessionCookie, { maxAge: expiresIn, secure: true, sameSite: 'none' })

  return {}
})
