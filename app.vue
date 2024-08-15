<template>
  <Html lang="uk" class="bg-[color:var(--bg-color)]">
  <Head>
    <link rel="icon" href="/favicon.ico"/>
    <title>Euro Price</title>
  </Head>
  <Body class="min-h-screen">
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
  </Body>
  </Html>
</template>

<script setup lang="ts">
import {onMounted, useNuxtApp} from '#imports'
import {themeChange} from 'theme-change'

const {
  $order: {refreshOrder},
} = useNuxtApp()

refreshOrder()

onMounted(() => {
  themeChange(false)

  // Установка ключевых слов
  const keywordsContent = `
    постачальник продуктів з Європи, купити європейські продукти оптом,
    гуртові поставки з Європи, постачання побутової хімії з Європи,
    купити продукти з Європи оптом, імпорт європейських товарів,
    оптові поставки європейських продуктів, європейські продукти для роздрібного ринку,
    дистриб'ютор продуктів з Європи, оптові ціни на європейські товари,
    Продукти харчування гуртом, Побутова хімія з Європи, Хімія з Європи гурт,
    Продукти опт, Продукти гурт, Сири опт, Опт товарів з Європи,
    Гурт продуктів харчування та побутової хімії, Італійська кава, Кава з Європи,
    Європейська кава, Олія опт, Товари з Європи, Цукерки з Європи,
    Європейська продукція гурт, Європейська продукція опт, Гелі для прання опт,
    Ополіскувачі опт, Європейські товари оптом, Солодощі з Європи,
    Шоколад гурт, Кава опт, Побутова хімія гурт, Продукти харчування гурт,
    Кава в зернах опт, Кава мелена опт, Кава розчинна опт, Пральні порошки з Європи,
    Кава, чай капучіно: Bellarom, Chicco D'Oro, Dallmayr, Don Jerez, Goriziana, Gimoka, Lavazza, Rioba, Melitta,Movenpick, Swisso, Tchibo, ZFC, Eduscho, Jacobs, Kimbo, Pellini, Segafredo, Ambassador, Cafe D'Or, Chess, Davidoff, Nescafe, La Festa, Hearts, MixFix, Westminister, Ramsey, Bastek, Lipton, Coffeta, Чорна Карта...
    Молочні продукти: Mlekovita, Mlekpol, Swiatowid, Pilos, Barista, Polmlek, Laciata, Gustobello, Zott, Philadelphia...
    М'ясні вироби: Viofel, Cimbalak, La Italia, Pikok, Subirats...
    Бакалія: Madero, Heinz, Alesto, Kaufland, Combino, Barilla, Hellmans, Kania, Italiamo, Maggi, Piacelli, Helcom, RMIX, Vesuvio, Extra Vergine, Vitanella, Monini, DeCecco, Hutesa, M&K, Marinero, Giana, Aro, Super Nuts, Fresh, Toredo...
    Солодощі: Milka, Kinder, Nutella, Ferrero, Cachet, Alpinella, Clavileno, Dolciando, Baron, Maitre Truffout, Fincare, Orion, Schoggetten, Tobleron, Terrys, Torras, Kit Kat, M&M, Bounty, Snickers, Storck, Magnetick, Mister Choc, Elvan, Chupa Chups, Mentos, Orbit, Trolli, Haribo, Skittles, Oreo, Gullon, Massimo, Knoopers, Hanuta, Fiesta, Pringles, Fine Drops, Hubba Bubba, Orbit, Socado, Soltino...
    Побутова хімія: Denk Mit, Dash, Ariel, Persil, Gama, Weiber Reise, Tomi, Coccolino, Molly, Fairy, Daz, Soft, Passion, Active, Chante Clair, App Wash, Kulmlex, Lavadera, Lenor, Softlan, Frosh, Ace, Vanish, Dr. Beckmann, At Home, Somat, Finish, Bergreen, Jar, Power Wash, Mr. Propper, Zsiroldo, Cif, Astonish, Gut&Gunstig, Harpic, Balea, Head&Shoulders, Lillien, Nickelodeon, DontoDent, Theramed, Elkos, Colgate, Naturalis, Old Spice, Rexona, Mivolis...
  `;

  // Установка описания
  const descriptionContent = `
    Широкий асортимент продуктів харчування, побутових товарів, бакалії та побутової хімії з Європи, за оптовими цінами.
    Найкращі умови для нових та постійних клієнтів на більш ніж 1000 товарів в асортименті!
  `;

  // Функция для установки мета-тега
  const setMetaTag = (name: string, content: string) => {
    let metaTag = document.querySelector(`meta[name="${name}"]`);
    if (metaTag) {
      metaTag.setAttribute('content', content);
    } else {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', name);
      metaTag.setAttribute('content', content);
      document.head.appendChild(metaTag);
    }
  };

  // Установка мета-тегов
  setMetaTag('keywords', keywordsContent);
  setMetaTag('description', descriptionContent);
})
</script>
