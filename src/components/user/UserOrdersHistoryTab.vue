<script setup>
import {onMounted, onUnmounted, ref, watch} from 'vue';
import OrderInfoCard from "./OrderInfoCard.vue";
import {orderService} from "../../services/orderService.js";
import {useAuthStore} from "../../store/authStore.js";
import {usePagination} from "../../composables/usePagination.js";
import PaginationControls from '../../components/PaginationControls.vue'
import OrderDetailsModal from "../modals/OrderDetailsModal.vue";
import OrderPaymentModal from "../modals/OrderPaymentModal.vue";

// Icons
import {LoaderCircle, BookDashed} from '@lucide/vue';

// User profile
const authStore = useAuthStore();

// Order history
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

  <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
    <h4>История заказов</h4>
  </div>

  <div class="info-card__body">
    <!-- Пустое состояние -->
    <div v-if="ordersTotalCount === 0" class="empty-state">
      <div class="flex justify-center mb-4">
        <BookDashed size="48" class="text-(--primary)"/>
      </div>
      <h5>У вас пока нет заказов</h5>
      <p>Ваши заказы будут отображаться здесь</p>
      <router-link to="/menu" class="btn btn-primary mt-3">
        Перейти к меню
      </router-link>
    </div>

    <!-- Ожидание загрузки -->
    <div v-else-if="orders.length === 0" class="flex justify-center py-10">
      <LoaderCircle size="64" class="animate-spin text-(--primary)"></LoaderCircle>
    </div>

    <!-- Список заказов -->
    <div v-else class="orders-list row g-3">
      <PaginationControls
          :current-page="ordersCurrentPage"
          :total-items="ordersTotalCount"
          :page-size="ordersPageSize"
          @go-to-page="goToPage"
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
          @go-to-page="goToPage"
          @next-page="nextPage"
          @prev-page="prevPage"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
h4 {
  font-family: $font-family, sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: #323142;
  margin: 0;
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

@media screen and (max-width: 767.98px) {
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
</style>