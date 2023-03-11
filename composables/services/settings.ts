import { useYimaApiSettings } from '#imports'

declare global {
  interface YimaSettings {
    minPurchasePrice: number
  }
}

export const useYimaSettings = () => {
  return {
    ...useYimaApiSettings(),
  }
}
