<template>
  <NuxtLoadingIndicator />
  <div class="grid h-screen grid-cols-12">
    <AdminMenu class="col-span-2" />
    <div class="col-span-10 py-20 px-20">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'

definePageMeta({
  layout: false,
  middleware: ['admin'],
})
</script>
