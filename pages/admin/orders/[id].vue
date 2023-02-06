<template>
  <div>
    <div class="flex flex-col gap-4">
      <TheH :level="1">{{ $t('order') }}</TheH>
      <div class="flex flex-wrap items-center gap-4">
        <span>ID: {{ order.id }} </span>
        <span>{{ $t('createdAt') }}: {{ resolveDate }}</span>
      </div>
      <div class="flex flex-col gap-6 xl:flex-row">
        <div class="flex grow flex-col gap-3">
          <TheH :level="2">{{ $t('products') }}</TheH>
          <div class="flex flex-col items-center gap-4">
            <div class="w-full overflow-x-auto">
              <table class="table w-full">
                <thead>
                  <tr>
                    <th class="bg-neutral text-neutral-content">{{ $t('image') }}</th>
                    <th class="bg-neutral text-neutral-content">{{ $t('name') }}</th>
                    <th class="bg-neutral text-neutral-content">{{ $t('amount') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in order.products" :key="product.id" class="group relative">
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
                      {{ product.quantity }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="flex grow flex-col gap-3">
          <TheH :level="2">{{ $t('contactInfo') }}</TheH>

          <div v-for="(item, key) in order.shippingAddress" :key="key">
            {{ $t(key) }}:
            {{ item }}
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <TheButton
          type="button"
          class="btn btn-error relative text-white"
          :loading="orderDeletePending"
          @click="handleDeleteButtonClick"
        >
          {{ $t('delete') }}
        </TheButton>
      </div>
    </div>

    <TheModal v-slot="{ closeModal }" v-model="deleteOrderModalOpen">
      <div class="flex flex-col items-center gap-6">
        <TheH :level="1" class="text-center">{{ $t('confirmDeleteOrder') }}</TheH>
        <div class="flex items-center gap-2">
          <TheButton class="btn btn-primary" @click=";[handleDeleteOrder(), closeModal()]">
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
  useYimaAdminOrder,
  useYimaHttp,
  useYimaToast,
  useYimaUtils,
} from '#imports'

const { getOrder, deleteOrder } = useYimaAdminOrder()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { getDateStringFromUnix } = useYimaUtils()
const { t } = useI18n()
const route = useRoute()
const localPath = useLocalePath()

const deleteOrderModalOpen = ref(false)
const orderId = route.params.id as string

const { data: order } = await getOrder(orderId)

if (!order.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not found',
  })
}

const resolveDate = computed(() => {
  return getDateStringFromUnix(order.value.createdAt)
})

function handleDeleteButtonClick() {
  deleteOrderModalOpen.value = true
}

const { execute: handleDeleteOrder, pending: orderDeletePending } = waitAnd(
  () => deleteOrder(orderId),
  async (response) => {
    if (response.error.value) {
      return
    }

    toastSuccess(t('orderDeleteSuccess'))

    await navigateTo(localPath('/admin/orders'))
  }
)
</script>
