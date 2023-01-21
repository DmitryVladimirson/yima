<template>
  <NuxtPage />
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'

definePageMeta({
  middleware: ['order'],
})
</script>
