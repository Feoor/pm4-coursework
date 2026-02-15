<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import RestaurantCard from '@/components/RestaurantCard.vue'
import DishCard from '@/components/DishCard.vue'
import ReviewCard from '@/components/ReviewCard.vue'

import { ref } from 'vue'
import { getImageUrl } from '@/utils/helpers'

const restaurants = ref([
  {
    id: 1,
    name: 'The Chicken King',
    image: getImageUrl('the_chicken_king.webp'),
    badge: 'Полезно',
    deliveryTime: 1440,
    rating: 4.8
  },
  {
    id: 2,
    name: 'The Fishman',
    image: getImageUrl('the_fishman.webp'),
    badge: 'Популярно',
    deliveryTime: 1440,
    rating: 4.8
  },
  {
    id: 3,
    name: 'The Chicken King',
    image: getImageUrl('the_chicken_king.webp'),
    badge: 'Полезно',
    deliveryTime: 1440,
    rating: 4.8
  }
])

const dishes = ref([
  {
    id: 1,
    restaurantId: 1,
    name: 'Chicken Hell',
    image: getImageUrl('chicken_hell_dish.png'),
    badge: 'Полезно',
    deliveryTime: 1440,
    rating: 4.8,
    price: 1799
  },
  {
    id: 2,
    restaurantId: 1,
    name: 'Swe Dish',
    image: getImageUrl('swe_dish.png'),
    badge: 'Популярно',
    deliveryTime: 2040,
    rating: 4.9,
    price: 2499
  },
  {
    id: 3,
    restaurantId: 2,
    name: 'Fish Hell',
    image: getImageUrl('fish_hell_dish.png'),
    badge: 'Эксклюзив',
    deliveryTime: 1440,
    rating: 4.9,
    price: 2499
  },
  {
    id: 4,
    restaurantId: 1,
    name: 'Chicken Hell',
    image: getImageUrl('chicken_hell_dish.png'),
    badge: 'Полезно',
    deliveryTime: 1440,
    rating: 4.8,
    price: 1799
  },
  {
    id: 5,
    restaurantId: 1,
    name: 'Swe Dish',
    image: getImageUrl('swe_dish.png'),
    badge: 'Популярно',
    deliveryTime: 2040,
    rating: 4.9,
    price: 2499
  }
])

const reviews = ref([
  {
    id: 1,
    name: 'Анна Петрова',
    image: getImageUrl('review_author.png'),
    slogan: '2 года с нами',
    text: 'Отличный сервис! Еда всегда свежая и вкусная. Рекомендую всем!',
    rating: 5
  },
  {
    id: 2,
    name: 'Иван Иванов',
    image: getImageUrl('review_author.png'),
    slogan: '1 год с нами',
    text: 'Очень доволен качеством блюд и быстрой доставкой. Буду заказывать снова!',
    rating: 4
  },
  {
    id: 3,
    name: 'Мария Смирнова',
    image: getImageUrl('review_author.png'),
    slogan: '6 месяцев с нами',
    text: 'Прекрасный выбор блюд и отличный сервис. Рекомендую всем любителям вкусной еды!',
    rating: 5
  }
])
</script>

