import { ref, useNuxtApp, getCurrentInstance } from '#imports'

const waitAnd = (
  handler: (...arguments_: any[]) => Promise<any> | undefined,
  callback?: (result: Record<string, any>, ...arguments_: any[]) => void | Promise<void>
) => {
  let result = {}
  const pending = ref()

  const execute = async (...arguments_: any[]) => {
    pending.value = true

    result = await handler(...arguments_)

    pending.value = false

    if (callback) {
      await callback(result, ...arguments_)
    }
  }

  return { ...result, execute, pending }
}

export const useYimaHttp = () => {
  const nuxtApp = useNuxtApp()
  const vm = getCurrentInstance()

  nuxtApp.hook('yima:form:error', (formReferenceId: string, formErrors: Record<string, string[]>) => {
    const form: any = vm?.refs[formReferenceId]
    if (form) {
      form.node.setErrors(formErrors)
      form.node.props.disabled = false
    }
  })

  return { waitAnd }
}
