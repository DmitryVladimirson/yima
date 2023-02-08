<template>
  <section class="container flex flex-col gap-6">
    <TheH :level="2" class="text-center">
      {{ $t('productsOfTheWeek') }}
    </TheH>

    <TheSwiper
      navigation
      autoplay
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
      <SwiperSlide v-for="product in chosenProducts" :key="product.slug" class="!h-auto">
        <ProductCard :product="product" />
      </SwiperSlide>
    </TheSwiper>
  </section>
</template>

<script lang="ts" setup>
import { useAppConfig } from '#imports'
import { withDefaults } from 'vue'

const { theme } = useAppConfig()
interface Properties {
  chosenProducts: Product[]
}

withDefaults(defineProps<Properties>(), {
  chosenProducts: () => [],
})
</script>
