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
      <FormKit v-model="currentSort" outer-class="ml-auto" type="select" :options="sortOptions" />
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
import { useYimaProduct, ref, useI18n, useRoute, navigateTo, watch } from '#imports'
import FilterIcon from '~icons/mdi/filter'

const { getProducts } = useYimaProduct()
const { t } = useI18n()
const route = useRoute()

const showFilters = ref(false)
const products = ref<Product[]>([])

const sortOptions = computed(() => [
  { label: t('newest'), value: 'createdAt:desc' },
  { label: t('cheapestFirst'), value: 'price:asc' },
  { label: t('expensiveFirst'), value: 'price:desc' },
  { label: t('a-z'), value: 'name:asc' },
  { label: t('z-a'), value: 'name:desc' },
])

const currentSort = ref(route.query.sort_by ?? sortOptions.value[0].value)

const { data: productsResponse } = await getProducts({ params: { sort_by: currentSort.value } })

products.value = productsResponse.value?.member ?? []

async function updateProducts() {
  const { data: productsResponse, error } = await getProducts({ params: { sort_by: currentSort.value } })
  if (error.value || !productsResponse.value) {
    return
  }

  products.value = productsResponse.value.member

  await navigateTo({ query: { ...route.query, sort_by: currentSort.value } })
}

watch(currentSort, async () => {
  await updateProducts()
})

/**
 * SEO meta tags
 */
useHead({
  title: 'Homepage',
})
</script>

<style lang=""></style>
