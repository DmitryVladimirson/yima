<template>
  <Switch
    v-model="enabled"
    :class="enabled ? 'bg-info' : 'bg-secondary'"
    class="relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent text-gray-800 shadow transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
  >
    <span
      aria-hidden="true"
      :class="enabled ? 'translate-x-9' : 'translate-x-0'"
      class="pointer-events-none inline-block flex h-[34px] w-[34px] transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
    >
      <component :is="enabled ? MoonIcon : SunIcon" />
    </span>
  </Switch>
</template>

<script setup lang="ts">
import { ref, watch, useLocalStorage, onMounted } from '#imports'
import SunIcon from '~icons/mdi/white-balance-sunny'
import MoonIcon from '~icons/mdi/moon-waning-crescent'
import { Switch } from '@headlessui/vue'

const isDarkMode = useLocalStorage('isDarkModeEnabled', false)

const enabled = ref(false)

onMounted(() => {
  if (isDarkMode.value || window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.remove('bg-slate-100')
    enabled.value = true
  }
})

watch(enabled, (value) => {
  if (!value) {
    document.documentElement.classList.remove('dark')
    document.documentElement.dataset.theme = ''
    isDarkMode.value = false

    return
  }

  document.documentElement.classList.add('dark')
  document.documentElement.dataset.theme = 'dark'
  isDarkMode.value = true
})
</script>
