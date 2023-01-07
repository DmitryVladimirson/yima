<template>
  <div class="card bg-base-100 shadow-xl pt-4">
    <figure><img :src="product.imgUrl" width="150" height="150" :alt="product.name"></figure>
    <div class="card-body">
      <h2 class="card-title">
        {{ product.name }}
      </h2>
      <p class="line-clamp-3">
        {{ product.description }}
      </p>
      <div class="flex  justify-between gap-4">
        <QuantityBox v-model="quantity" />
        <TheButton class="btn btn-primary relative" @click="handleAddToOrder">
          {{ $t('buy') }}
        </TheButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { withDefaults } from 'vue'
import { useYimaProduct, ref, toRefs, useYimaToast, useI18n } from '#imports'

interface popperProperties {
  product: Record<string, any>

}

const props = withDefaults(defineProps<popperProperties>(), {
  product: undefined
})

const { addProductToOrder } = useYimaProduct()
const { toastSuccess } = useYimaToast()
const { t } = useI18n()

const { product } = toRefs(props)
const quantity = ref(0)

function handleAddToOrder () {
  addProductToOrder(product.value, quantity.value)
  toastSuccess(t('addedToCart', { productName: product.value.name }))
}

</script>
