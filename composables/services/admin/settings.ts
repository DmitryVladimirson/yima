import { useYimaAdminApiSettings } from '#imports'

declare global {
  interface YimaAdminSettings extends YimaSettings {}
}

export const useYimaAdminSettings = () => {
  return {
    ...useYimaAdminApiSettings(),
  }
}
