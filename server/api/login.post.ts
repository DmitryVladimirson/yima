import admin from 'firebase-admin'
import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const { idToken } = await readBody(event)
  const expiresIn = 60 * 60 * 24 * 5 * 1000

  const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn })

  setCookie(event, '__session', sessionCookie, { maxAge: expiresIn, secure: true, sameSite: 'none' })

  return {}
})
