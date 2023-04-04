<template>
  <section v-if="saleProducts.length > 0" class="sales-slider container flex flex-col gap-6">
    <TheH :level="2" class="text-center">
      {{ $t('sale') }}
    </TheH>

    <ProductSlider :products="saleProducts" />
  </section>
</template>

<script lang="ts" setup>
import { withDefaults } from 'vue'

interface Properties {
  saleProducts: Product[]
}

withDefaults(defineProps<Properties>(), {
  saleProducts: () => [],
})
</script>

<style>
.sales-slider .old-price {
  @apply text-red-700;
}
</style>
