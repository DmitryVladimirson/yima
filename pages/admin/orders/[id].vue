<template>
  <div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <TheH :level="1">{{ $t('order') }}</TheH>
          <div class="flex flex-wrap items-center gap-4">
            <span>ID: {{ order.id }} </span>
            <span>{{ $t('createdAt') }}: {{ resolveDate }}</span>
          </div>
        </div>

        <TheButton
          :disabled="buttonsDisabled"
          class="btn btn-primary relative"
          :loading="exportOrdersPending"
          @click="handleExportOrder"
        >
          <DownloadIcon class="text-lg" />
        </TheButton>
      </div>
      <div class="flex flex-col gap-6">
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
                    <th class="bg-neutral text-neutral-content">{{ $t('price') }}</th>
                    <th class="bg-neutral text-neutral-content"></th>
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
                      <QuantityBox
                        v-model="product.quantity"
                        :disabled="buttonsDisabled"
                        class="relative z-10 w-fit"
                        @changed="handleSetOrderItemQuantity(product.id, $event)"
                      />
                    </td>
                    <td class="group-hover:bg-base-200">
                      <ThePrice :value="product.price" />
                    </td>
                    <td class="relative z-10 group-hover:bg-base-200">
                      <TheButton
                        class="btn btn-error relative w-fit text-white"
                        :loading="handleDeleteProductPending"
                        @click="handleDeleteProduct(product.id)"
                      >
                        <DeleteIcon class="text-lg" />
                      </TheButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="text-right">
            <TheH :level="3">{{ $t('totalPrice') }}: <ThePrice :value="resolveOrderTotal" /></TheH>
          </div>
        </div>
        <FormKit
          v-model="formData"
          type="form"
          :actions="false"
          form-class="flex flex-col gap-6"
          @submit="handleSaveOrder"
        >
          <div class="flex grow flex-col gap-3">
            <TheH :level="2"> {{ $t('paymentInfo' )}}</TheH>

            <FormKit type="text" :label="$t('paymentMethod')" name="paymentMethod" />
          </div>

          <div class="flex grow flex-col gap-3">
            <TheH :level="2">{{ $t('shipping') }}</TheH>

            <FormKit type="text" :label="$t('shippingMethod')" name="shippingMethod" />
            <FormKit type="text" validation="required" :label="$t('address')" name="address" />
          </div>
          <div class="flex grow flex-col gap-3">
            <TheH :level="2">{{ $t('contactInfo') }}</TheH>

            <div class="flex grow flex-col gap-3">
              <FormKit type="text" :label="$t('firstName')" name="firstName" />
              <FormKit type="text" :label="$t('lastName')" name="lastName" />
              <FormKit type="text" :label="$t('email')" name="email" />
              <FormKit type="text" :label="$t('phoneNumber')" name="phoneNumber" />
              <FormKit type="text" :label="$t('comment')" name="comment" />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <TheButton
              type="submit"
              :loading="saveOrderPending"
              :disabled="buttonsDisabled"
              class="btn btn-primary relative"
            >
              {{ $t('save') }}
            </TheButton>
            <TheButton
              :disabled="buttonsDisabled"
              type="button"
              class="btn btn-error relative text-white"
              :loading="orderDeletePending"
              @click="handleDeleteButtonClick"
            >
              {{ $t('delete') }}
            </TheButton>
          </div>
        </FormKit>
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
import DeleteIcon from '~icons/mdi/trash'
import DownloadIcon from '~icons/mdi/download'

const { getOrder, deleteOrder, exportOrder, setOrderItemQuantity, setOrderShippingAddress, setOrderProducts } =
  useYimaAdminOrder()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { getDateStringFromUnix } = useYimaUtils()
const { t } = useI18n()
const route = useRoute()
const localPath = useLocalePath()

const deleteOrderModalOpen = ref(false)
const orderId = route.params.id as string
const formData = ref<Record<string, any>>({})

const { data: order } = await getOrder(orderId)

if (!order.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not found',
  })
}

formData.value = {
  ...order.value.shippingAddress,
}

const resolveDate = computed(() => {
  return getDateStringFromUnix(order.value.createdAt)
})

const resolveOrderTotal = computed(() => {
  let total = 0

  for (const product of order.value.products) {
    total += product.price * product.quantity
  }

  return total
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

const { execute: handleExportOrder, pending: exportOrdersPending } = waitAnd(() => exportOrder(orderId))

const { execute: handleSetOrderItemQuantity, pending: setOrderItemQuantityPending } = waitAnd(
  (productId: string, quantity: number) => setOrderItemQuantity(orderId, productId, quantity)
)

const { execute: handleSaveOrder, pending: saveOrderPending } = waitAnd((data: ShippingAddress) =>
  setOrderShippingAddress(orderId, data)
)

const buttonsDisabled = computed(() => setOrderItemQuantityPending.value || saveOrderPending.value)

const { execute: handleDeleteProduct, pending: handleDeleteProductPending } = waitAnd(
  (id: string) => {
    order.value.products = order.value.products.filter((product) => product.id !== id)

    return setOrderProducts(orderId, order.value.products)
  },
  async (response) => {
    if (response.error.value) {
      return
    }

    toastSuccess(t('productDeleteSuccess'))
  }
)
</script>
