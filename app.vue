<template>
  <Html lang="uk" class="bg-[color:var(--bg-color)]">
    <Body class="min-h-screen">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#imports'

const {
  $order: { refreshOrder },
} = useNuxtApp()

refreshOrder()
</script>
