<script setup>
import { ref } from 'vue'
import AuthLayout from '@/components/auth/AuthLayout.vue';
import { userService } from "@/services/userService.js";

const email = ref('')

const handleSubmit = async () => {
  if (!email.value) {
    alert('Пожалуйста, введите адрес электронной почты.')
    return
  }

  try {
    await userService.resetUserPassword(email.value)
    alert(`Письмо для сброса пароля отправлено на: ${email.value}`,)
  } catch (err) {
    console.error('Ошибка при отправке запроса на сброс пароля:', err)
    alert('Произошла ошибка при отправке запроса на сброс пароля. Пожалуйста, попробуйте снова позже.')
    return
  }

  // Очистить поле ввода после отправки
  email.value = ''
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
              <input type="email" class="form-control" placeholder="Адрес электронной почты" v-model="email" required>
              <label for="forgetPasswordEmailInput">Адрес электронной почты</label>
            </div>
            <button type="submit" class="auth__form-btn btn btn-primary w-100">Проверить</button>
          </form>
    </AuthLayout>
</template>

<style lang="scss" scoped>
@use "@/assets/styles/auth-page.scss";
</style>