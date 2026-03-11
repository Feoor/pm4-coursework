<script setup>
import {ref, onMounted, watch, onUnmounted} from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import PaginationControls from "@/components/PaginationControls.vue";
import AdminRestaurantCard from "@/components/admin/AdminRestaurantCard.vue";
import AdminDishCard from "@/components/admin/AdminDishCard.vue";
import { formatPrice, formatDate } from "@/utils/formatters.js";
import { getBadgeText, getOrderStatusText} from "@/utils/helpers.js";
import { adminService } from "@/services/adminService.js";
import { orderService } from "@/services/orderService.js";
import { ORDER_STATUS } from "@/constants/orderStatus.js";
import { useConfirmModal } from "@/composables/useConfirmModal.js";
import { usePagination } from "@/composables/usePagination.js";
import { Dish } from "@/models/Dish.js";

const { confirm } = useConfirmModal();

// Активная вкладка
const activeTab = ref(null) // 'restaurants' | 'menu' | 'users'

const handleTabChange = async (tab) => {
  switch (tab) {
    case 'restaurants':
      activeTab.value = 'restaurants';
      await fetchRestaurantsTotalCount()
      await nextRestaurantsPage();
      break;
    case 'menu':
      activeTab.value = 'menu';
      break;
    case 'users':
      activeTab.value = 'users';
      users.value = await adminService.getUsers(10);
      break;
  }
}

// --- Рестораны ---
const restaurantsPerPageSize = 10; // Кол-во ресторанов на странице (для пагинации)

// Функции для пагинации ресторанов
const fetchRestaurants = (params) => adminService.getRestaurants(params);
const countRestaurants = () => adminService.getRestaurantsCount();

// Пагинация ресторанов
const {
  displayedItems: displayedRestaurants,
  nextPage: nextRestaurantsPage,
  prevPage: prevRestaurantsPage,
  goToPage: goToRestaurantsPage,
  totalCount: restaurantsTotalCount,
  currentPage: restaurantsCurrentPage,
  fetchTotalCount: fetchRestaurantsTotalCount,
} = usePagination(
    fetchRestaurants,
    countRestaurants,
    restaurantsPerPageSize
)

const restaurantForm = ref({
  name: '',
  imageUrl: '',
  rating: '',
  deliveryTime: '',
  badge: '',
  categories: '',
})

const badgeOptions = [
  '',
  'healthy',
  'trending',
  'supreme',
  'spicy',
]

onMounted(async () => {
  await handleTabChange('restaurants'); // Показываем вкладку "Рестораны" по умолчанию при загрузке страницы
})

const handleAddRestaurant = async () => {
  const restaurantDoc = await adminService.addRestaurant(restaurantForm.value);

  // После успешного добавления ресторана, очищаем форму и добавляем новый ресторан в список
  restaurantForm.value = {
    name: '',
    imageUrl: '',
    rating: '',
    deliveryTime: '',
    badge: '',
    categories: '',
  }
  displayedRestaurants.value.push(restaurantDoc);
}

const handleDeleteRestaurant = async (id) => {
  // Перед удалением стоит показать модальное окно с подтверждением действия, так как это критичная операция
  const ok = await confirm({
    title: `Удалить ресторан #${id}?`,
    message: 'Вы уверены, что хотите удалить этот ресторан? Это действие нельзя будет отменить.',
    confirmText: 'Удалить',
    cancelText: 'Отмена',
    variant: 'danger'
  })

  if (!ok) return;

  await adminService.deleteRestaurant(id)
  displayedRestaurants.value.filter(restaurant => restaurant.id !== id)
}

// --- Меню ---
const selectedRestaurantId = ref('')
const sections = ref([
  {
    id: 'sec1',
    name: 'Пицца'
  },
  {
    id: 'sec2',
    name: 'Суши'
  }
]) // Секции выбранного ресторана
const dishesPerPageSize = 10; // Кол-во блюд на странице (для пагинации)

