<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <TheLink to="/admin/attributes/new" class="btn btn-primary">{{ $t('newAttribute') }}</TheLink>
    </div>
    <div v-if="attributes?.member?.length > 0" class="w-full overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th class="bg-neutral text-neutral-content">{{ $t('name') }}</th>
            <th class="bg-neutral text-neutral-content">{{ $t('type') }}</th>
            <th class="bg-neutral text-neutral-content text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attribute in attributes.member" :key="attribute.id" class="group relative">
            <td class="group-hover:bg-base-200">
              <TheLink class="absolute inset-0 z-10" :to="`/admin/attributes/${attribute.id}`" />
              <div class="max-w-xs truncate font-bold">{{ attribute.name }}</div>
            </td>
            <td class="group-hover:bg-base-200">
              {{ $t(attribute.type) }}
            </td>
            <th class="group-hover:bg-base-200">
              <div class="relative z-20 flex items-center justify-center gap-2">
                <TheLink :to="`/admin/attributes/${attribute.id}`" class="btn"><DetailsIcon class="text-xl" /></TheLink>
                <TheButton
                  class="btn btn-error relative text-white"
                  :loading="currentAttributeId === attribute.id && attributeDeletePending"
                  @click="handleDeleteButtonClick(attribute.id)"
                >
                  <DeleteIcon class="text-lg" />
                </TheButton>
              </div>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
    <TheMessageBox v-else :message="$t('noAttributes')"></TheMessageBox>
    <TheModal v-slot="{ closeModal }" v-model="deleteAttributeModalOpen">
      <div class="flex flex-col items-center gap-6">
        <TheH :level="1" class="text-center">{{ $t('confirmDeleteAttribute') }}</TheH>
        <div class="flex items-center gap-2">
          <TheButton class="btn btn-primary" @click=";[handleDeleteAttribute(currentAttributeId), closeModal()]">
            {{ $t('confirm') }}
          </TheButton>
          <TheButton class="btn" @click="closeModal">{{ $t('cancel') }}</TheButton>
        </div>
      </div>
    </TheModal>
  </div>
</template>

<script setup lang="ts">
import { useYimaAdminAttribute, useYimaHttp, useYimaToast, useI18n, ref } from '#imports'
import DetailsIcon from '~icons/mdi/pencil'
import DeleteIcon from '~icons/mdi/trash'

const { getAttributes, deleteAttribute } = useYimaAdminAttribute()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { t } = useI18n()

const deleteAttributeModalOpen = ref(false)

const { data: attributes } = await getAttributes()

const currentAttributeId = ref('')

function handleDeleteButtonClick(id: string) {
  currentAttributeId.value = id
  deleteAttributeModalOpen.value = true
}

const { execute: handleDeleteAttribute, pending: attributeDeletePending } = waitAnd(
  (id: string) => deleteAttribute(id),
  async (response) => {
    if (response.error.value) {
      return
    }

    toastSuccess(t('attributeDeleteSuccess'))

    await updateAttributes()
  }
)

async function updateAttributes() {
  const { data } = await getAttributes()
  attributes.value = data.value
}
</script>
`
