<template>
  <nav v-if="totalPages > 1" class="flex gap-1 text-white">
    <TheButton
      :class="['btn  h-8 min-h-0 w-8 p-0', { 'pointer-events-none opacity-50': modelValue === 1 }, arrowClass]"
      @click="handlePaginationChange(modelValue - 1)"
    >
      <slot name="leftIcon">
        <ChevronLeftIcon class="h-auto w-6" />
      </slot>
    </TheButton>

    <div v-for="page in generatedPagination" :key="page">
      <span v-if="page === -1" class="text-gray-500">...</span>

      <TheButton
        v-else
        :class="['btn  h-8 min-h-0  w-8 p-0', itemClass, page === modelValue ? activeItemClass : 'btn-outline']"
        @click="handlePaginationChange(page)"
      >
        {{ page }}
      </TheButton>
    </div>

    <TheButton
      :class="['btn  h-8 min-h-0 w-8 p-0', { 'pointer-events-none opacity-50': modelValue === totalPages }, arrowClass]"
      @click="handlePaginationChange(modelValue + 1)"
    >
      <slot name="rightIcon">
        <ChevronRightIcon class="h-auto w-6" />
      </slot>
    </TheButton>
  </nav>
</template>

<script lang="ts" setup>
import { toRefs, computed, watch, navigateTo, useRoute } from '#imports'
import ChevronLeftIcon from '~icons/mdi/chevron-left'
import ChevronRightIcon from '~icons/mdi/chevron-right'
import { withDefaults } from 'vue'

const route = useRoute()

interface Properties {
  activeItemClass?: string
  arrowClass?: string
  delta?: number
  itemClass?: string
  itemsPerPage?: number
  modelValue: number
  totalItems: number
}

const properties = withDefaults(defineProps<Properties>(), {
  activeItemClass: 'btn-neutral',
  arrowClass: '',
  delta: 2,
  itemClass: '',
  itemsPerPage: 12,
  modelValue: 1,
  totalItems: undefined,
})

const { modelValue, itemClass, activeItemClass, arrowClass } = toRefs(properties)

const emits = defineEmits(['update:modelValue', 'paginationChange'])

const totalPages = computed(() => {
  return Math.ceil(properties.totalItems / properties.itemsPerPage)
})

const generatedPagination = computed(() => {
  const left = modelValue.value - properties.delta
  const right = modelValue.value + properties.delta + 1
  const rangeWithDots = []
  let helper: number | null = null

  for (let index = 1; index <= totalPages.value; index++) {
    if (index === 1 || index === totalPages.value || (index >= left && index < right)) {
      if (helper) {
        if (index - helper === 2) {
          rangeWithDots.push(helper + 1)
        } else if (index - helper !== 1) {
          rangeWithDots.push(-1)
        }
      }

      rangeWithDots.push(index)
      helper = index
    }
  }

  return rangeWithDots
})

function goToPage(pageIndex: number) {
  emits('update:modelValue', pageIndex)
}

async function handlePaginationChange(page: number) {
  goToPage(page)

  let pageQuery: number | undefined = Number(page)

  if (page === 1) {
    pageQuery = undefined
  }

  await navigateTo({
    query: { ...route.query, page: pageQuery },
  })

  emits('paginationChange', page)
}

watch(
  () => properties.itemsPerPage,
  () => handlePaginationChange(1)
)
</script>
