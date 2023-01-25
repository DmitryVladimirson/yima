<template>
  <div class="container grid gap-10 md:grid-cols-2 md:gap-20">
    <figure class="mx-auto flex w-1/2 items-center md:w-full">
      <img :src="product.imgUrl" width="500" height="500" class="h-full w-full object-contain" alt="product.name" />
    </figure>
    <div class="flex flex-col justify-start gap-6 md:gap-8">
      <div class="flex items-baseline justify-between">
        <h2>{{ product.name }}</h2>
      </div>

      <div v-if="product.description" class="max-md:order-last">
        <h2>{{ $t('description') }}</h2>
        <p class="mt-4 max-sm:text-sm">
          {{ product.description }}
        </p>
      </div>

      <ThePrice class="text-xl font-bold" :value="product.price" />

      <div class="flex items-center justify-start gap-4">
        <QuantityBox v-model="quantity" class="h-full justify-center" input-class="" />
        <TheButton class="btn btn-primary grow xl:w-1/3" @click="handleAddToOrder">{{ $t('buy') }} </TheButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useYimaProduct, useRoute, createError, useYimaToast, useI18n, ref } from '#imports'

const { getProductBySlug, addProductToOrder } = useYimaProduct()
const { toastSuccess } = useYimaToast()
const { t } = useI18n()
const route = useRoute()

const quantity = ref(1)

const { data: product } = await getProductBySlug(String(route.params.slug))

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not found',
  })
}

function handleAddToOrder() {
  addProductToOrder(product.value, quantity.value)
  toastSuccess(t('addedToCart', { productName: product.value.name }))
}
</script>
