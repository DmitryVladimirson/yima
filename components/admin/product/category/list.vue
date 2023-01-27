<template>
  <div v-if="categories.length > 0">
    <FormKit type="group" name="categories">
      <div class="mb-1 block text-sm">
        {{ $t('categories') }}
      </div>
      <TheBaseCard class="flex flex-col gap-4">
        <div v-for="category in categories" :key="category.id">
          <AdminProductCategoryRowItem :category="category" />
        </div>
      </TheBaseCard>
    </FormKit>
  </div>
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
