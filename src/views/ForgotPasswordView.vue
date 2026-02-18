<script setup>
import AuthLayout from '@/components/auth/AuthLayout.vue';

const handleSubmit = () => {
  // Здесь будет логика для отправки формы восстановления пароля
  alert('Функция восстановления пароля пока не реализована.');
}
</script>

<template>
    <AuthLayout>
        <!--  Титул + быстрый вход  -->
          <h2 class="auth__title text-center mb-4">Забыл пароль</h2>
          <h3 class="auth__subtitle text-center mb-5 mb-xl-6">Введите вашу почту для сброса пароля</h3>

          <!--  Форма  -->
          <form @submit.prevent="handleSubmit" class="auth__form">
            <div class="auth__form-input auth__form-input--email form-floating mb-5">
              <input type="email" class="form-control" placeholder="Адрес электронной почты" required>
              <label for="forgetPasswordEmailInput">Адрес электронной почты</label>
            </div>
            <button type="submit" class="auth__form-btn btn btn-primary w-100">Проверить</button>
          </form>
    </AuthLayout>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/auth-page.scss";
</style>