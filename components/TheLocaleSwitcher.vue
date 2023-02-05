<template>
  <FormKit
    v-model="currentLocale"
    type="select"
    input-class="border-none shadow"
    :options="localeOptions"
    @input="handleSwitchLocale"
  />
</template>

<script lang="ts" setup>
import { useI18n, ref } from '#imports'

const { setLocale, locale } = useI18n()

const currentLocale = ref(locale.value)

const localeOptions = [
  { value: 'uk', label: 'UA' },
  { value: 'ru', label: 'RU' },
]

async function handleSwitchLocale() {
  await setLocale(currentLocale.value)
}
</script>
