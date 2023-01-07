<template>
  <div class="container">
    {{ $t('products') }}
    <div v-for="product in products" :key="product.id">
      <img :src="product.imgUrl" width="100" height="100" :alt="product.name">
      <div>{{ product.name }}</div>
      <div>{{ product.price }}</div>
      <button @click="addProductToOrder(product, 1)">
        AddToCart
      </button>
    </div>

    <div class="mt-10">
      Cart
    </div>
    <div v-for="product in orderState.products" :key="product.id">
      <img :src="product.imgUrl" width="100" height="100" :alt="product.name">
      <div>{{ product.name }}</div>
      <div>{{ product.price }}</div>
      <div>{{ product.quantity }}</div>
      <button @click="removeProductFromOrder(product.id)">
        Remove
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useYimaProduct } from '#imports'

const { $order: { state: orderState } } = useNuxtApp()
const { getProducts, addProductToOrder, removeProductFromOrder } = useYimaProduct()

const { data: products } = await getProducts()

/**
 * SEO meta tags
 */
useHead({
  title: 'Homepage'
})

</script>

<style lang=""></style>
