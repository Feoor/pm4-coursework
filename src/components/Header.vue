<script setup>
import { ref, watch } from 'vue';
import CartSidebar from '@/components/sidebar/CartSidebar.vue';
import NavSidebar from '@/components/sidebar/NavSidebar.vue';
import UserMiniProfile from '@/components/UserMiniProfile.vue';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatters';

const authStore = useAuthStore();
const cartStore = useCartStore();

defineProps({
  mode: {
    type: String,
    default: 'full' // 'full' для полного отображения(блок аунтификации), 'lite' для отображения только логотипа
  },
  withCart: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['order-payment']) // Событие для перехода к оплате заказа для CartSidebar.vue

// Открываем сайдбар меню при нажатии на кнопку
const isNavMenuOpen = ref(false);

const handleMenuToggle = () => {
  isNavMenuOpen.value = !isNavMenuOpen.value;
}

const handleSidebarClose = () => {
  isNavMenuOpen.value = false;
  cartStore.toggleMenu();
}

// Управление блокировкой скролла через watcher
watch(isNavMenuOpen, (newValue) => {
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
            class="header__user-profile d-none d-sm-flex align-items-center"
            >
            <UserMiniProfile />
          </div>

          <!-- FIXME: Профиль пользователя и кнопки аутификации не одного размера -->
          <div v-else-if="mode === 'full' && !authStore.profile && authStore.isAuthInitialized"
            class="header__auth-buttons d-none d-sm-flex">
            <router-link to="/sign-in" class="header__login me-2">Войти</router-link>
            <router-link to="/sign-up" class="header__sign-up">Зарегистрироваться</router-link>
          </div>

          <button v-if="mode === 'full' && withCart" @click="cartStore.toggleMenu()"
            class="cart-btn btn btn-primary d-none d-lg-flex align-items-center">
            <span class="cart__count me-3 badge rounded-pill bg-danger">{{ cartStore.totalItems() }}</span>
            Открыть заказ
            <span class="cart__price ms-4">{{ formatPrice(cartStore.totalPrice()) }}</span>
          </button>

          <button @click="handleMenuToggle" class="header__menu" :class="isNavMenuOpen ? 'header__menu--toggle' : ''">
            <span></span>
          </button>
        </div>

        <!-- Боковое меню -->
        <div class="sidebar" :class="(isNavMenuOpen || cartStore.isMenuOpen) ? 'sidebar--show' : ''" @click.self="handleSidebarClose">

          <!-- Меню для навигации -->
          <!-- FIXME: Сломались стили -->
          <NavSidebar :mode="mode" :isMenuOpen="isNavMenuOpen" />

          <!-- Меню корзины -->
          <CartSidebar v-if="withCart" @order-payment="emit('order-payment')" /> 
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
  height: 51px;
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
      padding: 12px 20px;
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
      padding: 12px 20px;
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
      bottom: 48px;
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
    }
  }
}
</style>