<template>
  <div class="flex flex-row items-center gap-3">
    <div class="mb-1 block text-sm">
      {{ $t('flavours') }}
    </div>
    <Switch
      ref="productTypeSwitcher"
      v-model="enabled"
      class="relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-info text-gray-800 shadow transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      <span
        aria-hidden="true"
        :class="enabled ? 'translate-x-9' : 'translate-x-0'"
        class="pointer-events-none inline-block flex h-[34px] w-[34px] transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
      >
      </span>
    </Switch>
    <div class="mb-1 block text-sm">
      {{ $t('types') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, toRefs} from '#imports'
import { Switch } from '@headlessui/vue'
import { Ref, withDefaults } from 'vue'

interface Properties {
  modelValue: boolean
}

const emits = defineEmits(['update:modelValue'])

const properties = withDefaults(defineProps<Properties>(), {
  modelValue: () => false,
})

const { modelValue } = toRefs(properties)

const enabled = ref(modelValue.value)

watch(enabled, (updated) => {
  enabled.value = updated
  emits('update:modelValue', updated)
})
</script>
