<template>
  <TheBaseCard class="gap-4 p-0">
    <TheLink
      :to="`/${product.slug}`"
      class="relative flex h-full w-full flex-col items-center gap-4 p-4 pt-6 pb-0 md:px-8 md:pt-8"
    >
      <div class="flex items-center justify-center">
        <img :src="product.imgUrl" width="128" height="128" class="h-32 w-32 object-contain" :alt="product.name" />
      </div>
      <div class="h-full w-full">
        <h2 class="card-title line-clamp-2 min-h-[56px]">
          {{ product.name }}
        </h2>
      </div>
    </TheLink>
    <div class="flex items-end justify-start gap-2 px-4 md:px-8">
      <ThePrice class="text-lg font-bold" :class="{ 'old-price': product.oldPrice }" :value="product.price" />
      <ThePrice v-if="product.oldPrice" class="line-through" :value="product.oldPrice" />
    </div>
    <div class="flex w-full flex-wrap justify-between gap-2 px-4 pt-0 pb-4 md:px-8 md:pb-8">
      <QuantityBox
        v-if="product.inStock"
        v-model="quantity"
        class="grow"
        :disabled="!product.inStock"
        :min="product.minAmountToPurchase"
      />
      <TheButton :disabled="!product.inStock" class="btn btn-primary relative grow" @click="handleAddToOrder">
        {{ product.inStock ? $t('buy') : $t('notInStock') }}
      </TheButton>
    </div>
  </TheBaseCard>
</template>
<script setup lang="ts">
import { useYimaProduct, toRefs, ref, useYimaToast, useI18n } from '#imports'
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

const quantity = ref(product.value.minAmountToPurchase ?? 1)

function handleAddToOrder() {
  addProductToOrder(product.value, quantity.value, product.value.flavours?.[0])
  toastSuccess(t('addedToCart', { productName: product.value.name }))
}
</script>