<template>
    <Header />

    <main class="main">
      <!--  Встречающий контент  -->
      <section class="hero">
        <div class="container-sm">
          <div class="hero__wrapper row">

            <div class="hero__left-column col-12 col-md-6 d-flex flex-column">
              <p class="hero__subtitle">БОЛЕЕ 1000 ПОЛЬЗОВАТЕЛЕЙ</p>

              <h1 class="hero__title mb-3">
                Наслаждайтесь едой со всего
                <span class="highlight--purple">Мира</span>
              </h1>

              <p class="hero__text">С EatLy вы можете ставить цели по сбережениям, получать кэшбэк, получить зарплату на 2 дня раньше (см.условия) и получите бонус <span class="highlight--purple">$20</span>.</p>

              <div class="hero__buttons">
                <router-link to="/sign-up" class="hero__btn btn btn-primary">Приступить</router-link>
              </div>

              <div class="hero__reviews col-12 d-flex">
                <div class="hero__review">
                  <img class="hero__review-logo" src="@/assets/img/trustpilot_logo.svg" alt="Trustpilot logo">

                  <div class="hero__review-stars">
                      <img v-for="star in 5" :key="star" src="@/assets/icons/full_star.svg" alt="star">
                  </div>

                  <div class="hero__review-counts">
                    <span>4900+</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="hero__right-column col-12 col-md-6">
              <div class="hero__food-img">
                <img src="@/assets/img/hero_food.webp" alt="Hero Food">
              </div>
              <div class="hero__order-preview">
                <img src="@/assets/img/order_preview.webp" alt="Order Preview">
              </div>
              <div class="hero__graph">
                <img src="@/assets/img/hero_graph.png" alt="Hero Graph">
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Преимущества -->
      <section class="features">
        <div class="container-sm">

          <div class="features__wrapper row justify-content-evenly">
            <div class="features__feature col-12 col-md-3 h-100">
              <h3 class="features__feature-title">10K+</h3>
              <p class="features__feature-text">Довольных клиентов <br>По всему миру</p>
            </div>

            <div class="features__feature col-12 col-md-3 h-100">
              <h3 class="features__feature-title">4M</h3>
              <p class="features__feature-text">Продано полезных блюд <br>Включая молочные коктейли</p>
            </div>

            <div class="features__feature col-12 col-md-3 h-100">
              <h3 class="features__feature-title">99.99%</h3>
              <p class="features__feature-text">Надежная поддержка <br>Мы создаем лучший сервис</p>
            </div>
          </div>

        </div>
      </section>

      <!-- Скачать приложение -->
      <section class="app-download">
        <div class="container-sm">

          <div class="app-download__wrapper row justify-content-between align-items-center">
            <div class="app-download__mockup col-12 col-lg-6 order-1 order-lg-0">
              <div class="app-download__mobile-screen mx-auto">
                <img src="@/assets/img/mobile_screen.webp" alt="Mobile Screen" class="app-download__mobile-screen">
              </div>
            </div>

            <div class="app-download__content col-12 col-lg-6 d-flex flex-column">
              <h2 class="app-download__title">
                Премиальное
                <span class="highlight--purple">качество</span>
                для вашего здоровья
              </h2>

              <ul class="app-download__features">
                <li class="app-download__feature">
                  <p>Премиальная еда готовится из ингредиентов, богатых важными витаминами и минералами.</p>
                </li>
                <li class="app-download__feature">
                  <p>Эти продукты способствуют общему оздоровлению, поддерживая пищеварение и укрепляя иммунитет.</p>
                </li>
              </ul>

              <button class="app-download__btn">Скачать</button>
            </div>
          </div>

        </div>
      </section>

      <!-- Наши лучшие рестораны -->
      <section class="our-restaurants">
        <div class="container-sm">

          <!-- Обертка сетки -->
          <div class="our-restaurants__wrapper">
            <!-- Титул -->
            <h2 class="our-restaurants__title text-center">Наши лучшие <span class="highlight--purple">рестораны</span></h2>

            <!-- Карточки ресторанов -->
            <div class="our-restaurants__restaurants-wrapper col-12 mb-2">

              <RestaurantCard
                v-for="restaurant in restaurants"
                :key="restaurant.id"
                :restaurant="restaurant"
              />

            </div>

            <!-- Переход на страницу меню -->
            <div class="col-12 text-end">
              <router-link to="/menu" class="view-all">Посмотреть все</router-link>
            </div>

          </div>

        </div>
      </section>

      <!-- Наши лучшие блюда -->
      <section class="our-dishes">
        <div class="container-sm">

          <!-- Обертка сетки -->
          <div class="our-dishes__wrapper">
            <!-- Титул -->
            <h2 class="our-dishes__title col-12 text-center">Наши лучшие <span class="highlight--purple">блюда</span></h2>

            <!-- Карточки блюд -->
            <div class="our-dishes__dishes-wrapper col-12 mb-2">
              <DishCard
                v-for="dish in dishes"
                :key="dish.id"
                :dish="dish"
                mode="preview"
              />
            </div>
            <!-- Переход на страницу меню -->
            <div class="col-12 text-end">
              <router-link to="/menu" class="view-all">Посмотреть все</router-link>
            </div>

          </div>

        </div>
      </section>

      <!-- Секция об контроле покупок -->
      <section class="purchases-control">
        <div class="container-sm">
          <div class="purchases-control__wrapper row align-items-center">

            <div class="purchases-control__left-column col-12 col-lg-6 d-flex flex-column justify-content-start mb-5 mb-lg-0">
              <h2 class="purchases-control__title mb-5">
                Контролируйте
                <span class="highlight--purple">покупки</span>
                через панель управления
              </h2>

              <img src="@/assets/img/order_history.webp" alt="Order History" class="purchases-control__first-image">
            </div>

            <div class="purchase-control__right-column col-12 col-lg-6 d-flex justify-content-end">
              <img src="@/assets/img/purchases_control.png" alt="Purchases Control" class="purchases-control__second-image">
            </div>

          </div>
        </div>
      </section>

      <!-- Секция с отзывами -->
      <section class="reviews">
        <div class="container-sm">
          <div class="reviews__wrapper">

            <h2 class="reviews__title text-center">
              <span class="highlight--purple">Отзывы</span>
              клиентов
            </h2>

            <div class="reviews__inner purple-scrollbar">
              <ReviewCard
                v-for="review in reviews"
                :key="review.id"
                :review="review"
              />
            </div>

          </div>
        </div>
      </section>

      <!-- Секция с подпиской и купоном на скидку -->
      <section class="sale">
        <div class="container-sm">
          <div class="sale__wrapper">

              <h2 class="sale__title">ПОЛУЧИТЕ 50%</h2>

              <form id="promoForm" class="sale__form">
                <div class="form-floating col-12 col-md-7 col-xl-5">
                  <input id="promoEmailInput" type="email" class="sale__email-input form-control" placeholder="name@example.com">
                  <label for="promoEmailInput">Введите Ваш Email Адрес</label>

                  <button type="submit" class="subscribe__btn">Подписаться</button>
                </div>
              </form>

          </div>
        </div>
      </section>
    </main>

    <Footer />
