<template>
  <div class="flex flex-col gap-16">
    <TheSteps />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'

definePageMeta({
  middleware: ['order'],
})
</script>
