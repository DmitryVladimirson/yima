<template>
  <div class="flex flex-col gap-10 lg:gap-20">
    <section>
      <div class="container">
        <!--        <div class="flex items-center justify-around rounded-xl bg-white p-8">-->
        <!--          <DeliveryIcon style="color: black" class="max-lg:hidden" width="100" height="100" />-->
        <!--          <div class="m-0 flex w-fit flex-col">-->
        <!--            <h2 class="mb-4 text-black">Запускаємо безкоштовну доставку по Ужгороду!</h2>-->
        <!--            <p class="text-black">-->
        <!--              Просто замовляй, а ми доставимо <span class="text-success">ШВИДКО</span> та-->
        <!--              <span class="text-success">БЕЗКОШТОВНО</span>.-->
        <!--            </p>-->
        <!--          </div>-->
        <!--        </div>-->

        <!-- Ваши существующие секции о продуктах и акциях -->

        <!-- Табы с информацией -->
        <div class="bg-white p-6 rounded-2xl shadow-md m-2 mb-8 w-full">
          <div class="flex flex-col lg:flex-row items-center">
            <div class="flex flex-col items-center lg:items-start text-gray-800 w-full lg:w-1/2 p-4">
              <h2 class="mb-8 text-2xl md:text-4xl font-bold">
                ТОВАРИ З <span class="text-[#fbbf24]">ЄВРОПИ</span>
              </h2>
              <h2 class="mb-6 text-lg font-semibold">ГУРТОВЕ ПОСТАЧАННЯ ДЛЯ ВАШОГО БІЗНЕСУ</h2>

              <div class="flex items-center mb-1">
                <span class="mr-2 text-lg">🍏</span>
                <h3 class="text-md">Продукти харчування</h3>
              </div>
              <div class="flex items-center mb-1">
                <span class="mr-2 text-lg">🧴</span>
                <h3 class="text-md">Побутова хімія</h3>
              </div>

              <div class="mt-4 flex items-center text-success">
                <span class="mr-2">🚚</span>
                <h4 class="text-lg font-semibold">БЕЗКОШТОВНА ДОСТАВКА УЖГОРОДОМ</h4>
              </div>
            </div>
            <div class="w-full lg:w-1/2 flex justify-center mt-6 lg:mt-0">
              <PayIcon class="text-9xl text-success lg:text-[300px]"></PayIcon>
            </div>
          </div>
        </div>

        <div v-if="!currentTab" class="tabs">
          <button class="tablink font-bold" @click="openTab('payment')">Способи оплати</button>
          <button class="tablink font-bold" @click="openTab('delivery')">Способи доставки</button>
          <button class="tablink font-bold" @click="openTab('return')">Заміна та повернення товару</button>
          <button class="tablink font-bold" @click="openTab('about')">Про компанію</button>
        </div>
        <div id="payment" class="tabcontent" :class="{ 'active-tab': currentTab === 'payment' }">
          <div class="flex justify-center items-center flex-col">
            <h2 class="mb-8 text-2xl md:text-4xl text-center">СПОСОБИ ОПЛАТИ</h2>
            <div class="flex flex-col lg:flex-row justify-around">
              <div class="lg:w-1/3 flex flex-col items-center rounded-2xl bg-white p-4 text-gray-800 shadow m-2">
                <CashIcon class="text-8xl mb-8"></CashIcon>
                <div class="font-bold text-lg md:text-2xl mb-4 flex text-center justify-center">ГОТІВКОВИЙ РОЗРАХУНОК
                </div>
                <div class="text-center p-4 text-ml md:text-lg">Оплата готівкою при отриманні товару у кур’єра.</div>
              </div>
              <div class="lg:w-1/3 flex flex-col items-center rounded-2xl bg-white p-4 text-gray-800 shadow m-2">
                <CardIcon class="text-8xl mb-8"></CardIcon>
                <div class="font-bold text-lg md:text-2xl mb-4 flex text-center justify-center">БЕЗГОТІВКОВИЙ
                  РОЗРАХУНОК
                </div>
                <div class="text-center p-4 text-ml md:text-lg">
                  Оплата замовлення за допомогою банківських карт Visa й MasterCard.
                  Оплата по безготівковому розрахунку в касі будь-якого банку або з розрахункового рахунку Вашої
                  компанії.
                </div>
              </div>
              <div class="lg:w-1/3 flex flex-col items-center rounded-2xl bg-white p-4 text-gray-800 shadow m-2">
                <PayIcon class="text-8xl mb-8"></PayIcon>
                <div class="font-bold text-lg md:text-2xl mb-4 flex text-center justify-center">НАКЛАДЕНИМ ПЛАТЕЖЕМ
                </div>
                <div class="text-ml md:text-lg p-4 text-center">
                  Оплата накладеним платежем (завдаток 10% від суми)у випадку доставлення кур’єрською службою Нова Пошта
                  або Deliveri.
                  <div class="mt-2">
                    Розрахунок готівкою при отриманні товару на складі служби доставки.
                    Оплата за послуги згідно з тарифом Нової пошти 20 грн. + 2% від суми замовлення.
                  </div>

                </div>
              </div>
            </div>
            <TheButton class="btn btn-primary mt-2 flex w-fit items-center gap-2" type="button" @click="handleReturn">
              Назад
            </TheButton>
          </div>
        </div>

        <div id="delivery" class="tabcontent" :class="{ 'active-tab': currentTab === 'delivery' }">

          <div class="flex justify-center items-center flex-col">
            <h2 class="mb-8 text-2xl md:text-4xl text-center">СПОСОБИ ДОСТАВКИ</h2>
            <div class="flex flex-col lg:flex-row justify-around">
              <div class="lg:w-1/3 flex flex-col items-center rounded-2xl bg-white p-4 text-gray-800 shadow m-2">
                <CashIcon class="text-8xl mb-8"></CashIcon>
                <div class="font-bold text-lg md:text-2xl mb-4 flex text-center justify-center">ПО УЖГОРОДУ КУРЬЄРОМ
                </div>
                <div class="text-center p-4 text-ml md:text-lg">За наявності товару на складі, та при оформленні
                  замовлення доставка здійснюється протягом 1-2 днів з
                  дня замовлення. <br> <span class="font-medium text-green-600">ДОСТАВКА ПО УЖГОРОДУ ТА В ПЕРЕДМІСТІ БЕЗКОШТОВНА ПРИ ЗАМОВЛЕННІ ВІД 5000 грн.</span>
                </div>
              </div>
              <div class="lg:w-1/3 flex flex-col items-center rounded-2xl bg-white p-4 text-gray-800 shadow m-2">
                <PayIcon class="text-8xl mb-8"></PayIcon>
                <div class="font-bold text-lg md:text-2xl mb-4 flex text-center justify-center">ПО УКРАЇНІ</div>
                <div class="text-ml md:text-lg p-4 text-center">
                  Нова пошта/ Diliveri <br>
                  Доставка на відділення нової пошти, після затвердження замовлення, при умові наявності товару на
                  складі.
                  <div class="mt-2">
                    Вартість доставки по Україні – за тарифами Нової пошти/Deliveri.
                    Адресна доставка по Україні — за тарифами Нової Пошти/Deliveri.
                  </div>

                </div>
              </div>
            </div>
            <TheButton class="btn btn-primary mt-2 flex w-fit items-center gap-2" type="button" @click="handleReturn">
              Назад
            </TheButton>
          </div>
        </div>

        <div id="return" class="tabcontent" :class="{ 'active-tab': currentTab === 'return' }">
          <div class="text-center flex justify-center items-center flex-col">
            <div class="mb-4 lg:mb-8 text-xl lg:text-4xl font-bold">ЗАМІНА ТА ПОВЕРНЕННЯ ТОВАРУ</div>
            <div class="mb-4 lg:mb-8 text-md">
              <p class="mb-4">
                Повернення товару, придбаного в інтернет-магазині Euro Price, можна здійснити протягом 5 днів з моменту
                придбання. <span class="font-bold">Обовʼязкові умови повернення товару:</span> <br> товар не був в
                експлуатації, пакування товару не
                порушене та збережено товарний чек і гарантійний талон, якщо він передбачений.
              </p>
              <p>
                Інтернет-магазин Euro Price завжди йде назустріч клієнтам.
              </p>
              <p>
                Якщо ви залишилися незадоволені якістю придбаного товару, ми готові в індивідуальному порядку розглянути
                ваш випадок і вирішити його, навіть якщо пакування порушене.
              </p>
              <p>
                Адреса повернення товарів: село Минай(Закарпаття) Нова Пошта №1<br>
                Пошта для запитань та зауважень: <span class="font-bold">euprice.ua@gmail.com</span>
              </p>
            </div>
            <TheButton class="btn btn-primary mt-2 flex w-fit items-center gap-2" type="button" @click="handleReturn">
              Назад
            </TheButton>
          </div>

        </div>

        <div id="about" class="tabcontent" :class="{ 'active-tab': currentTab === 'about' }">
          <div class=" flex justify-center items-center flex-col">
            <h2 class="mb-4 lg:mb-8 text-xl lg:text-4xl font-bold">ПРО КОМПАНІЮ</h2>
            <div class="mb-4 lg:mb-8 text-md">
              <p>
                Ласкаво просимо до нашої компанії, яка спеціалізується на постачанні продуктів харчування та побутової
                хімії з Європи гуртом. Ми пропонуємо широкий асортимент якісних товарів за конкурентними цінами, при
                цьому забезпечуючи високий рівень обслуговування та індивідуальний підхід до кожного клієнта.
              </p>
              <h3>Чому обирають нас:</h3>
              <ol>
                <li class="font-bold mb-2">1. Багаторічний досвід та надійність: Ми працюємо в галузі постачання з Європи вже протягом багатьох
                  років. Наші клієнти довіряють нам завдяки стабільній якості та своєчасним поставкам. (При потребі
                  складаємо договір про постачання товарів ФОП/ТОВ)
                </li>
                <li class="font-bold mb-2">2. Широкий асортимент продукції: Ви знайдете у нас все, що потрібно для побуту та господарства: від
                  смачних продуктів харчування до догляду за дому і особистою гігієною.
                </li>
                <li class="font-bold mb-2">3. Конкурентні ціни та постійні знижки: Ми пропонуємо доступні ціни нашим клієнтам, а також
                  спеціальні знижки для стабільних покупців.
                </li>
                <li class="font-bold mb-2">4. Індивідуальний підхід до кожного замовника: Ми розуміємо, що кожен клієнт унікальний, тому ми
                  стежимо за вашими потребами та завжди готові запропонувати оптимальні рішення.
                </li>
                <li class="font-bold mb-2">5. Задоволення клієнтів на першому місці: Нам важлива думка кожного клієнта. Якщо ви не задоволені,
                  ми готові зробити все можливе, щоб ви були задоволені нашими послугами.
                </li>
                <li>Ми пишаємося нашою репутацією і завжди прагнемо надавати тільки найкращі товари та обслуговування.
                  Приєднуйтесь до нас сьогодні та переконайтесь, чому ми є надійними партнерами для вашого бізнесу або
                  побуту!
                </li>
                <li>Постачання продуктів харчування, гуртові поставки з Європи, купити побутову хімію оптом, європейські
                  товари для побуту, надійні постачальники харчових продуктів, оптові ціни на продукти, імпорт з Європи,
                  оптові знижки на побутову хімію, продукти дешево, європейські смаколики та солодощі.
                </li>
              </ol>
            </div>
            <TheButton class="btn btn-primary mt-2 flex w-fit items-center gap-2" type="button" @click="handleReturn">
              Назад
            </TheButton>
          </div>

        </div>

      </div>



    </section>
    <HomepageChosenProducts v-if="!currentTab" :chosen-products="chosenProducts.member"/>
    <HomepageSaleProducts v-if="!currentTab" :sale-products="saleProducts.member"/>
    <section v-if="!currentTab">
      <div id="plp_container" ref="plpContainer" class="container flex flex-col gap-6">
        <div class="block md:hidden">
          <TheH>
            {{ $t('allProducts') }}
          </TheH>
        </div>
        <template v-if="products.member.length > 0 || filters.length > 0">
          <div class="flex items-center justify-between gap-4">
            <TheH class="hidden md:block">
              {{ $t('allProducts') }}
            </TheH>
            <TheButton class="btn btn-primary flex h-10 items-center md:hidden" @click="showFilters = !showFilters">
              <FilterIcon class="text-lg"/>
            </TheButton>
            <div class="ml-auto flex gap-2">
              <FormKit v-model="currentSort" input-class="!border-0 shadow" type="select" :options="sortOptions"/>
              <FormKit
                v-if="products.totalItems > itemsPerPageOptionDefault"
                v-model="itemsPerPage"
                input-class="!border-0 shadow"
                type="select"
                :options="itemsPerPageOptions"
              />
            </div>
          </div>
          <div class="flex flex-col gap-10 md:flex-row xl:gap-20">
            <div class="hidden w-full md:block md:w-1/3 lg:w-1/5 xl:w-1/6" :class="{ '!block': showFilters }">
              <ClientOnly>
                <div ref="productFiltersWrapper" class="h-full w-full">
                  <ProductFilters :filters="filters" class="sticky top-4" @filters-changed="handleChangeFilters"/>
                </div>

                <template #fallback>
                  <PlaceholderFilters class="hidden sm:block"/>
                </template>
              </ClientOnly>
            </div>
            <div class="flex h-full flex-col items-center gap-4 md:w-4/5 md:items-end xl:w-5/6">
              <ClientOnly>
                <ProductList :products="products.member"/>
                <ThePagination
                  v-model="currentPage"
                  :total-items="products.totalItems"
                  :items-per-page="itemsPerPage"
                  @pagination-change="updateProducts"
                />
                <template #fallback>
                  <PlaceholderProductList/>
                </template>
              </ClientOnly>
            </div>
          </div>
        </template>
        <TheMessageBox v-else :message="$t('noProductsFound')"></TheMessageBox>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {useYimaProduct, ref, useI18n, useRoute, navigateTo, watch, useThrottleFn} from '#imports'
