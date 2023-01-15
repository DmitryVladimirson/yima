<template>
  <div class="container">
    <div class="flex flex-col items-center justify-center gap-4 md:gap-8">
      <DoneIcon class="relative h-24 w-24 text-green-400 md:h-40 md:w-40" />
      <div class="flex flex-col items-center gap-4 text-center">
        <TheH :level="1" class="text-lg sm:text-2xl md:text-3xl">
          {{ $t('orderCompleteSuccess') }}
        </TheH>
        <TheH :level="3" class="sm:text-md text-sm md:text-xl">{{ $t('completeDescription') }}</TheH>
        <TheLink to="/" class="btn btn-primary mt-2 flex items-center gap-2">
          <StoreIcon class="text-xl" />
          {{ $t('toShop') }}
        </TheLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import DoneIcon from '~icons/mdi/check-circle-outline'
import StoreIcon from '~icons/mdi/home'
</script>
