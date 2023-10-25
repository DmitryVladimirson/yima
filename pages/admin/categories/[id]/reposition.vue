<template>
  <div>
    <FormKit
      v-if="positioned.length > 0"
      v-model="formData"
      type="form"
      :actions="false"
      form-class="flex flex-col gap-4"
      @submit="handleSubmit"
    >
      <TheH :level="1">{{ $t('adminCategoryArrangement') }}</TheH>
      <draggable
        v-model="positioned"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !dragging ? 'flip-list' : null,
        }"
        v-bind="dragOptions"
        item-key="position"
        class="flex list-none flex-col gap-1"
        @start="dragging = true"
        @end="dragging = false"
      >
        <template #item="{ element }">
          <li
            class="rounded-box border-2 border-dotted border-base-300 bg-base-100 p-2 dark:bg-neutral dark:text-neutral-content"
          >
            {{ element.name }}
          </li>
        </template>
      </draggable>
      <TheButton type="submit" class="btn btn-primary relative" :loading="submitPending">{{ $t('save') }}</TheButton>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { createError, useI18n, useRoute, useYimaAdminCategory, useYimaToast } from '#imports'
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import {
  fetchRelatives,
  storeRepositioned,
  fillPositionPropertyByOrder,
} from '~/composables/services/admin/category/categoryArrangeService'
import { useYimaHttp } from '~/composables/core/http'
import {sortRelativesByPosition} from "~/server/lib/categorySortUtil";

const { getCategory } = useYimaAdminCategory()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { t } = useI18n()
const route = useRoute()

const categoryId = route.params.id as string
const categoryResponse = await getCategory(categoryId)

if (!categoryResponse.data) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not found',
  })
}

const category = categoryResponse.data.value

const sameParentCategories = await fetchRelatives(category)
// eslint-disable-next-line prefer-const
let positioned = fillPositionPropertyByOrder(sortRelativesByPosition(sameParentCategories))

const formData = ref<Record<string, any>>()
const dragging = ref(false)

const dragOptions = computed(() => ({
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
}))

const { execute: handleSubmit, pending: submitPending } = waitAnd(
  async () => {
    return storeRepositioned(positioned)
  },
  async () => {
    toastSuccess(t('adminCategoryUpdateSuccess'))

    // Await navigateTo(localPath('/admin/categories/'))
  }
)
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
