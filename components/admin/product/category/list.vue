<template>
  <TheBaseCard v-if="categories.length > 0" class="flex flex-col gap-4">
    <div v-for="category in categories" :key="category.id">
      <AdminProductCategoryRowItem :category="category" />
    </div>
  </TheBaseCard>
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
