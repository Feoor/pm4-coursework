<script setup>
import { defineProps, ref, watch } from 'vue';
import { useAuthStore } from '@/store/authStore';
const authStore = useAuthStore();

defineProps({
  mode: {
    type: String,
    default: 'full' // 'full' для полного отображения(блок аунтификации), 'lite' для отображения только логотипа
  },
  cart: {
    type: Object, // Заменить на объект корзины
    default: null
  }
})

// Открываем сайдбар меню при нажатии на кнопку
const isMenuOpen = ref(false);

const handleMenuToggle = () => {
  isMenuOpen.value = !isMenuOpen.value;
}

// Управление блокировкой скролла через watcher
watch(isMenuOpen, (newValue) => {
  if (newValue) {
    document.body.classList.add('lock');
  } else {
    document.body.classList.remove('lock');
  }
});
</script>

<template>
  <!-- Навбар -->
  <header class="header" :class="mode === 'lite' ? 'header--lite' : ''">
    <div class="container-sm">
      <!--  Навигация  -->
      <div class="header__wrapper">

        <!--  Левая часть  -->
        <div class="header__left-side">
          <div class="header__logo">
            <router-link to="/" class="eatly-logo">eatly</router-link>

          </div>

          <nav v-if="mode === 'full'" class="header__nav">
            <ul class="header__list menu list-reset">
              <li class="menu__item menu__item--active"><router-link to="/menu">Меню</router-link></li>
              <li class="menu__item"><router-link to="/contacts">Контакты</router-link></li>
            </ul>
          </nav>
        </div>

        <div class="header__right-side">
          <div v-if="mode === 'full' && authStore.profile && authStore.isAuthInitialized"
            class="header__user-profile d-none d-sm-flex align-items-center">
            <span class="header__user-greeting highlight--purple">Здравствуйте,&nbsp;</span>
            <span class="header__user-name">{{ authStore.profile.shortName }}!</span>
            <button @click="authStore.logout()" class="header__logout btn btn-primary ms-2">Выйти</button>
          </div>

          <!-- FIXME: Профиль пользователя и кнопки аутификации не одного размера -->
          <div v-else-if="mode === 'full' && !authStore.profile && authStore.isAuthInitialized"
            class="header__auth-buttons d-none d-sm-flex">
            <router-link to="/sign-in" class="header__login me-2">Войти</router-link>
            <router-link to="/sign-up" class="header__sign-up">Зарегистрироваться</router-link>
          </div>

          <button v-if="mode === 'full' && cart" class="cart-btn btn btn-primary d-none d-lg-flex align-items-center">
            <span class="cart__count me-3 badge rounded-pill bg-danger">{{ cart.itemsCount }}</span>
            Открыть заказ
            <span class="cart__price ms-4">{{ cart.totalPrice }} ₸</span>
          </button>

          <button @click="handleMenuToggle" class="header__menu" :class="isMenuOpen ? 'header__menu--toggle' : ''">
            <span></span>
          </button>
        </div>

        <!-- Боковое меню -->
        <div class="sidebar" :class="(isMenuOpen || cart?.isMenuOpen) ? 'sidebar--show' : ''">

          <!-- Меню для навигации -->
          <div class="sidebar__menu-nav" :class="isMenuOpen ? 'sidebar__menu-nav--show' : ''">
            <div class="sidebar__header">
              <div class="sidebar__brand">
                <!-- Логотип без текста -->
                <router-link to="/" class="eatly-logo"></router-link>
              </div>
            </div>
            <div class="sidebar__nav">
              <ul class="sidebar__list menu list-reset">
                <li class="menu__item"><router-link to="/menu">Меню</router-link></li>
                <li class="menu__item"><router-link to="/contacts">Контакты</router-link></li>
              </ul>
            </div>
            <div v-if="mode === 'full'" class="sidebar__buttons justify-content-between text-center">

              <div v-if="authStore.profile && authStore.isAuthInitialized"
                class="sidebar__user-profile d-flex flex-column align-items-center col-12 gap-4">
                <div>
                  <span class="header__user-greeting highlight--purple">Здравствуйте,&nbsp;</span>
                  <span class="header__user-name">{{ authStore.profile.shortName }}!</span>
                </div>

                <button @click="authStore.logout()" class="header__logout btn btn-primary w-100">Выйти</button>
              </div>

              <div v-else-if="!authStore.profile && authStore.isAuthInitialized"
                class="sidebar__auth-buttons d-flex flex-column col-12 gap-2">
                <router-link to="/sign-in" class="sidebar__login">Войти</router-link>
                <router-link to="/sign-up" class="sidebar__sign-up">Зарегистрироваться</router-link>
              </div>

            </div>
          </div>

          <!-- Меню корзины -->
          <div class="sidebar__menu-cart sidebar__menu" :class="cart?.isMenuOpen ? 'sidebar__menu-cart--show' : ''">
            <div class="sidebar__header">
              <button id="closeCartButton" class="sidebar__close-btn"></button>
            </div>

            <div id="cartMenuContent" class="menu-cart__content">
              <h3 class="menu-cart__title mb-3">Корзина пуста</h3>
              <div class="menu-cart__dishes-wrapper">

                  <!-- Шаблон карточек блюд -->
                  <!-- <div class="menu-cart__dish d-flex justify-content-between align-items-center">
                    &lt;!&ndash; Краткая информация об блюде &ndash;&gt;
                    <div class="cart-dish__info d-flex align-items-center">
                      <img src="../img/fish_hell_dish.png" alt="Fish Hell Dish" class="cart-dish__image">
                      <div class="cart-dish__details">
                        <h5 class="cart-dish__name">Fish Hell</h5>
                        <span class="cart-dish__price">₸2499</span>
                      </div>
                    </div>

                    &lt;!&ndash; Кнопки управления количеством &ndash;&gt;
                    <div class="cart-dish__controls d-flex flex-column align-items-center">
                      <div class="cart-dish__qty d-flex align-items-center">
                        <button class="cart-dish__minus-btn"></button>
                        <span class="cart-dish__count">1</span>
                        <button class="cart-dish__plus-btn"></button>
                      </div>
                      <div class="cart-dish__total-price">
                        <span class="cart-dish__total">₸2499</span>
                      </div>
                    </div>
                  </div> -->
              </div>
            </div>

            <div id="sidebarCartButtons" class="sidebar__buttons">
                <!-- Шаблон кнопки перехода к оплате -->
                <!-- <a href="#" class="sidebar__checkout-btn w-100 d-flex align-items-center">
                  <span class="cart__count me-3 badge rounded-pill bg-danger">0</span>
                  Перейти к оплате
                  <span class="cart__price ms-auto">0 ₸</span>
                </a> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.list-reset {
  list-style: none;
  padding-left: 0;
}

