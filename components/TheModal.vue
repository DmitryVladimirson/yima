<template>
  <Teleport to="body">
    <div>
      <input id="my-modal-4" :checked="modalOpen" type="checkbox" class="modal-toggle" @click="closeModal" />
      <label for="my-modal-4" class="modal cursor-pointer" :class="{ 'modal-open': modalOpen }">
        <label class="modal-box relative">
          <slot :close-modal="closeModal" />
        </label>
      </label>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { toRefs, ref, watch } from '#imports'
import { withDefaults } from 'vue'

interface Properties {
  modelValue?: boolean
}

const properties = withDefaults(defineProps<Properties>(), {
  modelValue: false,
})

const emits = defineEmits(['update:modelValue'])

const { modelValue } = toRefs(properties)

const modalOpen = ref(modelValue.value)

function closeModal() {
  modalOpen.value = false
}

watch(modelValue, (value) => {
  modalOpen.value = value
})

watch(modalOpen, (value) => {
  emits('update:modelValue', value)
})
</script>
