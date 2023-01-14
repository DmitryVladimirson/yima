<template>
  <button
    :type="type"
    :class="{ loading: loading }"
    :aria-disabled="disabled"
    :disabled="disabled || loading"
    class="before:hidden"
  >
    <transition
      v-if="loading"
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div class="absolute inset-0 flex items-center justify-center bg-inherit" :class="loadingWrapperClass">
        <TheLoading class="object-fit-contain h-full max-h-[75%] w-full max-w-[75%]" :class="loadingClass" />
      </div>
    </transition>

    <slot />
  </button>
</template>

<script lang="ts" setup>
import { withDefaults } from 'vue'

interface Properties {
  disabled?: boolean
  loading?: boolean
  loadingClass?: string
  loadingWrapperClass?: string
  type?: string
}

withDefaults(defineProps<Properties>(), {
  disabled: undefined,
  loading: false,
  loadingClass: '',
  loadingWrapperClass: '',
  type: 'button',
})
</script>
