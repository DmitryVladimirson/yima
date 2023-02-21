<template>
  <div class="flex justify-between overflow-hidden rounded-md border bg-white p-1" v-bind="$attrs">
    <TheButton
      v-if="!disableButtons"
      class="flex items-center justify-center"
      :class="[
        decreaseButtonClass,
        {
          'pointer-events-none opacity-70': quantity === min || disabled,
        },
      ]"
      @click="decrease"
    >
      <MinusIcon :class="iconClass" />
    </TheButton>
    <input
      v-model="quantity"
      type="number"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :class="['w-10 border-0 p-1 text-center leading-tight text-gray-800 focus:ring-0', inputClass]"
      @change="validateValue"
    />
    <span v-if="suffix" :class="suffixClass" class="flex items-center justify-center">{{ suffix }}</span>
    <TheButton
      v-if="!disableButtons"
      class="flex items-center justify-center"
      :class="[
        increaseButtonClass,
        {
          'pointer-events-none opacity-70': quantity === max || disabled,
        },
      ]"
      @click="increase"
    >
      <PlusIcon :class="iconClass" />
    </TheButton>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, ref } from '#imports'
import MinusIcon from '~icons/mdi/minus'
import PlusIcon from '~icons/mdi/plus'
import { withDefaults } from 'vue'

interface Properties {
  decreaseButtonClass?: string
  disableButtons?: boolean
  disabled?: boolean
  iconClass?: string
  increaseButtonClass?: string
  inputClass?: string
  max?: number
  min?: number
  modelValue?: number
  step?: number
  suffix?: string
  suffixClass?: string
  value?: number
}

const properties = withDefaults(defineProps<Properties>(), {
  decreaseButtonClass: 'ng-button w-10 bg-white p-0 text-gray-500 hover:bg-gray-100',
  disableButtons: false,
  disabled: false,
  iconClass: 'h-auto w-6',
  increaseButtonClass: 'ng-button w-10 bg-white p-0 text-gray-500 hover:bg-gray-100',
  inputClass: '',
  max: 999,
  min: 1,
  modelValue: undefined,
  step: 1,
  suffix: '',
  suffixClass: 'text-gray-800 leading-tight mr-2',
  value: 1,
})

const {
  decreaseButtonClass,
  disableButtons,
  disabled,
  iconClass,
  increaseButtonClass,
  inputClass,
  max,
  min,
  modelValue,
  step,
  value,
} = toRefs(properties)

const quantity = ref(modelValue.value || value.value)

const emits = defineEmits(['update:modelValue', 'changed'])

function increase() {
  const updatedValue = quantity.value + step.value

  if (updatedValue > max.value) {
    return
  }

  quantity.value = updatedValue

  validateValue()
}

function decrease() {
  const updatedValue = quantity.value - step.value

  if (updatedValue < min.value) {
    return
  }

  quantity.value = updatedValue

  validateValue()
}

function validateValue() {
  if (!quantity.value || quantity.value <= 0) {
    quantity.value = 1
  }

  if (quantity.value > max.value) {
    quantity.value = max.value
  }

  if (quantity.value < min.value) {
    quantity.value = min.value
  }

  quantity.value = Math.floor(quantity.value)
  emits('changed', quantity.value)
  emits('update:modelValue', quantity.value)
}
</script>

<style lang="postcss" scoped>
input {
  &[type='number'] {
    /* noinspection CssInvalidPropertyValue */
    appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      @apply appearance-none;
      @apply m-0;
    }
  }
}
</style>
