<template>
  <div class="container flex flex-col items-center gap-6">
    <div v-if="orderState.products.length > 0" class="grid w-full max-w-4xl grid-flow-row">
      <div class="hidden grid-flow-row grid-cols-1 gap-3 border-b py-3 md:grid md:grid-cols-6 md:gap-0">
        <div class="col-span-2 flex items-center gap-3" />
        <div class="flex items-center justify-start pr-11 md:justify-end">
          {{ $t('count') }}
        </div>
        <div class="flex items-center justify-end">
          {{ $t('priceForOne') }}
        </div>
        <div class="flex items-center justify-end">
          {{ $t('totalPriceProduct') }}
        </div>
        <div></div>
      </div>
      <article
        v-for="item in orderState.products"
        :key="item.id"
        class="grid grid-flow-row grid-cols-2 gap-3 border-b py-3 md:grid-cols-6 md:gap-2"
      >
        <div class="col-span-2 flex items-center gap-6">
          <img :src="item.imgUrl" :alt="item.name" class="shrink-0 rounded" width="60" height="60" />

          <span class="flex flex-col gap-1">
            <span class="hover:text-primary font-semibold leading-tight">
              {{ item.name }}
            </span>
          </span>
        </div>

        <div class="flex items-center justify-start md:justify-end">
          <QuantityBox :value="item.quantity" @changed="changeProductOrderQuantity(item.id, $event)" />
        </div>

        <div class="hidden items-center justify-end md:flex">
          <ThePrice :value="item.price" />
        </div>

        <div class="flex items-center justify-end font-bold">
          <ThePrice :value="item.price * item.quantity" />
        </div>
        <div class="col-span-full flex items-center md:col-span-1">
          <TheButton
            class="hover:bg-primary relative ml-auto flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-gray-300 text-white disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-cyan-400 md:ml-4"
            @click="removeProductFromOrder(item.id)"
          >
            <TrashIcon class="h-auto w-4" />
          </TheButton>
        </div>
      </article>
    </div>
    <TheMessageBox v-else :message="$t('yourCartIsEmpty')" />
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useYimaProduct } from '#imports'
import TrashIcon from '~icons/mdi/delete'

const {
  $order: { state: orderState },
} = useNuxtApp()

const { removeProductFromOrder, changeProductOrderQuantity } = useYimaProduct()
</script>