</template>

<style lang="scss" scoped>
.view-all {
  position: relative;
  z-index: 1; /* Чтобы тень не перекрывала текст */
  margin-top: 65px;
  padding-right: 40px;
  font-family: $font-family, sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 226%;
  letter-spacing: -0.01em;
  color: #acadb9;

  &::after {
    display: inline-block;
    content: "";
    width: 24px;
    height: 24px;
    background: url("@/assets/icons/gray_right_arrow.svg") no-repeat;
    background-size: contain;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    transition: transform .2s;
  }
  &:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
    &::after {
      transform: translateX(8px) translateY(-50%);
    }
  }
}

.hero__wrapper {
  padding-top: 250px;
  padding-bottom: 130px;

  .hero__left-column {
    .hero__subtitle {
      padding-left: 76px;
      font-family: $font-family, sans-serif;
      font-weight: 900;
      font-size: 15px;
      line-height: 120%;
      letter-spacing: 0.13em;
      text-transform: uppercase;
      color: rgba(32, 31, 31, 0.2);
      position: relative;

      &::before {
        display: inline-block;
        content: "";
        width: 54px;
        height: 0;
        border: 1px solid rgba(32, 31, 31, 0.2);
        margin-right: 20px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }
    .hero__title {
      font-family: $font-family, sans-serif;
      font-weight: 900;
      font-size: 60px;
      color: #201f1f;
    }
    .hero__text {
      font-family: $second-family, sans-serif;
      font-weight: 400;
      font-size: 18px;
      line-height: 156%;
      color: #676767;
      opacity: 0.7;

      margin-bottom: 54px;
    }
    .hero__buttons {
      display: flex;
      gap: 18px;
    }
    .hero__btn {
      padding: 1rem 28px;
    }
    .hero__reviews {
      display: flex;
      gap: 12px;
      margin-top: 54px;
      //width: 350px;
      overflow: hidden;

      .hero__review {
        display: flex;
        align-items: center;
        gap: 20px;

        .hero__review-logo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero__review-stars {
          display: flex;
          gap: 4px;
          width: 96px;
        }
        .hero__review-counts {
          font-family: $font5, sans-serif;
          font-weight: 400;
          font-size: 16px;
          line-height: 150%;
          color: #334155;
          opacity: 0.7;
        }
      }
    }
  }
  .hero__right-column {
    display: flex;
    justify-content: center;
    align-content: center;
    position: relative;

    .hero__food-img {
      position: relative;

      img {
        width: 449px;
        height: 456px;
        object-fit: contain;
      }

      &::after {
        display: inline-block;
        content: "";
        width: 101px;
        height: 98px;
        position: absolute;
        background: url("@/assets/icons/spiral_arrow.svg") no-repeat;
        background-size: contain;
        z-index: -1;
        top: 23%;
        right: -10%;
        transform: translateY(-50%);
      }
    }

    .hero__order-preview {
      position: absolute;
      top: -2%;
      right: 3px;
      transform: translateY(-50%);

      img {
        width: 329px;
        height: 90px;
        border-radius: 16px;
        box-shadow: -10px 12px 21px 0 rgba(0, 0, 0, 0.15);
        object-fit: contain;
      }
      &::after {
        display: inline-block;
        content: "";
        width: 42px;
        height: 28px;
        background: url("@/assets/icons/illustration_01.svg") no-repeat;
        background-size: contain;
        position: absolute;
        top: -15%;
        right: -14%;
        transform: translateY(-50%);
      }
    }
    .hero__graph {
      position: absolute;
      bottom: 0;
      left: 0;

      img {
        width: 207px;
        height: 206px;
        border-radius: 17px;
        box-shadow: 13px -17px 28px 0 rgba(0, 0, 0, 0.15);
        object-fit: contain;
      }

      &::before {
        display: inline-block;
        width: 39px;
        height: 37px;
        content: "";
        position: absolute;
        background: url("@/assets/icons/illustration_02.svg") no-repeat;
        background-size: contain;
        z-index: -1;
        bottom: -25%;
        left: -20%;
        transform: translateY(-50%);
      }
    }
  }
}

/* Стили для секций */
/* Наши преимущества */
.features {
  background: url("@/assets/img/features_bg.svg") no-repeat;
  background-size: cover;
  padding: 48px 0;

  .features__feature {
    &:not(:last-child) {
      border-right: 1px solid $translucent-white;
    }

    .features__feature-title {
      font-family: $font3, sans-serif;
      font-weight: 700;
      font-size: 43px;
      line-height: 125%;
      text-align: center;
      text-transform: uppercase;
      color: #fff;
    }
    .features__feature-text {
      font-family: $second-family, sans-serif;
      font-weight: 500;
      font-size: 14px;
      line-height: 150%;
      text-align: center;
      text-transform: capitalize;
      color: #c5bfed;
    }
  }
}

/* Скачать приложение */
.app-download__wrapper {
  padding: 120px 0;
  border-bottom: 2px solid #cbcbcb;

  .app-download__mockup {
    .app-download__mobile-screen {
      position: relative;
      max-width: 304px;
      max-height: 609px;
      object-fit: contain;

      &::after {
        display: inline-block;
        content: "";
        width: 52px;
        height: 62px;
        background: url("@/assets/icons/illustration_02.svg") no-repeat;
        position: absolute;
        top: -35px;
        right: -60px;
        transform: rotate(215deg) scale(1.2);
      }
    }
  }
  .app-download__content {
    .app-download__title {
      font-family: $font-family, sans-serif;
      font-weight: 900;
      font-size: 50px;
      color: #18181b;
      margin-bottom: 62px;
    }
    .app-download__features {
      display: flex;
      flex-direction: column;
      gap: 28px;
      margin-bottom: 60px;

      .app-download__feature {
        font-family: $second-family, sans-serif;
        font-weight: 400;
        font-size: 20px;
        line-height: 150%;
        color: #676767;

        p {
          margin-bottom: 0;
        }
      }
    }
    .app-download__btn {
      position: relative;
      width: max-content;
      padding: 1.25rem 68px 1.25rem 26px;
      border-radius: 15px;
      background: $purple;
      border: none;
      font-family: $font-family, sans-serif;
      font-weight: 600;
      font-size: 18px;
      line-height: 125%;
      text-transform: capitalize;
      text-align: center;
      color: #fff;
      transition: background .3s;

      &::after {
        display: inline-block;
        content: "";
        width: 30px;
        height: 30px;
        background: url("@/assets/icons/right_arrow.svg") no-repeat;
        background-size: contain;
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-45%);
        transition: transform .2s;
      }
      &::before {
        display: inline-block;
        content: "";
        width: 169px;
        height: 61px;
        background: url("@/assets/img/long_spiral.svg") no-repeat;
        background-size: contain;
        position: absolute;
        z-index: -1;
        bottom: -80%;
        right: -85%;
      }
      &:hover {
        background: $purple-hover;
      }
      &:hover::after {
        transform: translateX(8px) translateY(-45%);
      }
    }
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

/* Управление покупками */
.purchases-control__wrapper {
  padding-top: 100px;
  padding-bottom: 120px;
  border-bottom: 2px solid #cbcbcb;

  .purchases-control__title {
    font-weight: 900;
    font-size: 50px;
    color: #18181b;
  }
  .purchases-control__first-image {
    max-width: 345px;
    max-height: 294px;
  }
  .purchases-control__second-image {
    max-width: 543px;
    max-height: 466px;
    border-radius: 28px;
    box-shadow: 0 100px 100px -32px rgba(50, 49, 66, 0.2);
  }
}

/* Отзывы клиентов */
.reviews__wrapper {
  padding-top: 100px;
  padding-bottom: 120px;

  /* Карусель со слайдером */
  .reviews__inner {
    display: flex;
    gap: 48px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 30px;
  }

  /* Титул */
  .reviews__title {
    font-weight: 800;
    margin-bottom: 80px;
  }
}

/* Секция с купоном */
.sale {
  padding-top: 100px;
}
.sale__wrapper {
  width: 100%;
  height: 280px;
  padding: 40px 65px;
  border-radius: 30px;
  background: $purple url("@/assets/img/sale_bg.webp");
  background-size: cover;
  position: relative;

  &::after {
    display: inline-block;
    content: "";
    width: 274px;
    height: 276px;
    background: url("@/assets/img/swe_dish.png") no-repeat;
    background-size: contain;
    position: absolute;
    bottom: -25%;
    right: 5%;
  }
  .sale__title {
    font-weight: 900;
    font-size: 60px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 38px;
  }
  /* Стили текста для формы */
  .sale__form {
    font-family: $font-family, sans-serif;
    font-weight: 600;
    color: #878787;
    opacity: 0.8;

    .form-floating {
      position: relative;
    }
    .sale__email-input {
      border-radius: 14px;
      height: 68px;
      padding-right: 180px;
      font-family: $font-family, sans-serif;
      font-weight: 600;
      font-size: 16px;
      color: #323142;
      background-color: #fff;
    }
    .subscribe__btn {
      position: absolute;
      top: 0; right: 8px; bottom: 0;
      margin: auto;
      border-radius: 11px;
      height: 53px;
      padding: 0 24px;
      background: $purple;
      border: none;
      font-family: $font-family, sans-serif;
      font-weight: 600;
      font-size: 18px;
      line-height: 125%;
      text-transform: capitalize;
      text-align: center;
      color: #fff;
      transition: background .3s;

      &:hover {
        background: $purple-hover;
      }
    }
  }
}

/* Адаптивность главной страницы */
@media screen and (max-width: 1199.98px) {
  // Планшеты в горизонтальной ориентации, Ipad Pro (>= 1024px)

  .hero__wrapper {
    padding-top: 200px;
    padding-bottom: 100px;

    .hero__left-column {
      .hero__subtitle {
        padding-left: 52px;
        margin-bottom: 12px;

        font-size: 15px;

        &::before {
          width: 42px;
        }
      }
      .hero__title {
        font-size: 60px;
      }
      .hero__text {
        font-size: 18px;
        margin-bottom: 48px;
      }
      .hero__buttons {
        gap: 20px;
      }
      .hero__btn {
        font-size: 18px;
        padding: 0.75rem 1.5rem;
      }

      .hero__reviews {
        .hero__review {
          gap: 16px;

          .hero__review-logo {
            width: 123px;
            height: 31px;
          }
          .hero__review-stars {
            img {
              width: 17px;
              height: 16px;
            }
          }
        }
      }
    }

    .hero__right-column {
      .hero__food-img {
        img {
          max-width: 305px;
          max-height: 315px;
        }
        &::after {
          width: 72px;
          height: 69px;
          top: 15%;
          right: -12%;
        }
      }
      .hero__order-preview {
        top: -10%;
        right: 55%;
        transform: translateX(-50%);

        img {
          width: 234px;
          height: 64px;
          position: absolute;
        }
        &::after {
          display: none;
        }
      }
      .hero__graph {
        bottom: 25%;
        left: 10%;

        img {
          width: 148px;
          height: 146px;
        }

        &::before {
          width: 27px;
          height: 23px;
          bottom: -17%;
          left: -12%;
        }
      }
    }
  }

  .features {
    padding: 55px 0;

    .features__feature {
      .features__feature-title {
        font-size: 43px;
      }
      .features__feature-text {
        font-size: 14px;
      }
    }
  }

  .app-download__wrapper {
    padding-top: 80px;
    padding-bottom: 86px;

    .app-download__mockup {
      .app-download__mobile-screen {
        max-width: 216px;
        max-height: 433px;

        &::after {
          width: 40px;
          height: 45px;
          top: -30px;
          right: -50px;
        }
      }
    }

    .app-download__content {
      .app-download__title {
        font-size: 38px;
        margin-bottom: 48px;
      }
      .app-download__features {
        gap: 24px;

        .app-download__feature {
          font-size: 18px;
        }
      }
      .app-download__btn {
        padding: 1rem 3rem 1rem 1.5rem;
        font-size: 18px;

        &::after {
          width: 24px;
          height: 24px;
          right: 14px;
        }
        &::before {
          width: 110px;
          height: 44px;
          bottom: -60%;
          right: -60%;
          transform: rotate(-5deg);
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

  .purchases-control__wrapper {
    padding-top: 80px;
    padding-bottom: 86px;

    .purchases-control__title {
      font-size: 44px;
    }
    .purchases-control__first-image {
      max-width: 246px;
      max-height: 210px;
    }

    .purchases-control__second-image {
      max-width: 380px;
      max-height: 332px;
    }
  }

  .reviews__wrapper {
    padding-top: 80px;
    padding-bottom: 86px;

    .reviews__title {
      font-size: 44px;
      margin-bottom: 54px;
    }
  }
  .sale {
    padding-top: 80px;

    .sale__wrapper {
      padding: 2rem 3rem;
      height: 200px;

      &::after {
        width: 195px;
        height: 196px;
      }
      .sale__title {
        font-size: 48px;
        margin-bottom: 24px;
      }
      .sale__email-input {
        padding-right: 130px;
        height: 48px;
      }
      .sale__form {
        .subscribe__btn {
          height: 38px;
          font-size: 10px;
        }
      }
    }
  }
}

@media screen and (max-width: 991.98px) {
  // Планшеты в вертикальной ориентации (>= 768px)

  .hero__wrapper {
    padding-top: 180px;
    padding-bottom: 90px;

    .hero__left-column {
      .hero__subtitle {
        font-size: 14px;

        &::before {
          width: 36px;
        }
      }
      .hero__title {
        font-size: 42px;
      }
      .hero__text {
        font-size: 18px;
      }
      .hero__btn {
        font-size: 16px;
        padding: 0.75rem 1.25rem;
      }

      .hero__reviews {
        margin-top: 36px;
      }
    }

    .hero__right-column {
      .hero__food-img {
        img {
          max-width: 220px;
          max-height: 221px;
        }
        &::after {
          width: 72px;
          height: 69px;
          top: 15%;
          right: -14%;
        }
      }
      .hero__order-preview {
        top: -8%;
        right: 53%;

        img {
          width: 163px;
          height: 45px;
        }
      }
      .hero__graph {
        bottom: 45%;
        left: 8%;

        img {
          width: 104px;
          height: 103px;
        }

        &::before {
          width: 19px;
          height: 15px;
          bottom: -17%;
          left: -12%;
        }
      }
    }
  }

  .features {
    .features__feature {
      .features__feature-title {
        font-size: 40px;
      }
      .features__feature-text {
        font-size: 14px;
        margin-bottom: 0;
      }
    }
  }

  .app-download__wrapper {
    padding-top: 70px;
    padding-bottom: 76px;

    .app-download__mockup {
      .app-download__mobile-screen {
        max-width: 304px;
        max-height: 609px;

        &::after {
          width: 40px;
          height: 45px;
          top: -30px;
          right: -50px;
        }
      }
    }

    .app-download__content {
      padding-bottom: 64px;

      .app-download__title {
        font-size: 45px;
        margin-bottom: 48px;
        text-align: center;
      }
      .app-download__features {
        gap: 8px;
        margin-bottom: 24px;

        .app-download__feature {
          font-size: 20px;
        }
      }
      .app-download__btn {
        align-self: center;
        padding: 1.25rem 3.5rem 1.25rem 1.75rem;
        font-size: 18px;

        &::after {
          width: 28px;
          height: 28px;
          right: 14px;
        }
        &::before {
          width: 140px;
          height: 52px;
          bottom: -15%;
          right: -85%;
          transform: rotate(340deg);
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

  .purchases-control__wrapper {
    padding-top: 70px;
    padding-bottom: 76px;

    .purchases-control__title {
      font-size: 45px;
    }
    .purchases-control__first-image {
      max-width: 172px;
      max-height: 147px;
      margin: 0 auto;
    }

    .purchases-control__second-image {
      max-width: 266px;
      max-height: 225px;
      margin: 0 auto;
    }
  }

  .reviews__wrapper {
    .reviews__title {
      font-size: 40px;
    }
  }

  .sale {
    padding-top: 70px;

    .sale__wrapper {
      padding: 1.5rem 2.75rem;
      height: 200px;

      &::after {
        width: 195px;
        height: 196px;
      }
      .sale__title {
        font-size: 48px;
        margin-bottom: 24px;
      }
      .sale__email-input {
        height: 48px;
      }
      .sale__form {
        .subscribe__btn {
          height: 38px;
          font-size: 10px;
        }
      }
    }
  }
}

@media screen and (max-width: 767.98px) {
  // Телефоны в горизонтальной ориентации (>= 576px)

  .hero__wrapper {
    padding-top: 140px;
    padding-bottom: 120px;

    .hero__left-column {
      padding-bottom: 70px;
      align-items: center;
      text-align: center;

      .hero__subtitle {
        padding-left: 68px;
        margin-bottom: 20px;
        font-size: 15px;

        &::before {
          width: 54px;
        }
      }
      .hero__title {
        font-size: 52px;
      }

      .hero__btn {
        font-size: 18px;
        padding: 1rem 1.75rem;
      }

      .hero__reviews {
        flex-direction: column;
        align-items: center;
        margin-top: 40px;

        .hero__review {
          gap: 24px;
        }
      }
    }
    .hero__right-column {
      .hero__food-img {
        img {
          max-width: 314px;
          max-height: 320px;
        }
        &::after {
          top: 27%;
          right: -12%;
        }
      }
      .hero__order-preview {
        top: -8%;
        right: 53%;

        img {
          width: 230px;
          height: 64px;
        }
      }
      .hero__graph {
        bottom: -20%;
        left: 8%;

        img {
          width: 169px;
          height: 168px;
        }

        &::before {
          width: 38px;
          height: 33px;
          bottom: -27%;
          left: -17%;
        }
      }
    }
  }

  .features {
    background: url("@/assets/img/features_bg-sm.svg") no-repeat;
    background-size: cover;

    .features__feature {
      padding: 1.5rem 0;

      &:not(:last-child) {
        border-right: none;
        border-bottom: 1px solid $translucent-white;
      }
      .features__feature-title {
        font-size: 45px;
      }
    }
  }

  .app-download__wrapper {
    padding-top: 50px;
    padding-bottom: 60px;

    .app-download__content {
      .app-download__title {
        font-size: 35px;
      }
      .app-download__features {
        gap: 16px;
        margin-bottom: 32px;

        .app-download__feature {
          font-size: 20px;
        }
      }
      .app-download__btn {
        &::before {
          right: -95%;
        }
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

  .purchases-control__wrapper {
    padding-top: 50px;
    padding-bottom: 60px;

    .purchases-control__title {
      font-size: 35px;
    }
  }

  .reviews__wrapper {
    padding-top: 50px;
    padding-bottom: 60px;

    .reviews__title {
      font-size: 35px;
      margin-bottom: 40px;
    }
  }

  .sale {
    padding-top: 60px;

    .sale__wrapper {
      padding: 2.5rem 2rem;
      height: 300px;

      &::after {
        right: 50%;
        bottom: -32%;
        transform: translateX(50%);
      }
    }
  }
}

@media screen and (max-width: 566.98px) {
  // Телефоны в вертикальной ориентации (< 567px)

  .hero__wrapper {
    .hero__left-column {
      padding-bottom: 50px;

      .hero__subtitle {
        padding-left: 44px;
        font-size: 13px;

        &::before {
          width: 33px;
        }
      }
      .hero__title {
        font-size: 40px;
      }
      .hero__text {
        font-size: 16px;
        margin-bottom: 40px;
      }

      .hero__btn {
        font-size: 14px;
        padding: 0.75rem 1.5rem;
      }

      .hero__reviews {
        margin-top: 40px;

        .hero__review {
          gap: 16px;
        }
      }
    }
    .hero__right-column {
      .hero__food-img {
        img {
          max-width: 256px;
          max-height: 259px;
        }
        &::after {
          top: 28%;
          right: -7%;
        }
      }
      .hero__order-preview {
        top: -8%;
        right: 60%;

        img {
          width: 186px;
          height: 52px;
        }
      }
      .hero__graph {
        bottom: -20%;
        left: 8%;

        img {
          width: 120px;
          height: 119px;
        }

        &::before {
          width: 24px;
          height: 23px;
          bottom: -27%;
          left: -17%;
        }
      }
    }
  }

  .features {
    .features__feature {
      padding: 2rem 0;
    }
  }

  .app-download__wrapper {
    .app-download__mockup {
      .app-download__mobile-screen {
        max-width: 230px;
        max-height: 460px;

        &::after {
          top: -40px;
          right: -40px;
          transform: rotate(200deg) scale(1);
        }
      }
    }
    .app-download__content {
      padding-bottom: 120px;

      .app-download__title {
        margin-bottom: 40px;
      }
      .app-download__features {
        gap: 20px;

        .app-download__feature {
          font-size: 18px;
        }
      }
      .app-download__btn {
        &::before {
          width: 125px;
          height: 45px;
          bottom: -80%;
          right: 80%;
          transform: rotate(110deg);
        }
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

  .sale {
    .sale__wrapper {
      height: 400px;

      .sale__title {
        font-size: 42px;
        text-align: center;
      }
      .sale__email-input {
        padding-right: 12px;
      }
      .sale__form {
        .subscribe__btn {
          position: static;
          height: max-content;
          margin-top: 16px;
          padding: 1rem 1.5rem;
          font-size: 16px;
        }
      }
    }
  }
}

@media screen and (max-width: 330px) {
  // Очень маленькие мобильные экраны
  .hero__wrapper {
    .hero__left-column {
      .hero__title {
        font-size: 35px;
      }
      .hero__text {
        font-size: 15px;
        margin-bottom: 32px;
      }

      .hero__buttons {
        gap: 12px;
      }
      .hero__btn {
        display: flex;
        align-items: center;
        font-size: 13px;
        padding: 0.75rem 1rem;
      }

      .hero__reviews {
        margin-top: 32px;

        .hero__review {
          gap: 8px;

          .hero__review-logo {
            width: 87px;
            height: 22px;
            object-fit: contain;
          }
          .hero__review-stars {
            width: max-content;

            img {
              width: 14px;
              height: 13px;
            }
          }
          .hero__review-counts {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>