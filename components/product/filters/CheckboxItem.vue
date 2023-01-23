<template>
  <div
    class="collapse flex flex-col overflow-visible"
    :class="[collapseOpen ? 'collapse-open' : 'collapse-close', { 'gap-2': collapseOpen }]"
  >
    <div class="collapse-title flex min-h-0 items-center justify-start gap-2 p-0 text-xl font-medium">
      <FormKit v-model="data" type="checkbox" wrapper-class="!items-start" :label="item.name" :name="item.id" />
      <TheButton v-if="item.children.length > 0" @click="toggleCollapse"
        ><ChevronIcon class="text-sm" :class="{ 'rotate-180': collapseOpen }" />
      </TheButton>
    </div>
    <template v-if="item.children.length > 0">
      <div class="collapse-content flex flex-col gap-2 p-0">
        <div v-for="child in item.children" :key="child.id" class="pl-2">
          <ProductFiltersCheckboxItem
            :form-data="formData"
            :section-name="sectionName"
            :item="child"
            :reset-filters="resetFilters"
            @checkbox-changed="handleChange"
          />
        </div>
      </div>
    </template>
  </div>

  <div class="flex flex-col items-start gap-2"></div>
</template>

<script setup lang="ts">
import { toRefs, ref, watch, computed } from '#imports'
import ChevronIcon from '~icons/mdi/chevron-down'
import { withDefaults } from 'vue'

const emits = defineEmits(['checkbox-changed'])

interface popperProperties {
  item: Record<string, any>
  formData: Record<string, any>
  sectionName: string
  resetFilters: boolean
}

const properties = withDefaults(defineProps<popperProperties>(), {
  item: undefined,
  formData: undefined,
  sectionName: '',
  resetFilters: false,
})

const data = ref(false)
const setChildren = ref(true)
const collapseOpen = ref(true)
const { item, formData, sectionName, resetFilters } = toRefs(properties)

function handleChange() {
  emits('checkbox-changed')
}

const isChildrenChecked = computed(() => {
  if (item.value.children.length === 0) {
    return false
  }

  for (const child of item.value.children) {
    if (!formData.value[sectionName.value][child.id]) {
      return false
    }
  }

  return true
})

function toggleCollapse() {
  collapseOpen.value = !collapseOpen.value
}

watch(isChildrenChecked, () => {
  data.value = isChildrenChecked.value
  setChildren.value = isChildrenChecked.value
})

watch(data, (value) => {
  if (item.value.children.length === 0) {
    handleChange()

    return
  }

  if (value) {
    for (const child of item.value.children) {
      formData.value[sectionName.value][child.id] = true
    }

    return
  }

  if (setChildren.value) {
    for (const child of item.value.children) {
      formData.value[sectionName.value][child.id] = false
    }
  }

  if (item.value.parent) {
    formData.value[sectionName.value][item.value.parent] = false
  }
})
</script>