const {
  displayedItems: displayedDishes,
  nextPage: nextDishesPage,
  prevPage: prevDishesPage,
  goToPage: goToDishesPage,
  totalCount: dishesTotalCount,
  currentPage: dishesCurrentPage,
  reset: resetDishesPagination,
  updateItems: updateDishes,
} = usePagination(
    null, // fetchDishes будет устанавливаться динамически при выборе ресторана
    null,
    dishesPerPageSize
)

const sectionForm = ref({
  name: ''
})

const dishForm = ref({
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  section: '',
  rating: '',
  deliveryTime: '',
  categories: '',
  badge: '',
  restaurantId: '',
})

const handleSelectRestaurant = async () => {
  console.log('Selected restaurant:', selectedRestaurantId.value)

  const fetchDishes = (params) => adminService.getDishesByRestaurant(selectedRestaurantId.value, params);
  const countDishes = () => adminService.getDishesCountByRestaurant(selectedRestaurantId.value);

  // Сбрасываем пагинацию на первую страницу при выборе нового пользователя
  // и обновляем функции для получения заказов и их количества
  await resetDishesPagination(fetchDishes, countDishes);
}

const handleAddSection = () => {
  // TODO: логика добавления секции
  console.log('Add section:', sectionForm.value)
}

const handleDeleteSection = (id) => {
  // TODO: логика удаления секции
  console.log('Delete section:', id)
}

const handleAddDish = async () => {
  dishForm.value.restaurantId = selectedRestaurantId.value
  const dishDoc = await adminService.addDish(dishForm.value);
  const newDish = new Dish({
    id: dishDoc.id,
    ...dishForm.value
  })

  // После успешного добавления блюда, очищаем форму и добавляем новое блюдо в список
  dishForm.value = {
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    section: '',
    rating: '',
    deliveryTime: '',
    categories: '',
  }

  updateDishes([newDish], true) // Добавляем новое блюдо в начало списка, так как оно самое свежее
}

const handleDeleteDish = async (id) => {
  // Перед удалением стоит показать модальное окно с подтверждением действия, так как это критичная операция
  const ok = await confirm({
    title: `Удалить блюдо #${id}?`,
    message: 'Вы уверены, что хотите удалить это блюдо? Это действие нельзя будет отменить.',
    confirmText: 'Удалить',
    cancelText: 'Отмена',
    variant: 'danger'
  })

  if (!ok) return;

  await adminService.deleteDish(id)
  displayedDishes.value.filter(dish => dish.id !== id);
}

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

const orderStatusOptions = [
  { value: ORDER_STATUS.PENDING, label: 'В ожидании оплаты' },
  { value: ORDER_STATUS.PAID, label: 'Оплачен' },
  { value: ORDER_STATUS.DELIVERED, label: 'Доставлен' },
  { value: ORDER_STATUS.CANCELED, label: 'Отменён' },
]

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

const handleChangeOrderStatus = async (order, newStatus) => {
  await orderService.updateOrderStatus(selectedUser.value.id, order.id, newStatus)
  order.status = newStatus; // Локально обновляем статус заказа, чтобы не перезагружать весь список
}

const getOrderStatusClass = (status) => {
  const classes = {
    [ORDER_STATUS.PENDING]: 'status--pending',
    [ORDER_STATUS.PAID]: 'status--paid',
    [ORDER_STATUS.DELIVERED]: 'status--delivered',
    [ORDER_STATUS.CANCELED]: 'status--canceled',
  }
  return classes[status] || ''
}

