<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-4">
      <h1>{{ $t('lastOrders') }}</h1>
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
      </div>
    </template>
    <TheMessageBox v-else :message="$t('noOrdersFound')" />
  </div>
</template>

<script setup lang="ts">
import { useYimaAdminOrder, useYimaUtils } from '#imports'

const { getOrders } = useYimaAdminOrder()
const { getDateStringFromUnix } = useYimaUtils()

const { data: orders } = await getOrders()
</script>
