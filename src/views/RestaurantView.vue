<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import DishCard from '@/components/DishCard.vue'
import OrderPaymentModal from '@/components/modals/OrderPaymentModal.vue';
import DishDetailsModal from '@/components/modals/DishDetailsModal.vue';
import { getBadgeClass, getBadgeText } from '@/utils/helpers';
import { useRestaurant } from '@/composables/useRestaurant';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

const route = useRoute();
const { restaurant, isLoading, menu, popularDishes, fetchRestaurantData } = useRestaurant();
const authStore = useAuthStore();
const cartStore = useCartStore();
const isOrderPaymentModalOpen = ref(false);
const currentOrder = ref(null);
const isDishDetailsModalOpen = ref(false);
const selectedDish = ref(null);

// Загружаем данные ресторана при монтировании компонента (используем ID из URL)
onMounted(() => fetchRestaurantData(route.params.id));

const addToCart = (dish) => {
  cartStore.addToCart(dish);
}

const addToFavorites = (dish) => {
  console.log('Добавлено в избранное:', dish);
}

const handleCloseOrderPaymentModal = () => {
  isOrderPaymentModalOpen.value = false;
  currentOrder.value = null;
}
const handleOpenOrderPaymentModal = () => {
  isOrderPaymentModalOpen.value = true;
}

const handleOrderPayment = async () => {
  if (cartStore.totalItems() === 0) {
    alert('Ваша корзина пуста. Пожалуйста, добавьте блюда перед оформлением заказа.');
    return;
  } else if (!authStore.isAuthenticated()) {
    alert('Пожалуйста, войдите в свой аккаунт, чтобы оформить заказ.');
    return;
  }

  const res = await cartStore.createOrder({
    id: authStore.profile?.id || 'guest', // TODO: Сделать обязательным полем при оформлении заказа
    deliveryAddress: authStore.profile?.deliveryAddress || 'Not provided', // TODO: Сделать обязательным полем при оформлении заказа
    paymentMethod: null
  });

  if (res.success && res.order) {
    currentOrder.value = res.order;
    handleOpenOrderPaymentModal();
  } else {
    alert('Ошибка при создании заказа. Пожалуйста, попробуйте снова.');
  }
}

const handlePaymentSuccess = (orderId) => {
  console.log('Оплата прошла успешно для заказа:', orderId);
}

const showDishDetails = (dish) => {
  selectedDish.value = dish;
  isDishDetailsModalOpen.value = true;
}

const handleCloseDishDetailsModal = () => {
  isDishDetailsModalOpen.value = false;
  selectedDish.value = null;
}

const addToCartFromModal = (dish) => {
  cartStore.addToCart(dish);
  handleCloseDishDetailsModal();
}
</script>

