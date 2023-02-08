<template>
  <section class="container flex items-center justify-around rounded-xl bg-white p-8">
    <DeliveryIcon style="color: black" class="max-lg:hidden" width="100" height="100" />
    <div class="container m-0 flex w-fit flex-col">
      <h2 class="mb-4 text-black">Запускаємо безкоштовну доставку по Ужгороду!</h2>
      <p class="text-black">
        Просто замовляй, а ми доставимо <span class="text-success">ШВИДКО</span> та
        <span class="text-success">БЕЗКОШТОВНО</span>.
      </p>
    </div>
  </section>
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
import DeliveryIcon from '~icons/mdi/truck-delivery-outline'
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
