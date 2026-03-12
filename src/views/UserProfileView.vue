<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import AvatarUploadModal from '@/components/modals/AvatarUploadModal.vue'
import OrderPaymentModal from '@/components/modals/OrderPaymentModal.vue'
import OrderInfoCard from '@/components/OrderInfoCard.vue'
import PaginationControls from '@/components/PaginationControls.vue'
import {useAuthStore} from '@/store/authStore'
import {onMounted, onUnmounted, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {userService} from '@/services/userService'
import {formatPhoneNumber} from '@/utils/formatters'
import {usePagination} from "@/composables/usePagination.js";
import {orderService} from "@/services/orderService.js";
import OrderDetailsModal from '@/components/modals/OrderDetailsModal.vue'

const authStore = useAuthStore()
const router = useRouter()

// Редактирование профиля
const isEditing = ref(false)
const isAvatarModalOpen = ref(false)
const editForm = ref({
  displayName: '',
  phoneNumber: '',
  address: ''
})

const handleEditProfile = () => {
  // Заполняем форму текущими данными профиля
  editForm.value = {
    displayName: authStore.profile?.displayName || '',
    phoneNumber: formatPhoneNumber(authStore.profile?.phoneNumber || ''),
    address: authStore.profile?.deliveryAddress || ''
  }
  isEditing.value = true
}

const handleEditProfilePicture = () => {
  isAvatarModalOpen.value = true
}

const handleCloseAvatarModal = () => {
  isAvatarModalOpen.value = false
}

const handlePhoneNumberInput = (event) => {
  let value = event.target.value.replace(/\D/g, '') // Удаляем все не цифровые символы
  if (value.length > 11) value = value.slice(0, 11) // Ограничиваем до 11 цифр
  editForm.value.phoneNumber = formatPhoneNumber(value) // Форматируем номер телефона
}

const handleUploadAvatar = async (file) => {
  console.log('Uploading avatar:', file)
  
  try {
    // Пример логики загрузки:
    // 1. Загрузить файл в Firebase Storage
    // 2. Получить URL загруженного файла
    // 3. Обновить профиль пользователя с новым photoURL
    // const url = await uploadAvatarToStorage(file, authStore.profile.id)
    // await userService.updateUserProfile(authStore.profile.id, { photoURL: url })
    // authStore.profile.photoURL = url
    
    // Пока просто показываем, что файл получен
    console.log('Avatar file received, size:', file.size);
  } catch (error) {
    console.error('Error uploading avatar:', error);
    alert('Error uploading avatar');
  }
  // Закрываем модальное окно смены аватара
  isAvatarModalOpen.value = false
}

const handleSaveProfile = async () => {
  if (!authStore.profile?.id) {
    console.error('Cannot save profile: user is not authenticated');
    return;
  }
  
  try {
    await userService.updateUserProfile(authStore.profile.id, {
      displayName: editForm.value.displayName,
      phoneNumber: editForm.value.phoneNumber,
      deliveryAddress: editForm.value.address
    })
    
    // Обновляем локальный профиль
    authStore.profile.displayName = editForm.value.displayName
    authStore.profile.phoneNumber = editForm.value.phoneNumber
    authStore.profile.deliveryAddress = editForm.value.address
    
    isEditing.value = false
  } catch (error) {
    console.error('Error saving profile:', error);
    alert('Error saving profile');
  }
}

const handleCancelEdit = () => {
  isEditing.value = false
  editForm.value = {
    displayName: authStore.profile?.displayName || '',
    phoneNumber: authStore.profile?.phoneNumber || '',
    address: authStore.profile?.deliveryAddress || ''
  }
}

const handleLogout = () => {
  authStore.logout();
  router.push('/sign-in');
}

// История заказов
const isPaymentModalOpen = ref(false)
const selectedOrder = ref(null)
const isOrderDetailsModalOpen = ref(false)
const detailsOrder = ref(null)
const ordersPageSize = 5

// Функции для пагинации заказов
const fetchOrders = (params) => orderService.getUserOrders(authStore.profile.id, true, params);
const countOrders = () => orderService.getOrdersCountForUser(authStore.profile.id);

const {
  // Variables
  items: orders,
  displayedItems: displayedOrders,
  totalCount: ordersTotalCount,
  currentPage: ordersCurrentPage,

  // Methods
  nextPage, prevPage, goToPage,
  fetchTotalCount,
  updateItems
} = usePagination(
  fetchOrders,
  countOrders,
  ordersPageSize
)

// Слушатель заказов для получения обновлений в реальном времени
let unsubscribeOrdersListener = null

const startLiveUpdates = () => {
  if (unsubscribeOrdersListener) unsubscribeOrdersListener();

  const ordersLimit = orders.value.length > 0 ? orders.value.length : ordersPageSize;
  unsubscribeOrdersListener = orderService.subscribeToUserOrders(authStore.profile.id, (updatedOrders) => {
    console.log('Received real-time orders update:', updatedOrders)

    const pushAtStart = true // Добавляем новые заказы в начало списка, так как они самые свежие
    const isInitial = true // Мы получаем каждый раз полный список заказов, поэтому всегда обновляем весь список
    updateItems(updatedOrders, pushAtStart, isInitial) // Обновляем список заказов при получении новых данных
  }, ordersLimit);
}

watch(() => orders.value.length, (newLength) => {
  if (newLength > 0) {
    startLiveUpdates() // Запускаем слушатель заказов при загрузке первой страницы
  }
})

// Открытие модалки деталей заказа
const handleShowOrderDetails = (order) => {
  detailsOrder.value = order
  isOrderDetailsModalOpen.value = true
}

const handleCloseOrderDetailsModal = () => {
  isOrderDetailsModalOpen.value = false
  detailsOrder.value = null
}

// Переход от деталей заказа к оплате
const handlePayFromDetails = (orderId) => {
  // Закрываем модалку деталей
  handleCloseOrderDetailsModal()

  // Находим заказ и открываем модалку оплаты
  const order = orders.value.find(o => o.id === orderId)
  if (order) {
    selectedOrder.value = order
    isPaymentModalOpen.value = true
  } else {
    console.error('Order not found:', orderId)
  }
}

// Оплата заказа (будет вызываться из OrderInfoCard)
const handlePayOrder = (orderId) => {
  selectedOrder.value = orders.value.find(order => order.id === orderId)
  if (selectedOrder.value) {
    isPaymentModalOpen.value = true
  } else {
    console.error('Order not found:', orderId)
  }
}

const handleCloseOrderPaymentModal = () => {
  isPaymentModalOpen.value = false
  selectedOrder.value = null
}

const handlePaymentSuccess = (orderId) => {
  console.log('Payment successful for order:', orderId)

  // Обновляем статус заказа в истории
  const order = orders.value.find(o => o.id === orderId)
  if (order) {
    order.status = 'paid'
  } else {
    console.error('Order not found in history after payment:', orderId)
  }
}

onMounted(async () => {
  await authStore.waitForInitialization()

  // Пагинация заказов
  await fetchTotalCount();
  await nextPage(); // Загружаем первую страницу заказов при загрузке профиля
});

onUnmounted(() => {
  if (unsubscribeOrdersListener) {
    console.log('Unsubscribing from orders listener')
    unsubscribeOrdersListener();
  }
})
</script>

<template>
  <!-- Модальное окно смены аватара -->
  <AvatarUploadModal 
    :is-open="isAvatarModalOpen"
    :current-avatar="authStore.profile?.photoURL || ''"
    @close="handleCloseAvatarModal"
    @upload="handleUploadAvatar"
  />

  <!-- Модальное окно деталей заказа -->
  <OrderDetailsModal
    :isOpen="isOrderDetailsModalOpen"
    :order="detailsOrder"
    @close="handleCloseOrderDetailsModal"
    @pay="handlePayFromDetails"
  />

  <OrderPaymentModal 
    v-if="selectedOrder" 
    :is-open="isPaymentModalOpen"
    :order="selectedOrder" 
    @close="handleCloseOrderPaymentModal"
    @payment-success="handlePaymentSuccess"
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
                <button class="avatar-edit-btn" @click="handleEditProfilePicture">
                  <img src="@/assets/icons/pen_icon.svg" alt="Редактировать аватар">
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
                <div class="stat-value">{{ ordersTotalCount || 0 }}</div>
                <div class="stat-label">Заказов</div>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <div class="stat-value">0</div>
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
          <!-- Личные данные -->
          <div class="info-card mb-4">
            <div class="info-card__header">
              <h4>Личные данные</h4>
              <button 
                v-if="!isEditing" 
                class="btn btn-primary btn-sm"
                @click="handleEditProfile"
              >
                Редактировать
              </button>
              <div v-else class="d-flex gap-2">
                <button class="btn btn-primary btn-sm" @click="handleSaveProfile">
                  Сохранить
                </button>
                <button class="btn btn-secondary btn-sm" @click="handleCancelEdit">
                  Отмена
                </button>
              </div>
            </div>

            <div class="info-card__body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Имя</label>
                  <input 
                    type="text" 
                    class="form-control"
                    v-model="editForm.displayName"
                    :disabled="!isEditing"
                    placeholder="Введите ваше имя"
                  >
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control"
                    :value="authStore.profile?.email || ''"
                    disabled
                  >
                </div>
                <div class="col-md-6">
                  <label class="form-label">Телефон</label>
                  <input 
                    type="tel" 
                    class="form-control"
                    :value="editForm.phoneNumber"
                    @input="handlePhoneNumberInput"
                    :disabled="!isEditing"
                    placeholder="+7 (___) ___-__-__"
                    maxlength="18"
                  >
                </div>
                <div class="col-md-6">
                  <label class="form-label">Дата регистрации</label>
                  <input 
                    type="text"
                    class="form-control"
                    :value="authStore.profile?.formattedCreatedAt || 'Не указано'"
                    disabled
                  >
                </div>
                <div class="col-12">
                  <label class="form-label">Адрес доставки</label>
                  <input 
                    type="text" 
                    class="form-control"
                    v-model="editForm.address"
                    :disabled="!isEditing"
                    placeholder="Введите адрес доставки"
                    maxlength="255"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- История заказов -->
          <div class="info-card">
            <div class="info-card__header">
              <h4>История заказов</h4>
            </div>

            <div class="info-card__body">
              <!-- Пустое состояние -->
              <div v-if="ordersTotalCount === 0" class="empty-state">
                <div class="empty-state__icon">
                  <img src="@/assets/icons/empty-state_icon.svg" alt="Пустое состояние">
                </div>
                <h5>У вас пока нет заказов</h5>
                <p>Ваши заказы будут отображаться здесь</p>
                <router-link to="/menu" class="btn btn-primary mt-3">
                  Перейти к меню
                </router-link>
              </div>

              <!-- Список заказов -->
              <div v-else class="orders-list row g-3">
                <PaginationControls
                  :current-page="ordersCurrentPage"
                  :total-items="ordersTotalCount"
                  :page-size="ordersPageSize"
                  @update:ordersCurrentPage="goToPage"
                  @next-page="nextPage"
                  @prev-page="prevPage"
                />

                <OrderInfoCard 
                  v-for="order in displayedOrders"
                  :key="order.id" 
                  :order="order"
                  @pay="handlePayOrder"
                  @show-details="handleShowOrderDetails"
                />

                <PaginationControls
                  :current-page="ordersCurrentPage"
                  :total-items="ordersTotalCount"
                  :page-size="ordersPageSize"
                  @update:ordersCurrentPage="goToPage"
                  @next-page="nextPage"
                  @prev-page="prevPage"
                />
              </div>
            </div>
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
        width: 40px;
        height: 40px;
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

// Информационные карточки (правая колонка)
.info-card {
  background: #fff;
  border-radius: 30px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;

    h4 {
      font-family: $font-family, sans-serif;
      font-weight: 700;
      font-size: 24px;
      color: #323142;
      margin: 0;
    }
  }

  &__body {
    .form-label {
      font-family: $font-family, sans-serif;
      font-weight: 600;
      font-size: 14px;
      color: #323142;
      margin-bottom: 8px;
    }

    .form-control {
      border-radius: 12px;
      border: 1px solid #e0e0e0;
      padding: 12px 16px;
      font-family: $second-family, sans-serif;
      font-size: 15px;

      &:disabled {
        background-color: #f9f9f9;
        color: #8e97a6;
        cursor: not-allowed;
      }
    }
  }
}

