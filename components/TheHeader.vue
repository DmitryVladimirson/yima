<template>
  <div class="navbar bg-base-100 container flex-col gap-4 px-4 sm:flex-row">
    <TheLink to="/" class="flex-grow text-xl font-bold normal-case">EuroPrice</TheLink>
    <div class="flex-none gap-2">
      <FormKit type="text" :placeholder="$t('searchProducts')" />
      <div class="dropdown dropdown-end dropdown-hover">
        <TheLink to="/order" class="btn btn-ghost btn-circle">
          <span class="indicator">
            <CartIcon class="text-xl" />
            <span
              v-if="orderState.products.length > 0"
              class="indicator-item bg-primary flex h-6 w-6 items-center justify-center rounded-full text-white"
            >
              {{ orderState.products.length }}
            </span>
          </span>
        </TheLink>
        <div tabindex="0" class="card card-compact dropdown-content bg-base-100 w-96 shadow">
          <div class="card-body max-sm:hidden">
            <div v-for="product in orderState.products" :key="product.id" class="flex items-center justify-between">
              <img class="shrink-0 rounded" width="50" height="50" :src="product.imgUrl" :alt="product.name" />
              <span class="w-24 text-base">{{ product.name }}</span>
              <span class="w-28 text-base font-bold"><ThePrice :value="product.price" /></span>
              <TheButton
                class="hover:bg-primary relative m-0 flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-gray-300 text-white disabled:cursor-not-allowed disabled:opacity-50 md:ml-4"
                @click="removeProductFromOrder(product.id)"
              >
                <TrashIcon class="h-auto w-4" />
              </TheButton>
            </div>
            <span class="text-info">{{ $t('totalPriceProduct') }}: 999 грн</span>
            <div class="card-actions">
              <TheLink to="/order" class="btn btn-primary btn-block">{{ $t('viewCart') }}</TheLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useYimaProduct } from '#imports'
import CartIcon from '~icons/mdi/cart-outline'
import TrashIcon from '~icons/mdi/delete'

const {
  $order: { state: orderState },
} = useNuxtApp()

const { removeProductFromOrder } = useYimaProduct()
</script>
