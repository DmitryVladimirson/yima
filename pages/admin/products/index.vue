<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <TheLink to="/admin/products/new" class="btn btn-primary">{{ $t('newProduct') }}</TheLink>
    </div>
    <div class="w-full overflow-x-auto">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th class="bg-neutral text-neutral-content">{{ $t('image') }}</th>
            <th class="bg-neutral text-neutral-content">{{ $t('name') }}</th>
            <th class="bg-neutral text-neutral-content">{{ $t('visibility') }}</th>
            <th class="bg-neutral text-neutral-content text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="group relative">
            <td class="group-hover:bg-base-200">
              <TheLink class="absolute inset-0 z-10" :to="`/admin/products/${product.id}`" />
              <div class="flex items-center space-x-3">
                <div class="avatar">
                  <div class="mask mask-squircle h-12 w-12">
                    <img :src="product.imgUrl" :alt="product.name" />
                  </div>
                </div>
              </div>
            </td>
            <td class="group-hover:bg-base-200">
              <div class="max-w-xs truncate font-bold">{{ product.name }}</div>
            </td>
            <td class="group-hover:bg-base-200">
              <span class="badge" :class="product.isVisible ? 'badge-success' : 'badge-error text-white'">
                {{ product.isVisible ? $t('visible') : $t('hidden') }}
              </span>
            </td>
            <th class="group-hover:bg-base-200">
              <div class="relative z-20 flex items-center justify-center gap-2">
                <TheLink :to="`/admin/products/${product.id}`" class="btn"><DetailsIcon class="text-xl" /></TheLink>
                <TheButton
                  class="btn btn-error relative text-white"
                  :loading="currentProductId === product.id && productDeletePending"
                  @click="handleDeleteButtonClick(product.id)"
                >
                  <DeleteIcon class="text-lg" />
                </TheButton>
              </div>
            </th>
          </tr>
          <!-- row 2 -->
        </tbody>
        <!-- foot -->
      </table>
    </div>
    <TheModal v-slot="{ closeModal }" v-model="deleteProductModalOpen">
      <div class="flex flex-col items-center gap-6">
        <TheH :level="1" class="text-center">{{ $t('confirmDeleteProduct') }}</TheH>
        <div class="flex items-center gap-2">
          <TheButton class="btn btn-primary" @click=";[handleDeleteProduct(currentProductId), closeModal()]">
            {{ $t('confirm') }}
          </TheButton>
          <TheButton class="btn" @click="closeModal">{{ $t('cancel') }}</TheButton>
        </div>
      </div>
    </TheModal>
  </div>
</template>

<script setup lang="ts">
import { useYimaAdminProduct, useYimaHttp, useYimaToast, useI18n, ref } from '#imports'
import DetailsIcon from '~icons/mdi/pencil'
import DeleteIcon from '~icons/mdi/trash'

const { getProducts, deleteProduct } = useYimaAdminProduct()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { t } = useI18n()

const deleteProductModalOpen = ref(false)

const { data: products } = await getProducts()

const currentProductId = ref('')

function handleDeleteButtonClick(id: string) {
  currentProductId.value = id
  deleteProductModalOpen.value = true
}

const { execute: handleDeleteProduct, pending: productDeletePending } = waitAnd(
  (id: string) => deleteProduct(id),
  async (response) => {
    if (response.error.value) {
      return
    }

    toastSuccess(t('productDeleteSuccess'))

    await updateProducts()
  }
)

async function updateProducts() {
  const { data } = await getProducts()
  products.value = data.value
}
</script>
`
