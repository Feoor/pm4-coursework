<script setup>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import AvatarUploadModal from '../components/modals/AvatarUploadModal.vue'
import {useAuthStore} from '../store/authStore'
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {favoritesService} from "../services/favoritesService.js";
import {orderService} from "../services/orderService.js";

// Tabs
import EditUserProfileTab from "../components/user/EditUserProfileTab.vue";
import UserOrdersHistoryTab from "../components/user/UserOrdersHistoryTab.vue";
import UserFavoritesTab from "../components/user/UserFavoritesTab.vue";

// Icons
import {Pen, UserPen, Logs, Bookmark} from '@lucide/vue';

const authStore = useAuthStore()
const router = useRouter()

// Вкладки
const activeTab = ref('personal');

const handleTabChange = (tab) => {
  switch (tab) {
    case 'personal':
      activeTab.value = 'personal';
      break;
    case 'orders':
      activeTab.value = 'orders';
      break;
    case 'favorites':
      activeTab.value = 'favorites';
      break;
    default:
      activeTab.value = 'personal';
      break;
  }
}

// Profile Avatar Change
const isAvatarModalOpen = ref(false);

const handleEditProfilePicture = () => {
  isAvatarModalOpen.value = true
}

const handleCloseAvatarModal = () => {
  isAvatarModalOpen.value = false
}

const handleUploadAvatar = async (file) => {
  console.log('Uploading avatar:', file)

  try {
    // Пока просто показываем, что файл получен
    console.log('Avatar file received, size:', file.size);
  } catch (error) {
    console.error('Error uploading avatar:', error);
    alert('Error uploading avatar');
  }
  // Закрываем модальное окно смены аватара
  isAvatarModalOpen.value = false
}

const handleLogout = () => {
  authStore.logout();
  router.push('/sign-in');
}

// Кол-во избранных и заказов
const countFavorites = ref(0);
const countOrders = ref(0);

onMounted(async () => {
  await authStore.waitForInitialization()

  // Кол-во заказов
  countOrders.value = await orderService.getOrdersCountForUser(authStore.profile.id);

  // Кол-во избранных
  countFavorites.value = (await favoritesService.getTotalFavoritesCount(authStore.profile.id)).totalCount;
});
</script>

<template>
  <!-- Модальное окно смены аватара -->
  <AvatarUploadModal 
    :is-open="isAvatarModalOpen"
    :current-avatar="authStore.profile?.photoURL || ''"
    @close="handleCloseAvatarModal"
    @upload="handleUploadAvatar"
  />

  <Header mode="lite" />
  
  <main class="profile-page">
    <div class="container-sm">
      <!-- Заголовок страницы -->
      <div class="profile-page__header">
        <h2>Мой профиль</h2>
      </div>

      <div class="row g-4">
        <!-- Левая колонка - Информация профиля -->
        <div class="col-lg-4">
          <div class="profile-card">
            <!-- Аватар -->
            <div class="profile-card__avatar">
              <div class="avatar-wrapper">
                <img
                  :src="authStore.profile?.photoURL || 'https://via.placeholder.com/150'" 
                  alt="Avatar"
                  class="avatar-image"
                >
                <button class="avatar-edit-btn p-2" @click="handleEditProfilePicture">
                  <Pen class="text-white" size="24"/>
                </button>
              </div>
            </div>

            <!-- Основная информация -->
            <div class="profile-card__info">
              <h3 class="profile-name">
                {{ authStore.profile?.displayName || 'Пользователь' }}
              </h3>
              <p class="profile-email">
                {{ authStore.profile?.email || '' }}
              </p>
            </div>

            <!-- Статистика -->
            <div class="profile-card__stats">
              <div class="stat-item">
                <div class="stat-value">{{ countOrders || 0 }}</div>
                <div class="stat-label">Заказов</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-value">{{ countFavorites }}</div>
                <div class="stat-label">Избранное</div>
              </div>
            </div>

            <!-- Кнопка выхода -->
            <button class="btn btn-secondary w-100 mt-3" @click="handleLogout">
              Выйти из аккаунта
            </button>
          </div>
        </div>

        <!-- Правая колонка - Детальная информация -->
        <div class="col-lg-8">
          <!-- Табы навигации -->
          <div class="user-tabs">
            <button
                class="user-tabs__btn"
                :class="{ 'user-tabs__btn--active': activeTab === 'personal' }"
                @click="handleTabChange('personal')"
            >
              <!-- Иконка ресторана -->
              <UserPen size="20" />
              Личные данные
            </button>
            <button
                class="user-tabs__btn"
                :class="{ 'user-tabs__btn--active': activeTab === 'orders' }"
                @click="handleTabChange('orders')"
            >
              <!-- Иконка меню -->
              <Logs size="20" />
              Заказы
            </button>
            <button
                class="user-tabs__btn"
                :class="{ 'user-tabs__btn--active': activeTab === 'favorites' }"
                @click="handleTabChange('favorites')"
            >
              <!-- Иконка пользователей -->
              <Bookmark size="20" />
              Избранное
            </button>
          </div>

          <div class="bg-white rounded-5 p-7.5 overflow-x-auto" >
            <!-- Личные данные -->
            <EditUserProfileTab v-if="activeTab === 'personal'" />

            <!-- История заказов -->
            <UserOrdersHistoryTab v-if="activeTab === 'orders'" />

            <!-- Избранное -->
            <UserFavoritesTab v-if="activeTab === 'favorites'" />
          </div>
        </div>
      </div>
    </div>
  </main>

  <Footer />
