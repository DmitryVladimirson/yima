<template>
  <NuxtLoadingIndicator />

  <div class="flex h-screen min-h-full flex-col">
    <TheHeader />
    <main class="py-10">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
<script setup lang="ts"></script>
