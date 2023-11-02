<template>
  <div v-if="categories.length > 0" class="mr-0.5 flex flex-col gap-2 pb-2">
    <div v-for="category in categories" :key="category.id">
      <AdminCategoryRowItem :category="category" :category-group="categories" />
    </div>
  </div>
  <TheMessageBox v-else-if="isRoot" :message="$t('noCategories')" />
</template>

<script setup lang="ts">
import { withDefaults } from 'vue'

interface Properties {
  categories: AdminCategory[]
  isRoot?: boolean
}

withDefaults(defineProps<Properties>(), {
  categories: () => [],
  isRoot: false,
})
</script>
