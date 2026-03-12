<script setup>
import {formatDate} from "@/utils/formatters.js";
import PaginationControls from "@/components/PaginationControls.vue";
import AdminUserCard from "@/components/admin/AdminUserCard.vue";
import {usePagination} from "@/composables/usePagination.js";
import {useConfirmModal} from "@/composables/useConfirmModal.js";
import {orderService} from "@/services/orderService.js";
import {adminService} from "@/services/adminService.js";
import {onMounted, onUnmounted, ref, watch} from "vue";

const { confirm } = useConfirmModal();

// --- Пользователи ---
const users = ref([])
const selectedUser = ref(null) // Выбранный пользователь для просмотра заказов
const userOrdersPerPage = 5 // Кол-во заказов на странице (для пагинации)
const userSearchQuery = ref('') // Поиск по имени

const {
  items: selectedUserOrders,
  displayedItems: selectedUserDisplayedOrders,
  nextPage: selectedUserNextOrdersPage,
  prevPage: selectedUserPrevOrdersPage,
  goToPage: selectedUserGoToOrdersPage,
  totalCount: selectedUserOrdersCount,
  currentPage: selectedUserOrdersCurrentPage,
  reset: resetSelectedUserOrdersPagination,
  updateItems: updateSelectedUserOrders,
} = usePagination(
    null,
    null,
    userOrdersPerPage
)

// Слушатель заказов для получения обновлений в реальном времени
let unsubscribeOrdersListener = null

const startLiveUpdates = (userId, ordersLimit) => {
  if (unsubscribeOrdersListener) unsubscribeOrdersListener();

  if (!userId) {
    console.warn('User ID is required to start live updates for orders');
    return;
  }

  unsubscribeOrdersListener = orderService.subscribeToUserOrders(userId, (updatedOrders) => {
    console.log('Received real-time orders update:', updatedOrders)

    const pushAtStart = true // Добавляем новые заказы в начало списка, так как они самые свежие
    const isInitial = true // Мы получаем каждый раз полный список заказов, поэтому всегда обновляем весь список
    updateSelectedUserOrders(updatedOrders, pushAtStart, isInitial) // Обновляем список заказов при получении новых данных
  }, ordersLimit);
}

watch(() => selectedUserOrders.value.length, (newLength) => {
  if (newLength > 0 && selectedUser.value) {
    const ordersLimit = selectedUserOrders.value.length > 0 ? selectedUserOrders.value.length : userOrdersPerPage; // Если заказы уже загружены, используем их количество, иначе используем лимит на странице
    startLiveUpdates(selectedUser.value.id, ordersLimit) // Запускаем слушатель заказов при выборе пользователя
  }
})

const handleSearchUsers = async () => {
  if (userSearchQuery.value.trim() === '') {
    users.value = await adminService.getUsers(10) // Получаем всех пользователей, если строка поиска пустая
    return
  }

  users.value = await adminService.getUserBySearchTerm(userSearchQuery.value)
}

const handleSelectUser = async (user) => {
  selectedUser.value = user

  const sortByUnpair = true;
  const fetchOrders = (params) => orderService.getUserOrders(selectedUser.value?.id, sortByUnpair, params);
  const countOrders = () => orderService.getOrdersCountForUser(selectedUser.value?.id);

  // Сбрасываем пагинацию на первую страницу при выборе нового пользователя
  // и обновляем функции для получения заказов и их количества
  await resetSelectedUserOrdersPagination(fetchOrders, countOrders);
}

const handleDeselectUser = () => {
  selectedUser.value = null;
  selectedUserDisplayedOrders.value = [];

  if (unsubscribeOrdersListener) {
    unsubscribeOrdersListener(); // Останавливаем слушатель заказов при отмене выбора пользователя
    unsubscribeOrdersListener = null;
  }
}

const handleToggleAdmin = async (user) => {
  const newRole = user.role === 'admin' ? 'user' : 'admin'
  const actionText = newRole === 'admin' ? 'назначить администратором' : 'снять права администратора'

  const ok = await confirm({
    title: 'Изменить роль?',
    message: `Вы уверены, что хотите ${actionText} пользователя «${user.displayName}»?`,
    confirmText: 'Подтвердить',
    cancelText: 'Отмена',
    variant: 'primary'
  })

  if (!ok) return

  await adminService.updateUserRole(user.id, newRole);
  user.role = newRole; // Локально обновляем роль пользователя, чтобы не перезагружать весь список
}

