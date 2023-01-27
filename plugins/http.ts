import { useAsyncData, useYimaToast, defineNuxtPlugin, useNuxtApp, unref, computed } from '#imports'
import { defu } from 'defu'
import { hash } from 'ohash'
import { type SearchParams } from 'typesense/lib/Typesense/Documents'
import type { AsyncData, AsyncDataOptions } from '#app'
import type { FetchOptions, FetchResponse } from 'ohmyfetch'
import type { ComputedRef } from 'vue'

declare global {
  interface MemberResponse<T> {
    totalItems: number
    member: T
  }
}

export interface YimaFetchOptions extends Omit<FetchOptions<any>, 'params'> {
  validationFormRef?: string
  recaptcha?: boolean
  throwToast?: boolean
  params?: Partial<SearchParams>
}

export const baseLdJsonHeader = 'application/ld+json'

const catchClientHttpErrors = async (fetchOptions: YimaFetchOptions, response: FetchResponse<any>) => {
  const nuxtApp = useNuxtApp()
  const { toastError } = useYimaToast()
  const {
    $i18n: { t },
  } = nuxtApp

  const formErrors: Record<string, string[]> = {}

  const hydraError = response._data.data

  if (!hydraError) {
    return
  }

  if (hydraError.message) {
    toastError(t(hydraError.message))
  }

  for (const violation of hydraError.violations ?? []) {
    if (violation.propertyPath) {
      if (violation.propertyPath in formErrors) {
        formErrors[violation.propertyPath] = [...formErrors[violation.propertyPath], t(violation.message)]

        continue
      }

      formErrors[violation.propertyPath] = [t(violation.message)]
    } else if (fetchOptions.throwToast) {
      toastError(violation.message)
    }
  }

  if (fetchOptions.validationFormRef) {
    await nuxtApp.callHook('yima:form:error', fetchOptions.validationFormRef, formErrors)
  }
}

const apiFetchFactory = () => {
  return $fetch.create({
    baseURL: '',
    async onRequest({ options }) {
      const {
        $i18n: { locale, locales },
      } = useNuxtApp()
      const currentLocale = locales.value.find((item: Record<string, any>) => item.code === locale.value)

      options.headers = {
        ...options.headers,
        'Accept-Language': currentLocale.iso.replace('-', '_'),
      }
    },
    async onResponse({ request: _, options, response }) {
      if (process.server) {
        return
      }

      await catchClientHttpErrors(options, response)
    },
  })
}

/*
 * Custom fetch for post FormData
 * Issue: https://github.com/nuxt/framework/issues/4669
 */
const postFormData = async (url: string, formData: FormData) => {
  const uniqueKey = hash([url, ...formData])

  return useAsyncData(uniqueKey, async () =>
    $fetch(url, {
      method: 'POST',
      body: formData,
    })
  )
}

export function http() {
  const fetchApi = apiFetchFactory()

  const makeRequest = async <T>(
    url: string | ComputedRef<string>,
    options: ComputedRef<YimaFetchOptions>,
    asyncDataOptions?: AsyncDataOptions<any>
  ): Promise<AsyncData<T, any>> => {
    options.value.throwToast = options.value.throwToast ?? true

    const uniqueKey = computed(() => {
      const parts = unref(options)

      return hash([unref(url), parts.method, parts.headers, parts.params, parts.body])
    })

    return useAsyncData(unref(uniqueKey), async () => fetchApi(unref(url), unref(options)), asyncDataOptions)
  }

  /**
   * HTTP GET optimized method
   */
  const get = async <T = Record<string, any>>(
    url: string | ComputedRef<string>,
    options?: YimaFetchOptions | ComputedRef<YimaFetchOptions>,
    asyncDataOptions?: AsyncDataOptions<any>
  ) => {
    const fetchOptions = computed(() =>
      defu(unref(options), {
        method: 'GET',
        headers: { accept: baseLdJsonHeader },
      })
    )

    return makeRequest<T>(url, fetchOptions, asyncDataOptions)
  }

  /**
   * HTTP POST optimized method
   */
  const post = async <T = Record<string, any>>(
    url: string | ComputedRef<string>,
    options?: YimaFetchOptions | ComputedRef<YimaFetchOptions>,
    asyncDataOptions?: AsyncDataOptions<any>
  ) => {
    const fetchOptions = computed(() =>
      defu(unref(options), {
        method: 'POST',
        headers: {
          accept: baseLdJsonHeader,
          'content-type': baseLdJsonHeader,
        },
      })
    )

    return makeRequest<T>(url, fetchOptions, asyncDataOptions)
  }

  /**
   * HTTP PATCH optimized method
   */
  const patch = async <T = Record<string, any>>(
    url: string | ComputedRef<string>,
    options?: YimaFetchOptions | ComputedRef<YimaFetchOptions>,
    asyncDataOptions?: AsyncDataOptions<any>
  ) => {
    const fetchOptions = computed(() =>
      defu(unref(options), {
        method: 'PATCH',
        headers: {
          accept: baseLdJsonHeader,
          'content-type': 'application/merge-patch+json',
        },
      })
    )

    return makeRequest<T>(url, fetchOptions, asyncDataOptions)
  }

  /**
   * HTTP PUT optimized method
   */
  const put = async <T = Record<string, any>>(
    url: string | ComputedRef<string>,
    options?: YimaFetchOptions | ComputedRef<YimaFetchOptions>,
    asyncDataOptions?: AsyncDataOptions<any>
  ) => {
    const fetchOptions = computed(() =>
      defu(unref(options), {
        method: 'PUT',
        headers: {
          accept: baseLdJsonHeader,
          'content-type': baseLdJsonHeader,
        },
      })
    )

    return makeRequest<T>(url, fetchOptions, asyncDataOptions)
  }

  /**
   * HTTP DELETE optimized method
   */
  const _delete = async <T = Record<string, any>>(
    url: string | ComputedRef<string>,
    options?: YimaFetchOptions | ComputedRef<YimaFetchOptions>,
    asyncDataOptions?: AsyncDataOptions<any>
  ) => {
    const fetchOptions = computed(() =>
      defu(unref(options), {
        method: 'DELETE',
        headers: { accept: '*/*' },
      })
    )

    return makeRequest<T>(url, fetchOptions, asyncDataOptions)
  }

  return {
    delete: _delete,
    get,
    patch,
    post,
    postFormData,
    put,
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('http', http())
})
