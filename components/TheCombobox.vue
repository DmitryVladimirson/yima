<template>
  <Combobox v-model="selectedValue" :disabled="disabled">
    <div class="relative mt-1">
      <div
        class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
      >
        <ComboboxInput
          class="input input-bordered w-full border-gray-800/20 bg-white focus:ring-0 disabled:pointer-events-none dark:disabled:opacity-50"
          :display-value="(data) => data.description"
          :disabled="disabled"
          @change="query = $event.target.value"
        />
        <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>
      </div>
      <TransitionRoot leave="transition ease-in duration-100" leave-from="opacity-100" leave-to="opacity-0">
        <ComboboxOptions
          class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <div v-if="loading" class="relative cursor-default select-none py-2 px-4 text-gray-700">
            {{ $t('search') }}...
          </div>

          <template v-if="filteredData.length > 0">
            <ComboboxOption
              v-for="option in filteredData"
              :key="option.id"
              v-slot="{ selected, active }"
              as="template"
              :value="option"
            >
              <li
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-secondary text-white': active,
                  'text-gray-900': !active,
                }"
              >
                <span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
                  {{ option.description }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-secondary': !active }"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </template>
          <div v-else-if="!loading && query !== ''" class="relative cursor-default select-none py-2 px-4 text-gray-700">
            {{ $t('nothingFound') }}
          </div>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from '#imports'
import CheckIcon from '~icons/mdi/check'
import ChevronUpDownIcon from '~icons/mdi/unfold-more-horizontal'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import { withDefaults } from 'vue'

interface Properties {
  data: { id: string; description: string }[]
  modelValue?: { id: string; description: string }
  loading?: boolean
  disabled?: boolean
}

const properties = withDefaults(defineProps<Properties>(), {
  data() {
    return []
  },
  modelValue: undefined,
  loading: false,
  disabled: false,
})
const emits = defineEmits(['queryChanged', 'update:modelValue'])

const { data, modelValue } = toRefs(properties)
const query = ref('')
const selectedValue = ref(modelValue.value)

const filteredData = computed(() =>
  query.value === ''
    ? data.value
    : data.value.filter((object) =>
        object.description
          .toLowerCase()
          .replaceAll(/\s+/g, '')
          .includes(query.value.toLowerCase().replaceAll(/\s+/g, ''))
      )
)

watch(query, (value) => {
  if (!value && selectedValue.value?.description) {
    return
  }

  emits('queryChanged', value)
})
watch(selectedValue, (value) => {
  emits('update:modelValue', value)
})
</script>
