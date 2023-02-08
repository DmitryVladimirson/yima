<template>
  <div class="container flex flex-col items-center gap-6">
    <div v-if="orderState.products.length > 0" class="grid w-full max-w-4xl grid-flow-row">
      <div class="hidden grid-flow-row grid-cols-1 gap-3 py-3 px-4 sm:grid sm:grid-cols-12 md:gap-4">
        <div class="col-span-6 flex items-center gap-3 md:col-span-5" />
        <div class="col-span-3 flex items-center justify-center text-center md:col-span-2">
          {{ $t('count') }}
        </div>
        <div class="col-span-2 hidden items-center justify-end md:flex">
          {{ $t('priceForOne') }}
        </div>
        <div class="col-span-2 flex items-center justify-end">
          {{ $t('totalPriceProduct') }}
        </div>
        <div></div>
      </div>
      <TheBaseCard class="divide-y py-0">
        <article
          v-for="item in orderState.products"
          :key="item.id"
          class="relative grid grid-flow-row grid-cols-2 justify-center gap-4 py-4 sm:grid-cols-12"
        >
          <div class="col-span-full flex items-center justify-center sm:col-span-1">
            <img :src="item.imgUrl" :alt="item.name" class="w-28 shrink-0 rounded" width="60" height="60" />
          </div>
          <div
            class="col-span-full flex items-center justify-center gap-6 sm:col-span-5 sm:justify-start md:col-span-4"
          >
            <span class="font-semibold leading-tight">
              {{ item.name }}
            </span>
          </div>

          <div class="flex items-center justify-start sm:col-span-3 md:col-span-2 md:justify-end">
            <QuantityBox
              :value="item.quantity"
              :min="item.minAmountToPurchase"
              @changed="changeProductOrderQuantity(item.id, $event)"
            />
          </div>

          <div class="flex flex items-center justify-end sm:col-span-2 sm:hidden md:flex">
            <ThePrice :value="item.price" />
          </div>

          <div class="col-span-full flex items-center justify-end font-bold sm:col-span-2">
            <ThePrice :value="item.price * item.quantity" />
          </div>
          <div class="col-span-full flex items-center sm:col-span-1">
            <TheButton
              class="hover:bg-primary absolute right-0 top-4 ml-auto flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-gray-300 text-white disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-cyan-400 sm:static md:ml-4"
              @click="removeProductFromOrder(item.id)"
            >
              <TrashIcon class="h-auto w-4" />
            </TheButton>
          </div>
        </article>
      </TheBaseCard>
      <div class="ml-auto mt-10 flex flex-col gap-4">
        <div>
          <TheH :level="3" class="inline font-medium">{{ $t('totalPrice') }}: </TheH>
          <ThePrice class="text-xl font-bold leading-tight" :value="orderState.total" />
        </div>
        <TheLink to="/order/contact" class="btn btn-primary"
          >{{ $t('fillInContactData') }} <ChevronIcon class="text-lg"
        /></TheLink>
      </div>
    </div>
    <TheMessageBox v-else :message="$t('yourCartIsEmpty')" />
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useYimaProduct } from '#imports'
import TrashIcon from '~icons/mdi/delete'
import ChevronIcon from '~icons/mdi/chevron-right'

const {
  $order: { state: orderState },
} = useNuxtApp()

const { removeProductFromOrder, changeProductOrderQuantity } = useYimaProduct()
</script>