onUnmounted(() => {
  // При уходе со страницы админ-панели обязательно отписываемся от слушателя заказов,
  // чтобы не получать обновления в реальном времени, когда админ-панель уже не отображается
  if (unsubscribeOrdersListener) unsubscribeOrdersListener()
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
      <div v-if="activeTab === 'restaurants'" class="admin-content">
        <div class="row g-4">
          <!-- Форма добавления ресторана -->
          <div class="col-lg-5">
            <div class="admin-card">
              <div class="admin-card__header">
                <h4>Добавить ресторан</h4>
              </div>
              <div class="admin-card__body">
                <form @submit.prevent="handleAddRestaurant" class="admin-form">
                  <div class="admin-form__group">
                    <label class="admin-form__label">Название</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="restaurantForm.name"
                      placeholder="Название ресторана"
                      required
                    >
                  </div>

                  <div class="admin-form__group">
                    <label class="admin-form__label">Изображение (URL)</label>
                    <input
                      type="url"
                      class="form-control"
                      v-model="restaurantForm.imageUrl"
                      placeholder="https://example.com/image.jpg"
                    >
                    <!-- Превью изображения -->
                    <div v-if="restaurantForm.imageUrl" class="admin-form__preview">
                      <img :src="restaurantForm.imageUrl" alt="Preview">
                    </div>
                  </div>

                  <div class="row g-3">
                    <div class="col-6">
                      <div class="admin-form__group">
                        <label class="admin-form__label">Рейтинг</label>
                        <input
                          type="number"
                          class="form-control"
                          v-model="restaurantForm.rating"
                          placeholder="4.5"
                          min="0"
                          max="5"
                          step="0.1"
                        >
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="admin-form__group">
                        <label class="admin-form__label">Время доставки (мин)</label>
                        <input
                          type="number"
                          class="form-control"
                          v-model="restaurantForm.deliveryTime"
                          placeholder="30"
                          min="1"
                        >
                      </div>
                    </div>
                  </div>

                  <div class="admin-form__group">
                    <label class="admin-form__label">Бейдж</label>
                    <select class="form-control" v-model="restaurantForm.badge">
                      <option
                        v-for="opt in badgeOptions"
                        :key="opt"
                        :value="opt"
                      >
                        {{ getBadgeText(opt) }}
                      </option>
                    </select>
                  </div>

                  <div class="admin-form__group">
                    <label class="admin-form__label">Категории</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="restaurantForm.categories"
                      placeholder="asian, european, chicken..."
                    >
                  </div>

                  <button type="submit" class="btn btn-primary w-100 admin-form__submit">
                    Добавить ресторан
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Список ресторанов -->
          <div class="col-lg-7">
            <div class="admin-card">
              <div class="admin-card__header">
                <h4>Список ресторанов</h4>
                <span class="admin-card__counter">{{ restaurantsTotalCount }}</span>
              </div>
              <div class="admin-card__body">
                <!-- Пустое состояние -->
                <div v-if="restaurantsTotalCount === 0" class="admin-empty">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21V7L12 3L21 7V21H3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                    <path d="M9 21V13H15V21" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                  </svg>
                  <p>Ресторанов пока нет</p>
                </div>

                <!-- Список -->
                <div v-else class="admin-list">
                  <PaginationControls
                    :current-page="restaurantsCurrentPage"
                    :total-items="restaurantsTotalCount"
                    :page-size="restaurantsPerPageSize"
                    @update:restaurantCurrentPage="goToRestaurantsPage"
                    @next-page="nextRestaurantsPage"
                    @prev-page="prevRestaurantsPage"
                  />

                  <AdminRestaurantCard
                    v-for="rest in displayedRestaurants"
                    :key="rest.id"
                    :rest="rest"
                    @delete-restaurant="handleDeleteRestaurant"
                  />

                  <PaginationControls
                    :current-page="restaurantsCurrentPage"
                    :total-items="restaurantsTotalCount"
                    :page-size="restaurantsPerPageSize"
                    @update:restaurantCurrentPage="goToRestaurantsPage"
                    @next-page="nextRestaurantsPage"
                    @prev-page="prevRestaurantsPage"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ВКЛАДКА: МЕНЮ -->
      <div v-if="activeTab === 'menu'" class="admin-content">
        <!-- Выбор ресторана -->
        <div class="admin-card mb-4">
          <div class="admin-card__header">
            <h4>Выберите ресторан</h4>
          </div>
          <div class="admin-card__body">
            <select
              class="form-control admin-select--lg"
              v-model="selectedRestaurantId"
              @change="handleSelectRestaurant"
            >
              <option value="" disabled>— Выберите ресторан —</option>
              <option v-for="rest in displayedRestaurants" :key="rest.id" :value="rest.id">
                {{ rest.name }}
              </option>
            </select>

            <!-- Подсказка, если ресторанов нет -->
            <div v-if="restaurantsTotalCount === 0" class="admin-hint mt-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="8" r="1" fill="currentColor"/>
              </svg>
              Сначала добавьте хотя бы один ресторан во вкладке «Рестораны»
            </div>
          </div>
        </div>

        <!-- Контент меню (показывается при выбранном ресторане) -->
        <transition name="fade">
          <div v-if="selectedRestaurantId" class="row g-4">
            <!-- Секции -->
            <div class="col-lg-4">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h4>Секции</h4>
                  <span class="admin-card__counter">{{ sections.length }}</span>
                </div>
                <div class="admin-card__body">
                  <!-- Форма добавления секции -->
                  <form @submit.prevent="handleAddSection" class="admin-form admin-form--inline">
                    <input
                      type="text"
                      class="form-control"
                      v-model="sectionForm.name"
                      placeholder="Название секции"
                      required
                    >
                    <button type="submit" class="btn btn-primary admin-form__btn-add" title="Добавить секцию">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </form>

                  <!-- Список секций -->
                  <div v-if="sections.length === 0" class="admin-empty admin-empty--sm">
                    <p>Секций пока нет</p>
                  </div>

                  <div v-else class="admin-sections-list">
                    <div
                      v-for="section in sections"
                      :key="section.id"
                      class="admin-sections-list__item"
                    >
                      <span class="admin-sections-list__item-name">{{ section.name }}</span>
                      <button
                        class="admin-sections-list__item-delete"
                        @click="handleDeleteSection(section.id)"
                        title="Удалить"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Добавление блюда + список блюд -->
            <div class="col-lg-8">
              <!-- Форма добавления блюда -->
              <div class="admin-card mb-4">
                <div class="admin-card__header">
                  <h4>Добавить блюдо</h4>
                </div>
                <div class="admin-card__body">
                  <form @submit.prevent="handleAddDish" class="admin-form">
                    <div class="row g-3">
                      <div class="col-md-6">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Название блюда</label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="dishForm.name"
                            placeholder="Маргарита"
                            required
                          >
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Секция</label>
                          <select class="form-control" v-model="dishForm.section" required>
                            <option value="" disabled>— Выберите секцию —</option>
                            <option v-for="sec in sections" :key="sec.id" :value="sec.id">
                              {{ sec.name }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Рейтинг</label>
                          <input
                            type="number"
                            class="form-control"
                            v-model="dishForm.rating"
                            placeholder="4.5"
                            min="0"
                            max="5"
                            step="0.1"
                          >
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Время доставки (мин)</label>
                          <input
                            type="number"
                            class="form-control"
                            v-model="dishForm.deliveryTime"
                            placeholder="30"
                            min="1"
                          >
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Цена (₸)</label>
                          <input
                            type="number"
                            class="form-control"
                            v-model="dishForm.price"
                            placeholder="590"
                            min="0"
                            step="1"
                            required
                          >
                        </div>
                      </div>
                      <div class="col-md-8">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Изображение (URL)</label>
                          <input
                            type="url"
                            class="form-control"
                            v-model="dishForm.imageUrl"
                            placeholder="https://example.com/dish.jpg"
                          >
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Бейдж</label>
                          <select class="form-control" v-model="dishForm.badge">
                            <option
                                v-for="opt in badgeOptions"
                                :key="opt"
                                :value="opt"
                            >
                              {{ getBadgeText(opt) }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Категории</label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="dishForm.categories"
                            placeholder="asian, european, chicken..."
                          >
                        </div>
                      </div>
                    </div>

                    <!-- Превью блюда -->
                    <div v-if="dishForm.imageUrl" class="admin-form__preview admin-form__preview--dish">
                      <img :src="dishForm.imageUrl" alt="Preview">
                    </div>

                    <button type="submit" class="btn btn-primary w-100 admin-form__submit">
                      Добавить блюдо
                    </button>
                  </form>
                </div>
              </div>

              <!-- Список блюд -->
              <div class="admin-card">
                <div class="admin-card__header">
                  <h4>Блюда ресторана</h4>
                  <span class="admin-card__counter">{{ dishesTotalCount }}</span>
                </div>
                <div class="admin-card__body">
                  <div v-if="dishesTotalCount === 0" class="admin-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <p>Блюд пока нет</p>
                  </div>

                  <div v-else class="admin-dishes-list">
                    <PaginationControls
                      :current-page="dishesCurrentPage"
                      :total-items="dishesTotalCount"
                      :page-size="dishesPerPageSize"
                      @update:dishesCurrentPage="goToDishesPage"
                      @next-page="nextDishesPage"
                      @prev-page="prevDishesPage"
                    />

                    <AdminDishCard
                      v-for="dish in displayedDishes"
                      :key="dish.id"
                      :dish="dish"
                      @delete-dish="handleDeleteDish"
                    />

                    <PaginationControls
                      :current-page="dishesCurrentPage"
                      :total-items="dishesTotalCount"
                      :page-size="dishesPerPageSize"
                      @update:dishesCurrentPage="goToDishesPage"
                      @next-page="nextDishesPage"
                      @prev-page="prevDishesPage"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- ВКЛАДКА: Пользователи -->
      <div v-if="activeTab === 'users'" class="admin-content">
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
                        @update:selectedUserOrdersCurrentPage="selectedUserGoToOrdersPage"
                        @next-page="selectedUserNextOrdersPage"
                        @prev-page="selectedUserPrevOrdersPage"
                    />

                    <!-- TODO: Возможно стоит вынести в отдельный компонент -->
                    <div
                      v-for="order in selectedUserDisplayedOrders"
                      :key="order.id"
                      class="admin-orders-list__item"
                    >
                      <div class="admin-orders-list__item-header">
                        <div class="admin-orders-list__item-id">#{{ order.id.slice(0, 8) }}</div>
                        <div class="admin-orders-list__item-date">{{ formatDate(order.createdAt) }}</div>
                      </div>

                      <div class="admin-orders-list__item-body">
                        <!-- Товары заказа -->
                        <div class="admin-orders-list__item-items">
                          <div
                            v-for="(item, idx) in order.items"
                            :key="idx"
                            class="admin-orders-list__item-dish"
                          >
                            <span class="admin-orders-list__item-dish-name">{{ item.name }}</span>
                            <span class="admin-orders-list__item-dish-qty">×{{ item.quantity }}</span>
                            <span class="admin-orders-list__item-dish-price">{{ formatPrice(item.price) }}</span>
                          </div>
                        </div>

                        <div class="admin-orders-list__item-footer">
                          <div class="admin-orders-list__item-total">
                            Итого: <strong>{{ formatPrice(order.totalAmount) }}</strong>
                          </div>

                          <!-- Смена статуса -->
                          <div class="admin-orders-list__item-status">
                            <span class="admin-orders-list__status-badge" :class="getOrderStatusClass(order.status)">
                              {{ getOrderStatusText(order.status) }}
                            </span>
                            <select
                              class="form-control admin-orders-list__status-select"
                              :value="order.status"
                              @change="handleChangeOrderStatus(order, $event.target.value)"
                            >
                              <option
                                v-for="opt in orderStatusOptions"
                                :key="opt.value"
                                :value="opt.value"
                              >
                                {{ opt.label }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <PaginationControls
                        :current-page="selectedUserOrdersCurrentPage"
                        :total-items="selectedUserOrdersCount"
                        :page-size="userOrdersPerPage"
                        @update:selectedUserOrdersCurrentPage="selectedUserGoToOrdersPage"
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
    </div>
  </main>

  <Footer />
</template>

<style scoped lang="scss">
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

// Контент
.admin-content {
  animation: fadeIn 0.3s ease;
}

// Карточки
.admin-card {
  background: #fff;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;

    h4 {
      font-family: $font-family, sans-serif;
      font-weight: 700;
      font-size: 22px;
      color: #323142;
      margin: 0;
    }
  }

  &__counter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 10px;
    background: rgba(108, 95, 188, 0.1);
    color: $purple;
    border-radius: 50px;
    font-family: $font-family, sans-serif;
    font-weight: 700;
    font-size: 14px;
  }
}

// Формы
.admin-form {
  &__group {
    margin-bottom: 18px;
  }

  &__label {
    display: block;
    font-family: $font-family, sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: #323142;
    margin-bottom: 8px;
  }

  .form-control,
  select.form-control,
  textarea.form-control {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid #e0e0e0;
    border-radius: 12px;
    font-family: $second-family, sans-serif;
    font-size: 15px;
    background: #fff;
    transition: all 0.2s ease;
    appearance: auto;

    &:focus {
      outline: none;
      border-color: $purple;
      box-shadow: 0 0 0 3px rgba(108, 95, 188, 0.1);
    }

    &::placeholder {
      color: #c0c0c0;
    }
  }

  textarea.form-control {
    resize: vertical;
    min-height: 60px;
  }

  &__preview {
    margin-top: 12px;
    border-radius: 16px;
    overflow: hidden;
    border: 2px solid #f0f0f0;
    max-height: 180px;

    img {
      width: 100%;
      height: 100%;
      max-height: 180px;
      object-fit: cover;
      display: block;
    }

    &--dish {
      max-height: 120px;
      margin-bottom: 18px;

      img {
        max-height: 120px;
      }
    }
  }

  &__submit {
    margin-top: 8px;
    padding: 14px;
    font-size: 16px;
    border-radius: 14px;
  }

  &__checkbox {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-family: $font-family, sans-serif;
    font-weight: 600;
    font-size: 15px;
    color: #323142;
    user-select: none;

    input[type="checkbox"] {
      display: none;
    }

    &-mark {
      width: 22px;
      height: 22px;
      border: 2px solid #d0d0d0;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;

      &::after {
        content: '';
        width: 12px;
        height: 12px;
        background: $purple;
        border-radius: 3px;
        transform: scale(0);
        transition: transform 0.2s ease;
      }
    }

    input[type="checkbox"]:checked + &-mark {
      border-color: $purple;

      &::after {
        transform: scale(1);
      }
    }
  }

  // Инлайновая форма (секции)
  &--inline {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .form-control {
      flex: 1;
    }
  }

  &__btn-add {
    width: 48px;
    height: 48px;
    min-width: 48px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    flex-shrink: 0;
  }
}

.admin-select--lg {
  padding: 14px 18px !important;
  font-size: 16px !important;
  font-weight: 500;
}

// Подсказка
.admin-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: $second-family, sans-serif;
  font-size: 14px;
  color: #8e97a6;

  svg {
    flex-shrink: 0;
    color: $purple;
  }
}

// Пустое состояние
.admin-empty {
  text-align: center;
  padding: 40px 20px;
  color: #c0c0c0;

  svg {
    margin-bottom: 12px;
    opacity: 0.5;
  }

  p {
    font-family: $second-family, sans-serif;
    font-size: 15px;
    color: #8e97a6;
    margin: 0;
  }

  &--sm {
    padding: 20px 10px;

    svg {
      display: none;
    }
  }
}

// Список ресторанов
.admin-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

// Список секций
.admin-sections-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    background: #f9f9f9;
    border-radius: 12px;
    transition: all 0.2s ease;

    &:hover {
      background: #f4f2ff;
    }

    &-name {
      font-family: $font-family, sans-serif;
      font-weight: 600;
      font-size: 15px;
      color: #323142;
    }

    &-delete {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: #c0c0c0;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(229, 73, 43, 0.1);
        color: #e5492b;
      }
    }
  }
}

