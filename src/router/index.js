import { createRouter, createWebHistory } from 'vue-router'
import {useAuthStore} from "@/store/authStore.js";

const authStore = useAuthStore();

const NotFound = () => import('@/views/NotFoundView.vue')
const HomeView = () => import('@/views/HomeView.vue')
const EatlyMenu = () => import('@/views/EatlyMenuView.vue')
const ContactPage = () => import('@/views/ContactPageView.vue')
const SignUpView = () => import('@/views/SignUpView.vue')
const SignInView = () => import('@/views/SignInView.vue')
const ForgotPasswordView = ()  => import('@/views/ForgotPasswordView.vue')
const RestaurantView = () => import('@/views/RestaurantView.vue')
const UserProfile = () => import('@/views/UserProfileView.vue')
const AdminPanelView = () => import('@/views/AdminPanelView.vue');

const routes = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
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