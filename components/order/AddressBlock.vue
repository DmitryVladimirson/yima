<template>
  <div class="flex flex-col gap-2">
    <TheH :level="2">{{ $t('address') }}</TheH>
    <TheBaseCard class="flex flex-col gap-4 overflow-visible p-4">
      <template v-if="shippingOption.department">
        <div>
          <div>{{ $t('city') }}</div>
          <TheCombobox
            v-model="selectedCity"
            :loading="searchCitiesPending"
            :data="cities"
            @query-changed="handleSearchCities"
          />
        </div>
        <div>
          <div>{{ $t('branchAddress') }}</div>
          <TheCombobox
            v-model="selectedDepartment"
            :disabled="!selectedCity"
            :data="departments"
            :loading="searchDepartmentsPending"
            @query-changed="handleSearchDepartments"
          />
        </div>
      </template>
      <template v-else>
        <div v-if="!isUzhgorod">
          <div>{{ $t('city') }}</div>
          <TheCombobox
            v-model="selectedCity"
            :loading="searchCitiesPending"
            :data="cities"
            @query-changed="handleSearchCities"
          />
        </div>
        <div>
          <div>{{ $t('street') }}</div>
          <TheCombobox
            v-model="selectedStreet"
            :disabled="!selectedCity"
            :data="streets"
            :loading="searchStreetsPending"
            @query-changed="handleSearchStreets"
          />
        </div>
        <div>
          <div>{{ $t('buildingNum') }}</div>
          <FormKit v-model="buildingNumber" :disabled="!selectedStreet" type="text" />
        </div>
      </template>
    </TheBaseCard>
  </div>
</template>
<script setup lang="ts">
import { ref, useYimaHttp, useDebounceFn, toRefs, useRuntimeConfig } from '#imports'

import { withDefaults } from 'vue'

const emits = defineEmits(['update:modelValue'])

interface Properties {
  shippingOption: { label: string; department: boolean; service: string }
}

const properties = withDefaults(defineProps<Properties>(), {
  shippingOption() {
    return { label: 'Адресса', department: false, service: '' }
  },
})

const { shippingOption } = toRefs(properties)

const { waitAnd } = useYimaHttp()
const config = useRuntimeConfig()

const isUzhgorod = computed(() => !shippingOption.value.department && !shippingOption.value.service)

const buildingNumber = ref('')
const cities = ref([])
const streets = ref([])
const departments = ref([])
const selectedCity = ref<{ id: string; description: string } | undefined>(
  isUzhgorod.value
    ? {
        id: 'e71f4773-4b33-11e4-ab6d-005056801329',
        description: 'Ужгород',
      }
    : undefined
)
const selectedStreet = ref<{ id: string; description: string }>()
const selectedDepartment = ref<{ id: string; description: string }>()
const searchDepartmentsPending = ref(false)
const searchCitiesPending = ref(false)
const searchStreetsPending = ref(false)

const novaPoshtaApiEntryPoint = 'https://api.novaposhta.ua/v2.0/json/'
const novaPoshtaApiKey = config.public.novaposhtaApiKey
const deliveryApiEntryPoint = 'https://www.delivery-auto.com/api/v4/Public'

const isNovaPoshta = computed(() => shippingOption.value.service === 'novaposhta')
const isDelivery = computed(() => shippingOption.value.service === 'delivery')

const { execute: searchCities } = waitAnd(
  (query?: string) => {
    if (query === '') {
      cities.value = []
      searchCitiesPending.value = false

      return
    }

    if (!shippingOption.value.department || isNovaPoshta.value) {
      const cityQuery = query ?? 'київ'

      return useFetch(novaPoshtaApiEntryPoint, {
        method: 'post',
        body: JSON.stringify({
          apiKey: novaPoshtaApiKey,
          modelName: 'Address',
          calledMethod: 'searchSettlements',
          methodProperties: { CityName: cityQuery, Limit: '50', Page: '1' },
        }),
      })
    }

    if (isDelivery.value) {
      return useFetch(`${deliveryApiEntryPoint}/GetAreasList`, {
        method: 'get',
      })
    }
  },
  (response) => {
    searchCitiesPending.value = false

    if (!response?.data.value || response.error.value) {
      return
    }

    if (!shippingOption.value.department || isNovaPoshta.value) {
      if (!response.data.value.data[0]?.Addresses) {
        cities.value = []

        return
      }

      cities.value = response.data.value.data[0].Addresses.map((address: Record<string, any>) => {
        return {
          id: shippingOption.value.department ? address.DeliveryCity : address.Ref,
          description: address.Present,
        }
      })

      return
    }

    if (isDelivery.value) {
      if (response.data.value.data.length === 0) {
        cities.value = []

        return
      }

      cities.value = response.data.value.data.map((address: Record<string, any>) => {
        return { id: address.id, description: `${address.name}, ${address.regionName}` }
      })
    }
  }
)