<template>
  <!-- Модалка деталей блюда -->
  <DishDetailsModal
    :isOpen="isDishDetailsModalOpen"
    :dish="selectedDish"
    @close="handleCloseDishDetailsModal"
    @add-to-cart="addToCartFromModal"
  />

  <!--  -->
  <OrderPaymentModal
    v-if="currentOrder"
    :isOpen="isOrderPaymentModalOpen"
    :order="currentOrder"
    @close="handleCloseOrderPaymentModal"
    @payment-success="handlePaymentSuccess"
  />

  <Header :withCart="true" @order-payment="handleOrderPayment" />
  <main class="main">
    <section class="restaurant-hero mb-5">
      <div class="container-sm">
        <div class="restaurant-hero__wrapper">
          <div v-if="!isLoading && restaurant" class="card">
            <img :src="restaurant.imageUrl" :alt="restaurant.name" class="card-img-top">

            <div
              class="card-body d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between"
            >
              <span v-if="restaurant.badge" :class="`badge ${getBadgeClass(restaurant.badge)}`">{{ getBadgeText(restaurant.badge) }}</span>
              <h1 class="card-title mt-0">{{ restaurant.name }}</h1>

              <div class="our-restaurants__restaurant-info d-flex align-items-center">
                <span class="me-2">{{ restaurant.formattedDeliveryTime }}</span>
                <img src="@/assets/icons/purple_star.svg" alt="Purple star">
                <span class="ms-1">{{ restaurant.rating }}</span>
              </div>

              <button class="restaurant-bookmark"></button>
            </div>
          </div>

          <div v-else-if="isLoading" class="card">
            <div class="card-img-top placeholder-glow" style="height: 378px;">
              <div class="placeholder w-100 h-100"></div>
            </div>

            <div class="card-body">
              <h1 class="card-title placeholder-glow row">
                <span class="placeholder col-1"></span>
                <span class="placeholder col-3 offset-2"></span>
                <span class="placeholder col-3 offset-1"></span>
              </h1>
              </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Спиннер для индикации загрузки -->
    <section v-show="isLoading">
      <div class="d-flex justify-content-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загружаем...</span>
        </div>
      </div>
    </section>

    <!-- Популярные блюда ресторана -->
    <section class="menu-section" v-show="!isLoading && popularDishes">
      <div class="container-sm">

        <!-- Обертка сетки -->
        <div class="menu-section__wrapper">
          <!-- Титул -->
          <h2 class="menu-section__title col-12">Популярно 🔥</h2>

          <!-- Карточки блюд -->
          <div class="menu-section__dishes-wrapper col-12">
            <DishCard
              v-for="dish in popularDishes"
              :key="dish.id"
              :dish="dish"
              :mode="'full'"
              @add-to-cart="addToCart"
              @add-to-favorites="addToFavorites"
              @show-details="showDishDetails"
            />
          </div>

        </div>

      </div>
    </section>

    <!-- Секции меню -->
    <section class="menu-section" v-for="(sectionDishes, sectionName) in menu" :key="sectionName">
      <div class="container-sm">

        <!-- Обертка сетки -->
        <div class="menu-section__wrapper">
          <!-- Титул -->
          <h2 class="menu-section__title col-12">{{ sectionName }}</h2>

          <!-- Карточки блюд -->
          <div class="menu-section__dishes-wrapper col-12">
            <DishCard
              v-for="dish in sectionDishes"
              :key="dish.id"
              :dish="dish"
              :mode="'full'"
              @add-to-cart="addToCart"
              @add-to-favorites="addToFavorites"
              @show-details="showDishDetails"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- TODO: Синхронизировать мобильную корзину с основной корзиной -->
    <section class="cart-btn-section--md-position d-flex d-lg-none position-sticky">
      <div class="container-sm">
        <button @click="cartStore.toggleMenu()" class="cart-btn btn btn-primary d-flex align-items-center mx-auto">
          <span class="cart__count me-3 badge rounded-pill bg-danger">{{ cartStore.totalItems() }}</span>
          Открыть заказ
          <span class="cart__price ms-auto">{{ cartStore.formattedTotalPrice() }}</span>
        </button>
      </div>
    </section>
  </main>

  <Footer />
</template>

