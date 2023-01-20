<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-end">
      <TheLink to="/admin/categories/new" class="btn btn-primary">{{ $t('newCategory') }}</TheLink>
    </div>
    <AdminCategoryList :categories="categories" />
  </div>
</template>

<script setup lang="ts">
import { useYimaAdminCategory } from '#imports'

const { getCategories } = useYimaAdminCategory()

const { data: categories } = await getCategories()
</script>
`
