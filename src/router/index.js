import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import EatlyMenu from '@/views/EatlyMenuView.vue'
import ContactPage from '@/views/ContactPageView.vue'
import SignUpView from '@/views/SignUpView.vue'
import SignInView from '@/views/SignInView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import RestaurantView from '@/views/RestaurantView.vue'
import UserProfile from '@/views/UserProfileView.vue'
import AdminPanelView from "@/views/AdminPanelView.vue";
import {useAuthStore} from "@/store/authStore.js";

const routes = [
  { path: '/', component: HomeView },
  { path: '/menu', component: EatlyMenu },
  { path: '/contacts', component: ContactPage },
  { path: '/sign-up', component: SignUpView },
  { path: '/sign-in', component: SignInView },
  { path: '/forgot-password', component: ForgotPasswordView },
  { path: '/restaurant/:id', name: 'restaurant', component: RestaurantView },
  { path: '/profile', component: UserProfile, meta: { requireAuth: true } },
  { path: '/admin-panel', component: AdminPanelView, meta: { requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Если auth еще не инициализирован, ждем его готовности
  if (!authStore.isAuthInitialized) {
    authStore.waitForInitialization().then(() => {
      checkAccess(to, next, authStore);
    });
  } else {
    checkAccess(to, next, authStore);
  }
});

function checkAccess(to, next, authStore) {
  const isAuthenticated = authStore.isAuthenticated();
  const isAdmin = authStore.profile?.isAdmin;

  if (to.meta.requireAuth && !isAuthenticated) {
    next('/sign-in');
    return;
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    console.log('Доступ запрещен: требуется роль администратора');
    console.log(`Пользователь: ${authStore.profile?.displayName || 'неизвестный'}, Роль: ${authStore.profile?.role || 'неизвестная'}`);
    next('/');
    return;
  }

  next();
}


export default router