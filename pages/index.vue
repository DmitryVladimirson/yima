<template>
  <div class="container flex flex-col gap-6">
    <div class="flex items-center gap-6">
      <TheH>
        {{ $t('products') }}
      </TheH>
    </div>
    <template v-if="products.member.length > 0 || filters.length > 0">
      <div class="flex items-center justify-between gap-4">
        <TheButton class="btn btn-primary flex h-10 items-center md:hidden" @click="showFilters = !showFilters">
          <FilterIcon class="text-lg" />
        </TheButton>
        <div class="ml-auto flex gap-2">
          <FormKit v-model="currentSort" input-class="!border-0 shadow" type="select" :options="sortOptions" />
          <FormKit v-model="itemsPerPage" input-class="!border-0 shadow" type="select" :options="itemsPerPageOptions" />
        </div>
      </div>
      <div class="flex flex-col gap-10 md:flex-row xl:gap-20">
        <div class="hidden w-full md:block md:w-1/3 lg:w-1/5 xl:w-1/6" :class="{ '!block': showFilters }">
          <ProductFilters :filters="filters" class="sticky top-4" @filters-changed="handleChangeFilters" />
        </div>
        <div class="flex h-full flex-col items-center gap-4 md:w-4/5 md:items-end xl:w-5/6">
          <ProductList :products="products.member" />
          <ThePagination
            v-model="currentPage"
            :total-items="products.totalItems"
            :items-per-page="itemsPerPage"
            @pagination-change="updateProducts"
          />
        </div>
      </div>
    </template>
    <TheMessageBox v-else :message="$t('noProductsFound')"></TheMessageBox>
  </div>
</template>

<script setup lang="ts">
import { useYimaProduct, ref, useI18n, useRoute, navigateTo, watch, useThrottleFn } from '#imports'
import FilterIcon from '~icons/mdi/filter'

const { getProducts, getProductFilters } = useYimaProduct()
const { t } = useI18n()
const route = useRoute()

const showFilters = ref(false)

const sortOptions = computed(() => [
  { label: t('newest'), value: 'createdAt:desc' },
  { label: t('cheapestFirst'), value: 'price:asc' },
  { label: t('expensiveFirst'), value: 'price:desc' },
  { label: t('a-z'), value: 'name:asc' },
  { label: t('z-a'), value: 'name:desc' },
])

const itemsPerPageOptions = ref([
  { label: '20', value: 20 },
  { label: '50', value: 30 },
  { label: '100', value: 50 },
])

const itemsPerPageOptionDefault = 20

const currentSort = ref(route.query.sort_by ?? '')
const currentPage = ref(Number(route.query.page) || 1)
const itemsPerPage = ref(Number(route.query.itemsPerPage) || itemsPerPageOptionDefault)
const filterString = ref(route.query.filter_by ?? '')

const [{ data: products }, { data: filters }] = await Promise.all([
  getProducts({
    params: {
      sort_by: currentSort.value,
      filter_by: filterString.value,
      page: currentPage.value,
      per_page: itemsPerPage.value,
    },
  }),
  getProductFilters(),
])

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
    params: {
      sort_by: currentSort.value || undefined,
      filter_by: filterString.value,
      page: currentPage.value,
      per_page: itemsPerPage.value,
    },
  })
  if (error.value || !productsResponse.value) {
    return
  }

  products.value = productsResponse.value

  await navigateTo({
    query: {
      ...route.query,
      ...(currentSort.value === sortOptions.value[0].value
        ? { sort_by: undefined }
        : { sort_by: currentSort.value || undefined }),
      ...(filterString.value ? { filter_by: filterString.value } : { filter_by: undefined }),
      ...(itemsPerPage.value === itemsPerPageOptionDefault
        ? { itemsPerPage: undefined }
        : { itemsPerPage: itemsPerPage.value }),
    },
  })
}, 50)

watch([currentSort], async () => {
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
