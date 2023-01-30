<template>
  <div>
    <FormKit
      v-if="attribute"
      v-model="formData"
      type="form"
      :actions="false"
      form-class="flex flex-col gap-4"
      @submit="handleSubmit"
    >
      <TheH :level="1">{{ attribute.name }}</TheH>
      <div class="flex items-center gap-4">
        <span>ID: {{ attribute.id }} </span>
        <span>{{ $t('type') }}: {{ $t(attribute.type) }} </span>
      </div>
      <FormKit type="text" validation="required" name="name" :label="$t('name')" />

      <div class="flex items-center gap-4">
        <TheButton type="submit" class="btn btn-primary relative" :loading="submitPending">{{ $t('save') }}</TheButton>
        <TheButton
          type="button"
          class="btn btn-error relative text-white"
          :loading="attributeDeletePending"
          @click="handleDeleteButtonClick"
        >
          {{ $t('delete') }}
        </TheButton>
      </div>
    </FormKit>
    <TheModal v-slot="{ closeModal }" v-model="deleteAttributeModalOpen">
      <div class="flex flex-col items-center gap-6">
        <TheH :level="1" class="text-center">{{ $t('confirmDeleteAttribute') }}</TheH>
        <div class="flex items-center gap-2">
          <TheButton class="btn btn-primary" @click=";[handleDeleteAttribute(), closeModal()]">
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
  useYimaAdminAttribute,
  useYimaHttp,
  useYimaToast,
} from '#imports'

const { getAttribute, setAttribute, deleteAttribute } = useYimaAdminAttribute()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { t } = useI18n()
const route = useRoute()
const localPath = useLocalePath()

const formData = ref<Record<string, any>>({})
const deleteAttributeModalOpen = ref(false)
const attributeId = route.params.id as string

const { data: attribute } = await getAttribute(attributeId)

if (!attribute.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not found',
  })
}

formData.value = {
  name: attribute.value.name,
  type: attribute.value.type,
}

const { execute: handleSubmit, pending: submitPending } = waitAnd(
  async (data: AdminAttribute) => {
    return setAttribute(attributeId, data)
  },
  async (response) => {
    if (response.error.value) {
      return
    }

    toastSuccess(t('adminAttributeUpdateSuccess'))

    const { data } = await getAttribute(attributeId)
    attribute.value = data.value
  }
)

function handleDeleteButtonClick() {
  deleteAttributeModalOpen.value = true
}

const { execute: handleDeleteAttribute, pending: attributeDeletePending } = waitAnd(
  () => deleteAttribute(attributeId),
  async (response) => {
    if (response.error.value) {
      return
    }

    toastSuccess(t('attributeDeleteSuccess'))

    await navigateTo(localPath('/admin/attributes'))
  }
)
</script>