import DeliveryIcon from '~icons/mdi/truck-delivery-outline'
import CashIcon from '~icons/mdi/account-cash-outline'
import CardIcon from '~icons/mdi/account-credit-card-outline'
import PayIcon from '~icons/mdi/truck-delivery-outline'
import FilterIcon from '~icons/mdi/menu'
import TheButton from "~/components/TheButton.vue";

const currentTab = ref('')

const openTab = (tabName: string) => {
  currentTab.value = tabName
}
const handleReturn = () => {
  currentTab.value = ''
}
const {getProducts, getProductFilters} = useYimaProduct()
const {t} = useI18n()
const route = useRoute()

const showFilters = ref(false)

const sortOptions = computed(() => [
  {label: t('newest'), value: 'createdAt:desc'},
  {label: t('cheapestFirst'), value: 'price:asc'},
  {label: t('expensiveFirst'), value: 'price:desc'},
  {label: t('a-z'), value: 'name:asc'},
  {label: t('z-a'), value: 'name:desc'},
])

const itemsPerPageOptions = ref([
  {label: '20', value: 20},
  {label: '30', value: 30},
  {label: '50', value: 50},
])

const itemsPerPageOptionDefault = 20
const productFiltersWrapper = ref()
const currentSort = ref(route.query.sort_by ?? '')
const currentPage = ref(Number(route.query.page) || 1)
const itemsPerPage = ref(Number(route.query.itemsPerPage) || itemsPerPageOptionDefault)
const filterString = ref(route.query.filter_by ?? undefined)

