<template>
  <Html class="bg-slate-100 dark:bg-gray-800" lang="uk">
    <Body>
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
