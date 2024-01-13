<template>
  <div
    v-if="product"
    v-show="popupOpen"
    class="fixed left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50"
  >
    <div class="absolute left-0 top-0 z-40 h-full w-full" @click="closePopup"></div>
    <div
      class="z-50 flex h-full min-h-fit w-full max-w-full flex-col-reverse overflow-y-auto bg-white p-8 pb-4 text-gray-800 shadow-md lg:h-fit lg:w-fit lg:flex-row lg:overflow-y-hidden lg:rounded-2xl"
    >
      <!-- Add to Cart Form -->
      <div class="flex-column y-fit flex-shrink overflow-y-auto lg:w-[280px] lg:overflow-y-hidden">
        <!-- Price Info -->
        <div class="mb-4 flex flex-col-reverse">
          <ThePrice v-if="product.oldPrice" class="text-xl line-through" :value="product.oldPrice"></ThePrice>
          <div class="flex flex-col">
            <span class="font-bold">{{ $t('price') }}:</span>
            <span class="self-start text-3xl font-bold text-black">
              <ThePrice :value="product.price"></ThePrice>
            </span>
          </div>
        </div>

        <!-- Quantity Select -->
        <div class="mb-4 flex flex-col gap-2">
          <span class="font-bold">{{ $t('amount') }}:</span>
          <QuantityBox v-model="quantity" :min="product.minAmountToPurchase" />
        </div>

        <!-- Flavour Select -->
        <div v-if="product.flavours?.length > 0" class="mb-4">
          <FormKit v-model="flavour" :label="$t(productClassification)" type="select" :options="product.flavours" />
        </div>

        <!-- Add to Cart Button -->
        <TheButton :disabled="!product.inStock" class="btn btn-primary w-full grow gap-4 text-base" @click="addToCart">
          <AddToCartIcon class="h-auto w-6" />
          <span class="text-sm lg:text-base">{{ $t('addToCart') }}</span>
        </TheButton>
      </div>

      <div class="mt-0 flex-grow lg:ml-8 lg:w-[420px]">
        <!-- Product Title and Close Button -->
        <div class="mb-4 flex items-center justify-between">
          <TheH :level="2">{{ product.name }}</TheH>
          <TheButton class="h-8 w-8" @click="closePopup">
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </TheButton>
        </div>
        <!-- Product Picture -->
        <img :src="product.imgUrl" class="h-auto w-full object-contain" :alt="product?.name" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useI18n, useYimaProduct, useYimaToast } from '#imports'
import AddToCartIcon from '~icons/mdi/cart-plus'
import { toRefs } from 'vue'
import { withDefaults } from 'vue/dist/vue'

const { addProductToOrder, getProductBySlug } = useYimaProduct()
const { toastSuccess } = useYimaToast()
const { t } = useI18n()

interface Properties {
  modelValue: string
}

const properties = withDefaults(defineProps<Properties>(), {
  modelValue: '',
})

const emits = defineEmits(['update:modelValue'])

const popupOpen = ref(false)
const product = ref<Product>()
const nonFood = ref(false)
const flavour = ref<string>()
const quantity = ref(1)
const productClassification = ref('flavours')

const { modelValue } = toRefs(properties)

watch(modelValue, async (updated) => {
  if (updated === undefined || updated === '') {
    return
  }

  const { data: loadedProduct } = await getProductBySlug(updated)
  if (loadedProduct.value === undefined) {
    closePopup()
  }

  product.value = loadedProduct.value

  tryOpenPopup()
})

const addToCart = () => {
  if (product.value === undefined) {
    return
  }

  addProductToOrder(product.value, quantity.value, flavour.value)
  toastSuccess(t('addedToCart', { productName: product.value.name }))
  closePopup()
}

function tryOpenPopup() {
  popupOpen.value = product.value !== undefined
  quantity.value = product.value?.minAmountToPurchase ?? 1
  flavour.value = product.value?.flavours?.[0]
  nonFood.value = product.value?.nonFood ?? false
  productClassification.value = nonFood.value ? 'types' : 'flavours'
}

function closePopup() {
  popupOpen.value = false
  product.value = undefined
  emits('update:modelValue', '')
}
</script>
