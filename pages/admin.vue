<template>
  <NuxtLoadingIndicator />
  <div class="flex flex-col gap-4 lg:gap-10">
    <AdminHeader />
    <div class="container grid h-screen grid-cols-12 lg:max-w-full">
      <div class="z-10 col-span-12 pb-10 lg:col-span-10 lg:col-start-3 lg:px-20">
        <NuxtPage />
      </div>
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