.btn {
  height: 46px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 100;

  &--lite {
    position: relative;
    background: transparent;

    .header__wrapper {
      border-bottom: none;
    }
  }
}

.header__wrapper {
  padding: 1.5rem 0;
  border-bottom: 2px solid #cbcbcb;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header__left-side {
    display: flex;
    align-items: center;
    gap: 72px;

    .header__logo {
      font-family: $font-family, sans-serif;
      font-weight: 900;
      font-size: 24px;
      line-height: 130%;
      color: $purple;
      cursor: pointer;
    }

    .header__list {
      display: flex;
      margin: 0;
      gap: 38px;
      color: #606060;
    }
  }

  .header__right-side {
    display: flex;
    align-items: center;
    gap: 12px;

    // Кнопки авторизации
    .header__login {
      font-family: $second-family, sans-serif;
      font-weight: 700;
      font-size: 18px;
      line-height: 150%;
      color: #606060;
      background-color: inherit;
      border: none;
      border-radius: 17px;
      padding: 17px 26px;
      cursor: pointer;
      transition: background-color .2s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }

    .header__sign-up {
      font-family: $second-family, sans-serif;
      font-weight: 700;
      font-size: 18px;
      line-height: 150%;
      color: #f9f9f9;
      background: $purple;
      ;
      border: none;
      border-radius: 17px;
      padding: 17px 26px;
      cursor: pointer;
      transition: background .2s;

      &:hover {
        background: $purple-hover;
      }
    }

    .header__menu {
      display: none;
      position: relative;
      width: 30px;
      height: 20px;
      border: none;
      background: inherit;
      overflow: hidden;
      z-index: 200;

      // Линии меню
      &::after,
      &::before,
      span {
        content: "";
        position: absolute;
        width: 100%;
        height: 2px;
        background-color: #606060;
        left: 0;
        transition: transform .3s ease;
      }

      // Выравнивание линий
      &::after {
        bottom: 0;
      }

      &::before {
        top: 2px;
      }

      span {
        top: 50%;
        transform: translateY(-50%);
      }

      // Анимация
      &--toggle {
        &::after {
          background-color: #fff;
          bottom: 50%;
          transform: rotate(45deg);
        }

        &::before {
          top: 50%;
          background-color: #fff;
          transform: rotate(-45deg);
        }

        span {
          background-color: #fff;
          display: none;
        }
      }
    }
  }

  // Боковое меню
  .sidebar {
    display: flex;
    visibility: hidden;
    width: 100vw;
    height: 100vh;
    position: fixed;
    justify-content: flex-end;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.4);
    opacity: 0;
    pointer-events: none;
    transition: opacity .3s ease, visibility .3s ease;

    &--show {
      visibility: visible;
      opacity: 1;
      pointer-events: auto;
    }

    // Чтобы родительский элемент был над кнопкой меню
    &--with-close-btn-show {
      z-index: 300;
      visibility: visible;
      opacity: 1;
      pointer-events: auto;
    }

    // Меню навигации
    .sidebar__menu-nav {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 95%;
      height: 100%;
      border-top-left-radius: 40px;
      border-bottom-left-radius: 40px;
      padding: 0.75rem 1.5rem 0;
      background-color: $main-black;
      color: #fff;
      transform: translateX(100%);
      opacity: 0;
      transition: transform .3s ease, opacity .3s ease;
      z-index: 200;

      &--show {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .sidebar__header {
      display: flex;
      flex: 0 0 auto;
      // Размер главного хэдера страницы
      height: 56px;
      align-items: center;
      margin-bottom: 32px;

      .eatly-logo::before {
        right: 6px;
      }

      .sidebar__close-btn {
        position: absolute;
        display: inline-block;
        width: 40px;
        height: 40px;
        margin: 1.5rem 0.75rem 0 0;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        top: 0;
        right: 0;

        &::after {
          display: inline-block;
          content: "";
          width: 23px;
          height: 23px;
          background: url("@/assets/icons/close_icon.svg") no-repeat;
          background-size: contain;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }

    .sidebar__nav {
      overflow-y: auto;
      margin-bottom: 11rem;

      &::-webkit-scrollbar {
        display: none;
      }

      .menu__item>a {
        display: inline-block;
        width: 100%;
        padding: 1.5rem 0;
        border-bottom: 1px solid $translucent-white;
      }
    }

    .sidebar__buttons {
      display: flex;
      gap: 12px;
      padding: 0 1.5rem 2rem;
      position: absolute;
      right: 0;
      bottom: 48px; // По какой-то причине 0 недостаточно и элемент уходи за экран
      left: 0;

      a,
      button {
        padding: 0.75rem 1rem;
        border-radius: 16px;
        font-family: $second-family, sans-serif;
        font-size: 16px;
        font-weight: 600;
        transition: background .2s ease, color .2s ease;
      }
    }

    .sidebar__login {
      border: 1px solid $translucent-white;
      background-color: $purple-hover;

      &:hover {
        background-color: $purple;
      }
    }

    .sidebar__sign-up {
      border: 1px solid #fff;
      background-color: $main-black;
      color: #fff;

      &:hover {
        background-color: rgba(255, 255, 255, 0.15);
      }
    }

    // Боковая корзина
    .sidebar__menu-cart {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 95%;
      max-width: 550px;
      height: 100%;
      border-top-left-radius: 40px;
      border-bottom-left-radius: 40px;
      padding: 0.75rem 0 0;
      background-color: $main-black;
      color: #fff;
      transform: translateX(100%);
      opacity: 0;
      transition: transform .3s ease, opacity .3s ease;

      &--show {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .menu-cart__content {
      display: flex;
      flex-direction: column;
      overflow: auto;
      margin-bottom: 9rem;
      flex-grow: 1;
      color: #fff;

      &::-webkit-scrollbar {
        display: none;
      }

      .menu-cart__title {
        padding: 0 1.5rem;
        font-family: $font-family, sans-serif;
        font-size: 28px;
        font-weight: 800;
        color: #fff
      }

      .menu-cart__separator {
        width: 100%;
        height: 1px;
        background-color: $translucent-white;
        margin: 0.75rem 0;
      }

      .menu-cart__restaurant-name {
        padding: 0 1.5rem;
        font-family: $font-family, sans-serif;
        font-size: 20px;
        font-weight: 600;
        color: #fff;
      }
    }

    .menu-cart__dish {
      font-family: $font-family, sans-serif;
      font-weight: 600;
      padding: 0.75rem 1.5rem;

      &:hover {
        background-color: #353535;
      }

      // Информация о блюде
      .cart-dish__image {
        width: 100px;
        height: 100px;
        border-radius: 30px;
      }

      .cart-dish__details {
        margin-left: 16px;
      }

      .cart-dish__name {
        font-size: 20px;
      }

      .cart-dish__price {
        font-size: 18px;
      }

      // Кнопки управлением кол-вом блюд
      .cart-dish__qty {
        font-size: 20px;
        gap: 16px;

        button {
          position: relative;
          width: 40px;
          height: 40px;
          font-family: $font-family, sans-serif;
          font-size: 32px;
          border-radius: 10px;
          transition: background-color .2s ease;

          &::after {
            display: inline-block;
            content: "";
            width: 28px;
            height: 28px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }

      .cart-dish__minus-btn {
        background-color: $main-black;
        color: #fff;
        border: 1px solid #fff;

        &::after {
          background: url("@/assets/icons/minus.svg") no-repeat;
          background-size: contain;
        }

        &:hover {
          background-color: $translucent-white;
        }
      }

      .cart-dish__plus-btn {
        background-color: #fff;
        color: $main-black;
        border: 1px solid #fff;

        &::after {
          background: url("@/assets/icons/plus-black.svg") no-repeat;
          background-size: contain;
        }

        &:hover {
          background-color: $translucent-white;

          &::after {
            background: url("@/assets/icons/plus.svg") no-repeat;
            background-size: contain;
          }
        }
      }

      .cart-dish__total-price {
        margin-top: 4px;
        font-size: 20px;
        font-weight: 700;
        color: #fff;
      }
    }

    .sidebar__checkout-btn {
      border: 1px solid #fff;
      background-color: $main-black;
      color: #fff;
      text-align: center;

      &:hover {
        background-color: rgba(255, 255, 255, 0.15);
      }
    }
  }
}

/* Адаптивность навбара */
@media screen and (max-width: 1199.98px) {

  // Планшеты в горизонтальной ориентации, Ipad Pro
  .eatly-logo {
    &::before {
      width: 46px;
      height: 46px;
      right: 60px;
    }
  }

  .header__wrapper {
    height: 82px;

    .header__left-side {
      gap: 48px;

      .header__logo {
        font-size: 21px;
      }

      .header__list {
        gap: 30px;

        .menu__item {
          font-size: 18px;
        }
      }
    }

    .header__right-side {
      gap: 8px;

      .header__login {
        font-size: 18px;
        padding: 14px 22px;
      }

      .header__sign-up {
        font-size: 18px;
        padding: 14px 22px;
      }
    }
  }
}

@media screen and (max-width: 991.98px) {

  // Планшеты в вертикальной ориентации (>= 768px)
  .header__wrapper {
    padding: 0.75rem 0;

    .header__left-side {
      gap: 16px;
    }

    .header__right-side {
      gap: 8px;

      .header__login {
        font-size: 16px;
        padding: 16px 20px;
      }

      .header__sign-up {
        font-size: 16px;
        padding: 16px 20px;
      }
    }
  }
}

@media screen and (max-width: 767.98px) {

  // Телефоны в горизонтальной ориентации (>= 576px)
  .eatly-logo {
    padding-left: 52px;

    &::before {
      width: 46px;
      height: 42px;
      right: 58px;
    }
  }

  .header__wrapper {
    padding: 0.75rem 0;

    .header__left-side {
      .header__list {
        display: none;
      }
    }

    .header__right-side {
      gap: 16px;

      .header__menu {
        display: block;
      }
    }
  }
}

@media screen and (max-width: 566.98px) {

  // Телефоны в вертикальной ориентации (< 567px)
  .header__wrapper {
    height: 77px;
    padding: 1.5rem 0;

    .cart-btn {
      width: 400px;
    }

    // Боковое меню
    .sidebar {
      .sidebar__menu-nav {
        border-radius: 0;
        padding: 1.5rem 1.5rem 0;
        width: 100%;
      }

      .sidebar__header {
        height: 27px;
      }

      // Боковая корзина
      .sidebar__menu-cart {
        border-radius: 0;
        padding: 1.5rem 0 0;
        width: 100%;
      }

      .menu-cart__dish {

        // Информация о блюде
        .cart-dish__image {
          width: 56px;
          height: 56px;
          border-radius: 30px;
        }

        .cart-dish__details {
          margin-left: 16px;
          margin-right: 16px;
        }

        .cart-dish__name {
          font-size: 18px;
        }

        .cart-dish__price {
          font-size: 16px;
        }

        // Кнопки управлением кол-вом блюд
        .cart-dish__qty {
          font-size: 16px;
          gap: 12px;

          button {
            width: 32px;
            height: 32px;

            &::after {
              width: 20px;
              height: 20px;
            }
          }
        }

        .cart-dish__total-price {
          margin-top: 4px;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }
      }

      .sidebar__checkout-btn {
        border: 1px solid #fff;
        background-color: $main-black;
        color: #fff;
        text-align: center;

        &:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }
      }
    }
  }
}
</style>