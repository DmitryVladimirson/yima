<template>
  <div v-if="category" tabindex="0" class="collapse" :class="[collapseOpen ? 'collapse-open' : 'collapse-close']">
    <div class="collapse-title flex min-h-0 items-center gap-2 p-1 text-xl font-medium">
      <FormKit type="checkbox" :label="category.name" :name="category.id" />
      <TheButton
        v-if="category.children.length > 0"
        class="transition"
        :class="{
          'rotate-180': collapseOpen,
        }"
        @click="toggleCollapse"
        ><ChevronIcon
      /></TheButton>
    </div>
    <template v-if="category.children.length > 0">
      <div class="collapse-content flex flex-col gap-2 pb-0">
        <AdminProductCategoryRowItem v-for="child in category.children" :key="child.id" :category="child" />
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