const handleChangeOrderStatus = async (orderData) => {
  await orderService.updateOrderStatus(selectedUser.value.id, orderData.orderId, orderData.newStatus)
}

onMounted(async () => {
  users.value = await adminService.getUsers(10) // Загружаем первых 10 пользователей при загрузке страницы
});

onUnmounted(() => {
  // При уходе со страницы админ-панели обязательно отписываемся от слушателя заказов,
  // чтобы не получать обновления в реальном времени, когда админ-панель уже не отображается
  if (unsubscribeOrdersListener) unsubscribeOrdersListener();
})
</script>

<template>
  <div class="admin-content">
    <div class="row g-4">
      <!-- Список пользователей -->
      <div class="col-lg-5">
        <div class="admin-card">
          <div class="admin-card__header">
            <h4>Пользователи</h4>
            <span class="admin-card__counter">{{ users.length }}</span>
          </div>
          <div class="admin-card__body">
            <!-- Поиск -->
            <div class="admin-form admin-form--inline" style="margin-bottom: 20px;">
              <input
                  type="text"
                  class="form-control"
                  v-model="userSearchQuery"
                  placeholder="Поиск по имени или email..."
                  @input="handleSearchUsers"
              >
              <button class="btn btn-primary admin-form__btn-add" title="Найти" @click="handleSearchUsers">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <!-- Пустое состояние -->
            <div v-if="users.length === 0" class="admin-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <p>Пользователей пока нет</p>
            </div>

            <!-- Список -->
            <div v-else class="admin-users-list">
              <div
                  v-for="user in users"
                  :key="user.id"
                  class="admin-users-list__item"
                  :class="{ 'admin-users-list__item--active': selectedUser?.id === user.id }"
                  @click="handleSelectUser(user)"
              >
                <div class="admin-users-list__item-avatar">
                  <img :src="user.photoURL" :alt="user.displayName">
                </div>
                <div class="admin-users-list__item-info">
                  <div class="admin-users-list__item-name">
                    {{ user.displayName }}
                    <span v-if="user.role === 'admin'" class="admin-users-list__item-badge">Админ</span>
                  </div>
                  <div class="admin-users-list__item-email">{{ user.email }}</div>
                </div>
                <button
                    class="admin-users-list__item-role-btn"
                    :class="{ 'admin-users-list__item-role-btn--active': user.role === 'admin' }"
                    @click.stop="handleToggleAdmin(user)"
                    :title="user.role === 'admin' ? 'Снять права админа' : 'Назначить админом'"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Заказы выбранного пользователя -->
      <div class="col-lg-7">
        <div class="admin-card">
          <div class="admin-card__header">
            <h4>
              <template v-if="selectedUser">
                Заказы — {{ selectedUser.displayName }}
              </template>
              <template v-else>
                Заказы пользователя
              </template>
            </h4>
            <div v-if="selectedUser" style="display: flex; align-items: center; gap: 8px;">
              <span class="admin-card__counter">{{ selectedUserOrdersCount }}</span>
              <button class="admin-users__back-btn" @click="handleDeselectUser" title="Вернуться к списку">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="admin-card__body">
            <!-- Подсказка, если пользователь не выбран -->
            <div v-if="!selectedUser" class="admin-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 3H21V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 21H3V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 3L14 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 21L10 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p>Выберите пользователя из списка, чтобы просмотреть его заказы</p>
            </div>

            <!-- Информация о пользователе -->
            <div v-else>
              <div class="admin-user-info">
                <div class="admin-user-info__row">
                  <span class="admin-user-info__label">Email:</span>
                  <span class="admin-user-info__value">{{ selectedUser.email }}</span>
                </div>
                <div class="admin-user-info__row">
                  <span class="admin-user-info__label">Телефон:</span>
                  <span class="admin-user-info__value">{{ selectedUser.phoneNumber || 'Не указан' }}</span>
                </div>
                <div class="admin-user-info__row">
                  <span class="admin-user-info__label">Дата регистрации:</span>
                  <span class="admin-user-info__value">{{ formatDate(selectedUser.createdAt) }}</span>
                </div>
                <div class="admin-user-info__row">
                  <span class="admin-user-info__label">Роль:</span>
                  <span class="admin-user-info__value admin-user-info__value--role" :class="selectedUser.role === 'admin' ? 'admin-user-info__value--admin' : ''">
                        {{ selectedUser.role === 'admin' ? 'Администратор' : 'Пользователь' }}
                      </span>
                </div>
              </div>

              <!-- Пустые заказы -->
              <div v-if="selectedUserOrdersCount === 0" class="admin-empty admin-empty--sm">
                <p>У пользователя нет заказов</p>
              </div>

              <!-- Список заказов -->
              <div v-else class="admin-orders-list">
                <PaginationControls
                    :current-page="selectedUserOrdersCurrentPage"
                    :total-items="selectedUserOrdersCount"
                    :page-size="userOrdersPerPage"
                    @go-to-page="selectedUserGoToOrdersPage"
                    @next-page="selectedUserNextOrdersPage"
                    @prev-page="selectedUserPrevOrdersPage"
                />

                <AdminUserCard
                    v-for="order in selectedUserDisplayedOrders"
                    :key="order.id"
                    :order="order"
                    @change-order-status="handleChangeOrderStatus"
                />

                <PaginationControls
                    :current-page="selectedUserOrdersCurrentPage"
                    :total-items="selectedUserOrdersCount"
                    :page-size="userOrdersPerPage"
                    @go-to-page="selectedUserGoToOrdersPage"
                    @next-page="selectedUserNextOrdersPage"
                    @prev-page="selectedUserPrevOrdersPage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/admin-page.scss";

