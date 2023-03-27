<template>
  <ul
    v-if="products.length > 0"
    v-auto-animate
    class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
  >
    <li v-for="product in products" :key="product.id" class="">
      <ProductCard :class="{ 'h-full': products.length > 1 }" :product="product" />
    </li>
  </ul>
  <TheMessageBox v-else :message="$t('noProductsFound')"></TheMessageBox>
</template>
<script setup lang="ts">
import { withDefaults } from 'vue'

interface popperProperties {
  products: Product[]
}

withDefaults(defineProps<popperProperties>(), {
  products: () => [],
})
</script>
