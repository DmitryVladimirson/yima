<template>
  <div class="container">
    <FormKit
      v-slot="{ state: { valid: formValid } }"
      v-model="formData"
      type="form"
      form-class="flex mx-auto lg:w-4/5 xl:w-2/3 gap-10 xl:gap-20 "
      :actions="false"
      @submit="handleSubmit"
    >
      <div class="flex w-2/3 grow flex-col gap-8">
        <div class="flex flex-col gap-2">
          <TheH :level="2">{{ $t('email') }}</TheH>
          <FormKit type="email" name="email" validation="required|email" />
        </div>

        <div class="flex flex-col gap-2">
          <TheH :level="2">{{ $t('contactInfo') }}</TheH>
          <TheBaseCard class="grid gap-4 p-4 sm:grid-cols-2">
            <FormKit type="text" name="firstName" validation="required" :label="$t('firstName')" />
            <FormKit type="text" name="lastName" validation="required" :label="$t('lastName')" />
            <FormKit
              value="+380"
              type="text"
              name="phoneNumber"
              validation="required|matches:/^\+?380\d+$/|length:4,30"
              outer-class="col-span-full"
              :label="$t('phoneNumber')"
            />
          </TheBaseCard>
        </div>

        <FormKit
          type="select"
          :value="currentShippingOption.label"
          name="shippingMethod"
          validation="required"
          :label="$t('shippingMethod')"
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

        <LazyOrderAddressBlock
          v-if="formData.shippingMethod !== shippingOptions[0].label"
          :key="currentShippingOption.label"
          v-model="selectedShippingAddress"
          :shipping-option="currentShippingOption"
        />

        <FormKit type="checkbox" name="commentEnabled" outer-class="w-fit" :label="$t('addComment')" />

        <TheBaseCard v-show="formData.commentEnabled" class="p-4">
          <FormKit type="textarea" name="comment" :placeholder="$t('enterComment')" />
        </TheBaseCard>

        <TheButton class="btn btn-primary md:hidden" type="submit" :disabled="!formValid">
          {{ $t('submit') }}
        </TheButton>
      </div>
      <div class="hidden w-1/3 md:block">
        <div class="sticky top-4 flex flex-col gap-2">
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
            <TheH class="inline" :level="4">{{ $t('totalPrice') }}: </TheH>
            <ThePrice class="ml-auto inline-block text-lg font-bold" :value="orderState.total" />
          </div>
          <div
            class="ml-auto mt-4"
            :class="{
              'tooltip tooltip-bottom': !formValid || !selectedShippingAddress,
            }"
            :data-tip="$t('provideData')"
          >
            <TheButton class="btn btn-primary" type="submit" :disabled="!formValid || !selectedShippingAddress">
              {{ $t('submit') }}
            </TheButton>
          </div>
        </div>
      </div>
    </FormKit>
  </div>
</template>
<script setup lang="ts">
import { useNuxtApp, navigateTo, useLocalePath, ref, useYimaHttp } from '#imports'

const {
  $order: { state: orderState, setShippingAddress, completeOrder, removeOrder },
} = useNuxtApp()
const localePath = useLocalePath()
const { waitAnd } = useYimaHttp()

const formData = ref<Record<string, any>>({})

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

const selectedShippingAddress = ref('')

if (orderState.value.shippingAddress) {
  formData.value = {
    email: orderState.value.shippingAddress.email,
    firstName: orderState.value.shippingAddress.firstName,
    lastName: orderState.value.shippingAddress.lastName,
    phoneNumber: orderState.value.shippingAddress.phoneNumber,
    shippingMethod: orderState.value.shippingAddress.shippingMethod,
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

const { execute: handleSubmit } = waitAnd(
  (data: Record<string, any>) => {
    const payload: ShippingAddress = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      address: selectedShippingAddress.value,
      shippingMethod: data.shippingMethod,
      ...(data.commentEnabled ? { comment: data.comment } : {}),
    }

    setShippingAddress(payload)

    return completeOrder()
  },
  async (response) => {
    if (response.error.value) {
      return
    }

    await navigateTo(localePath('/order/complete'))

    removeOrder()
  }
)
watch(
  currentShippingOption,
  () => {
    selectedShippingAddress.value = ''
  },
  { deep: true }
)
</script>