// Список пользователей
.admin-users-list {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px;
    background: #f9f9f9;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #f4f2ff;
    }

    &--active {
      background: #f4f2ff;
      box-shadow: inset 0 0 0 2px rgba(108, 95, 188, 0.3);
    }

    &-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-info {
      flex: 1;
      min-width: 0;
    }

    &-name {
      font-family: $font-family, sans-serif;
      font-weight: 700;
      font-size: 15px;
      color: #323142;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
    }

    &-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      background: rgba(108, 95, 188, 0.12);
      color: $purple;
      white-space: nowrap;
    }

    &-email {
      font-family: $second-family, sans-serif;
      font-size: 13px;
      color: #8e97a6;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-role-btn {
      width: 36px;
      height: 36px;
      min-width: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f0f0;
      border: none;
      border-radius: 10px;
      color: #c0c0c0;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(108, 95, 188, 0.1);
        color: $purple;
      }

      &--active {
        background: rgba(108, 95, 188, 0.12);
        color: $purple;
      }
    }
  }
}

// Кнопка «назад» у заказов
.admin-users__back-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: #8e97a6;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
    color: #323142;
  }
}

// Информация о пользователе
.admin-user-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  padding: 16px 18px;
  background: #f9f9f9;
  border-radius: 14px;
  margin-bottom: 24px;

  &__row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__label {
    font-family: $second-family, sans-serif;
    font-size: 13px;
    color: #8e97a6;
  }

  &__value {
    font-family: $font-family, sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: #323142;

    &--role {
      padding: 2px 10px;
      border-radius: 6px;
      background: #f0f0f0;
      font-size: 13px;
    }

    &--admin {
      background: rgba(108, 95, 188, 0.12);
      color: $purple;
    }
  }
}

// Список заказов
.admin-orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media screen and (max-width: 767.98px) {
  .admin-users-list__item {
    padding: 12px;
    gap: 10px;

    &-avatar {
      width: 38px;
      height: 38px;
    }

    &-name {
      font-size: 14px;
    }

    &-role-btn {
      width: 32px;
      height: 32px;
      min-width: 32px;
    }
  }

  .admin-user-info {
    padding: 14px;
    gap: 10px 16px;
  }

  .admin-orders-list__item {
    &-header {
      padding: 12px 14px;
    }

    &-body {
      padding: 14px;
    }

    &-footer {
      flex-direction: column;
      align-items: flex-start;
    }

    &-status {
      width: 100%;
      flex-wrap: wrap;
    }
  }

  .admin-orders-list__status-select {
    min-width: 0;
    width: 100%;
  }
}
</style>