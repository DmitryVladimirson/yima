import { TYPE, useToast } from 'vue-toastification'
import type { ToastOptions } from 'vue-toastification/src/types'

const instance = () => useToast()

const toastDefault = (content: string, options?: ToastOptions) => {
  const toast = instance()

  toast(content, {
    ...options,
    type: TYPE.DEFAULT,
  })
}

const toastInfo = (content: string, options?: ToastOptions) => {
  const toast = instance()

  toast(content, {
    ...options,
    type: TYPE.INFO,
  })
}

const toastSuccess = (content: string, options?: ToastOptions) => {
  const toast = instance()

  toast(content, {
    ...options,
    type: TYPE.SUCCESS,
  })
}

const toastError = (content: string, options?: ToastOptions) => {
  const toast = instance()

  toast(content, {
    ...options,
    type: TYPE.ERROR,
  })
}

const toastWarning = (content: string, options?: ToastOptions) => {
  const toast = instance()

  toast(content, {
    ...options,
    type: TYPE.WARNING,
  })
}

export const useYimaToast = () => {
  return {
    toastDefault,
    toastError,
    toastInfo,
    toastSuccess,
    toastWarning,
  }
}
