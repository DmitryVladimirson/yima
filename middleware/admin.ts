import { useCookie, useNuxtApp, useLocalePath, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware(async () => {
  const cookie = useCookie('__session')

  const response = await useNuxtApp().$http.post('/api/checkauth', {
    body: {
      sessionCookie: cookie.value,
    },
  })

  if (!response.data.value?.admin) {
    const localePath = useLocalePath()

    return navigateTo(localePath('/login'))
  }
})
