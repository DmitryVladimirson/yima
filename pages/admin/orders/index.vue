<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-4">
      <h1>{{ $t('orders') }}</h1>
      <div>
        <div class="dropdown-end dropdown">
          <TheButton class="btn btn-primary relative" :loading="exportOrdersPending">
            <span class="indicator">
              <DownloadIcon class="text-lg" />
            </span>
          </TheButton>

          <div tabindex="0" class="dropdown-content">
            <VueDatePicker v-model="fromDate" inline range @update:model-value="handleExportOrders" />
          </div>
        </div>
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
import { useYimaAdminOrder, useYimaUtils, useYimaHttp, ref } from '#imports'
import DownloadIcon from '~icons/mdi/download'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const { getOrders, exportOrders } = useYimaAdminOrder()
const { getDateStringFromUnix, getUnixDate } = useYimaUtils()
const { waitAnd } = useYimaHttp()

const { data: orders } = await getOrders()

const fromDate = ref()

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

const { execute: handleExportOrders, pending: exportOrdersPending } = waitAnd(() => {
  const finalDateFrom = getUnixDate(fromDate.value[0])
  let finalDateTo = getUnixDate(fromDate.value[1])
  if (finalDateTo === finalDateFrom) {
    finalDateTo += 86_400
  }

  return exportOrders(finalDateFrom, finalDateTo)
})

onMounted(() => {
  const startDate = new Date()
  const endDate = new Date(new Date().setDate(startDate.getDate() + 1))
  fromDate.value = [startDate, endDate]
})
</script>
