<template>
  <div class="container flex flex-col items-center">
    <!-- Order form -->
    <FormKit
      v-slot="{ state: { valid: formValid } }"
      v-model="formData"
      type="form"
      form-class="w-full md:w-4/5 lg:w-3/4 max-w-xl"
      :actions="false"
      @submit="handleSubmit"
    >
      <!-- Shipping method dropdown input -->
      <div class="w-full mb-8">
        <TheH :level="2" class="pb-4">{{ $t('shippingMethod') }}</TheH>
        <FormKit
          type="select"
          v-model="formData.shippingMethod"
          name="shippingMethod"
          validation="required"
        >
          <option
            v-for="(option, index) in shippingOptions"
            :key="option.label"
            :disabled="index === 0"
            :value="option.label"
          >
            {{ option.label }}
          </option>
        </FormKit>
      </div>

      <!-- Delivery address block - displayed after shipping method is chosen -->
      <div class="w-full mb-8" v-if="formData.shippingMethod !== ''">
        <LazyOrderAddressBlock
          :key="formData.shippingMethod"
          v-model="formData.shippingAddress"
          :shipping-option="currentShippingOption!"
        />
      </div>

      <!-- Post-address selection fields -->
      <div class="w-full" v-if="formData.shippingAddress !== ''">
        <!-- Contact info fields -->
        <div class="w-full mb-8">
          <TheH :level="2">{{ $t('contactInfo') }}</TheH>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormKit type="text" name="firstName" validation="required" v-model="formData.firstName" :label="$t('firstName')" />
            <FormKit type="text" name="lastName" validation="required" v-model="formData.lastName" :label="$t('lastName')" />
            <FormKit type="text" name="phoneNumber" validation="required" v-model="formData.phoneNumber" :label="$t('phoneNumber')" />
          </div>
        </div>

        <!-- Payment method selection block -->
        <div class="w-full mb-8">
          <TheH :level="2">{{ $t('paymentInfo') }}</TheH>
          <FormKit
            type="select"
            name="paymentMethod"
            validation="required"
            v-model="formData.paymentMethod"
            :label="$t('paymentMethod')"
          >
            <option
              v-for="(option, index) in paymentOptions"
              :key="option"
              :disabled="index === 0"
              :value="option"
            >
              {{ option }}
            </option>
          </FormKit>
        </div>

        <!-- Placing comment on order block -->
        <div class="w-full mb-8">
          <TheH :level="2">{{ $t('addComment') }}</TheH>
          <FormKit type="checkbox" name="commentEnabled" v-model="formData.commentEnabled" :label="$t('addComment')" />
          <TheBaseCard v-show="formData.commentEnabled" class="p-4">
            <FormKit type="textarea" name="comment" v-model="formData.comment" :placeholder="$t('enterComment')" />
          </TheBaseCard>
        </div>
      </div>

      <!-- Submit button inside FormKit actions -->
      <div class="w-full mt-4">
        <TheButton class="btn btn-primary" type="submit" :disabled="!isFormComplete">
          {{ $t('submit') }}
        </TheButton>
      </div>
    </FormKit>

    <div class="hidden md:block md:w-1/3">
      <div class="sticky top-4 flex flex-col gap-8">
        <TheH :level="2">{{ $t('order') }}</TheH>
        <TheBaseCard class="flex flex-col divide-y px-4 py-2">
          <div v-for="product in orderState.products" :key="product.id" class="flex items-center gap-4 py-2">
            <div class="min-w-fit"><img width="60" height="60" :src="product.imgUrl" :alt="product.name" /></div>
            <div>
              <div class="line-clamp-1">{{ product.name }}</div>
              <div class="divide-x">
                <ThePrice :value="product.price" class="inline pr-2 text-sm font-semibold" />
                <span class="pl-1 text-xs">{{ product.quantity }} {{ $t('piece') }}</span>
              </div>
            </div>
          </div>
        </TheBaseCard>
        <div class="mt-2 items-center text-right">
          <TheH class="inline" :level="4">{{ $t('totalPrice') }}:</TheH>
          <ThePrice class="ml-auto inline-block text-lg font-bold" :value="orderState.total" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp, navigateTo, useLocalePath, ref, useYimaHttp, computed } from '#imports'

const {
  $order: { state: orderState, setShippingAddress, completeOrder, removeOrder },
} = useNuxtApp()
const localePath = useLocalePath()
const { waitAnd } = useYimaHttp()

const formData = ref<Record<string, any>>({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  shippingMethod: '',
  shippingAddress: '',
  paymentMethod: '',
  commentEnabled: false,
  comment: '',
})

const shippingOptions: { label: string; department: boolean; service: string }[] = [
  {
    label: 'Виберіть спосіб доставки',
    department: false,
    service: '',
  },
  {
    label: 'Нова пошта доставка на відділення',
    department: true,
    service: 'novaposhta',
  },
  {
    label: "Нова пошта доставка кур'єром",
    department: false,
    service: 'novaposhta',
  },
  {
    label: 'Делівері доставка на відділення',
    department: true,
    service: 'delivery',
  },
  {
    label: "Делівері доставка кур'єром",
    department: false,
    service: 'delivery',
  },
  {
    label: 'Доставка за адресою в Ужгороді',
    department: false,
    service: '',
  },
]

const paymentOptions = [
  'Виберіть метод оплати',
  'На карту',
  'Розрахунковий рахунок',
  'Накладений платіж (10% завдаток)',
]

const resetForm = () => {
  formData.value = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    shippingMethod: '',
    shippingAddress: '',
    paymentMethod: '',
    commentEnabled: false,
    comment: '',
  }
}

const currentShippingOption = computed(() => {
  if (!formData.value.shippingMethod && orderState.value?.shippingAddress) {
    return shippingOptions.find((option) => orderState.value.shippingAddress?.shippingMethod === option.label)
  }

  if (!formData.value.shippingMethod && !orderState.value?.shippingAddress) {
    return shippingOptions[0]
  }

  return shippingOptions.find((option) => formData.value.shippingMethod === option.label)
})

const isFormComplete = computed(() => {
  return (
    formData.value.firstName &&
    formData.value.lastName &&
    formData.value.phoneNumber &&
    formData.value.shippingMethod &&
    formData.value.shippingAddress &&
    formData.value.paymentMethod
  )
})

const { execute: handleSubmit } = waitAnd(
  (data: Record<string, any>) => {
    const payload: ShippingAddress = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      address: formData.value.shippingAddress,
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      ...(data.commentEnabled ? { comment: data.comment } : {}),
    }

    setShippingAddress(payload)

    return completeOrder()
  },
  async (response) => {
    if (response.error.value) {
      return
    }

    // Reset form data and state
    resetForm()

    await navigateTo(localePath('/order/complete'))

    removeOrder()
  }
)
</script>

<style scoped>
.container {
  max-width: 100%;
  padding: 16px;
}
</style>