// Пустое состояние
.empty-state {
  text-align: center;
  padding: 60px 20px;

  &__icon {
    margin-bottom: 24px;

    svg {
      opacity: 0.6;
    }
  }

  h5 {
    font-family: $font-family, sans-serif;
    font-weight: 700;
    font-size: 22px;
    color: #323142;
    margin-bottom: 12px;
  }

  p {
    font-family: $second-family, sans-serif;
    font-size: 16px;
    color: #8e97a6;
    margin-bottom: 0;
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

  .info-card {
    padding: 25px;

    &__header h4 {
      font-size: 22px;
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

  .info-card {
    padding: 20px;

    &__header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      h4 {
        font-size: 20px;
      }
    }
  }

  .empty-state {
    padding: 40px 20px;

    &__icon svg {
      width: 60px;
      height: 60px;
    }

    h5 {
      font-size: 20px;
    }

    p {
      font-size: 15px;
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

  .info-card {
    padding: 16px;

    &__header {
      margin-bottom: 16px;
      padding-bottom: 16px;

      h4 {
        font-size: 18px;
      }
    }

    &__body .form-control {
      padding: 10px 14px;
      font-size: 14px;
    }
  }

  .btn-sm {
    font-size: 14px;
    padding: 8px 16px;
  }
}
</style>