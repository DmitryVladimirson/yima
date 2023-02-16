<template>
  <div>
    <div class="mb-1 block text-sm">
      {{ $t('flavours') }}
    </div>
    <Vue3TagsInput :tags="flavours" :placeholder="$t('enterFlavours')" @on-tags-changed="handleChangeFlavours" />
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs } from '#imports'
import Vue3TagsInput from 'vue3-tags-input'
import { withDefaults } from 'vue'

interface Properties {
  modelValue: string[]
}

const emits = defineEmits(['update:modelValue'])

const properties = withDefaults(defineProps<Properties>(), {
  modelValue: () => [],
})

const { modelValue } = toRefs(properties)

const flavours = ref(modelValue.value)

function handleChangeFlavours(flavoursNew: string[]) {
  flavours.value = flavoursNew
  emits('update:modelValue', flavoursNew)
}
</script>
