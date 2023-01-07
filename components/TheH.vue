<template>
  <component :is="`h${level}`" v-bind="$attrs">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { withDefaults } from 'vue'

interface Properties {
  level?: number
}

withDefaults(defineProps<Properties>(), {
  level: 1
})

</script>
