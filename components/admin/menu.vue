<template>
  <div class="bg-neutral text-neutral-content flex flex-col items-center justify-start divide-y">
    <TheLink to="/admin" class="flex-grow py-6 text-xl font-bold normal-case">
      <span>Euro</span>
      <span class="text-amber-400 dark:text-cyan-400">PRICE.</span>
    </TheLink>

    <div class="h-full w-full divide-y">
      <TheLink
        v-for="item in menu"
        :key="item.name"
        class="hover:bg-neutral-focus flex items-center gap-2 px-4 py-3 transition hover:text-white"
        :to="item.link"
      >
        <component :is="item.icon" class="text-sm" />
        <span>
          {{ item.name }}
        </span>
      </TheLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'
import CubeIcon from '~icons/mdi/cube-outline'
import FolderIcon from '~icons/mdi/folder'
import AttributesIcon from '~icons/mdi/tag-multiple'

const { t } = useI18n()

const menu = [
  {
    name: t('products'),
    link: '/admin/products',
    icon: CubeIcon,
  },
  {
    name: t('categories'),
    link: '/admin/categories',
    icon: FolderIcon,
  },
  {
    name: t('attributes'),
    link: '/admin/attributes',
    icon: AttributesIcon,
  },
]
</script>
