<template>
  <div
    v-if="category"
    tabindex="0"
    class="collapse rounded-box border border-base-300 bg-base-100 pl-2 dark:bg-neutral dark:text-neutral-content"
    :class="[collapseOpen ? 'collapse-open' : 'collapse-close']"
  >
    <div class="collapse-title flex items-center justify-between text-xl font-medium">
      <TheLink :to="`/admin/categories/${category.id}`" class="pl-1">{{ category.name }}</TheLink>
      <div>
        <TheButton v-if="category.children?.length > 0" @click="toggleCollapse"><ChevronIcon /></TheButton>
        <TheButton
          v-if="categoryGroup.length > 1"
          @click="goToDragMenu(category.id)"
          >|||</TheButton
        >
      </div>
    </div>
    <AdminCategoryList
      v-show="collapseOpen"
      v-if="category.children?.length > 0"
      :categories="category.children as AdminCategory[]"
    />
  </div>
</template>

<script setup lang="ts">
import { navigateTo, ref, useLocalePath } from '#imports'
import ChevronIcon from '~icons/mdi/chevron-down'
import { withDefaults } from 'vue'

const localPath = useLocalePath()

const collapseOpen = ref(true)

interface Properties {
  category: AdminCategory
  categoryGroup: AdminCategory[]
  childrenIgnored?: boolean
}

withDefaults(defineProps<Properties>(), {
  category: undefined,
  categoryGroup: () => [],
})

function toggleCollapse() {
  collapseOpen.value = !collapseOpen.value
}

async function goToDragMenu(id: string) {
  await navigateTo(localPath(`/admin/categories/${id}/reposition`))
}
</script>
