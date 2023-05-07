<template>
  <div>
    <FormKit
      v-if="product"
      v-model="formData"
      type="form"
      :actions="false"
      form-class="flex flex-col gap-4"
      @submit="handleSubmit"
    >
      <TheH :level="1">{{ product.name }}</TheH>
      <div class="flex items-center gap-4">
        <span>ID: {{ product.id }} </span>
        <span>{{ $t('createdAt') }}: {{ resolveDate }}</span>
      </div>
      <div><img :src="product.imgUrl" alt="" class="h-40 w-40" /></div>
      <FormKit type="file" name="image" :label="$t('image')" />
      <FormKit type="text" name="name" :label="$t('name')" />
      <FormKit type="text" name="slug" :label="$t('slug')" :help="$t('productPath')" />
      <FormKit type="textarea" name="description" :label="$t('description')" />
      <FormKit type="number" name="price" :min="1" :step="0.01" :label="$t('price')" />
      <FormKit type="number" name="oldPrice" :step="0.01" :label="$t('oldPrice')" />
      <FormKit type="number" name="minAmountToPurchase" :step="1" :min="1" :label="$t('minAmountToPurchase')" />
      <AdminProductCategoryList :categories="allCategories" />
      <AdminProductAttributes :all-attributes="allAttributes" :product-attributes="product.attributes" />
      <AdminProductFlavours v-model="flavours" />
      <FormKit type="checkbox" :value="false" name="inStock" :label="$t('inStock')" />
      <FormKit type="checkbox" :value="false" name="isVisible" :label="$t('visibility')" />
      <div class="flex items-center gap-4">
        <TheButton type="submit" class="btn btn-primary relative" :loading="submitPending">{{ $t('save') }}</TheButton>
        <TheButton
          type="button"
          class="btn btn-error relative text-white"
          :loading="productDeletePending"
          @click="handleDeleteButtonClick"
        >
          {{ $t('delete') }}
        </TheButton>
      </div>
    </FormKit>
    <TheModal v-slot="{ closeModal }" v-model="deleteProductModalOpen">
      <div class="flex flex-col items-center gap-6">
        <TheH :level="1" class="text-center">{{ $t('confirmDeleteProduct') }}</TheH>
        <div class="flex items-center gap-2">
          <TheButton class="btn btn-primary" @click=";[handleDeleteProduct(), closeModal()]">
            {{ $t('confirm') }}
          </TheButton>
          <TheButton class="btn" @click="closeModal">{{ $t('cancel') }}</TheButton>
        </div>
      </div>
    </TheModal>
  </div>
</template>

<script setup lang="ts">
import {
  createError,
  navigateTo,
  onMounted,
  ref,
  useI18n,
  useLocalePath,
  useRoute,
  useYimaAdminCategory,
  useYimaAdminProduct,
  useYimaHttp,
  useYimaToast,
  useYimaAdminAttribute,
  useYimaUtils,
} from '#imports'

const { getProduct, setProduct, uploadImage, deleteProduct } = useYimaAdminProduct()
const { getAttributes } = useYimaAdminAttribute()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { getCategories } = useYimaAdminCategory()
const { getDateStringFromUnix } = useYimaUtils()
const { t } = useI18n()
const route = useRoute()
const localPath = useLocalePath()

const formData = ref<Record<string, any>>({})
const deleteProductModalOpen = ref(false)
const productId = route.params.id as string

const [{ data: product }, { data: allCategories }, { data: allAttributesResponse }] = await Promise.all([
  getProduct(productId),
  getCategories(),
  getAttributes(),
])

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not found',
  })
}

const allAttributes = allAttributesResponse.value?.member

formData.value = {
  name: product.value.name,
  description: product.value.description,
  slug: product.value.slug,
  isVisible: product.value.isVisible,
  inStock: product.value.inStock,
  minAmountToPurchase: Number(product.value.minAmountToPurchase),
  price: Number(product.value.price),
  oldPrice: Number(product.value.oldPrice),
}

const flavours = ref(product.value.flavours ?? [])

onMounted(() => {
  for (const category of product.value.categories) {
    formData.value.categories[category] = true
  }

  for (const attribute of product.value.attributes) {
    formData.value.attributes[attribute.id] = attribute.value
  }
})

const resolveDate = computed(() => {
  return getDateStringFromUnix(product.value.createdAt)
})

const { execute: handleSubmit, pending: submitPending } = waitAnd(
  async ({ image, categories, attributes, ...data }: Record<string, any>) => {
    if (image[0]) {
      const { file: imgFile } = image[0]

      data.imgUrl = await uploadImage(imgFile, productId)
    }

    const categoriesArray = []
    for (const category in categories) {
      if (categories[category]) {
        categoriesArray.push(category)
      }
    }

    data.categories = categoriesArray

    const attributesArray = []
    for (const attribute in attributes) {
      if (attributes[attribute]) {
        let value = attributes[attribute]
        const existingAttribute = allAttributes?.find((allAttribute) => allAttribute.id === attribute)

        if (existingAttribute?.type === 'number') {
          value = Number(value)
        }

        if (existingAttribute && existingAttribute) attributesArray.push({ id: attribute, value })
      }
    }

    data.attributes = attributesArray

    const productData = {
      attributes: data.attributes,
      categories: data.categories,
      createdAt: data.createdAt,
      description: data.description,
      inStock: data.inStock,
      isVisible: data.isVisible,
      minAmountToPurchase: Number(data.minAmountToPurchase),
      name: data.name,
      price: Number(data.price),
      oldPrice: Number(data.oldPrice),
      slug: data.slug,
      flavours: flavours.value,
      ...(data.imgUrl ? { imgUrl: data.imgUrl } : {}),
    }

    return setProduct(productId, productData)
  },
  async (response) => {
    if (response.error.value) {
      return
    }

    toastSuccess(t('adminProductUpdateSuccess'))

    const { data } = await getProduct(productId)
    product.value = data.value
  }
)

function handleDeleteButtonClick() {
  deleteProductModalOpen.value = true
}

const { execute: handleDeleteProduct, pending: productDeletePending } = waitAnd(
  () => deleteProduct(productId),
  async (response) => {
    if (response.error.value) {
      return
    }

    toastSuccess(t('productDeleteSuccess'))

    await navigateTo(localPath('/admin/products'))
  }
)
</script>
