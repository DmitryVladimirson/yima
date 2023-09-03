<template>
  <ul class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
    <li v-for="product in new Array(6).fill('')" :key="product.id">
      <PlaceholderProductCard />
    </li>
  </ul>
</template>
<script setup lang="ts"></script>
