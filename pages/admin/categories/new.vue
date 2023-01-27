<template>
  <div class="flex flex-col gap-8">
    <div>
      <TheH> {{ $t('newCategory') }}</TheH>
    </div>
    <FormKit
      ref="categoryNewFormReference"
      v-model="formData"
      type="form"
      :actions="false"
      form-class="flex flex-col gap-4"
      @submit="handleSubmit"
    >
      <FormKit type="text" name="name" validation="required" :label="$t('name')" />
      <FormKit v-model="id" type="text" name="id" validation="required" :label="$t('id')" />

      <FormKit
        type="select"
        :options="categoriesOptions"
        :placeholder="$t('parentCategoryPlaceholder')"
        name="parent"
        :label="$t('parentCategory')"
      />
      <FormKit type="checkbox" :value="false" name="isVisible" :label="$t('visibility')" />
      <TheButton type="submit" class="btn btn-primary relative" :loading="submitPending">
        {{ $t('save') }}
      </TheButton>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { ref, useI18n, useYimaAdminCategory, useYimaHttp, useYimaToast, useYimaUtils } from '#imports'

const { addCategory, getCategories } = useYimaAdminCategory()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { transliterate } = useYimaUtils()
const { t } = useI18n()

const { data: allCategories } = await getCategories()

const initialFormData = { isVisible: true, parent: '' }
const formData = ref<Record<string, any>>(initialFormData)
const categoryNewFormReference = ref()
const id = ref('')

const categoriesOptions = computed(() => {
  const options = [{ label: '-', value: '' }] as { label: string; value: string }[]

  if (!allCategories.value) {
    return options
  }

  for (const category of allCategories.value) {
    options.push(...createOptions(category))
  }

  return options
})

function createOptions(category: AdminCategory) {
  const options = [{ label: category.name, value: category.id }] as { label: string; value: string }[]

  if (category.children.length === 0) {
    return options
  }

  for (const child of category.children) {
    options.push(...createOptions(child))
  }

  return options
}

const resolveId = computed(() => {
  const id = formData.value.name
  if (!id) {
    return ''
  }

  return transliterate(id.replaceAll(' ', '-'))
})

const { execute: handleSubmit, pending: submitPending } = waitAnd(
  async (data: Record<string, any>) => {
    const category = { ...data, children: [] as string[] }

    return addCategory(category as ServerCategory, { validationFormRef: 'categoryNewFormReference' })
  },
  async (response) => {
    if (response.error.value) {
      return
    }

    toastSuccess(t('adminCategoryAddSuccess'))

    formData.value = initialFormData
  }
)

watch(resolveId, (value) => {
  id.value = value
})
</script>
