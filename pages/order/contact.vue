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
      <div class="flex grow flex-col gap-8">
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
          name="shippingMethod"
          :options="shippingOptions"
          validation="required"
          :label="$t('shippingMethod')"
        />
        <div class="flex flex-col gap-2">
          <TheH :level="2">{{ $t('address') }}</TheH>
          <TheBaseCard class="p-4">
            <OrderAddressAutocomplete id="map" name="address" validation="reqired" :placeholder="$t('enterAddress')" />
          </TheBaseCard>
        </div>
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
              'tooltip tooltip-bottom': !formValid,
            }"
            :data-tip="$t('provideData')"
          >
            <TheButton class="btn btn-primary" type="submit" :disabled="!formValid">
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

const shippingOptions = [
  'Нова пошта доставка до відділення',
  "Нова пошта доставка кур'єром",
  'Делівері доставка до відділення',
  "Делівері доставка кур'єром",
  'Доставка за адресою в Ужгороді',
]

if (orderState.value.shippingAddress) {
  formData.value = { ...orderState.value.shippingAddress }
}

const { execute: handleSubmit } = waitAnd(
  (data: Record<string, any>) => {
    setShippingAddress(data as ShippingAddress)

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

onMounted(() => {
  useHead({
    script: [
      {
        src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAFVwbDomYWdvmJZ5ZPhSKwrLZKWsKySqE&libraries=places',
      },
    ],
  })
})
</script>
