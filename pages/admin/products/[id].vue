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
      <FormKit type="number" name="price" :label="$t('price')" />
      <FormKit type="group" name="categories" :label="$t('categories')">
        <div class="-mb-2 block text-sm">
          {{ $t('categories') }}
        </div>
        <AdminProductCategoryList :categories="allCategories" />
      </FormKit>
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
} from '#imports'

const { getProduct, setProduct, uploadImage, deleteProduct } = useYimaAdminProduct()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { getCategories } = useYimaAdminCategory()
const { t } = useI18n()
const route = useRoute()
const localPath = useLocalePath()

const formData = ref<Record<string, any>>({})
const deleteProductModalOpen = ref(false)
const productId = route.params.id as string

const [{ data: product }, { data: allCategories }] = await Promise.all([getProduct(productId), getCategories()])

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not found',
  })
}

formData.value = {
  name: product.value.name,
  description: product.value.description,
  slug: product.value.slug,
  isVisible: product.value.isVisible,
  inStock: product.value.inStock,
  price: Number(product.value.price),
}

onMounted(() => {
  for (const category of product.value.categories) {
    formData.value.categories[category] = true
  }
})

const resolveDate = computed(() => {
  const dateObject = new Date(product.value.createdAt * 1000)

  return dateObject.toLocaleString('uk-UA', { timeStyle: 'short', dateStyle: 'short' }) // 2019-12-9 10:30:15
})

const { execute: handleSubmit, pending: submitPending } = waitAnd(
  async ({ image, categories, ...data }: Record<string, any>) => {
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

    return setProduct(productId, data)
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
