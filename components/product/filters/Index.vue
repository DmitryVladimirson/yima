<template>
  <div v-if="filters.length > 0" v-bind="$attrs">
    <FormKit v-model="formData" type="form" form-class="flex flex-col gap-4" :actions="false">
      <TheBaseCard class="flex flex-col justify-between gap-8 overflow-visible">
        <div v-for="filter in filters" :key="filter.sectionName" class="flex flex-col gap-4">
          <TheH :level="4">{{ $t(filter.sectionName) }}</TheH>
          <FormKit type="group" :name="filter.sectionName">
            <ul :id="filter.sectionName" class="scroller flex w-full flex-col gap-4">
              <li v-for="item in filter.items" :key="item.id">
                <template v-if="item.type === 'range'">
                  <TheSlider
                    :min-selected="priceSelectedValues.min"
                    class="mt-8"
                    :max-selected="priceSelectedValues.max"
                    :min="item.min"
                    :max="item.max"
                    :reset-data="resetFilters"
                    @price-filter-change="handlePriceFilterChange($event, item)"
                  />
                </template>
                <template v-else>
                  <ProductFiltersCheckboxItem
                    :reset-filters="resetFilters"
                    :section-name="filter.sectionName"
                    :form-data="formData"
                    :item="item"
                    @checkbox-changed="handleChange"
                  />
                </template>
              </li>
            </ul>
          </FormKit>
        </div>
      </TheBaseCard>
      <TheButton v-if="showResetFiltersButton" class="btn btn-primary w-full" @click="handleResetFilters">
        {{ $t('resetFilters') }}
      </TheButton>
    </FormKit>
  </div>
  <TheMessageBox v-else :message="$t('noFilters')" />
</template>

<script setup lang="ts">
import { ref, useRoute, onMounted, computed } from '#imports'
import { withDefaults } from 'vue'

const emits = defineEmits(['filters-changed'])

interface popperProperties {
  filters: Filter[]
}

withDefaults(defineProps<popperProperties>(), {
  filters: () => [],
})

const route = useRoute()

const resetFilters = ref(false)
const formData = ref<Record<string, any>>({})
const priceSelectedValues = ref<Record<string, any>>({})

const showResetFiltersButton = computed(() => route.query.filter_by)

function parseFiltersQuery() {
  const string = route.query.filter_by as string

  if (!string) {
    return
  }

  const filtersArray = string.split('&&')

  for (const filter of filtersArray) {
    const [key, value] = filter.split(':')

    if (key === 'categories') {
      const resultValue = value.slice(1, -1)
      const selectedValues = resultValue.split(',')

      for (const selectedValue of selectedValues) {
        formData.value.categories[selectedValue] = true
      }

      continue
    }

    if (key === 'price') {
      const [min, max] = value.split('..')
      priceSelectedValues.value = { min, max }
    }
  }
}

function handlePriceFilterChange(data: Array<string>, item: Record<string, any>) {
  if (data[0] === item.min && data[1] === item.max) {
    if (formData.value.price.values) {
      delete formData.value.price.values
    }

    handleChange()

    return
  }

  formData.value.price = { values: data }
  handleChange()
}

function handleResetFilters() {
  resetFilters.value = true

  setTimeout(() => {
    for (const category in formData.value.categories) {
      if (category in formData.value.categories) {
        formData.value.categories[category] = false
      }
    }
  }, 50)
}

function handleChange() {
  const result: Record<string, any> = { price: formData.value.price }

  const categories = { ...formData.value?.categories }

  // Delete empty attributes
  for (const [key, value] of Object.entries(categories)) {
    if (!value) {
      delete categories[key]
    }
  }

  if (categories && Object.keys(categories).length > 0) {
    result.categories = {
      ...categories,
    }
  }

  let filterString = ''
  if (result.categories) {
    const categoriesArray = Object.keys(result.categories)
    if (categoriesArray && categoriesArray.length > 0) {
      filterString += `categories:[${categoriesArray}]`
    }
  }

  if (result.price.values) {
    if (filterString) {
      filterString += '&&'
    }

    filterString += `price:${result.price.values.join('..')}`
  }

  resetFilters.value = false
  emits('filters-changed', filterString)
}

onMounted(() => {
  parseFiltersQuery()
})
</script>
