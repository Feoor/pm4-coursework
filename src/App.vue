<script setup>
import { useAuthStore } from '@/store/authStore';
const authStore = useAuthStore();
</script>

<template>
  <router-view />
</template>

<style lang="scss">
// Для аутентификационных страниц добавляем фоновое изображение
body.auth-bg {
  background-image: url("@/assets/img/auth_bg.png");
  background-size: cover;
  background-repeat: no-repeat;
}

// Блокировка прокрутки при открытии модальных окон
body.lock {
  overflow: hidden;
}

main {
  padding-top: var(--header-height); // Отступ для шапки
}
</style>
