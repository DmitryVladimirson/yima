<template>
  <TheBaseCard class="items-center gap-4 p-0">
    <TheLink
      :to="`/${product.slug}`"
      class="relative flex h-full w-full flex-col items-center gap-4 p-4 pt-6 pb-0 md:px-8 md:pt-8"
    >
      <div
        v-if="product.categories.length > 0"
        class="scrollbar-hide absolute right-2 right-2 left-2 top-2 flex overflow-scroll"
      >
        <div class="ml-auto flex gap-2">
          <span v-for="category in product.categories" :key="category" class="badge badge-md whitespace-nowrap text-xs">
            {{ category }}
          </span>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <img :src="product.imgUrl" width="128" height="128" class="h-32 w-32 object-contain" :alt="product.name" />
      </div>
      <div class="h-full w-full">
        <h2 class="card-title line-clamp-2 min-h-[56px]">
          {{ product.name }}
        </h2>
      </div>
    </TheLink>
    <div class="flex w-full items-center justify-between gap-4 px-4 pt-0 pb-4 md:px-8 md:pb-8">
      <ThePrice class="text-lg font-bold" :value="product.price" />
      <TheButton :disabled="!product.inStock" class="btn btn-primary relative" @click="handleAddToOrder">
        {{ $t('buy') }}
      </TheButton>
    </div>
  </TheBaseCard>
</template>
<script setup lang="ts">
import { useYimaProduct, ref, toRefs, useYimaToast, useI18n } from '#imports'
import { withDefaults } from 'vue'

interface popperProperties {
  product: Product
}

const properties = withDefaults(defineProps<popperProperties>(), {
  product: undefined,
})

const { addProductToOrder } = useYimaProduct()
const { toastSuccess } = useYimaToast()
const { t } = useI18n()

const { product } = toRefs(properties)

const minPurchaseAmount = computed(() => {
  const amountAttribute = product.value?.attributes.find((attribute) => attribute.id === "Kil'kist'-v-upakovtsi-(sht.)")
  if (!amountAttribute) {
    return 1
  }

  return Number(amountAttribute.value)
})

const quantity = ref(minPurchaseAmount.value)

function handleAddToOrder() {
  addProductToOrder(product.value, quantity.value)
  toastSuccess(t('addedToCart', { productName: product.value.name }))
}
</script>
