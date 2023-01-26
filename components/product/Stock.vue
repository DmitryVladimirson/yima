<template>
  <div
    class="font-bold"
    :class="{
      'text-green-600': inStock,
      'text-red-600': !inStock,
    }"
  >
    {{ stock }}
  </div>
</template>

<script lang="ts" setup>
import { toRefs, computed, useNuxtApp } from '#imports'
import { withDefaults } from 'vue'

interface Properties {
  inStock?: boolean
}

const properties = withDefaults(defineProps<Properties>(), {
  inStock: false,
})

const { inStock } = toRefs(properties)

const {
  $i18n: { t },
} = useNuxtApp()

const stock = computed(() => {
  return inStock.value ? t('inStock') : t('notInStock')
})
</script>
