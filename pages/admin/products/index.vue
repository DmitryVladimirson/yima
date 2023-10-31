<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <TheH :level="1">{{ $t('products') }}</TheH>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>{{ $t('totalItems') }}: {{ allItemsCount }}</div>

        <TheLink to="/admin/products/new" class="btn btn-primary">{{ $t('newProduct') }}</TheLink>
      </div>
    </div>
    <div class="flex justify-between">
      <FormKit
        v-model="formData"
        type="form"
        form-class="input-group sm:max-w-[200px] md:max-w-full"
        :actions="false"
        @submit="handleSearchByName"
      >
        <FormKit
          type="text"
          name="searchText"
          :placeholder="$t('searchProducts')"
          :classes="{
            input:
              'appearance-none border-none flex-shrink focus:ring-0 focus:outline-none rounded-br-none rounded-tr-none shadow',
          }"
        />
        <TheButton type="submit" class="btn btn-primary relative text-white">
          <SearchIcon class="text-xl"></SearchIcon>
        </TheButton>
      </FormKit>
      <div v-if="foundCount > 0">
        <div>{{ $t('foundItems') }}: {{ foundCount }}</div>
      </div>
    </div>
    <template v-if="foundCount > 0">
      <div class="flex flex-col items-center gap-4">
        <div class="w-full overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th class="bg-neutral text-neutral-content">{{ $t('image') }}</th>
                <th class="bg-neutral text-neutral-content">{{ $t('name') }}</th>
                <th class="bg-neutral text-neutral-content">{{ $t('visibility') }}</th>
                <th class="bg-neutral text-center text-neutral-content"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in foundItems" :key="product.id" class="group relative">
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
                <td class="group-hover:bg-base-200">
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <TheButton v-if="loadMoreButtonEnabled" class="btn btn-primary" @click="handleLoadMore">
          {{ $t('loadMore') }}
        </TheButton>
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
    </template>
    <TheMessageBox v-else :message="$t('noProductsFound')" />
  </div>
</template>

<script setup lang="ts">
import { ref, useI18n, useYimaAdminProduct, useYimaHttp, useYimaToast } from '#imports'
import DetailsIcon from '~icons/mdi/pencil'
import DeleteIcon from '~icons/mdi/trash'
import SearchIcon from '~icons/mdi/magnify'

import { YimaFetchOptions } from '~/plugins/http'

const { getProducts, deleteProduct } = useYimaAdminProduct()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { t } = useI18n()

const ITEMS_PER_FETCH = 10

const queriedName = ref('')
const loadMoreClickCounter = ref<number>(0)

watch(queriedName, (oldName, updatedName) => {
  if (oldName.trim() === updatedName.trim()) {
    return
  }

  loadMoreClickCounter.value = 0
})

const { data: products } = await getProducts(formFetchOptions())
const allItemsCount = ref(products.value.totalItems)

const foundCount = ref(products.value.totalItems)
const foundItems = ref(products.value.member)

const deleteProductModalOpen = ref(false)

const formData = ref<Record<string, any>>()

const currentProductId = ref('')

const loadMoreButtonEnabled = computed(() => {
  return foundCount.value - ITEMS_PER_FETCH * (loadMoreClickCounter.value + 1) > 0
})

function handleDeleteButtonClick(id: string) {
  currentProductId.value = id
  deleteProductModalOpen.value = true
}

const { execute: handleDeleteProduct, pending: productDeletePending } = waitAnd(
  (id: string) => deleteProduct(id),
  async (response, id) => {
    if (response.error.value) {
      return
    }

    toastSuccess(t('productDeleteSuccess'))

    products.value.member.splice(
      products.value.member.findIndex((product) => product.id === id),
      1
    )

    if (products.value.totalItems) {
      products.value.totalItems -= 1
    }
  }
)

function formFetchOptions(): YimaFetchOptions {
  const parameters: Record<string, any> = {}

  if (queriedName.value && queriedName.value.trim().length > 0) {
    parameters.q = queriedName.value.trim()
  }

  parameters.page = loadMoreClickCounter.value + 1

  return { params: parameters }
}

const { execute: handleSearchByName } = waitAnd(
  (request: Record<string, any>) => {
    queriedName.value = request.searchText
    loadMoreClickCounter.value = 0

    const fetchOptions = formFetchOptions()

    return getProducts(fetchOptions)
  },
  (searchResponse) => {
    if (!searchResponse || searchResponse.error.value || !searchResponse.data.value) {
      return
    }

    foundCount.value = searchResponse.data.value.totalItems
    foundItems.value = searchResponse.data.value.member
  }
)

async function handleLoadMore() {
  loadMoreClickCounter.value += 1

  const { data } = await getProducts(formFetchOptions())

  if (!data.value?.member) {
    return
  }

  foundItems.value.push(...data.value.member)
}
</script>
