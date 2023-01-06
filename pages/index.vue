<template>
  <div class="container">
    {{ $t('products') }}
    <div v-for="product in products" :key="product.id">
      <img :src="product.imgUrl" width="100" height="100" :alt="product.name">
      <div>{{ product.name }}</div>
      <div>{{ product.price }}</div>
      <div>{{ product.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">

const { getProducts } = useYimaProduct()

const { data: products } = await getProducts()

/**
 * SEO meta tags
 */
useHead({
  title: 'Homepage'
})

</script>

<style lang=""></style>
