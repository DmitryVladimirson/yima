<template>
  <ClientOnly>
    <TheSignIn />
  </ClientOnly>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports'

definePageMeta({
  layout: false,
})
</script>
