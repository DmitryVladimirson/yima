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
    <div class="flex flex-col items-start gap-10 md:flex-row xl:gap-20">
      <div class="hidden w-full md:block md:w-1/3 lg:w-1/5 xl:w-1/6" :class="{ '!block': showFilters }">
        <ProductFilters :filters="filters" class="sticky top-4" @filters-changed="handleChangeFilters" />
      </div>
      <ProductList :products="products" class="md:w-4/5 xl:w-5/6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useYimaProduct, ref, useI18n, useRoute, navigateTo, watch, useThrottleFn } from '#imports'
import FilterIcon from '~icons/mdi/filter'

const { getProducts, getProductFilters } = useYimaProduct()
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

const currentSort = ref(route.query.sort_by ?? '')
const filterString = ref(route.query.filter_by ?? '')

const [{ data: productsResponse }, { data: filters }] = await Promise.all([
  getProducts({ params: { sort_by: currentSort.value, filter_by: filterString.value } }),
  getProductFilters(),
])
products.value = productsResponse.value?.member ?? []

function handleChangeFilters(resultString: string) {
  filterString.value = resultString

  setTimeout(async () => {
    if (filterString.value === resultString) {
      await updateProducts()
    }
  }, 50)
}

const updateProducts = useThrottleFn(async () => {
  const { data: productsResponse, error } = await getProducts({
    params: { sort_by: currentSort.value, filter_by: filterString.value },
  })
  if (error.value || !productsResponse.value) {
    return
  }

  products.value = productsResponse.value.member

  await navigateTo({
    query: {
      ...(currentSort.value ? { sort_by: currentSort.value } : {}),
      ...(filterString.value ? { filter_by: filterString.value } : {}),
    },
  })
}, 50)

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
