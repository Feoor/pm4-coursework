<script setup>
import AuthLayout from '@/components/auth/AuthLayout.vue';
</script>

<template>
  <AuthLayout>
    <!--  Титул + быстрый вход  -->
          <h2 class="auth__title text-center mb-4 mb-lg-5">Регистрация в eatly</h2>
          <div class="auth__social-login d-flex justify-content-between mb-4">
            <button id="googleAuthButton" class="auth__social-btn auth__social-btn--google"></button>
            <button id="appleAuthButton" class="auth__social-btn auth__social-btn--apple"></button>
          </div>

          <h3 class="auth__text-divider text-center mb-4">ИЛИ</h3>

          <!--  Форма  -->
          <form id="signUpForm" class="auth__form">
            <div class="auth__form-input auth__form-input--name form-floating mb-4">
              <input type="text" class="form-control" id="signUpNameInput" placeholder="Имя Фамилия" required>
              <label for="signUpNameInput">Имя Фамилия</label>
            </div>

            <div class="auth__form-input auth__form-input--email form-floating mb-4">
              <input type="email" class="form-control" id="signUpEmailInput" placeholder="Адрес электронной почты" required>
              <label for="signUpEmailInput">Адрес электронной почты</label>
            </div>

            <div class="auth__form-input auth__form-input--password form-floating mb-4">
              <input type="password" class="form-control" id="signUpPasswordInput" placeholder="Пароль" required>
              <label for="signUpPasswordInput">Пароль</label>
            </div>
            <button type="submit" class="auth__form-btn btn btn-primary w-100">Зарегистрироваться</button>
          </form>

          <!--  Если есть аккаунт  -->
          <div class="auth__footer text-center mt-4">
            <p>Уже есть аккаунт? <router-link to="/sign-in" class="highlight--purple">Войти</router-link></p>
          </div>
  </AuthLayout>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/auth-page.scss";
</style>