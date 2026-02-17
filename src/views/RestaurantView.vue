<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import DishCard from '@/components/DishCard.vue'
import { getImageUrl } from '../utils/helpers';

const route = useRoute();
const restaurantId = ref(null);

onMounted(() => {
  restaurantId.value = route.params.id;

  console.log('ID ресторана:', restaurantId.value);
})

const addToCart = (dish) => {
  console.log('Добавлено в корзину:', dish);
}

const addToFavorites = (dish) => {
  console.log('Добавлено в избранное:', dish);
}
</script>

<template>
  <Header />

  <main class="main">
    <section class="restaurant-hero" data-restaurant-id="rest-1">
      <div class="container-sm">
        <div class="restaurant-hero__wrapper">
          <div class="card">
            <img src="../img/the_chicken_king.webp" alt="The Chicken King Restaurant" class="card-img-top">

            <div
              class="card-body d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between">
              <span class="badge badge-healthy d-xs-block d-sm-none">Полезно</span>
              <h1 class="card-title mt-0">The Chicken King</h1>

              <div class="our-restaurants__restaurant-info d-flex align-items-center">
                <span class="me-2">24min •</span>
                <img src="../icons/purple_star.svg" alt="Purple star">
                <span class="ms-1">4.8</span>
              </div>

              <button class="restaurant-bookmark"></button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Популярные блюда ресторана -->
    <section class="menu-section">
      <div class="container-sm">

        <!-- Обертка сетки -->
        <div class="menu-section__wrapper">
          <!-- Титул -->
          <h2 class="menu-section__title col-12">Popular 🔥</h2>

          <!-- Карточки блюд -->
          <div class="menu-section__dishes-wrapper col-12">
            <DishCard
              v-for="dish in [1, 2, 3, 4]"
              :key="dish"
              :dish="{
                name: `Dish ${dish}`,
                image: getImageUrl(`chicken_hell_dish.png`),
                badge: dish % 2 === 0 ? 'Полезно' : 'Популярно',
                deliveryTime: 20 + dish * 5,
                rating: (4.5 + dish * 0.1).toFixed(1),
                price: 1799 + dish * 200,
                restaurantId: 'rest-1'
              }"
              :mode="'full'"
              @add-to-cart="addToCart"
              @add-to-favorites="addToFavorites"
            />
          </div>

        </div>

      </div>
    </section>

    <!-- Курица с овощами -->
    <section class="menu-section">
      <div class="container-sm">

        <!-- Обертка сетки -->
        <div class="menu-section__wrapper">
          <!-- Титул -->
          <h2 class="menu-section__title col-12">Курица с овощами</h2>

          <!-- Карточки блюд -->
          <div class="menu-section__dishes-wrapper col-12">
            <div class="menu-section__dish card h-100">
              <!-- Кнопка "Добавить в любимое" -->
              <button class="product__favorite-btn dish-favorite"></button>

              <img src="../img/chicken_hell_dish.png" alt="Chicken Hell Dish"
                class="product__image card-img-top rounded-circle">

              <div class="card-body">
                <span class="badge badge-healthy">Полезно</span>
                <h5 class="product__name card-title mt-0">Chicken Hell</h5>

                <div class="menu-section__dish-info d-flex align-items-center mb-2">
                  <span class="me-2">24min •</span>
                  <img src="../icons/purple_star.svg" alt="Purple star">
                  <span class="ms-1">4.8</span>
                </div>
                <h5 class="product__price menu-section__dish-price">₸1799</h5>

                <!-- Кнопка "Добавить в корзину" -->
                <button class="product__cart-btn add-to-cart"></button>
              </div>
            </div>

            <div class="menu-section__dish card h-100">
              <!-- Кнопка "Добавить в любимое" -->
              <button class="product__favorite-btn dish-favorite"></button>

              <img src="../img/swe_dish.png" alt="Swe Dish" class="product__image card-img-top rounded-circle">

              <div class="card-body">
                <span class="badge badge-trending">Популярно</span>
                <h5 class="product__name card-title mt-0">Swe Dish</h5>

                <div class="menu-section__dish-info d-flex align-items-center mb-2">
                  <span class="me-2">34min •</span>
                  <img src="../icons/purple_star.svg" alt="Purple star">
                  <span class="ms-1">4.9</span>
                </div>
                <h5 class="product__price menu-section__dish-price">₸2499</h5>

                <!-- Кнопка "Добавить в корзину" -->
                <button class="product__cart-btn add-to-cart"></button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <section class="cart-btn-section--md-position d-flex d-lg-none position-sticky">
      <div class="container-sm">
        <button class="cart-btn btn btn-primary d-flex align-items-center mx-auto">
          <span class="cart__count me-3 badge rounded-pill bg-danger">0</span>
          Открыть заказ
          <span class="cart__price ms-auto">0 ₸</span>
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
  padding-top: 70px;
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