<template>
  <NuxtLink :external="external" :target="external ? '_blank' : undefined" :to="target" v-bind="$attrs">
    <slot />
  </NuxtLink>
</template>

<script lang="ts" setup>
import { useLocalePath, computed, toRefs } from '#imports'
import { withDefaults } from 'vue'

interface Properties {
  to?: string | Record<string, any>
}

const properties = withDefaults(defineProps<Properties>(), {
  to: '/',
})

const { to } = toRefs(properties)
const localePath = useLocalePath()

const external = computed(() => {
  if (typeof to.value === 'string') {
    return to.value.startsWith('http')
  }

  return false
})

const target = computed(() => {
  if (external.value) {
    return to.value
  }

  return localePath(to.value)
})
</script>
