<template>
  <ProductPopup v-model="selectedProductSlug" />
  <TheSwiper
    navigation
    :autoplay="{ pauseOnMouseEnter: true, disableOnInteraction: false }"
    :modules="[SwiperNavigation, SwiperAutoplay]"
    :slides-per-view="1"
    :slides-per-group="1"
    :space-between="10"
    :pagination="{ clickable: true }"
    :breakpoints="{
      [parseInt(theme.screens.sm)]: { slidesPerView: 2, slidesPerGroup: 2 },
      [parseInt(theme.screens.md)]: { slidesPerView: 3, slidesPerGroup: 3 },
      [parseInt(theme.screens.lg)]: { slidesPerView: 4, slidesPerGroup: 4 },
      [parseInt(theme.screens.xl)]: { slidesPerView: 5, slidesPerGroup: 5 },
    }"
  >
    <SwiperSlide v-for="product in products" :key="product.slug" class="!h-auto">
      <ProductCard :class="{ 'h-full': products.length > 1 }" :product="product" @show-popup="handleShowPopup" />
    </SwiperSlide>
  </TheSwiper>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports'
import { withDefaults } from 'vue'

const { theme } = useAppConfig()

const selectedProductSlug = ref('')

interface Properties {
  products: Product[]
}

withDefaults(defineProps<Properties>(), {
  products: () => [],
})

const handleShowPopup = (product: Product) => {
  selectedProductSlug.value = product.toString()
}
</script>
