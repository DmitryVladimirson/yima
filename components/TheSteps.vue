<template>
  <div class="container mx-auto w-full">
    <div class="mx-0 py-4 sm:px-16 md:px-24 md:pt-8 md:pb-10 lg:px-8">
      <div class="flex items-center justify-between">
        <template v-for="item in basketSteps.steps" :key="item.route">
          <TheLink
            v-if="
              (item.step <= basketCurrentStep || item.state === 'cart') &&
              basketCurrentStep !== basketSteps.steps.length
            "
            :to="`/${item.route}`"
            class="relative flex items-center"
          >
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full border-2 py-3 transition duration-300 ease-in-out"
              :class="{
                'border-primary bg-primary': item.step === basketCurrentStep,
                'border-primary': item.step < basketCurrentStep,
              }"
            >
              <component
                :is="basketIcons[item.step - 1]"
                class="h-auto w-6"
                :class="{
                  'text-white': item.step === basketCurrentStep,
                  'text-primary': item.step < basketCurrentStep,
                }"
              />
            </div>
            <div
              class="absolute top-0 left-1/2 mt-14 hidden w-48 -translate-x-1/2 text-center text-sm sm:block lg:mt-16 lg:text-base"
              :class="{
                'text-primary font-semibold': item.step === basketCurrentStep,
                'text-primary': item.step < basketCurrentStep,
              }"
            >
              {{ $t(item.title) }}
            </div>
          </TheLink>

          <span v-else class="relative flex items-center">
            <span
              class="flex h-12 w-12 items-center justify-center rounded-full border-2 py-3 transition duration-300 ease-in-out"
              :class="{
                'border-primary bg-primary': item.step === basketCurrentStep,
                'border-primary': item.step < basketCurrentStep,
              }"
            >
              <component
                :is="basketIcons[item.step - 1]"
                class="h-auto w-6"
                :class="{
                  'text-white': item.step === basketCurrentStep,
                  'text-primary': item.step < basketCurrentStep,
                }"
              />
            </span>
            <span
              class="absolute top-0 left-1/2 mt-14 hidden w-48 -translate-x-1/2 text-center text-sm sm:block lg:mt-16 lg:text-base"
              :class="{
                'text-primary font-semibold': item.step === basketCurrentStep,
                'text-primary': item.step < basketCurrentStep,
              }"
            >
              {{ $t(item.title) }}
            </span>
          </span>

          <div
            v-if="item.step < basketSteps.steps.length"
            class="flex-auto border-t-2 transition duration-300 ease-in-out"
            :class="{
              'border-primary': basketCurrentStep > item.step,
              'border-gray-300': basketCurrentStep < item.step,
            }"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, useRoute } from '#imports'
import UserIcon from '~icons/mdi/account-edit'
import CheckIcon from '~icons/mdi/cart-check'
import ShoppingCartIcon from '~icons/mdi/cart-outline'

const route = useRoute()

const basketIcons = [ShoppingCartIcon, UserIcon, CheckIcon]
const basketSteps = {
  steps: [
    {
      step: 1,
      route: 'order',
      title: 'cartProducts',
      state: 'cart',
    },
    {
      step: 2,
      route: 'order/contact',
      title: 'contactInfo',
      state: 'cart',
    },
    {
      step: 3,
      route: 'order/complete',
      title: 'orderCompleted',
    },
  ],
}

const basketCurrentStep = computed(() => {
  const routeName = route.name.toString()

  if (routeName.startsWith('order_')) {
    return 1
  }

  if (routeName.startsWith('order-contact_')) {
    return 2
  }

  if (routeName.startsWith('order-complete_')) {
    return 3
  }

  return 1
})
</script>
