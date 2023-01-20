import { createError } from '#imports'
import type { NuxtError } from '#app'

interface Violation {
  propertyPath: string
  message: string
}

interface YimaRequestError extends Partial<NuxtError> {
  data: {
    message?: string
    violations?: Violation[]
  }
}

export const createYimaError = (error: YimaRequestError) => {
  return createError(error)
}
