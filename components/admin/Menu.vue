<template>
  <div class="flex">
    <TheButton class="btn btn-primary flex h-10 min-h-0 w-10 rounded-lg p-1.5 lg:hidden" @click="handleShowDrawer">
      <MenuIcon class="text-xl" />
    </TheButton>

    <div
      class="drawer drawer-mobile fixed top-0 left-0 grid-cols-12"
      :class="[drawerVisible ? 'z-50 ' : '-z-10 delay-300 lg:z-0']"
    >
      <input id="admin-menu" v-model="drawerVisible" type="checkbox" class="drawer-toggle" />
      <div class="drawer-side col-span-12 block lg:col-span-2">
        <label for="admin-menu" class="drawer-overlay"></label>
        <div
          class="bg-neutral text-neutral-content z-50 flex w-1/2 flex-col items-center justify-start divide-y lg:w-full"
        >
          <TheLogo to="/admin" class="flex-grow py-6" />

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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n, ref } from '#imports'
import MenuIcon from '~icons/mdi/menu'
import CubeIcon from '~icons/mdi/cube-outline'
import CartIcon from '~icons/mdi/cart'
import FolderIcon from '~icons/mdi/folder'
import AttributesIcon from '~icons/mdi/tag-multiple'

const { t } = useI18n()
const drawerVisible = ref(false)

const menu = [
  {
    name: t('orders'),
    link: '/admin/orders',
    icon: CartIcon,
  },
  {
    name: t('allProducts'),
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
  {
    name: t('settings'),
    link: '/admin/settings',
    icon: AttributesIcon,
  },
]

function handleShowDrawer() {
  drawerVisible.value = true
}
</script>