</template>

<style lang="scss" scoped>
.profile-page {
  padding: 40px 0 80px;
  min-height: calc(100vh - var(--header-height) - 200px);

  &__header {
    margin-bottom: 40px;

    h2 {
      margin: 0;
    }
  }
}

// Карточка профиля (левая колонка)
.profile-card {
  background: #fff;
  border-radius: 30px;
  padding: 40px 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;

  &__avatar {
    margin-bottom: 24px;

    .avatar-wrapper {
      position: relative;
      width: 150px;
      height: 150px;
      margin: 0 auto;

      .avatar-image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #f9f9f9;
      }

      .avatar-edit-btn {
        position: absolute;
        bottom: 5px;
        right: 5px;
        background: $purple;
        border: 3px solid #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: .3s all;

        &:hover {
          background: $purple-hover;
          transform: scale(1.05);
        }
      }
    }
  }

  &__info {
    margin-bottom: 30px;

    .profile-name {
      font-family: $font-family, sans-serif;
      font-weight: 700;
      font-size: 28px;
      color: #323142;
      margin-bottom: 8px;
    }

    .profile-email {
      font-family: $second-family, sans-serif;
      font-size: 16px;
      color: #8e97a6;
      margin: 0;
    }
  }

  &__stats {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px 0;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 20px;

    .stat-item {
      text-align: center;

      .stat-value {
        font-family: $font-family, sans-serif;
        font-weight: 700;
        font-size: 32px;
        color: $purple;
        margin-bottom: 4px;
      }

      .stat-label {
        font-family: $second-family, sans-serif;
        font-size: 14px;
        color: #8e97a6;
      }
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: #f0f0f0;
    }
  }
}

// Табы навигации
.user-tabs {
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
@media screen and (max-width: 1199.98px) {
  .profile-page {
    padding: 30px 0 60px;

    &__header h2 {
      font-size: 40px;
    }
  }

  .profile-card {
    padding: 30px 25px;

    &__info .profile-name {
      font-size: 24px;
    }
  }
}

@media screen and (max-width: 991.98px) {
  .profile-page {
    &__header h2 {
      font-size: 36px;
    }
  }

  .profile-card {
    margin-bottom: 24px;

    &__avatar .avatar-wrapper {
      width: 130px;
      height: 130px;
    }

    &__info .profile-name {
      font-size: 22px;
    }

    &__stats .stat-item .stat-value {
      font-size: 28px;
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
  .profile-page {
    padding: 20px 0 40px;

    &__header {
      margin-bottom: 24px;

      h2 {
        font-size: 32px;
      }
    }
  }

  .profile-card {
    padding: 25px 20px;

    &__avatar .avatar-wrapper {
      width: 120px;
      height: 120px;

      .avatar-edit-btn {
        width: 36px;
        height: 36px;

        svg {
          width: 14px;
          height: 14px;
        }
      }
    }

    &__info .profile-name {
      font-size: 20px;
    }

    &__stats {
      .stat-item .stat-value {
        font-size: 24px;
      }

      .stat-divider {
        height: 35px;
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
  .profile-page {
    &__header h2 {
      font-size: 28px;
    }
  }

  .profile-card {
    padding: 20px 15px;

    &__avatar .avatar-wrapper {
      width: 100px;
      height: 100px;

      .avatar-edit-btn {
        width: 32px;
        height: 32px;
      }
    }

    &__info {
      .profile-name {
        font-size: 18px;
      }

      .profile-email {
        font-size: 14px;
      }
    }

    &__stats {
      .stat-item {
        .stat-value {
          font-size: 20px;
        }

        .stat-label {
          font-size: 12px;
        }
      }

      .stat-divider {
        height: 30px;
      }
    }
  }

  .admin-tabs {
    &__btn {
      padding: 10px 12px;
      font-size: 13px;
      gap: 6px;
    }
  }

  .btn-sm {
    font-size: 14px;
    padding: 8px 16px;
  }
}
</style>