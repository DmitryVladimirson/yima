<template>
  <div
    v-if="category"
    tabindex="0"
    class="border-base-300 bg-base-100 rounded-box collapse border"
    :class="[collapseOpen ? 'collapse-open' : 'collapse-close']"
  >
    <div class="collapse-title flex items-center justify-between text-xl font-medium">
      <TheLink :to="`/admin/categories/${category.id}`">{{ category.name }}</TheLink>
      <TheButton v-if="category.children.length > 0" @click="toggleCollapse"><ChevronIcon /></TheButton>
    </div>
    <template v-if="category.children.length > 0">
      <div class="collapse-content flex flex-col gap-2">
        <AdminCategoryRowItem v-for="child in category.children" :key="child.id" :category="child" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from '#imports'
import ChevronIcon from '~icons/mdi/chevron-down'
import { withDefaults } from 'vue'

const collapseOpen = ref(true)

interface Properties {
  category: AdminCategory
}

withDefaults(defineProps<Properties>(), {
  category: undefined,
})

function toggleCollapse() {
  collapseOpen.value = !collapseOpen.value
}
</script>
<style scoped>
.collapse-open .collapse-content,
.collapse:focus:not(.collapse-close) .collapse-content,
.collapse:not(.collapse-close) input[type='checkbox']:checked ~ .collapse-content {
  max-height: 0px;
}

.collapse-open > .collapse-content,
.collapse:focus:not(.collapse-close) .collapse-content,
.collapse:not(.collapse-close) input[type='checkbox']:checked ~ .collapse-content {
  max-height: none;
}
</style>
