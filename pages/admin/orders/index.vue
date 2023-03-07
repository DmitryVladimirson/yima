<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-4">
      <h1>{{ $t('orders') }}</h1>
      <div class="flex flex-wrap gap-4">
        <FormKit v-model="fromDate" type="select" :options="fromDatesOptions" />
        <TheButton class="btn btn-primary relative" :loading="exportOrdersPending" @click="handleExportOrders">
          <DownloadIcon class="text-lg" />
        </TheButton>
      </div>
    </div>
    <template v-if="orders.member?.length > 0">
      <div class="flex flex-col items-center gap-4">
        <div class="w-full overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th class="bg-neutral text-neutral-content">{{ $t('order') }}</th>
                <th class="bg-neutral text-neutral-content">{{ $t('itemsNumber') }}</th>
                <th class="bg-neutral text-neutral-content">{{ $t('totalPriceProduct') }}</th>
                <th class="bg-neutral text-neutral-content">{{ $t('date') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders.member" :key="order.id" class="group relative">
                <td class="group-hover:bg-base-200">
                  <TheLink class="absolute inset-0 z-10" :to="`/admin/orders/${order.id}`" />
                  {{ order.shippingAddress.email }}
                </td>
                <td class="group-hover:bg-base-200">
                  {{ order.products.length }}
                </td>
                <td class="group-hover:bg-base-200">
                  <ThePrice :value="order.total" />
                </td>
                <td class="group-hover:bg-base-200">{{ getDateStringFromUnix(order.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <TheButton v-if="loadMoreButtonEnabled" class="btn btn-primary" @click="handleLoadMore">
          {{ $t('loadMore') }}
        </TheButton>
      </div>
    </template>
    <TheMessageBox v-else :message="$t('noOrdersFound')" />
  </div>
</template>

<script setup lang="ts">
import { useYimaAdminOrder, useYimaUtils, useYimaHttp, useI18n, ref } from '#imports'
import DownloadIcon from '~icons/mdi/download'

const { getOrders, exportOrders } = useYimaAdminOrder()
const { getDateStringFromUnix, getUnixDate } = useYimaUtils()
const { waitAnd } = useYimaHttp()
const { t } = useI18n()

const { data: orders } = await getOrders()

const fromDatesOptions = computed(() => {
  const dateNowUnix = getUnixDate()

  return [
    { value: dateNowUnix - 86_400, label: t('lastDay') },
    { value: dateNowUnix - 604_800, label: t('lastWeek') },
    { value: dateNowUnix - 2_629_743, label: t('lastMonth') },
    { value: undefined, label: t('allTime') },
  ]
})

const fromDate = ref(fromDatesOptions.value[0].value)

const loadMoreButtonEnabled = computed(() => {
  if (!orders.value?.member || !orders.value?.totalItems) {
    return false
  }

  return orders.value.member.length < orders.value.totalItems && orders.value.totalItems > 10
})

async function handleLoadMore() {
  const { data } = await getOrders({
    params: { anchorDocumentId: orders.value?.member.at(-1)?.id },
  })
  if (!data.value?.member) {
    return
  }

  orders.value?.member.push(...data.value.member)
}

const { execute: handleExportOrders, pending: exportOrdersPending } = waitAnd(() => exportOrders(fromDate.value))
</script>
