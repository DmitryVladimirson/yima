<template>
  <Html lang="uk" :class="{ 'bg-slate-100': !isDarkMode }">
    <Body class="min-h-screen">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>

<script setup lang="ts">
import { useLocalStorage, useNuxtApp } from '#imports'

const isDarkMode = useLocalStorage('isDarkModeEnabled', false)

const {
  $order: { refreshOrder },
} = useNuxtApp()

refreshOrder()
</script>
