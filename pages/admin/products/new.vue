<template>
  <div class="flex flex-col gap-8">
    <div>
      <TheH> {{ $t('newProduct') }}</TheH>
    </div>
    <FormKit
      ref="productNewFormReference"
      v-model="formData"
      type="form"
      :actions="false"
      form-class="flex flex-col gap-4"
      @submit="handleSubmit"
    >
      <FormKit type="text" name="name" validation="required" :label="$t('name')" />
      <FormKit
        v-model="slug"
        type="text"
        validation="required"
        name="slug"
        :label="$t('slug')"
        :help="$t('productPath')"
      />
      <FormKit v-model="id" type="text" validation="required" name="id" :label="$t('id')" />
      <FormKit type="group" name="categories" :label="$t('categories')">
        <div class="-mb-2 block text-sm">
          {{ $t('categories') }}
        </div>
        <AdminProductCategoryList :categories="allCategories" />
      </FormKit>
      <FormKit type="textarea" name="description" :label="$t('description')" />
      <FormKit type="number" validation="required" name="price" :label="$t('price')" />
      <FormKit type="file" name="image" :label="$t('image')" />
      <FormKit type="checkbox" name="inStock" :label="$t('inStock')" />
      <FormKit type="checkbox" name="isVisible" :label="$t('visibility')" />
      <TheButton type="submit" class="btn btn-primary relative" :loading="submitPending">
        {{ $t('save') }}
      </TheButton>
    </FormKit>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  useI18n,
  useYimaAdminCategory,
  useYimaAdminProduct,
  useYimaHttp,
  useYimaToast,
  useYimaUtils,
} from '#imports'

const { addProduct, uploadImage, setProduct } = useYimaAdminProduct()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { getCategories } = useYimaAdminCategory()
const { transliterate } = useYimaUtils()
const { t } = useI18n()

const initialFormData = { isVisible: true, inStock: true }

const formData = ref<Record<string, any>>(initialFormData)
const productNewFormReference = ref()
const slug = ref('')
const id = ref('')

const resolveSlug = computed(() => {
  const slug = formData.value.name
  if (!slug) {
    return ''
  }

  return transliterate(slug.replaceAll(' ', '_'))
})

const resolveId = computed(() => {
  const id = formData.value.name
  if (!id) {
    return ''
  }

  return transliterate(id.replaceAll(' ', '-'))
})

const { data: allCategories } = await getCategories()

const { execute: handleSubmit, pending: submitPending } = waitAnd(
  async ({ price, image, categories, ...data }: Record<string, any>) => {
    const product = { ...data, price: Number(price) } as AdminProduct

    const categoriesArray = []
    for (const category in categories) {
      if (categories[category]) {
        categoriesArray.push(category)
      }
    }

    product.categories = categoriesArray
    product.createdAt = Math.floor(Date.now() / 1000)
    product.imgUrl = ''

    const addProductResponse = await addProduct(product, { validationFormRef: 'productNewFormReference' })

    if (addProductResponse.error.value || image.length === 0) {
      return addProductResponse
    }

    const productNew = addProductResponse.data.value

    const { file: imgFile } = image[0]

    const imgUrl = await uploadImage(imgFile, productNew.id)

    return setProduct(productNew.id, { imgUrl })
  },
  async (response) => {
    if (response.error.value) {
      return
    }

    toastSuccess(t('adminProductAddSuccess'))

    formData.value = initialFormData
  }
)

watch(resolveSlug, (value) => {
  slug.value = value
})

watch(resolveId, (value) => {
  id.value = value
})
</script>
