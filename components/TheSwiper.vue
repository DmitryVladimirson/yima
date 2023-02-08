<template>
  <div class="ng-swiper relative flex justify-center">
    <Swiper
      v-bind="$attrs"
      class="w-full transition duration-300"
      :class="{ 'opacity-0': isSwiperLoading }"
      @swiper="handleInit"
    >
      <slot />
    </Swiper>
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="isSwiperLoading" class="absolute inset-0 z-10 flex items-center justify-center">
        <TheLoading class="h-10 w-10" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'

const isSwiperLoading = ref(true)

function handleInit() {
  isSwiperLoading.value = false
}
</script>
