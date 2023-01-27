<template>
  <div class="flex flex-col gap-8">
    <div>
      <TheH> {{ $t('newAttribute') }}</TheH>
    </div>
    <FormKit
      ref="attributeNewFormReference"
      v-model="formData"
      type="form"
      :actions="false"
      form-class="flex flex-col gap-4"
      @submit="handleSubmit"
    >
      <FormKit type="text" name="name" validation="required" :label="$t('name')" />

      <FormKit v-model="id" type="text" validation="required" name="id" :label="$t('id')" />
      <FormKit type="select" validation="required" name="type" :options="typeOptions" :label="$t('type')" />

      <TheButton type="submit" class="btn btn-primary relative" :loading="submitPending">
        {{ $t('save') }}
      </TheButton>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { ref, useI18n, useYimaAdminAttribute, useYimaHttp, useYimaToast, useYimaUtils } from '#imports'

const { addAttribute } = useYimaAdminAttribute()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { transliterate } = useYimaUtils()
const { t } = useI18n()

const formData = ref<Record<string, any>>({})
const attributeNewFormReference = ref()
const id = ref('')

const typeOptions = computed(() => {
  return [
    { label: t('text'), value: 'text' },
    { label: t('number'), value: 'number' },
  ]
})

const resolveId = computed(() => {
  const id = formData.value.name
  if (!id) {
    return ''
  }

  return transliterate(id.replaceAll(' ', '-'))
})

const { execute: handleSubmit, pending: submitPending } = waitAnd(
  async (data: AdminAttribute) => addAttribute(data, { validationFormRef: 'attributeNewFormReference' }),
  async (response, _, node) => {
    if (response.error.value) {
      return
    }

    toastSuccess(t('adminAttributeAddSuccess'))
    node.reset()
  }
)

watch(resolveId, (value) => {
  id.value = value
})
</script>
