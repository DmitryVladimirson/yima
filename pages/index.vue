<template>
  <div class="container flex flex-col gap-6">
    <div class="flex items-center gap-6">
      <TheH>
        {{ $t('products') }}
      </TheH>
      <TheLink class="btn btn-primary relative" to="/order">
        {{ $t('cart') }}



        <span
          v-if="orderState.products.length > 0"
          class="bg-primary absolute top-0 right-0 flex h-7 w-7 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        >
          {{ orderState.products.length }}
        </span>
      </TheLink>
    </div>
    <ProductList :products="products" />
  </div>
</template>

<script setup lang="ts">
import { useYimaProduct, useNuxtApp } from '#imports'

const {
  $order: { state: orderState },
} = useNuxtApp()

const { getProducts } = useYimaProduct()

const { data: products } = await getProducts()

/**
 * SEO meta tags
 */
useHead({
  title: 'Homepage',
})
</script>

<style lang=""></style>
