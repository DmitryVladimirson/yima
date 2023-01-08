<template>
  <ClientOnly>
    <span class="whitespace-nowrap">{{ price }}</span>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { toRefs, computed } from '#imports'
import { withDefaults } from 'vue'

interface Properties {
  options?: Record<string, any>
  value: number
}

const properties = withDefaults(defineProps<Properties>(), {
  options: undefined,
  value: 0,
})

const { value, options } = toRefs(properties)

const price = computed(() => {
  const numberFormatOptions: Record<string, any> = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options.value,
  }

  numberFormatOptions.style = 'currency'
  numberFormatOptions.currency = 'UAH'

  return new Intl.NumberFormat('UK', numberFormatOptions).format(value.value)
})
</script>
