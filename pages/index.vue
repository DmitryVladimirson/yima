<template>
  <div class="container">
    {{ data }}
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/get-products')
</script>
