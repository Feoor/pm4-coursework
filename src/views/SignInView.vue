<script setup>
import AuthLayout from '@/components/auth/AuthLayout.vue';
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';
import { getAuthErrorMessage } from "@/utils/errorHandlers";

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  email: '',
  password: ''
});
const errorMessage = ref('');

const handleButtonClick = async (provider) => {
  const providerMethods = {
    'Google': authStore.signInWithGoogle,
    'Apple': () => Promise.reject(new Error('Вход через Apple пока не реализован.'))
  };

  try {
    await providerMethods[provider]?.();
    router.push('/menu');
  } catch (error) {
    errorMessage.value = getAuthErrorMessage(error.code) || 'Произошла ошибка при входе через социальную сеть. Пожалуйста, попробуйте снова.';
  }
};

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    await authStore.signIn(form.value.email, form.value.password);
    router.push('/menu'); // Перенаправляем на главную страницу после успешного входа
  } catch (error) {
    errorMessage.value = getAuthErrorMessage(error.code) || 'Произошла ошибка при входе. Пожалуйста, попробуйте снова.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
    <AuthLayout>
        <!--  Титул + быстрый вход  -->
          <h2 class="auth__title text-center mb-4 mb-lg-5">Вход в eatly</h2>
          <div class="auth__social-login d-flex justify-content-between mb-4">
            <button @click="handleButtonClick('Google')" class="auth__social-btn auth__social-btn--google"></button>
            <button @click="handleButtonClick('Apple')" class="auth__social-btn auth__social-btn--apple"></button>
          </div>

          <h3 class="auth__text-divider text-center mb-4">ИЛИ</h3>

          <!--  Форма  -->
          <form @submit.prevent="handleSubmit" class="auth__form">
            <div class="auth__form-input auth__form-input--email form-floating mb-4">
              <input v-model="form.email" type="email" class="form-control" placeholder="Адрес электронной почты" required>
              <label for="signInEmailInput">Адрес электронной почты</label>
            </div>

            <div class="auth__form-input auth__form-input--password auth__form-input--with-hint form-floating mb-4">
              <input v-model="form.password" type="password" class="form-control" placeholder="Пароль" required>
              <label for="signInPasswordInput">Пароль</label>

              <!-- auth__form-input--with-hint для подсказки "Вы забыли пароль?" -->
              <div class="input-hint form-text text-end"><router-link to="/forgot-password" class="highlight--purple">Забыли пароль?</router-link></div>
            </div>

            <p v-if="errorMessage" class="auth__form-error text-center text-danger mb-2">{{ errorMessage }}</p>
            <button type="submit" class="auth__form-btn btn btn-primary w-100">
              <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ authStore.isLoading ? 'Вход...' : 'Войти' }}
            </button>
          </form>

          <!--  Если еще нет аккаунта  -->
          <div class="auth__footer text-center mt-4">
            <p>Еще нет аккаунта? <router-link to="/sign-up" class="highlight--purple">Зарегистрироваться</router-link></p>
          </div>
    </AuthLayout>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/auth-page.scss";
</style>