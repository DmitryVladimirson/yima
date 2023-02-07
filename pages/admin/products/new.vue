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
      <AdminProductCategoryList :categories="allCategories" />
      <AdminProductAttributes :all-attributes="allAttributes.member" />
      <FormKit type="textarea" name="description" :label="$t('description')" />
      <FormKit type="number" validation="required" name="price" :step="0.01" :label="$t('price')" />
      <FormKit type="number" name="minAmountToPurchase" :step="1" :min="1" :label="$t('minAmountToPurchase')" />
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
  useYimaAdminAttribute,
  navigateTo,
  useLocalePath,
} from '#imports'

const { addProduct, uploadImage, setProduct } = useYimaAdminProduct()
const { waitAnd } = useYimaHttp()
const { toastSuccess } = useYimaToast()
const { getCategories } = useYimaAdminCategory()
const { getAttributes } = useYimaAdminAttribute()
const { transliterate, getUnixDate } = useYimaUtils()
const { t } = useI18n()
const localePath = useLocalePath()

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

const [{ data: allCategories }, { data: allAttributes }] = await Promise.all([
  getCategories(),
  getAttributes({ params: { per_page: -1 } }),
])

const { execute: handleSubmit, pending: submitPending } = waitAnd(
  async ({ image, categories, attributes, ...data }: Record<string, any>) => {
    const categoriesArray = []
    for (const category in categories) {
      if (categories[category]) {
        categoriesArray.push(category)
      }
    }

    const attributesArray = []
    for (const attribute in attributes) {
      if (attributes[attribute]) {
        let value = attributes[attribute]
        const existingAttribute = allAttributes.value?.member.find((allAttribute) => allAttribute.id === attribute)

        if (existingAttribute?.type === 'number') {
          value = Number(value)
        }

        if (existingAttribute && existingAttribute) attributesArray.push({ id: attribute, value })
      }
    }

    data.attributes = attributesArray
    data.categories = categoriesArray
    data.createdAt = getUnixDate()
    data.imgUrl = ''

    const productData = {
      attributes: data.attributes,
      categories: data.categories,
      createdAt: data.createdAt,
      description: data.description,
      id: data.id,
      imgUrl: data.imgUrl,
      inStock: data.inStock,
      isVisible: data.isVisible,
      minAmountToPurchase: Number(data.minAmountToPurchase),
      name: data.name,
      price: Number(data.price),
      slug: data.slug,
    }

    const addProductResponse = await addProduct(productData, { validationFormRef: 'productNewFormReference' })

    if (addProductResponse.error.value || image.length === 0 || !addProductResponse.data.value) {
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

    await navigateTo(localePath('/admin/products'))
  }
)

watch(resolveSlug, (value) => {
  slug.value = value
})

watch(resolveId, (value) => {
  id.value = value
})
</script>
