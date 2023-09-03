<template>
  <div v-bind="$attrs">
    <div class="flex flex-col gap-4">
      <TheBaseCard class="flex flex-col justify-between gap-8 overflow-visible">
        <div class="flex flex-col gap-4">
          <TheH :level="4">Категорії</TheH>
          <div role="status" class="flex max-w-sm animate-pulse flex-col gap-2">
            <div class="flex items-center gap-2">
              <FormKit type="checkbox" />
              <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <TheButton>
                <ChevronIcon class="text-sm" />
              </TheButton>
            </div>
            <div class="flex items-center gap-2">
              <FormKit type="checkbox" />
              <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="flex items-center gap-2">
              <FormKit type="checkbox" />
              <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="flex items-center gap-2">
              <FormKit type="checkbox" />
              <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <TheButton>
                <ChevronIcon class="text-sm" />
              </TheButton>
            </div>
            <div class="flex items-center gap-2">
              <FormKit type="checkbox" />
              <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="flex items-center gap-2">
              <FormKit type="checkbox" />
              <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="flex items-center gap-2">
              <FormKit type="checkbox" />
              <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="flex items-center gap-2">
              <FormKit type="checkbox" />
              <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="flex items-center gap-2">
              <FormKit type="checkbox" />
              <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="flex items-center gap-2">
              <FormKit type="checkbox" />
              <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div class="flex items-center gap-2">
              <FormKit type="checkbox" />
              <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <TheButton>
                <ChevronIcon class="text-sm" />
              </TheButton>
            </div>
          </div>
        </div>
      </TheBaseCard>
      <TheButton disabled class="btn btn-primary w-full">
        {{ $t('resetFilters') }}
      </TheButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChevronIcon from '~icons/mdi/chevron-down'
</script>