// Список блюд
.admin-dishes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

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

  &__item {
    border: 1px solid #f0f0f0;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.2s ease;

    &:hover {
      border-color: #e0e0e0;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    }

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      background: #fafafa;
      border-bottom: 1px solid #f0f0f0;
    }

    &-id {
      font-family: $font-family, sans-serif;
      font-weight: 700;
      font-size: 15px;
      color: #323142;
    }

    &-date {
      font-family: $second-family, sans-serif;
      font-size: 13px;
      color: #8e97a6;
    }

    &-body {
      padding: 16px 18px;
    }

    &-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 14px;
    }

    &-dish {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: $second-family, sans-serif;
      font-size: 14px;
      color: #555;

      &-name {
        flex: 1;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &-qty {
        color: #8e97a6;
        font-size: 13px;
        flex-shrink: 0;
      }

      &-price {
        font-family: $font-family, sans-serif;
        font-weight: 600;
        color: #323142;
        flex-shrink: 0;
      }
    }

    &-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      border-top: 1px solid #f0f0f0;
      flex-wrap: wrap;
      gap: 12px;
    }

    &-total {
      font-family: $second-family, sans-serif;
      font-size: 15px;
      color: #555;

      strong {
        font-family: $font-family, sans-serif;
        font-weight: 700;
        color: #323142;
      }
    }

    &-status {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  &__status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 8px;
    font-family: $font-family, sans-serif;
    font-weight: 600;
    font-size: 12px;
    white-space: nowrap;
  }

  &__status-select {
    padding: 6px 10px !important;
    font-size: 13px !important;
    border-radius: 8px !important;
    min-width: 160px;
    border: 1.5px solid #e0e0e0;
  }
}

