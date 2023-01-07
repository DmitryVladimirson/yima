<template>
  <div class="card bg-base-100 pt-4 shadow-xl dark:bg-white dark:text-black">
    <figure><img :src="product.imgUrl" width="150" height="150" :alt="product.name" /></figure>
    <div class="card-body">
      <h2 class="card-title">
        {{ product.name }}
      </h2>
      <p class="line-clamp-3">
        {{ product.description }}
      </p>
      <div class="xs:flex-row flex flex-col justify-between gap-4">
        <QuantityBox v-model="quantity" class="justify-around" />
        <TheButton class="btn btn-primary relative" @click="handleAddToOrder">
          {{ $t('buy') }}
        </TheButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useYimaProduct, ref, toRefs, useYimaToast, useI18n } from '#imports'
import { withDefaults } from 'vue'

interface popperProperties {
  product: Record<string, any>
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
