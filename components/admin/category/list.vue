<template>
  <div v-if="categories.length > 0" class="flex flex-col gap-4">
    <div v-for="category in categories" :key="category.id">
      <AdminCategoryRowItem :category="category" />
    </div>
  </div>
  <TheMessageBox v-else :message="$t('noCategories')" />
</template>

<script setup lang="ts">
import { withDefaults } from 'vue'

interface Properties {
  categories: AdminCategory[]
}

withDefaults(defineProps<Properties>(), {
  categories: () => [],
})
</script>
