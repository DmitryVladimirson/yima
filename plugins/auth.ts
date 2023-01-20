import { useYimaAuth, useNuxtApp } from '#imports'
import { getIdToken } from 'firebase/auth'

export function authPlugin() {
  const auth = useYimaAuth()
  const userInfo = auth.useUserState()

  return {
    ...auth,
    userInfo,
  }
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const plugin = authPlugin()

  if (process.client) {
    const { auth: firebaseAuth } = await import('~/server/lib/firebase')
    const currentUid = firebaseAuth.currentUser?.uid
    firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        if (currentUid === user.uid) {
          return
        }

        const idToken = await getIdToken(user)

        await useNuxtApp().$http.post('/api/login', {
          body: { idToken },
        })
      }
    })
  }

  nuxtApp.provide('auth', plugin)
})
