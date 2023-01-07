<template>
  <div class="container flex flex-col gap-6">
    <div class="flex items-center gap-6">
      <TheH>
        {{ $t('products') }}
      </TheH>
    </div>
    <ProductList :products="products" />
  </div>
</template>

<script setup lang="ts">
import { useYimaProduct } from '#imports'

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
