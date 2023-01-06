export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hookOnce('page:finish', () => {
    nuxtApp.$i18n.onLanguageSwitched = async () => {
      await refreshNuxtData()
    }
  })
})
