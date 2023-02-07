<template>
  <div v-if="product" class="container flex flex-col gap-10">
    <div class="grid gap-10 md:grid-cols-2 md:gap-20">
      <figure class="mx-auto flex w-1/2 items-center md:w-full">
        <img :src="product.imgUrl" width="500" height="500" class="h-full w-full object-contain" :alt="product.name" />
      </figure>
      <div class="flex flex-col justify-start gap-4 md:gap-6">
        <TheH :level="1">{{ product.name }}</TheH>
        <TheBaseCard class="gap-6 p-8">
          <div class="flex flex-row justify-between">
            <div class="flex flex-col gap-2">
              <span class="font-bold">{{ $t('amount') }}:</span>
              <QuantityBox v-model="quantity" :min="minPurchaseAmount" />
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex flex-col">
                <span class="font-bold">{{ $t('price') }}:</span>
                <span class="self-start text-3xl font-bold text-black">
                  <ThePrice :value="product.price"></ThePrice>
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between gap-4">
            <div>
              <div class="flex">
                <ProductStock class="grow" :in-stock="product.inStock" />
              </div>
            </div>
            <div v-if="product.categories.length > 0" class="flex items-center gap-4">
              {{ $t('categories') }}:
              {{ product.categories.join(', ') }}
            </div>
          </div>

          <div class="flex flex-wrap gap-2 sm:flex-nowrap">
            <TheButton
              :disabled="!product.inStock"
              class="btn btn-primary grow gap-4 text-base sm:w-auto"
              @click="handleAddToOrder"
            >
              <AddToCartIcon class="h-auto w-6" />
              <span class="text-sm lg:text-base">{{ $t('addToCart') }}</span>
            </TheButton>
          </div>
        </TheBaseCard>
        <div v-if="product.description" class="flex flex-col gap-2">
          <TheH :level="2">{{ $t('description') }} </TheH>
          <p>{{ product.description }}</p>
        </div>
        <div v-if="product.attributes.length > 0" class="flex flex-col gap-2">
          <TheH :level="2">{{ $t('attributes') }} </TheH>
          <div class="w-full overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th class="bg-neutral text-neutral-content">{{ $t('name') }}</th>
                  <th class="bg-neutral text-neutral-content">{{ $t('value') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="attribute in product.attributes" :key="attribute.name" class="group relative">
                  <td class="group-hover:bg-base-200">
                    <div class="max-w-xs truncate font-bold">{{ attribute.name }}</div>
                  </td>
                  <td class="group-hover:bg-base-200">
                    {{ attribute.value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useYimaProduct, useRoute, createError, useYimaToast, useI18n, ref } from '#imports'
import AddToCartIcon from '~icons/mdi/cart-plus'

const { getProductBySlug, addProductToOrder } = useYimaProduct()
const { toastSuccess } = useYimaToast()
const { t } = useI18n()
const route = useRoute()

const { data: product } = await getProductBySlug(String(route.params.slug))

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not found',
  })
}

const minPurchaseAmount = computed(() => {
  const amountAttribute = product.value?.attributes.find((attribute) => attribute.id === "Kil'kist'-v-upakovtsi-(sht.)")
  if (!amountAttribute) {
    return 1
  }

  return Number(amountAttribute.value)
})

const quantity = ref(minPurchaseAmount.value)

function handleAddToOrder() {
  addProductToOrder(product.value, quantity.value)
  toastSuccess(t('addedToCart', { productName: product.value.name }))
}
</script>