<style lang="scss" scoped>
/* Добавить ресторан в избранное */
.restaurant-bookmark {
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 16px;
  right: 24px;
  border: none;
  border-radius: 50%;
  background-color: #dbd9ee;
  transition: background-color .2s;

  &::after {
    display: inline-block;
    content: "";
    max-width: 16px;
    max-height: 21px;
    background: url("@/assets/icons/bookmark.svg") no-repeat;
    background-size: cover;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  &:hover {
    background-color: $purple;

    &::after {
      background: url("@/assets/icons/bookmark_white.svg") no-repeat;
      background-size: cover;
    }
  }
}

/* Добавить блюдо в любимое */
.dish-favorite {
  position: absolute;
  top: 14px;
  right: 12px;
  border: none;
  border-radius: 50%;
  background: transparent;
  width: 40px;
  height: 40px;
  transition: background-color .2s;

  &::after {
    display: inline-block;
    content: "";
    max-width: 22px;
    max-height: 19px;
    background: url("@/assets/icons/heart.svg") no-repeat;
    background-size: contain;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  &:hover {
    background-color: #f7c5ba;
  }
}

/* Добавить блюдо в корзину */
.add-to-cart {
  position: absolute;
  bottom: 26px;
  right: 24px;
  border: none;
  border-radius: 9px;
  background-color: #323142;
  width: 44px;
  height: 40px;
  transition: background-color .2s;

  &::after {
    display: inline-block;
    content: "";
    width: 24px;
    height: 24px;
    background: url("@/assets/icons/plus.svg") no-repeat;
    background-size: contain;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  &:hover {
    background-color: $purple;
  }
}

// Корзина
.cart-btn {
  padding: 17px 16px;
  border-radius: 17px;
  background-color: $purple;
  color: #fff;
  font-size: 18px !important;
  font-weight: 700 !important;
  cursor: pointer;
  transition: background-color .2s;

  &:hover {
    background-color: $purple-hover;
  }

  .cart__count {
    font-size: 16px;
  }
}

.restaurant-hero__wrapper {
  padding-bottom: 48px;

  .card {
    border: 1px solid #cdcdcd;
    box-shadow: 8px 91px 45px 0 rgba(229, 229, 229, 0.7);
    position: relative;

    .card-img-top {
      max-height: 378px;
      object-fit: cover;
    }

    .card-body {
      padding: 1.75rem 2.5rem;

      h1 {
        font-family: $font-family, sans-serif;
        font-weight: 800;
        font-size: 40px;
        line-height: 133%;
        color: #323142;
      }

      .our-restaurants__restaurant-info {
        font-family: $font-family, sans-serif;
        font-weight: 400;
        font-size: 26px;
        color: #8e97a6;
      }

      .restaurant-bookmark {
        width: 62px;
        height: 62px;
        position: relative;
        right: 0;
        bottom: 0;

        &::after {
          max-width: 24px;
          max-height: 32px;
        }
      }
    }
  }
}

/* Блюда ресторана */
.menu-section__wrapper {
  padding-bottom: 70px;

  .menu-section__title {
    color: #323142;
    margin-top: 0;
    margin-bottom: 24px;
  }

  .menu-section__dishes-wrapper {
    display: flex;
    gap: 30px;
    padding-top: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .menu-section__dish {
    flex: 0 0 auto;
    scroll-snap-align: start;
    width: 225px;
    padding: 37px 20px 26px;
    border: 2px solid #f4f4f4;
    border-radius: 30px;
    position: relative;
    cursor: pointer;
    transition: transform .3s ease;

    &:hover {
      transform: translateY(-10px);
    }

    .card-img-top {
      border-radius: 30px 30px 0 0;
    }

    .card-body {
      padding: 0;

      h5 {
        font-family: $font-family, sans-serif;
        font-weight: 800;
        font-size: 25px;
        line-height: 162%;
        color: #323142;
        margin-bottom: 0;
      }

      .menu-section__dish-info {
        font-family: $font-family, sans-serif;
        font-weight: 400;
        font-size: 19px;
        line-height: 133%;
        color: #8e97a6;
      }
    }
  }
}

/* Адаптивность страниц ресторанов */
@media screen and (max-width: 1199.98px) {

  // Планшеты в горизонтальной ориентации, Ipad Pro (>= 1024px)
  .dish-favorite {
    top: 8px;
    right: 8px;
  }

  .add-to-cart {
    width: 40px;
    height: 36px;
    right: 16px;
    bottom: 20px;
  }

  .restaurant-hero__wrapper {
    padding-bottom: 24px;

    .card {
      box-shadow: 5px 65px 32px 0 rgba(229, 229, 229, 0.7);

      .card-img-top {
        max-height: 268px;
      }

      .card-body {
        padding: 1.25rem 2rem;

        h1 {
          font-size: 36px;
        }

        .our-restaurants__restaurant-info {
          font-size: 28px;
        }

        .restaurant-bookmark {
          &::after {
            width: 24px;
            height: 32px;
          }
        }
      }
    }
  }

  /* Блюда ресторана */
  .menu-section__wrapper {
    padding-top: 60px;
    padding-bottom: 40px;

    .our-dishes__dishes-wrapper {
      gap: 22px;
    }

    .menu-section__dish {
      width: 200px;
      padding: 1rem;

      .card-body {
        h5 {
          font-size: 24px;
        }

        .menu-section__dish-info {
          font-size: 18px;
        }
      }
    }
  }
}

@media screen and (max-width: 991.98px) {

  // Планшеты в вертикальной ориентации (>= 768px)
  .dish-favorite {
    top: 12px;
    width: 35px;
    height: 35px;

    &::after {
      width: 23px;
      height: 19px;
    }
  }

  .cart-btn-section--md-position {
    bottom: 20px;
  }

  .cart-btn {
    width: 400px;
  }

  .restaurant-hero__wrapper {

    .card {
      .card-img-top {
        max-height: 240px;
      }

      h1 {
        font-size: 32px;
      }

      .our-restaurants__restaurant-info {
        font-size: 24px;
      }

      .card-body {
        .restaurant-bookmark {
          width: 56px;
          height: 56px;

          &::after {
            width: 20px;
            height: 28px;
          }
        }
      }
    }
  }

  /* Блюда ресторана */
  .menu-section__wrapper {
    padding-bottom: 30px;

    .menu-section__dish {
      .menu-section__dish-info {
        img {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
}

@media screen and (max-width: 767.98px) {

  // Телефоны в горизонтальной ориентации (>= 576px)
  .add-to-cart {
    width: 36px;
    height: 32px;
    right: 16px;
    bottom: 16px;
  }

  .cart-btn {
    width: 100%;
  }

  .restaurant-hero__wrapper {
    padding-bottom: 16px;

    .card {
      box-shadow: 5px 57px 28px 0 rgba(229, 229, 229, 0.7);

      .card-img-top {
        max-height: 200px;
      }

      .card-body {
        padding: 0.75rem 1.5rem;

        h1 {
          font-size: 28px;
        }

        .our-restaurants__restaurant-info {
          font-size: 20px;
        }

        .restaurant-bookmark {
          width: 48px;
          height: 48px;

          &::after {
            width: 16px;
            height: 24px;
            background-size: contain;
          }
        }
      }
    }
  }

  /* Блюда ресторана */
  .menu-section__wrapper {
    padding-top: 60px;
    padding-bottom: 40px;

    .menu-section__dish {
      width: 175px;

      .card-body {
        h5 {
          font-size: 20px;
        }

        .menu-section__dish-info {
          font-size: 16px;

          img {
            width: 22px;
            height: 22px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 566.98px) {

  // Телефоны в вертикальной ориентации (< 567px)
  .add-to-cart {
    width: 36px;
    height: 32px;
    right: 16px;
    bottom: 16px;
  }

  .restaurant-hero__wrapper {
    padding-bottom: 0;

    .card {
      .card-body {
        padding: 0.5rem 1.5rem;

        h1 {
          font-size: 24px;
        }

        .our-restaurants__restaurant-info {
          font-size: 18px;
        }

        .restaurant-bookmark {
          position: absolute;
          width: 48px;
          height: 48px;
          right: 18px;
          bottom: 14px;

          &::after {
            width: 18px;
            height: 26px;
          }
        }
      }
    }
  }

  /* Блюда ресторана */
  .menu-section__wrapper {
    padding-top: 60px;
    padding-bottom: 30px;

    .menu-section__dish {
      width: 175px;

      .card-body {
        h5 {
          font-size: 20px;
        }

        .menu-section__dish-info {
          font-size: 16px;

          img {
            width: 22px;
            height: 22px;
          }
        }
      }
    }
  }
}
</style>