<template>
  <div class="navbar container min-h-min flex-col gap-4 bg-slate-100 px-4 dark:bg-gray-800 sm:flex-row">
    <TheLink to="/" class="flex-grow text-xl font-bold normal-case">
      Euro
      <span class="text-amber-400 dark:text-cyan-400">PRICE.</span>
    </TheLink>
    <div class="flex-none gap-2">
      <div ref="searchFormReference" class="form-control">
        <FormKit
          v-model="formData"
          type="form"
          form-class="input-group"
          :actions="false"
          @submit="handleSearch"
          @input="handleSearch"
        >
          <div class="relative">
            <FormKit
              type="text"
              name="searchText"
              :placeholder="$t('searchProducts')"
              :classes="{
                input:
                  'appearance-none border-none focus:ring-0 focus:outline-none rounded-br-none rounded-tr-none shadow-sm',
              }"
              :input-class="{ 'rounded-b-none': showHits }"
            />
            <TheBaseCard v-if="showHits" class="absolute top-full w-full rounded-tr-none rounded-tl-none p-0">
              <div v-if="searchHasHits" class="scroller max-h-[200px] w-full overflow-auto">
                <TheLink
                  v-for="product in searchHits"
                  :key="product.id"
                  :to="`/${product.slug}`"
                  class="hover:bg-base-200 flex items-center gap-2 p-3 sm:gap-4"
                  @click="closeHits"
                >
                  <div class="flex h-10 w-10 min-w-fit items-center justify-center">
                    <img :src="product.imgUrl" :alt="product.name" width="40" height="40" />
                  </div>
                  <div class="truncate text-sm font-medium">{{ product.name }}</div>
                </TheLink>
              </div>
              <div v-else class="p-4">{{ $t('noHits') }}</div>
            </TheBaseCard>
          </div>

          <TheButton type="submit" class="btn btn-square relative shadow">
            <SearchIcon class="text-xl"></SearchIcon>
          </TheButton>
        </FormKit>
      </div>
      <div class="dropdown dropdown-end dropdown-hover">
        <TheLink to="/order" class="btn btn-ghost btn-circle">
          <span class="indicator">
            <CartIcon class="text-xl" />
            <span
              v-if="orderState.products.length > 0"
              class="indicator-item bg-primary flex h-6 w-6 items-center justify-center rounded-full text-white dark:bg-cyan-400"
            >
              {{ orderState.products.length }}
            </span>
          </span>
        </TheLink>
        <div
          tabindex="0"
          class="card card-compact dropdown-content bg-base-100 shadow"
          :class="[{ hidden: $route.path.startsWith('/order') }, orderState.products.length > 0 ? 'w-96' : 'w-52']"
        >
          <div class="card-body max-sm:hidden">
            <div v-if="orderState.products.length > 0" class="flex flex-col gap-4">
              <div class="flex flex-col divide-y">
                <div
                  v-for="product in orderState.products"
                  :key="product.id"
                  class="flex items-center justify-between gap-4 rounded bg-white p-3 text-black"
                >
                  <img class="shrink-0 rounded" width="50" height="50" :src="product.imgUrl" :alt="product.name" />
                  <span class="line-clamp-1 w-24 grow text-base">{{ product.name }}</span>
                  <span class="divide-x">
                    <ThePrice class="pr-2 text-sm font-bold" :value="product.price" />

                    <span class="pl-1 text-xs">{{ product.quantity }}</span>
                  </span>
                  <TheButton
                    class="hover:bg-primary relative m-0 flex h-4 w-4 items-center justify-center overflow-hidden rounded-full bg-gray-300 text-white disabled:cursor-not-allowed disabled:opacity-50 md:ml-4"
                    @click="removeProductFromOrder(product.id)"
                  >
                    <TrashIcon class="h-auto w-3" />
                  </TheButton>
                </div>
              </div>
              <div class="flex items-center">
                <span class="flex grow items-center justify-center gap-2 text-lg font-bold"
                  >{{ $t('totalPriceProduct') }}: <ThePrice :value="orderState.total"
                /></span>
                <div class="card-actions">
                  <TheLink to="/order" class="btn btn-primary btn-block">{{ $t('viewCart') }}</TheLink>
                </div>
              </div>
            </div>
            <span v-else class="text-md text-center font-medium">{{ $t('yourCartIsEmpty') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useYimaProduct, useYimaSearch, ref, computed, onClickOutside, useYimaHttp } from '#imports'
import CartIcon from '~icons/mdi/cart-outline'
import SearchIcon from '~icons/mdi/magnify'
import TrashIcon from '~icons/mdi/close'

const {
  $order: { state: orderState },
} = useNuxtApp()

const { searchProductsByName } = useYimaSearch()
const { removeProductFromOrder } = useYimaProduct()
const { waitAnd } = useYimaHttp()

const searchHits = ref<Product[]>([])
const formData = ref<Record<string, any>>({})
const showHits = ref(false)
const searchFormReference = ref()

const searchHasHits = computed(() => {
  return searchHits.value.length > 0
})

const { execute: handleSearch } = waitAnd(
  (data: Record<string, any>) => {
    if (!data.searchText) {
      searchHits.value = []
      showHits.value = false

      return
    }

    return searchProductsByName(data.searchText)
  },
  (searchResponse) => {
    if (!searchResponse || searchResponse.error.value || !searchResponse.data.value) {
      return
    }

    searchHits.value = searchResponse.data.value.member

    showHits.value = true
  }
)

function closeHits() {
  showHits.value = false
}

onClickOutside(searchFormReference, () => {
  closeHits()
})
</script>
