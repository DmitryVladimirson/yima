<template>
  <div v-if="products.length > 0" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
    <ProductCard v-for="product in products" :key="product.id" :product="product" />
  </div>
</template>
<script setup lang="ts">
import { withDefaults } from 'vue'

interface popperProperties {
  products: Record<string, any>[]

}

withDefaults(defineProps<popperProperties>(), {
  products: () => []
})
</script>
