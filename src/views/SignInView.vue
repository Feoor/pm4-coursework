<script setup>
import Header from '@/components/Header.vue'
import AuthLayout from '@/components/auth/AuthLayout.vue'
</script>

<template>
    <AuthLayout>
        <!--  Титул + быстрый вход  -->
          <h2 class="auth__title text-center mb-4 mb-lg-5">Вход в eatly</h2>
          <div class="auth__social-login d-flex justify-content-between mb-4">
            <button id="googleAuthButton" class="auth__social-btn auth__social-btn--google"></button>
            <button id="appleAuthButton" class="auth__social-btn auth__social-btn--apple"></button>
          </div>

          <h3 class="auth__text-divider text-center mb-4">ИЛИ</h3>

          <!--  Форма  -->
          <form id="signInForm" class="auth__form">
            <div class="auth__form-input auth__form-input--email form-floating mb-4">
              <input type="email" class="form-control" id="signInEmailInput" placeholder="Адрес электронной почты" required>
              <label for="signInEmailInput">Адрес электронной почты</label>
            </div>

            <div class="auth__form-input auth__form-input--password auth__form-input--with-hint form-floating mb-4">
              <input type="password" class="form-control" id="signInPasswordInput" placeholder="Пароль" required>
              <label for="signInPasswordInput">Пароль</label>

              <!-- auth__form-input--with-hint для подсказки "Вы забыли пароль?" -->
              <div class="input-hint form-text text-end"><router-link to="/forgot-password" class="highlight--purple">Забыли пароль?</router-link></div>
            </div>

            <button type="submit" class="auth__form-btn btn btn-primary w-100">Войти</button>
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