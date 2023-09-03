<template>
  <div class="flex flex-col gap-4">
    <div class="flex w-full items-end gap-4">
      <FormKit
        v-model="selectedNewAttributeId"
        type="select"
        outer-class="grow"
        :label="$t('attributes')"
        :options="attributesOptions"
        :disabled="attributesOptions?.length === 0"
        :placeholder="$t('chooseAttribute')"
      />
      <TheButton
        class="btn btn-primary"
        :disabled="!selectedNewAttributeId || attributesOptions?.length === 0"
        @click="handleAddAttribute"
        >{{ $t('add') }}
      </TheButton>
    </div>
    <FormKit v-if="allAttributes?.length > 0" type="group" :label="$t('categories')" name="attributes">
      <div class="flex flex-col gap-4">
        <div v-for="attribute in selectedAttributes" :key="attribute.id" class="flex flex-col">
          <div class="flex justify-between">
            <span class="text-sm">{{ attribute.name }}</span>
            <TheButton class="flex items-center gap-1 text-error" @click="handleDeleteAttribute(attribute.id)">
              <CloseIcon /> {{ $t('delete') }}
            </TheButton>
          </div>
          <FormKit :type="attribute.type" outer-class="grow" :step="1" validation="required" :name="attribute.id" />
        </div>
      </div>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from '#imports'
import CloseIcon from '~icons/mdi/close'
import { withDefaults } from 'vue'

interface Properties {
  allAttributes: AdminAttribute[]
  productAttributes: { id: string; value: string | number }[]
}

const properties = withDefaults(defineProps<Properties>(), {
  allAttributes: () => [],
  productAttributes: () => [],
})

const { allAttributes, productAttributes } = toRefs(properties)

const selectedNewAttributeId = ref('')
const selectedAttributes = ref<AdminAttribute[]>([])

if (allAttributes.value) {
  selectedAttributes.value = allAttributes.value.filter((attribute) =>
    productAttributes.value.some((productAttribute) => productAttribute.id === attribute.id)
  )
}

const attributesOptions = computed(() => {
  return allAttributes.value
    .filter((attribute) => !selectedAttributes.value.some((selectedAttribute) => selectedAttribute.id === attribute.id))
    .map((attribute) => {
      return { value: attribute.id, label: attribute.name }
    })
})

function handleAddAttribute() {
  const existingAttribute = allAttributes.value.find((attribute) => attribute.id === selectedNewAttributeId.value)

  if (
    !existingAttribute ||
    selectedAttributes.value.some((attribute) => attribute.id === selectedNewAttributeId.value)
  ) {
    return
  }

  selectedAttributes.value.unshift(existingAttribute)

  selectedNewAttributeId.value = ''
}

function handleDeleteAttribute(attributeId: string) {
  const existingAttributeIndex = selectedAttributes.value.findIndex((attribute) => attribute.id === attributeId)

  if (existingAttributeIndex === -1) {
    return
  }

  selectedAttributes.value.splice(existingAttributeIndex, 1)
}
</script>
