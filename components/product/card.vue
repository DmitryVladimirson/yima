<template>
  <TheBaseCard class="items-center gap-4 p-0">
    <TheLink
      :to="`/${product.slug}.html`"
      class="flex h-full w-full flex-col items-center gap-4 p-4 pt-4 pb-0 md:px-8 md:pt-8"
    >
      <div class="flex items-center justify-center">
        <img :src="product.imgUrl" width="128" height="128" class="h-32 w-32 object-contain" :alt="product.name" />
      </div>
      <div class="h-full w-full">
        <h2 class="card-title line-clamp-2">
          {{ product.name }}
        </h2>
        <p class="line-clamp-3">
          {{ product.description }}
        </p>
      </div>
    </TheLink>
    <div class="flex w-full items-center justify-between gap-4 px-4 pt-0 pb-4 md:px-8 md:pb-8">
      <ThePrice class="text-lg font-bold" :value="product.price" />
      <TheButton class="btn btn-primary relative" @click="handleAddToOrder">
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
const quantity = ref(1)

function handleAddToOrder() {
  addProductToOrder(product.value, quantity.value)
  toastSuccess(t('addedToCart', { productName: product.value.name }))
}
</script>
