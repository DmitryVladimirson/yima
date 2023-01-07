<template>
  <div class="card bg-base-100 shadow-xl pt-4">
    <figure><img :src="product.imgUrl" width="150" height="150" alt="Shoes"></figure>
    <div class="card-body">
      <h2 class="card-title">
        {{ product.name }}
      </h2>
      <p class="line-clamp-3">
        {{ product.description }}
      </p>
      <div class="flex  justify-between gap-4">
        <QuantityBox v-model="quantity" />
        <TheButton class="btn btn-primary relative" @click="addProductToOrder(product, quantity)">
          {{ $t('buy') }}
        </TheButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { withDefaults } from 'vue'
import { useYimaProduct, ref } from '#imports'

interface popperProperties {
  product: Record<string, any>

}

withDefaults(defineProps<popperProperties>(), {
  product: undefined
})

const quantity = ref(0)

const { addProductToOrder } = useYimaProduct()

</script>
