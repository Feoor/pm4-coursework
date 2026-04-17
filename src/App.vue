<script setup>
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import { useConfirmModal } from '@/composables/useConfirmModal'

import { setLucideProps } from '@lucide/vue';

setLucideProps({
  strokeWidth: 1.5,
});

const { modalProps, onConfirm, onClose, isOpen } = useConfirmModal()
</script>

<template>
<!-- TODO: Перейти на Tailwind CSS -->
<!-- TODO: Переделать все иконки на lucide icons -->
  <router-view />

  <!-- Глобальное модальное окно подтверждения -->
  <ConfirmModal
    v-bind="modalProps"
    :isOpen="isOpen"
    @confirm="onConfirm"
    @close="onClose"
  />
</template>

<style lang="scss">
// Для аутентификационных страниц добавляем фоновое изображение
body.auth-bg {
  background-image: url("@/assets/img/auth_bg.png");
  background-size: cover;
  background-repeat: no-repeat;
}

main {
  padding-top: var(--header-height); // Отступ для шапки
}
</style>