const plpContainer = ref(null)
const scrollToTop = async () => {
  const position = plpContainer.value.offsetTop - 16
  window.scrollTo({
    top: position,
    behavior: 'smooth',
  })
}

const [{data: filters}, {data: products}, {data: chosenProducts}, {data: saleProducts}] = await Promise.all([
  getProductFilters(),
  getProducts({
    params: {
      sort_by: currentSort.value || undefined,
      page: currentPage.value,
      per_page: itemsPerPage.value,
      filter_by: filterString.value,
    },
  }),
  getProducts({
    params: {
      filter_by: 'categories:[chosen-products]',
    },
  }),
  getProducts({
    params: {
      filter_by: 'categories:[sale]',
    },
  }),
])

function handleChangeFilters(resultString: string) {
  if (filterString.value === resultString) {
    return
  }

  filterString.value = resultString

  setTimeout(async () => {
    if (filterString.value === resultString) {
      currentPage.value = 1
      await updateProducts(true)
    }
  }, 50)
}

const updateProducts = useThrottleFn(async (resetPage?: boolean) => {
  const {data: productsResponse, error} = await getProducts({
    params: {
      sort_by: currentSort.value || undefined,
      filter_by: filterString.value,
      page: currentPage.value,
      per_page: itemsPerPage.value,
    },
  })
  if (error.value || !productsResponse.value) {
    return
  }

  products.value = productsResponse.value

  await scrollToTop()
  await navigateTo({
    query: {
      ...route.query,
      ...(currentSort.value === sortOptions.value[0].value
        ? {sort_by: undefined}
        : {sort_by: currentSort.value || undefined}),
      ...(filterString.value ? {filter_by: filterString.value} : {filter_by: undefined}),
      ...(itemsPerPage.value === itemsPerPageOptionDefault
        ? {itemsPerPage: undefined}
        : {itemsPerPage: itemsPerPage.value}),
      ...(resetPage === true ? {page: undefined} : {}),
    },
  })
}, 50)

watch([currentSort], async () => {
  await updateProducts()
})

watch(productFiltersWrapper, () => {
  if (!productFiltersWrapper?.value) {
    return
  }

  const productFilters = productFiltersWrapper.value.querySelector('div')
  const filtersHeight = productFilters.clientHeight
  const targetHeight = window.innerHeight - 25
  const categoriesList = productFilters.querySelector('#categories')
  const categoriesListHeight = categoriesList.clientHeight
  if (filtersHeight < targetHeight) {
    return
  }

  const endHeight = Math.max(categoriesListHeight - (filtersHeight - targetHeight), 200)
  categoriesList.style.height = `${endHeight}px`
  categoriesList.classList.add('overflow-auto', 'pr-2')
})
</script>

<style scoped>
.banner {
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
}
.tabs {
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 100%;
}

.tablink {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  margin: 10px 15px;
  transition: 0.3s;
  background-color: white;
  border-radius: 0.5rem;
  color: black;
}

.tablink:hover {
  background-color: #e8b508;
  border-radius: 0.5rem
}

.tabcontent {
  display: none;
  padding: 6px 12px;
  border-top: none;
}

.tabcontent.active-tab {
  display: block !important;
}
</style>
