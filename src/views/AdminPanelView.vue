<script setup>
import {ref, onMounted, watch, onUnmounted} from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import PaginationControls from "@/components/PaginationControls.vue";
import AdminRestaurantCard from "@/components/admin/AdminRestaurantCard.vue";
import AdminDishCard from "@/components/admin/AdminDishCard.vue";
import AdminUserCard from "@/components/admin/AdminUserCard.vue";
import { formatDate } from "@/utils/formatters.js";
import { getBadgeText } from "@/utils/helpers.js";
import { adminService } from "@/services/adminService.js";
import { orderService } from "@/services/orderService.js";
import { useConfirmModal } from "@/composables/useConfirmModal.js";
import { usePagination } from "@/composables/usePagination.js";
import { Dish } from "@/models/Dish.js";
import AdminRestaurantsTab from "@/components/admin/AdminRestaurantsTab.vue";
import AdminDishesTab from "@/components/admin/AdminDishesTab.vue";
import AdminUsersTab from "@/components/admin/AdminUsersTab.vue";

const { confirm } = useConfirmModal();

// Активная вкладка
const activeTab = ref(null) // 'restaurants' | 'menu' | 'users'

const handleTabChange = async (tab) => {
  switch (tab) {
    case 'restaurants':
      activeTab.value = 'restaurants';
      break;
    case 'menu':
      activeTab.value = 'menu';
      break;
    case 'users':
      activeTab.value = 'users';
      break;
  }
}

onMounted(async () => {
  await handleTabChange('restaurants'); // Показываем вкладку "Рестораны" по умолчанию при загрузке страницы
})

</script>

<template>
  <Header mode="lite" />

  <main class="admin-page">
    <div class="container-sm">
      <!-- Заголовок -->
      <div class="admin-page__header">
        <h2>Админ-панель</h2>
      </div>

      <!-- Табы навигации -->
      <div class="admin-tabs">
        <button
          class="admin-tabs__btn"
          :class="{ 'admin-tabs__btn--active': activeTab === 'restaurants' }"
          @click="handleTabChange('restaurants')"
        >
          <!-- Иконка ресторана -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21V7L12 3L21 7V21H3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M9 21V13H15V21" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          Рестораны
        </button>
        <button
          class="admin-tabs__btn"
          :class="{ 'admin-tabs__btn--active': activeTab === 'menu' }"
          @click="handleTabChange('menu')"
        >
          <!-- Иконка меню -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M4 18H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Меню и блюда
        </button>
        <button
          class="admin-tabs__btn"
          :class="{ 'admin-tabs__btn--active': activeTab === 'users' }"
          @click="handleTabChange('users')"
        >
          <!-- Иконка пользователей -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 3.13C17.7699 3.58317 19.0078 5.17799 19.0078 7.005C19.0078 8.83201 17.7699 10.4268 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Пользователи
        </button>
      </div>

      <!-- ВКЛАДКА: РЕСТОРАНЫ -->
      <AdminRestaurantsTab v-if="activeTab === 'restaurants'" />

      <!-- ВКЛАДКА: МЕНЮ -->
      <AdminDishesTab v-if="activeTab === 'menu'" />

      <!-- ВКЛАДКА: Пользователи -->
      <AdminUsersTab v-if="activeTab === 'users'" />
    </div>
  </main>

  <Footer />
</template>

<style scoped lang="scss">
@use "@/assets/styles/admin-page.scss";

.admin-page {
  padding: 40px 0 80px;
  min-height: calc(100vh - var(--header-height) - 200px);

  &__header {
    margin-bottom: 32px;

    h2 {
      margin: 0;
    }
  }
}

// Табы навигации
.admin-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0;

  &__btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 24px;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
    font-family: $font-family, sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: #8e97a6;
    cursor: pointer;
    transition: all 0.3s ease;

    svg {
      flex-shrink: 0;
    }

    &:hover {
      color: $purple;
      background: rgba(108, 95, 188, 0.03);
    }

    &--active {
      color: $purple;
      border-bottom-color: $purple;
    }
  }
}

// Адаптивные стили
@media screen and (max-width: 991.98px) {
  .admin-page {
    padding: 30px 0 60px;

    &__header h2 {
      font-size: 36px;
    }
  }

  .admin-tabs {
    &__btn {
      padding: 12px 18px;
      font-size: 15px;
    }
  }
}

@media screen and (max-width: 767.98px) {
  .admin-page {
    padding: 20px 0 40px;

    &__header {
      margin-bottom: 20px;

      h2 {
        font-size: 28px;
      }
    }
  }

  .admin-tabs {
    gap: 4px;
    overflow-x: auto;

    &__btn {
      padding: 10px 14px;
      font-size: 14px;
      white-space: nowrap;

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
}

@media screen and (max-width: 566.98px) {
  .admin-tabs {
    &__btn {
      padding: 10px 12px;
      font-size: 13px;
      gap: 6px;
    }
  }
}
</style>