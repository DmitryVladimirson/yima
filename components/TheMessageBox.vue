<template>
  <div
    class="mb-4 flex w-full items-center gap-3 rounded p-3 text-sm"
    :class="[
      {
        'bg-info': type === 'info',
        'bg-success': type === 'success',
        'bg-warning': type === 'warning',
        'bg-danger': type === 'danger',
      },
      defaultClass,
    ]"
    role="alert"
  >
    <slot name="icon">
      <template v-if="type === 'success'">
        <SuccessIcon class="h-auto w-8" />
      </template>
      <template v-else-if="type === 'warning'">
        <WarningIcon class="h-auto w-8" />
      </template>
      <template v-else-if="type === 'danger'">
        <DangerIcon class="h-auto w-8" />
      </template>
      <template v-else>
        <InfoIcon class="h-auto w-8" />
      </template>
    </slot>
    <div class="flex flex-col">
      <div v-if="title" class="font-bold">
        {{ title }}
      </div>
      <div v-if="message" v-html="message"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WarningIcon from '~icons/mdi/alert-circle-outline'
import SuccessIcon from '~icons/mdi/check-circle-outline'
import DangerIcon from '~icons/mdi/close-octagon'
import InfoIcon from '~icons/mdi/information-outline'
import { withDefaults } from 'vue'

interface Properties {
  defaultClass?: string
  message: string
  title?: string
  type?: string
}

withDefaults(defineProps<Properties>(), {
  defaultClass: 'text-white',
  message: '',
  title: '',
  type: 'info',
})
</script>