// Стили статусов
.status {
  &--pending {
    background: rgba(245, 166, 35, 0.12);
    color: #e6930a;
  }

  &--paid {
    background: rgba(108, 95, 188, 0.12);
    color: $purple;
  }

  &--delivered {
    background: rgba(46, 184, 92, 0.12);
    color: #1e9d4f;
  }

  &--canceled {
    background: rgba(229, 73, 43, 0.1);
    color: #e5492b;
  }
}

// Анимации
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

// Адаптивные стили
@media screen and (max-width: 1199.98px) {
  .admin-card {
    padding: 24px;

    &__header h4 {
      font-size: 20px;
    }
  }
}

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

  .admin-card {
    padding: 20px;
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

  .admin-card {
    padding: 18px;
    border-radius: 20px;

    &__header {
      margin-bottom: 18px;
      padding-bottom: 14px;

      h4 {
        font-size: 18px;
      }
    }
  }

  .admin-form {
    &__label {
      font-size: 13px;
    }

    .form-control {
      padding: 10px 14px;
      font-size: 14px;
    }

    &--inline {
      gap: 8px;
    }

    &__btn-add {
      width: 44px;
      height: 44px;
      min-width: 44px;
    }
  }

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

@media screen and (max-width: 566.98px) {
  .admin-tabs {
    &__btn {
      padding: 10px 12px;
      font-size: 13px;
      gap: 6px;
    }
  }

  .admin-card {
    padding: 14px;
    border-radius: 16px;
  }

  .admin-list__item-meta {
    flex-wrap: wrap;
    gap: 6px;
  }

  .admin-dishes-list__item-meta {
    flex-wrap: wrap;
    gap: 6px;
  }
}
</style>