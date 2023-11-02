<template>
  <div>
    <FormKit
      v-if="category"
      v-model="formData"
      type="form"
      :actions="false"
      form-class="flex flex-col gap-4"
      @submit="handleSubmit"
    >
      <TheH :level="1">{{ category.name }}</TheH>
      <div>ID: {{ category.id }}</div>

      <FormKit type="text" name="name" :label="$t('name')" />
      <FormKit type="select" :options="categoriesOptions" name="parent" :label="$t('parentCategory')" />
      <FormKit type="checkbox" name="isVisible" :label="$t('visibility')" />

      <div class="flex items-center gap-4">
        <TheButton type="submit" class="btn btn-primary relative" :loading="submitPending">{{ $t('save') }}</TheButton>
        <TheButton
          type="button"
          class="btn btn-error relative text-white"
          :loading="categoryDeletePending"
          @click="handleDeleteButtonClick"
        >
          {{ $t('delete') }}
        </TheButton>
      </div>
    </FormKit>
    <TheModal v-slot="{ closeModal }" v-model="deleteCategoryModalOpen">
      <div class="flex flex-col items-center gap-6">
        <TheH :level="1" class="text-center">{{ $t('confirmDeleteCategory') }}</TheH>
        <div class="flex items-center gap-2">
          <TheButton class="btn btn-primary" @click=";[handleDeleteCategory(), closeModal()]">
            {{ $t('confirm') }}
          </TheButton>
          <TheButton class="btn" @click="closeModal">{{ $t('cancel') }}</TheButton>
        </div>
      </div>
    </TheModal>
  </div>
</template>

<script setup lang="ts">
import {
  createError,
  navigateTo,
  ref,
  useI18n,
  useLocalePath,
  useRoute,
  useYimaAdminCategory,
  useYimaHttp,
  useYimaToast,
} from '#imports'

const { getCategory, setCategory, getCategories, deleteCategory } = useYimaAdminCategory()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { t } = useI18n()
const route = useRoute()
const localPath = useLocalePath()

const formData = ref<Record<string, any>>()
const deleteCategoryModalOpen = ref(false)
const categoryId = route.params.id as string

const [{ data: category }, { data: allCategories }] = await Promise.all([getCategory(categoryId), getCategories()])

if (!category.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not found',
  })
}

formData.value = { ...category.value }

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
  const options = [] as { label: string; value: string }[]

  if (category.id === categoryId) {
    return options
  }

  options.push({ label: category.name, value: category.id })

  if (category.children.length === 0) {
    return options
  }

  for (const child of category.children) {
    options.push(...createOptions(child))
  }

  return options
}

const { execute: handleSubmit, pending: submitPending } = waitAnd(
  ({ id: _, ...data }: Record<string, any>) => setCategory(categoryId, data),
  (response: Record<string, any>) => {
    if (response.error.value) {
      return
    }

    toastSuccess(t('adminCategoryUpdateSuccess'))
  }
)

function handleDeleteButtonClick() {
  deleteCategoryModalOpen.value = true
}

const { execute: handleDeleteCategory, pending: categoryDeletePending } = waitAnd(
  () => deleteCategory(categoryId),
  async (response) => {
    if (response.error.value) {
      return
    }

    toastSuccess(t('categoryDeleteSuccess'))

    await navigateTo(localPath('/admin/categories/'))
  }
)
</script>
