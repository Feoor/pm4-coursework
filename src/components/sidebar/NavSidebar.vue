<script setup>
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();

defineProps({
  mode: {
    type: String,
    default: 'full'
  },
  isMenuOpen: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
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
</template>

<style lang="scss" scoped>
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

/* Адаптивность навбара */
@media screen and (max-width: 1199.98px) {

  // Планшеты в горизонтальной ориентации, Ipad Pro
  .menu__item {
    font-size: 18px;
  }
}

@media screen and (max-width: 566.98px) {

  // Телефоны в вертикальной ориентации (< 567px)

  // Боковое меню
  .sidebar__menu-nav {
    border-radius: 0;
    padding: 1.5rem 1.5rem 0;
    width: 100%;
  }

  .sidebar__header {
    height: 27px;
  }
}
</style>