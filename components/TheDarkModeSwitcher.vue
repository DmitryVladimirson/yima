<template>
  <Switch
    ref="themeSwitcher"
    v-model="enabled"
    data-toggle-theme="dark,light"
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
import { ref, onMounted } from '#imports'
import SunIcon from '~icons/mdi/white-balance-sunny'
import MoonIcon from '~icons/mdi/moon-waning-crescent'
import { Switch } from '@headlessui/vue'
import { themeChange } from 'theme-change'

const isDarkMode = useLocalStorage('theme', 'light')

const enabled = ref(false)
const themeSwitcher = ref()

onMounted(() => {
  themeChange(false)

  if (isDarkMode.value === 'dark') {
    enabled.value = true
  }
})
</script>
