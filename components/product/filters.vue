<template>
  <div class="flex flex-col gap-4">
    <TheBaseCard class="flex flex-col justify-between gap-8 overflow-visible">
      <div class="flex flex-col gap-4">
        <TheH :level="4">{{ $t('categories') }}</TheH>
        <ul class="flex flex-col gap-4">
          <li class="flex items-center">
            <FormKit type="checkbox" label="Писечки" name="terms" :value="true" />
          </li>
          <li>
            <FormKit type="checkbox" label="Сисечки" name="terms" :value="true" />
          </li>
          <li>
            <FormKit type="checkbox" label="Попочки" name="terms" :value="true" />
          </li>
        </ul>
      </div>
      <TheSlider :min-selected="200" :max-selected="1500" :min="100" :max="2000">
        <template #label>
          <TheH :level="4">{{ $t('price') }}</TheH>
        </template>
      </TheSlider>
    </TheBaseCard>
    <TheButton class="btn btn-primary w-full">{{ $t('resetFilters') }}</TheButton>
  </div>
</template>
