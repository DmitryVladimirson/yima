<template>
  <section class="flex flex-col gap-4">
    <TheH :level="1">{{ $t('settings') }}</TheH>
    <FormKit v-model="formData" :actions="false" type="form" form-class="flex flex-col gap-4" @submit="handleSubmit">
      <FormKit type="number" name="minPurchasePrice" :label="$t('minPurchasePrice')" />
      <TheButton :loading="settingSavePending" type="submit" class="btn btn-primary relative mr-auto">
        {{ $t('save') }}
      </TheButton>
    </FormKit>
  </section>
</template>

<script setup lang="ts">
import { useYimaAdminSettings, ref, createError, useYimaHttp, useYimaToast, useI18n } from '#imports'

const { getSettings, setSettings } = useYimaAdminSettings()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { t } = useI18n()

const { data: settings } = await getSettings()

if (!settings.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not found',
  })
}

const formData = ref<YimaSettings>({
  minPurchasePrice: settings.value.minPurchasePrice,
})

const { execute: handleSubmit, pending: settingSavePending } = waitAnd(
  (data: Record<string, any>) => {
    const payload: YimaSettings = { minPurchasePrice: Number(data.minPurchasePrice) }

    return setSettings(payload)
  },
  (result) => {
    if (result.error.value) {
      return
    }

    toastSuccess(t('settingsSaveSuccess'))
  }
)
</script>
