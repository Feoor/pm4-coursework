<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import DishCard from '../components/DishCard.vue';
import RestaurantCard from '../components/RestaurantCard.vue';

import { ref, onMounted } from 'vue'
import { getImageUrl } from '@/utils/helpers'
import { useMenuFilters } from '@/composables/useMenuFilters';
import { useDiscovery } from '@/composables/useDiscovery';

const faqItems = ref([
  {
    id: 1,
    question: 'Как оформить заказ на сайте?',
    answer: 'Выберите понравившиеся блюда или ресторан, добавьте позиции в корзину и следуйте инструкциям для оформления заказа.',
    active: false
  },
  {
    id: 2,
    question: 'Можно ли оплатить заказ онлайн?',
    answer: 'Да, вы можете оплатить заказ онлайн банковской картой или через электронные кошельки.',
    active: false
  },
  {
    id: 3,
    question: 'Как узнать статус моего заказа?',
    answer: 'После оформления заказа вы получите уведомление и сможете отслеживать статус в личном кабинете.',
    active: false
  },
  {
    id: 4,
    question: 'Можно ли отменить или изменить заказ?',
    answer: 'Да, вы можете отменить или изменить заказ до его подтверждения рестораном, связавшись с поддержкой.',
    active: false
  },
  {
    id: 5,
    question: 'Как воспользоваться промокодом?',
    answer: 'Введите промокод в специальное поле при оформлении заказа, и скидка будет применена автоматически.',
    active: false
  }
])

const handleFaqClick = (faq) => {
  faq.active = !faq.active;
}

const groups = ref([
  { id: 1, name: 'Все', value: 'all' },
  { id: 2, name: 'Рестораны', value: 'restaurants' },
  { id: 3, name: 'Блюда', value: 'dishes' }
])
const categories = ref([
  { id: 1, name: 'Pizza', icon: getImageUrl('pizza.svg'), category: 'pizza' },
  { id: 2, name: 'Asian', icon: getImageUrl('hotdog.svg'), category: 'asian' },
  { id: 3, name: 'Donat', icon: getImageUrl('doughnut_ico.svg'), category: 'donat' },
  { id: 4, name: 'Ice', icon: getImageUrl('icecream.svg'), category: 'ice' }
])
const sortOptions = ref([
  { id: 1, name: 'Рекомендуемое', value: 'rating' },
  { id: 2, name: 'Быстрая доставка', value: 'fast-delivery' },
  { id: 3, name: 'Популярное', value: 'popular' }
])

const { 
  // Variables
  restaurants,
  dishes,
  isLoading, 
  error, 
  // Methods
  fetchDiscoveryData
} = useDiscovery();

onMounted(() => {
  fetchDiscoveryData();
})

const { 
  // Variables
  searchQuery, 
  selectedCategories, 
  selectedSortOption, 
  maxPrice, 
  // Computed
  filteredDishes, 
  filteredRestaurants, 
  // Methods
  toggleCategory, 
  isCategorySelected
 } = useMenuFilters(restaurants, dishes);
const selectedGroup = ref('all');
</script>

