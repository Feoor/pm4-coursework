<script setup>
import { useAuthStore } from '@/store/authStore'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

// Icons
import { ChevronDown, NotebookText, Heart, User, LogOut } from "@lucide/vue";

const authStore = useAuthStore()
const router = useRouter()

// Управление состоянием выпадающего меню
const isMenuOpen = ref(false)
const menuRef = ref(null)

// Переключение меню
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// Закрытие меню при клике вне его
const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    isMenuOpen.value = false
  }
}

// Переход на страницу профиля
const goToProfile = () => {
  isMenuOpen.value = false
  router.push('/profile')
}

// Выход из аккаунта
const handleLogout = async () => {
  isMenuOpen.value = false
  await authStore.logout()
  await router.push('/');
}

// Добавляем/удаляем слушатель клика
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="user-mini-profile" ref="menuRef">
    <!-- Кнопка профиля -->
    <button 
      class="profile-trigger"
      :class="{ 'profile-trigger--active': isMenuOpen }"
      @click="toggleMenu"
    >
      <div class="profile-trigger__avatar">
        <img 
          :src="authStore.profile?.photoURL || 'https://via.placeholder.com/40'" 
          :alt="authStore.profile?.displayName || 'User'"
        >
      </div>
      <ChevronDown
        class="profile-trigger__arrow"
        :class="{ 'profile-trigger__arrow--open': isMenuOpen }"
      />
    </button>

    <!-- Выпадающее меню -->
    <transition name="dropdown">
      <div v-if="isMenuOpen" class="profile-dropdown">
        <!-- Информация о пользователе -->
        <div class="profile-dropdown__header">
          <div class="profile-avatar">
            <img 
              :src="authStore.profile?.photoURL || 'https://via.placeholder.com/50'" 
              :alt="authStore.profile?.displayName || 'User'"
            >
          </div>
          <div class="profile-info">
            <div class="profile-name">
              {{ authStore.profile?.displayName || 'Пользователь' }}
            </div>
            <div class="profile-email">
              {{ authStore.profile?.email || '' }}
            </div>
          </div>
        </div>

        <!-- Разделитель -->
        <div class="profile-dropdown__divider"></div>

        <!-- Статистика -->
        <div class="profile-dropdown__stats">
          <div class="stat-item">
            <NotebookText class="stat-icon"/>

            <div class="stat-text">
              <span class="stat-value">0</span>
              <span class="stat-label">Заказов</span>
            </div>
          </div>
          <div class="stat-item">
            <Heart class="stat-icon"/>
            <div class="stat-text">
              <span class="stat-value">0</span>
              <span class="stat-label">Избранное</span>
            </div>
          </div>
        </div>

        <!-- Разделитель -->
        <div class="profile-dropdown__divider"></div>

        <!-- Меню действий -->
        <div class="profile-dropdown__menu">
          <button class="menu-item" @click="goToProfile">
            <div class="menu-item__icon">
              <User />
            </div>
            <span class="menu-item__text">Мой профиль</span>
          </button>

          <button class="menu-item menu-item--danger" @click="handleLogout">
            <div class="menu-item__icon">
              <LogOut />
            </div>
            <span class="menu-item__text">Выйти</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.user-mini-profile {
  position: relative;
  display: block;

  // Скрываем на маленьких экранах
  @media screen and (max-width: 767.98px) {
    display: none;
  }
}

// Кнопка профиля
.profile-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 50px;
  padding: 4px 12px 4px 4px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(108, 95, 188, 0.05);
    border-color: rgba(108, 95, 188, 0.15);
  }

  &--active {
    background: rgba(108, 95, 188, 0.1);
    border-color: rgba(108, 95, 188, 0.2);
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__arrow {
    color: #606060;
    transition: transform 0.3s ease;

    &--open {
      transform: rotate(180deg);
    }
  }
}

// Выпадающее меню
.profile-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 300px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 20px;
  z-index: 1000;

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .profile-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #f0f0f0;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .profile-info {
      flex: 1;
      min-width: 0;

      .profile-name {
        font-family: $font-family, sans-serif;
        font-weight: 700;
        font-size: 16px;
        color: #323142;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .profile-email {
        font-family: $second-family, sans-serif;
        font-size: 13px;
        color: #8e97a6;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  &__divider {
    height: 1px;
    background: #f0f0f0;
    margin: 16px 0;
  }

  &__stats {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: #f9f9f9;
      border-radius: 12px;

      .stat-icon {
        width: 20px;
        height: 20px;
        background: #fff;
        border-radius: 8px;
        color: $purple;
        flex-shrink: 0;
      }

      .stat-text {
        display: flex;
        align-items: baseline;
        gap: 6px;
        flex: 1;

        .stat-value {
          font-family: $font-family, sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: $purple;
        }

        .stat-label {
          font-family: $second-family, sans-serif;
          font-size: 13px;
          color: #8e97a6;
        }
      }
    }
  }

  &__menu {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 12px;
      background: transparent;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;

      &__icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(108, 95, 188, 0.1);
        border-radius: 10px;
        color: $purple;
        flex-shrink: 0;
        transition: all 0.2s ease;
      }

      &__text {
        font-family: $font-family, sans-serif;
        font-weight: 600;
        font-size: 15px;
        color: #323142;
        transition: color 0.2s ease;
      }

      &:hover {
        background: rgba(108, 95, 188, 0.05);

        .menu-item__icon {
          background: rgba(108, 95, 188, 0.15);
          transform: translateX(2px);
        }
      }

      &--danger {
        .menu-item__icon {
          background: rgba(229, 73, 43, 0.1);
          color: #e5492b;
        }

        .menu-item__text {
          color: #e5492b;
        }

        &:hover {
          background: rgba(229, 73, 43, 0.05);

          .menu-item__icon {
            background: rgba(229, 73, 43, 0.15);
          }
        }
      }
    }
  }
}

// Анимация выпадающего меню
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
  transform-origin: top right;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

// Адаптивные стили
@media screen and (max-width: 991.98px) {
  .profile-dropdown {
    width: 280px;
  }
}
</style>