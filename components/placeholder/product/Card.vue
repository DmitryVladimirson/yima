<template>
  <TheBaseCard class="gap-4 p-0">
    <TheLink class="relative flex h-full w-full flex-col items-center gap-4 p-4 pb-0 pt-6 md:px-8 md:pt-8">
      <div class="flex items-center justify-center">
        <img
          src="/placeholder-image-product.webp"
          width="128"
          height="128"
          class="h-32 w-32 object-contain"
          alt="product image placeholder"
        />
      </div>
      <div class="h-full w-full">
        <div class="card-title h-5 w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </TheLink>
    <div class="flex items-end justify-start gap-2 px-4 md:px-8">
      <div class="card-title h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
    </div>
    <div class="flex w-full flex-wrap justify-between gap-2 px-4 pb-4 pt-0 md:px-8 md:pb-8">
      <QuantityBox disabled :value="0" class="grow" />
      <TheButton class="btn btn-primary relative grow" disabled>
        {{ $t('buy') }}
      </TheButton>
    </div>
  </TheBaseCard>
</template>
<script setup lang="ts"></script>