<template>
  <Header />

  <main class="main">
    <!-- Фильтры, поиск и баннер -->
    <section class="food-filter">
      <div class="container-sm">

        <!-- Обертка сетки -->
        <div class="food-filter__wrapper row justify-content-between g-1">

          <!-- Левая колонка -->
          <div class="food-filter__left-column col-12 col-md-7 d-flex flex-column justify-content-between">
            <!-- Баннер -->
            <div class="food-filter__promo-banner">
              <h2 class="promo-banner__title">
                СКИДКА 50%
                <br><span class="text-muted--purple">НА ВЫХОДНЫХ</span>
              </h2>
            </div>

            <!-- Поиск -->
            <div class="food-filter__search">
              <div class="form-floating">
                <input type="text" class="food-filter__search-input form-control" placeholder="Поиск"
                  v-model="searchQuery">
                <label for="foodFilterSearchInput">Поиск...</label>
              </div>

              <div class="food-filter__display-filters col-12 btn-group" role="group">
                <!-- FIXME: Переключение не работает -->
                <!-- TODO: Сделать через v-for, прийдется менять стили и отрисовку -->
                <input type="radio" class="btn-check food-filter__display-filter" name="sortShowFilterGroup"
                  v-model="selectedGroup" value="all" :checked="selectedGroup === 'all'">
                <label class="btn btn-outline-primary" for="sortShowAll">Все</label>

                <input type="radio" class="btn-check food-filter__display-filter" name="sortShowFilterGroup"
                  v-model="selectedGroup" value="restaurants" :checked="selectedGroup === 'restaurants'">
                <label class="btn btn-outline-primary" for="sortShowRestaurants">Рестораны</label>

                <input type="radio" class="btn-check food-filter__display-filter" name="sortShowFilterGroup"
                  v-model="selectedGroup" value="dishes" :checked="selectedGroup === 'dishes'">
                <label class="btn btn-outline-primary" for="sortShowDishes">Блюда</label>
              </div>
            </div>
          </div>

          <!-- Правая колонка (фильтры) -->
          <div class="food-filter__right-column col-12 col-md-4">
            <div class="food-filter__filter-panel shadow">

              <!-- Фильтр по категориям -->
              <div class="filter-panel__category">
                <h3 class="filter-panel__category-title">Категории</h3>
                <div class="filter-panel__category-list row g-3">
                  <div class="col-3 col-md-6 col-xl-3" v-for="category in categories" :key="category.id">
                    <button 
                      class="filter-panel__category-item" 
                      :class="{ 'filter-panel__category-item--active': isCategorySelected(category.category) }"
                      @click="toggleCategory(category.category)"
                    >
                      {{ category.name }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Фильтр по сортировке -->
              <div class="filter-panel__sort">
                <h3 class="filter-panel__sort-title">Сортировать По</h3>
                <div class="filter-panel__sort-list row row-cols-2 gx-5 gy-1" id="sortByFilters">
                  <div class="filter-panel__sort-item col" v-for="sortOption in sortOptions" :key="sortOption.id">
                    <input 
                      type="radio" 
                      class="filter-panel__sort-btn" 
                      name="sortByFilter" 
                      :id="'sortBy' + sortOption.name"
                      :value="sortOption.value" 
                      v-model="selectedSortOption"
                    >
                    <label class="btn" :for="'sortBy' + sortOption.name">{{ sortOption.name }}</label>
                  </div>
                </div>
              </div>

              <!-- Фильтр по цене -->
              <div class="filter-panel__price">
                <h3 class="filter-panel__price-title">Цена</h3>
                <label for="priceSlider" class="visually-hidden">Цена до</label>
                <input type="range" class="filter-panel__price-slider" min="0" max="15000" step="500"
                  v-model="maxPrice" />
                <div class="filter-panel__price-range">
                  <span>0 ₸</span>
                  <span class="price-range__current-price">{{ maxPrice }} ₸</span>
                </div>
              </div>

              <!-- Нужды в нажатии кнопки нет -->
              <button class="filter-panel__apply-btn">Применить</button>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- Наши лучшие рестораны -->
    <section class="our-restaurants" v-show="filteredRestaurants && filteredRestaurants.length > 0">
      <div class="container-sm">

        <!-- Обертка сетки -->
        <div class="our-restaurants__wrapper">
          <!-- Титул -->
          <h2 class="our-restaurants__title text-center">Наши лучшие <span class="highlight--purple">рестораны</span>
          </h2>

          <!-- Карточки ресторанов -->
          <div class="our-restaurants__restaurants-wrapper col-12 mb-2">
            <RestaurantCard v-for="restaurant in filteredRestaurants" :key="restaurant.id" :restaurant="restaurant" />
          </div>

        </div>

      </div>
    </section>

    <!-- Наши лучшие блюда -->
    <section class="our-dishes" v-show="filteredDishes && filteredDishes.length > 0">
      <div class="container-sm">
        <!-- Обертка сетки -->
        <div class="our-dishes__wrapper">
          <!-- Титул -->
          <h2 class="our-dishes__title col-12 text-center">Наши лучшие <span class="highlight--purple">блюда</span></h2>
          <!-- Карточки блюд -->
          <div class="our-dishes__dishes-wrapper col-12 mb-2">
            <DishCard v-for="dish in filteredDishes" :key="dish.id" :dish="dish" />
          </div>

        </div>

      </div>
    </section>

    <!-- Если не найдены рестораны или блюда -->
    <section class="no-results mt-6" v-show="!filteredRestaurants.length && !filteredDishes.length && !isLoading">
        <div class="container-sm">
            <h2 class="no-results__title text-center">К сожалению, ничего не найдено</h2>
            <p class="no-results__text text-center text-muted">Попробуйте изменить фильтры или поиск.</p>
        </div>
    </section>

    <!-- Спиннер во время загрузки данных -->
    <section v-show="isLoading">
      <div class="d-flex justify-content-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загружаем...</span>
        </div>
      </div>
    </section>

    <!-- Часто задаваемые вопросы -->
    <section class="faq">
      <div class="container-sm">

        <!-- Обертка сетки -->
        <div class="faq__wrapper row g-3">
          <!-- Титул -->
          <h2 class="faq__title col-12 text-center">
            Часто задаваемые
            <br><span class="highlight--purple">вопросы</span>
          </h2>

          <!-- Вопросы и ответы -->
          <div
           v-for="faq in faqItems" 
           :key="faq.id" 
           class="faq__question col-12" 
           :class="faq.active ? 'faq__question--active' : ''"
           >
            <!-- Вопрос, заголовок всегда виден -->
            <div class="faq__question-header">
              <button class="faq__header-btn" @click="handleFaqClick(faq)">
                {{ faq.question }}
              </button>
            </div>

            <!-- Ответ, скрытый по умолчанию -->
            <div class="faq__question-body">
              {{ faq.answer }}
            </div>
          </div>

        </div>

      </div>
    </section>
  </main>

  <Footer />

</template>

<style lang="scss" scoped>
.food-filter__wrapper {
  padding-bottom: 30px;

  /* Левая колонка, баннер, поиск */
  .food-filter__promo-banner {
    position: relative;
    padding: 40px 52px;
    border-radius: 19px;
    background: $purple url("@/assets/img/sale_bg.webp");

    &::before {
      display: inline-block;
      content: "";
      width: 37px;
      height: 37px;
      background: url("@/assets/icons/illustration_02.svg") no-repeat;
      background-size: contain;
      position: absolute;
      top: -12%;
      right: -6%;
      transform: rotate(195deg) scale(1.2);
    }
    &::after {
      display: inline-block;
      content: "";
      width: 234px;
      height: 236px;
      background: url("@/assets/img/swe_dish.png") no-repeat;
      background-size: contain;
      position: absolute;
      bottom: -25%;
      right: 3%;
    }
    .promo-banner__title {
      font-weight: 900;
      font-size: 60px;
      color: #f7f8fa;
    }
  }
  .food-filter__search {
    position: relative;

    .form-floating {
      position: relative;

      &::before {
        display: inline-block;
        content: "";
        width: 35px;
        height: 35px;
        background: url("@/assets/icons/search.svg") no-repeat;
        position: absolute;
        z-index: 1;
        top: 50%;
        left: 16px;
        transform: translateY(-50%);
      }
      .food-filter__search-input {
        position: relative;
        padding-left: 62px;
        padding-right: 16px;
        margin-bottom: 32px;
        border-radius: 19px;
        border-color: #ededed;
        background: #ededed;
        font-family: $font-family, sans-serif;
        font-weight: 600;
        font-size: 18px;
        line-height: 117%;
        color: #18181b;
        transition: .2s all;
      }
      .food-filter__search-input ~ label {
        padding-left: 70px;

        &::after {
          background: inherit;
        }
      }
    }
    .food-filter__display-filters {
      & input:first-of-type + label {
        border-radius: 15px 0 0 15px;
        border-right: 1px;
      }
      .food-filter__display-filter + label {
        border: 2px solid $purple;
        margin: 0;
        padding: 20px 0;
        background: inherit;
        font-family: $font-family, sans-serif;
        font-weight: 600;
        font-size: 18px;
        text-align: center;
        color: $purple;
        transition: .2s all;
      }
      label:hover {
        background: $purple;
        color: #f7f8fa;
      }
      .food-filter__display-filter:checked + label {
        background: $purple;
        color: #f5f5f5;
      }
      .food-filter__display-filter:checked:hover + label {
        background: $purple-hover;
        color: #f7f8fa;
      }
      & input:last-of-type + label {
        border-radius: 0 15px 15px 0;
        border-left: 1px;
      }
    }
  }

  /* Правая колонка, фильтры */
  .food-filter__filter-panel {
    border-radius: 24px;
    padding: 32px;

    // Текстовые стили
    font-family: $font-family, sans-serif;
    font-weight: 600;
    font-size: 21px;
    line-height: 135%;
    color: #323142;

    // Стили титулов фильтров
    .filter-panel__category-title,
    .filter-panel__sort-title,
    .filter-panel__price-title {
      margin-bottom: 12px;
      font-family: $font-family, sans-serif;
      font-weight: 600;
      font-size: 21px;
      line-height: 135%;
      color: #323142;
    }
    // Отступы между фильтрами
    .filter-panel__category,
    .filter-panel__sort,
    .filter-panel__price {
      margin-bottom: 24px;
    }

    // Стили кнопок категорий
    .filter-panel__category-list {
      .filter-panel__category-item {
        position: relative;
        width: 100%;
        padding-top: 66px;
        padding-bottom: 12px;
        border: none;
        border-radius: 14px;
        background: rgba(255, 222, 138, 0.35);
        font-family: $font-family, sans-serif;
        font-weight: 600;
        font-size: 14px;
        text-align: center;
        color: #d69900;
        transition: .2s transform;

        // 1 Элемент, родитель, пицца
        &::after {
          display: inline-block;
          content: "";
          width: 35px;
          height: 35px;
          background: url("@/assets/icons/pizza.svg") no-repeat;
          background-size: contain;
          position: absolute;
          top: 35%;
          right: 0;
          left: 0;
          margin: 0 auto;
          transform: translateY(-50%);
        }

        // Выбранный элемент
        &--active {
          position: relative;
          outline: 2px solid currentColor;
          box-shadow: var(--bs-box-shadow-sm);
          transform: scale(1.1);
        }
      }
      // 2 Элемент, Азиатская еда
      div:nth-child(2) .filter-panel__category-item {
        background: rgba(251, 71, 29, 0.35);
        color: #fb471d;

        &::after {
          width: 38px;
          height: 38px;
          background: url("@/assets/icons/hotdog.svg") no-repeat;
          background-size: contain;
        }
      }
      // 3 Элемент, Пончики
      div:nth-child(3) .filter-panel__category-item {
        background: rgba(237, 182, 107, 0.35);
        color: #edb66b;

        &::after {
          width: 36px;
          height: 36px;
          background: url("@/assets/icons/doughnut_ico.svg") no-repeat;
          background-size: contain;
        }
      }
      // 4 Элемент, Мороженное
      div:nth-child(4) .filter-panel__category-item {
        background: rgba(90, 133, 255, 0.35);
        color: #5a85ff;

        &::after {
          width: 22px;
          height: 40px;
          background: url("@/assets/icons/icecream.svg") no-repeat;
          background-size: contain;
        }
      }
    }

    .filter-panel__sort-list {
      /* Каждый 2 элемент находится справа */
      .filter-panel__sort-item {
        display: flex;
        align-items: start;

        &:nth-child(even) {
          justify-content: left;
        }
      }
      .filter-panel__sort-btn {
        appearance: none;

        &:hover {
          color: $purple;
        }

        & ~ label {
          background: inherit;
          border: none;
          font-family: $font-family, sans-serif;
          font-weight: 500;
          font-size: 15px;
          text-align: center;
          line-height: 187%;
          color: #acadb9;
        }

        &:checked ~ label {
          color: #f5f5f5;
          background: $purple;
        }
      }
    }
    .filter-panel__price {
      .filter-panel__price-slider {
        /* Сброс стандартных стилей */
        appearance: none;

        /* Стили ползунка */
        width: 100%;
        height: 8px;
        background: $purple;
        border-radius: 9px;
        outline: none;

        &::-webkit-slider-thumb {
          /* Сброс стандартных стилей */
          appearance: none;

          /* Стили ползунка */
          width: 20px;
          height: 21px;
          background: $purple;
          border-radius: 50%;
          box-shadow: 0 0 0 .25rem rgba(108, 95, 188, 0.25);
          cursor: pointer;
          transition: .2s all;
        }
        // Firefox
        &::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #6f42c1;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
      }
      .filter-panel__price-range {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
        color: #6c757d;
      }
    }
    .filter-panel__apply-btn {
      width: 100%;
      border: none;
      padding: 18px 0;
      border-radius: 14px;
      background: $purple;
      font-family: $font-family, sans-serif;
      font-weight: 800;
      font-size: 18px;
      color: #fff3eb;

      &:hover {
        background: $purple-hover;
        color: #f7f8fa;
      }
    }
  }
}

.no-results {
  .no-results__title {
    font-family: $font-family, sans-serif;
    font-weight: 800;
    font-size: 40px;
    line-height: 135%;
    color: #323142;
  }
  .no-results__text {
    font-family: $font-family, sans-serif;
    font-weight: 500;
    font-size: 24px;
    line-height: 135%;
  }
}

/* Наши лучшие рестораны */
.our-restaurants__wrapper {
  padding-top: 100px;
  padding-bottom: 120px;
  border-bottom: 2px solid #cbcbcb;

  .our-restaurants__title {
    color: #323142;
    margin-bottom: 40px;
  }
  .our-restaurants__restaurants-wrapper {
    display: flex;
    gap: 30px;
    margin-top: 0;
    padding-top: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

/* Наши лучшие блюда */
.our-dishes__wrapper {
  padding-top: 100px;
  padding-bottom: 120px;
  border-bottom: 2px solid #cbcbcb;

  .our-dishes__title {
    color: #323142;
    margin-bottom: 40px;
  }

  .our-dishes__dishes-wrapper {
    display: flex;
    gap: 30px;
    padding-top: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.faq__wrapper {
  padding-top: 200px;

  .faq__title {
    font-weight: 800;
    // Отступ в 90px - 28 у заголовка вопроса
    margin-bottom: 62px;
    position: relative;

    &::after {
      display: inline-block;
      content: "";
      width: 39px;
      height: 37px;
      background: url("@/assets/icons/illustration_02.svg") no-repeat;
      position: absolute;
      top: -20%;
      right: 30%;
      transform: rotate(190deg) scale(1.2);
    }
  }

  .faq__question {
    margin-top: 28px;
    border-bottom: 2px solid #cbcbcb;

    .faq__question-header {
      .faq__header-btn {
        width: 100%;
        padding: 1rem .5rem;
        background: inherit;
        border: none;
        cursor: pointer;
        position: relative;

        font-family: $font-family, sans-serif;
        font-weight: 800;
        font-size: 24px;
        text-align: left;
        color: #323142;

        &::after {
          display: inline-block;
          content: "";
          width: 36px;
          height: 36px;
          background: $purple url("@/assets/icons/plus.svg") no-repeat center;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%) rotate(0deg);
          transition: .3s transform;
        }
      }
    }

    .faq__question-body {
      max-height: 0;
      overflow: hidden;
      padding: 0;
      font-family: $font-family, sans-serif;
      font-weight: 500;
      font-size: 20px;
      color: #686868;
      opacity: 0;
      transition: .3s max-height ease-in-out, .4s opacity ease-in-out, .4s padding ease;
    }

  }
  // Активный вопрос
  .faq__question--active {
    .faq__question-header {
      .faq__header-btn {
        &::after {
          transform: translateY(-50%) rotate(45deg);
          background-color: $purple-hover;
        }
      }
    }
    .faq__question-body {
      max-height: 200px;
      padding: .25rem .5rem 2.5rem;
      opacity: 1;
    }
  }
}

@media screen and (max-width: 1199.98px) {
  // Планшеты в горизонтальной ориентации, Ipad Pro (>= 1024px)
  .food-filter__wrapper {
    /* Левая колонка, баннер, поиск */
    .food-filter__promo-banner {
      padding: 30px 42px;

      &::before {
        top: -17%;
        transform: rotate(195deg) scale(1);
      }
      &::after {
        width: 180px;
        height: 180px;
        right: -2%;
      }
      .promo-banner__title {
        font-size: 48px;
      }
    }

    /* Правая колонка, фильтры */
    .food-filter__filter-panel {
      padding: 20px;

      // Стили титулов фильтров
      .filter-panel__category-title,
      .filter-panel__sort-title,
      .filter-panel__price-title {
        font-size: 20px;
      }

      .filter-panel__category-list {
        .filter-panel__category-item {
          padding-top: 50px;
          padding-bottom: 8px;
          font-size: 16px;
        }
      }

      .filter-panel__sort-list {
        .filter-panel__sort-btn {
          font-size: 14px;
        }
      }
    }
  }

  .our-restaurants__wrapper {
    padding-top: 80px;
    padding-bottom: 86px;

    .our-restaurants__title {
      margin-top: 0;
      margin-bottom: 40px;
    }
  }

  .our-dishes__wrapper {
    padding-top: 80px;
    padding-bottom: 86px;

    .our-dishes__title {
      margin-top: 0;
      margin-bottom: 40px;
    }
    .our-dishes__dishes-wrapper {
      gap: 22px;
    }
  }

  .faq__wrapper {
    padding-top: 100px;

    .faq__title {
      margin-bottom: 30px;
      font-size: 35px;

      &::after {
        top: -30%;
        right: 28%;
        transform: rotate(180deg) scale(1);
      }
    }
  }
}

@media screen and (max-width: 991.98px) {
  // Планшеты в вертикальной ориентации (>= 768px)
  .food-filter__wrapper {
    /* Левая колонка, баннер, поиск */
    .food-filter__promo-banner {
      padding: 20px 20px 100px;

      &::before {
        top: -12%;
        right: -10%;
        transform: rotate(195deg) scale(0.9);
      }
      &::after {
        width: 150px;
        height: 150px;
        right: 50%;
        transform: translateX(50%);
      }
      .promo-banner__title {
        font-size: 42px;
      }
    }
    .food-filter__search {
      .food-filter__display-filters {
        .food-filter__display-filter {
          font-size: 15px;
        }
      }
    }

    /* Правая колонка, фильтры */
    .food-filter__filter-panel {
      padding: 16px;

      // Стили титулов фильтров
      .filter-panel__category-title,
      .filter-panel__sort-title,
      .filter-panel__price-title {
        font-size: 18px;
      }

      // Сортировка по ...
      .filter-panel__sort-list {
        .filter-panel__sort-btn {
          font-size: 12px;
        }
      }

      // Ползунок цен
      .filter-panel__price {
        .filter-panel__price-range {
          font-size: 0.8rem;
        }
      }
    }
  }

  .our-restaurants__wrapper {
    padding-top: 70px;
    padding-bottom: 76px;

    .our-restaurants__title {
      margin-top: 0;
      margin-bottom: 40px;
    }

  }

  .our-dishes__wrapper {
    padding-top: 70px;
    padding-bottom: 76px;
  }

  .faq__wrapper {
    padding-top: 80px;

    .faq__title {
      margin-bottom: 12px;
      font-size: 32px;

      &::after {
        top: -30%;
        right: 24%;
        transform: rotate(180deg) scale(0.8);
      }
    }
  }
}

@media screen and (max-width: 767.98px) {
  // Телефоны в горизонтальной ориентации (>= 576px)
  .food-filter__wrapper {

    /* Левая колонка, баннер, поиск */
    .food-filter__promo-banner {
      padding: 32px 24px;
      margin-bottom: 50px;

      &::before {
        display: none;
      }
      &::after {
        right: 18%;
        bottom: -15%;
      }
      .promo-banner__title {
        font-size: 46px;
      }
    }
    .food-filter__search {
      .food-filter__display-filters {
        margin-bottom: 30px;

        .food-filter__display-filter {
          font-size: 16px;
        }
      }
    }

    /* Правая колонка, фильтры */
    .food-filter__filter-panel {
      padding: 24px;

      // Стили титулов фильтров
      .filter-panel__category-title,
      .filter-panel__sort-title,
      .filter-panel__price-title {
        font-size: 24px;
      }

      // Стили кнопок категорий
      .filter-panel__category-list {
        .filter-panel__category-item {
          font-size: 18px;
        }
      }

      // Сортировка по ...
      .filter-panel__sort-list {
        .filter-panel__sort-btn {
          font-size: 18px;
        }
      }

      // Ползунок цен
      .filter-panel__price {
        .filter-panel__price-range {
          font-size: 1rem;
        }
      }

      .filter-panel__apply-btn {
        padding: 14px 0;
      }
    }
  }

  .our-restaurants__wrapper {
    padding-top: 50px;
    padding-bottom: 60px;
  }
  .our-dishes__wrapper {
    padding-top: 50px;
    padding-bottom: 60px;    
  }

  .faq__wrapper {
    padding-top: 70px;

    .faq__title {
      margin-bottom: 0;
      font-size: 36px;

      &::after {
        top: -30%;
        right: 11%;
        transform: rotate(180deg) scale(0.9);
      }
    }
    .faq__question {
      .faq__question-header {
        .faq__header-btn {
          font-size: 20px;

          &::after {
              width: 30px;
              height: 30px;
          }
        }
      }

      .faq__question-body {
        font-size: 18px;
      }
    }
  }
}

@media screen and (max-width: 566.98px) {
  // Телефоны в вертикальной ориентации (< 567px)
  .food-filter__wrapper {

    /* Левая колонка, баннер, поиск */
    .food-filter__promo-banner {
      padding: 20px 16px 100px;
      margin-bottom: 70px;

      &::after {
        right: 50%;
        bottom: -25%;
      }
      .promo-banner__title {
        font-size: 34px;
      }
    }
    .food-filter__search {
      .food-filter__display-filters {
        margin-bottom: 20px;

        .food-filter__display-filter {
          font-size: 14px;
        }
      }
    }

    /* Правая колонка, фильтры */
    .food-filter__filter-panel {
      padding: 16px;

      // Стили титулов фильтров
      .filter-panel__category-title,
      .filter-panel__sort-title,
      .filter-panel__price-title {
        font-size: 20px;
      }

      // Стили кнопок категорий
      .filter-panel__category-list {
        .filter-panel__category-item {
          font-size: 14px;
        }
      }

      // Сортировка по ...
      .filter-panel__sort-list {
        .filter-panel__sort-btn {
          font-size: 15px;
        }
      }

      // Ползунок цен
      .filter-panel__price {
        .filter-panel__price-range {
          font-size: 0.8rem;
        }
      }

      .filter-panel__apply-btn {
        padding: 8px 0;
        font-size: 16px;
      }
    }
  }

  .our-restaurants__wrapper {
    padding-top: 50px;
    padding-bottom: 60px;

    .our-restaurants__title {
      margin-bottom: 36px;
    }
  }

  .faq__wrapper {
    padding-top: 50px;

    .faq__title {
      margin-bottom: 0;
      font-size: 30px;

      &::after {
        top: 65%;
        right: 13%;
        transform: rotate(245deg) scale(0.8);
      }
    }
    .faq__question {
      .faq__question-header {
        .faq__header-btn {
          font-size: 18px;
          padding: 1rem 2.5rem 1rem 0.5rem;

          &::after {
            width: 28px;
            height: 28px;
          }
        }
      }

      .faq__question-body {
        font-size: 16px;
      }
    }
  }
}
</style>