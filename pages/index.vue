<template>
  <div class="container flex flex-col gap-6">
    <div class="flex items-center gap-6">
      <TheH>
        {{ $t('products') }}
      </TheH>
    </div>
    <div class="flex items-center justify-between gap-4">
      <TheButton class="btn btn-primary flex h-10 items-center md:hidden" @click="showFilters = !showFilters">
        <FilterIcon class="text-lg" />
      </TheButton>
      <FormKit
        outer-class="ml-auto"
        :placeholder="$t('sort')"
        type="select"
        :options="[$t('newest'), $t('cheapestFirst'), $t('expensiveFirst'), $t('a-z'), $t('z-a')]"
      />
    </div>
    <div class="flex flex-col gap-10 md:flex-row xl:gap-20">
      <div class="hidden md:block md:w-1/3 lg:w-1/5 xl:w-1/6" :class="{ '!block': showFilters }">
        <ProductFilters class="sticky top-4" />
      </div>
      <ProductList :products="products" class="md:w-4/5 xl:w-5/6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useYimaProduct, ref } from '#imports'
import FilterIcon from '~icons/mdi/filter'

const { getProducts } = useYimaProduct()

const { data: products } = await getProducts()

const showFilters = ref(false)

/**
 * SEO meta tags
 */
useHead({
  title: 'Homepage',
})
</script>

<style lang=""></style>
