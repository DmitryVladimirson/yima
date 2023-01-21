<template>
  <TheBaseCard class="items-center gap-4 md:p-8">
    <figure>
      <img :src="product.imgUrl" width="120" height="120" class="h-32 w-32 object-contain" :alt="product.name" />
    </figure>
    <div class="h-full w-full">
      <h2 class="card-title line-clamp-2">
        {{ product.name }}
      </h2>
      <p class="line-clamp-3">
        {{ product.description }}
      </p>
    </div>
    <div class="flex w-full items-center justify-between gap-4">
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
