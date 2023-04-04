<template>
  <section v-if="chosenProducts.length > 0" class="container flex flex-col gap-6">
    <TheH :level="2" class="text-center">
      {{ $t('productsOfTheWeek') }}
    </TheH>

    <ProductSlider :products="chosenProducts" />
  </section>
</template>

<script lang="ts" setup>
import { withDefaults } from 'vue'

interface Properties {
  chosenProducts: Product[]
}

withDefaults(defineProps<Properties>(), {
  chosenProducts: () => [],
})
</script>