searchCities()

const debounceSearchCities = useDebounceFn(searchCities, 1000)

async function handleSearchCities(query: string) {
  searchCitiesPending.value = true
  await debounceSearchCities(query)
}

const { execute: searchDepartments } = waitAnd(
  (query: string) => {
    if (!selectedCity.value?.id) {
      departments.value = []

      return
    }

    if (isNovaPoshta.value) {
      return useFetch(novaPoshtaApiEntryPoint, {
        method: 'post',
        body: JSON.stringify({
          apiKey: novaPoshtaApiKey,
          modelName: 'Address',
          calledMethod: 'getWarehouses',
          methodProperties: {
            CityRef: selectedCity.value.id,
            FindByString: query,
            Limit: '50',
            Page: '1',
          },
        }),
      })
    }

    if (isDelivery.value) {
      return useFetch(`${deliveryApiEntryPoint}/GetWarehousesList`, {
        method: 'get',
        query: {
          CityId: selectedCity.value.id,
        },
      })
    }
  },
  (response) => {
    searchDepartmentsPending.value = false

    if (!response?.data.value || response.error.value) {
      return
    }

    if (response.data.value.data.length === 0) {
      departments.value = []

      return
    }

    if (isNovaPoshta.value) {
      departments.value = response.data.value.data.map((address: Record<string, any>) => {
        return { id: address.Ref, description: address.Description }
      })

      return
    }

    if (isDelivery.value) {
      departments.value = response.data.value.data.map((address: Record<string, any>) => {
        return { id: address.id, description: address.address }
      })
    }
  }
)

const debounceSearchDepartments = useDebounceFn(searchDepartments, 1000)

async function handleSearchDepartments(query: string) {
  searchDepartmentsPending.value = true
  await debounceSearchDepartments(query)
}

const { execute: searchStreets } = waitAnd(
  (query: string) => {
    if (!selectedCity.value?.id) {
      streets.value = []

      return
    }

    return useFetch(novaPoshtaApiEntryPoint, {
      method: 'post',
      body: JSON.stringify({
        apiKey: novaPoshtaApiKey,
        modelName: 'Address',
        calledMethod: 'searchSettlementStreets',
        methodProperties: {
          SettlementRef: selectedCity.value.id,
          StreetName: query,
          Limit: '50',
        },
      }),
    })
  },
  (response) => {
    searchStreetsPending.value = false

    if (!response?.data.value || response.error.value) {
      return
    }

    if (!response.data.value.data[0]?.Addresses) {
      streets.value = []

      return
    }

    streets.value = response.data.value.data[0].Addresses.map((address: Record<string, any>) => {
      return { id: address.SettlementStreetRef, description: address.Present }
    })
  }
)

const debounceSearchStreets = useDebounceFn(searchStreets, 1000)

async function handleSearchStreets(query: string) {
  searchStreetsPending.value = true
  await debounceSearchStreets(query)
}

watch(
  shippingOption,
  async () => {
    selectedCity.value = undefined
    selectedDepartment.value = undefined
    await searchCities()
  },
  { deep: true }
)

watch(
  selectedCity,
  async () => {
    await searchDepartments()
  },
  { deep: true }
)

watch(
  selectedDepartment,
  () => {
    if (!selectedCity.value?.description || !selectedDepartment.value?.description) {
      return
    }

    const address = `${selectedDepartment.value.description}, ${selectedCity.value.description}`
    emits('update:modelValue', address)
  },
  { deep: true }
)
watch(
  buildingNumber,
  () => {
    if (!selectedCity.value?.description || !selectedStreet.value?.description || !buildingNumber.value) {
      return
    }

    const address = `${selectedStreet.value.description} ${buildingNumber.value}, ${selectedCity.value.description}`
    emits('update:modelValue', address)
  },
  { deep: true }
)
</script>
