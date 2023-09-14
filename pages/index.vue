<template>
  <div class="flex flex-col gap-10 lg:gap-20">
    <TheButton class="btn" @click="exportProducts">Export products</TheButton>
    <section>
      <div class="container">
        <div class="flex items-center justify-around rounded-xl bg-white p-8">
          <DeliveryIcon style="color: black" class="max-lg:hidden" width="100" height="100" />
          <div class="m-0 flex w-fit flex-col">
            <h2 class="mb-4 text-black">Запускаємо безкоштовну доставку по Ужгороду!</h2>
            <p class="text-black">
              Просто замовляй, а ми доставимо <span class="text-success">ШВИДКО</span> та
              <span class="text-success">БЕЗКОШТОВНО</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container flex flex-col gap-6">
        <div class="block md:hidden">
          <TheH>
            {{ $t('allProducts') }}
          </TheH>
        </div>
        <template v-if="products.member.length > 0 || filters.length > 0">
          <div class="flex items-center justify-between gap-4">
            <TheH class="hidden md:block">
              {{ $t('allProducts') }}
            </TheH>
            <TheButton class="btn btn-primary flex h-10 items-center md:hidden" @click="showFilters = !showFilters">
              <FilterIcon class="text-lg" />
            </TheButton>
            <div class="ml-auto flex gap-2">
              <FormKit v-model="currentSort" input-class="!border-0 shadow" type="select" :options="sortOptions" />
              <FormKit
                v-if="products.totalItems > itemsPerPageOptionDefault"
                v-model="itemsPerPage"
                input-class="!border-0 shadow"
                type="select"
                :options="itemsPerPageOptions"
              />
            </div>
          </div>
          <div class="flex flex-col gap-10 md:flex-row xl:gap-20">
            <div class="hidden w-full md:block md:w-1/3 lg:w-1/5 xl:w-1/6" :class="{ '!block': showFilters }">
              <ClientOnly>
                <div ref="productFiltersWrapper" class="h-full w-full">
                  <ProductFilters :filters="filters" class="sticky top-4" @filters-changed="handleChangeFilters" />
                </div>

                <template #fallback>
                  <PlaceholderFilters class="hidden sm:block" />
                </template>
              </ClientOnly>
            </div>
            <div class="flex h-full flex-col items-center gap-4 md:w-4/5 md:items-end xl:w-5/6">
              <ClientOnly>
                <ProductList :products="products.member" />
                <ThePagination
                  v-model="currentPage"
                  :total-items="products.totalItems"
                  :items-per-page="itemsPerPage"
                  @pagination-change="updateProducts"
                />
                <template #fallback>
                  <PlaceholderProductList />
                </template>
              </ClientOnly>
            </div>
          </div>
        </template>
        <TheMessageBox v-else :message="$t('noProductsFound')"></TheMessageBox>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useYimaProduct, ref, useI18n, useRoute, navigateTo, watch, useThrottleFn, useYimaAdminProduct } from '#imports'
import DeliveryIcon from '~icons/mdi/truck-delivery-outline'
import FilterIcon from '~icons/mdi/menu'

const { exportProducts } = useYimaAdminProduct()
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
  { label: '30', value: 30 },
  { label: '50', value: 50 },
])

const itemsPerPageOptionDefault = 20
const productFiltersWrapper = ref()
const currentSort = ref(route.query.sort_by ?? '')
const currentPage = ref(Number(route.query.page) || 1)
const itemsPerPage = ref(Number(route.query.itemsPerPage) || itemsPerPageOptionDefault)
const filterString = ref(route.query.filter_by ?? '')

const [{ data: products }, { data: filters }] = await Promise.all([
  getProducts({
    params: {
      sort_by: currentSort.value || undefined,
      page: currentPage.value,
      per_page: itemsPerPage.value,
    },
  }),
  getProductFilters(),
  // GetProducts({
  //   params: {
  //     filter_by: 'categories:[chosen-products]',
  //   },
  // }),
  // getProducts({
  //   params: {
  //     filter_by: 'categories:[sale]',
  //   },
  // }),
])

function handleChangeFilters(resultString: string) {
  filterString.value = resultString

  setTimeout(async () => {
    if (filterString.value === resultString) {
      currentPage.value = 1
      await updateProducts(true)
    }
  }, 50)
}

const updateProducts = useThrottleFn(async (resetPage?: boolean) => {
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
      ...(resetPage === true ? { page: undefined } : {}),
    },
  })
}, 50)

watch([currentSort], async () => {
  await updateProducts()
})

watch(productFiltersWrapper, () => {
  if (!productFiltersWrapper?.value) {
    return
  }

  const productFilters = productFiltersWrapper.value.querySelector('div')
  const filtersHeight = productFilters.clientHeight
  const targetHeight = window.innerHeight - 25
  const categoriesList = productFilters.querySelector('#categories')
  const categoriesListHeight = categoriesList.clientHeight
  if (filtersHeight < targetHeight) {
    return
  }

  const endHeight = Math.max(categoriesListHeight - (filtersHeight - targetHeight), 200)
  categoriesList.style.height = `${endHeight}px`
  categoriesList.classList.add('overflow-auto', 'pr-2')
})
</script>

<style lang=""></style>
