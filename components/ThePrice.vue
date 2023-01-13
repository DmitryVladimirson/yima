<template>
  <span class="whitespace-nowrap">{{ value }} грн</span>
</template>

<script lang="ts" setup>
import { toRefs } from '#imports'
import { withDefaults } from 'vue'

interface Properties {
  value: number
}

const properties = withDefaults(defineProps<Properties>(), {
  value: 0,
})

const { value } = toRefs(properties)
</script>
