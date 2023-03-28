<template>
  <div class="flex flex-col gap-6 sm:gap-10 xl:gap-16">
    <div class="container">
      <TheLink to="/" class="btn btn-primary mt-2 flex w-fit items-center gap-2"> На головну </TheLink>
    </div>
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
