import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import EatlyMenu from '../views/EatlyMenuView.vue'
import ContactPage from '../views/ContactPageView.vue'
import SignUpView from '../views/SignUpView.vue'
import SignInView from '../views/SignInView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/menu', component: EatlyMenu },
  { path: '/contacts', component: ContactPage },
  { path: '/sign-up', component: SignUpView },
  { path: '/sign-in', component: SignInView },
  { path: '/forgot-password', component: ForgotPasswordView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router