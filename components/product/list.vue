<template>
  <div v-if="products.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
    <ProductCard v-for="product in products" :key="product.id" :product="product" />
  </div>
</template>
<script setup lang="ts">
import { withDefaults } from 'vue'

interface popperProperties {
  products: Record<string, any>[]
}

withDefaults(defineProps<popperProperties>(), {
  products: () => [],
})
</script>
