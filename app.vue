<template>
  <Html lang="uk" class="bg-[color:var(--bg-color)]">
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <title>Euro Price</title>
    </Head>
    <Body class="min-h-screen">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </Html>
</template>

<script setup lang="ts">
import { onMounted, useNuxtApp } from '#imports'
import { themeChange } from 'theme-change'

const {
  $order: { refreshOrder },
} = useNuxtApp()

refreshOrder()

onMounted(() => {
  themeChange(false)
})
</script>
