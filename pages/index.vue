<template>
  <div class="container">
    <pre>
      {{ products }}
    </pre>
    <div v-for="product in products" :key="product.id">
      <img :src="product.imgUrl" alt="" class="w-40">
      <div>{{ product.name }}</div>
      <div>{{ product.price }}</div>
      <div>{{ product.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useYimaProduct, useHead } from '#imports'

const { getProducts } = useYimaProduct()

const { data: products } = await getProducts()
console.log(products.value)

/**
 * SEO meta tags
 */
useHead({
  title: 'Homepage'
})

</script>

<style lang=""></style>
