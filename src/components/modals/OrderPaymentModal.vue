<script setup>
import ModalLayout from '@/components/modals/ModalLayout.vue'
import { ref, computed } from 'vue'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { formatPrice , formatCardNumber, formatExpiryDate } from '@/utils/formatters'
import { updateOrderStatus } from '@/services/orderService'
import { ORDER_STATUS } from '@/constants/orderStatus'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'payment-success'])

const cartStore = useCartStore()
const authStore = useAuthStore()

// Состояние компонента
const paymentMethod = ref('card') // 'card', 'cash', 'online-wallet'
const isProcessing = ref(false)
const paymentStatus = ref(null) // null, 'success', 'error'
const errorMessage = ref('')

// Данные карты
const cardData = ref({
  number: '',
  holder: '',
  expiry: '',
  cvv: ''
})

// Обработчики ввода
const handleCardNumberInput = (event) => {
  const value = event.target.value.replace(/\s/g, '')
  if (value.length <= 16) {
    cardData.value.number = formatCardNumber(value)
  }
}

const handleExpiryInput = (event) => {
  const value = event.target.value.replace(/\D/g, '')
  if (value.length <= 4) {
    cardData.value.expiry = formatExpiryDate(value)
  }
}

const handleCvvInput = (event) => {
  const value = event.target.value.replace(/\D/g, '')
  if (value.length <= 3) {
    cardData.value.cvv = value
  }
}

// Валидация формы
const isFormValid = computed(() => {
  if (paymentMethod.value === 'card') {
    return (
      cardData.value.number.replace(/\s/g, '').length === 16 &&
      cardData.value.holder.trim() !== '' &&
      cardData.value.expiry.length === 5 &&
      cardData.value.cvv.length === 3
    )
  }
  return true
})

// Обработка оплаты
const handlePayment = async () => {
  if (!isFormValid.value) return
  
  isProcessing.value = true
  paymentStatus.value = null
  errorMessage.value = ''
  
  try {
    // Симуляция обработки платежа
    await new Promise((resolve, reject) => setTimeout(() => resolve(), 3000))
    
    // Обновляем статус заказа на "оплачен"
    await updateOrderStatus(authStore.profile?.id, props.order.id, ORDER_STATUS.PAID, { paymentMethod: paymentMethod.value })
    
    paymentStatus.value = 'success'
    
    // Очищаем корзину после успешной оплаты
    setTimeout(() => {
      cartStore.clearCart()
      emit('payment-success', props.order.id)
      handleClose()
    }, 2000)
    
  } catch (error) {
    console.error('Payment error:', error)
    paymentStatus.value = 'error'
    errorMessage.value = 'Произошла ошибка при обработке платежа. Попробуйте снова.'
  } finally {
    isProcessing.value = false
  }
}

const handleClose = () => {
  if (!isProcessing.value) {
    emit('close')
  }
}
</script>

<template>
  <ModalLayout
    :isOpen="isOpen"
    title="Оплата заказа"
    :showFooter="false"
    maxWidth="700px"
    @close="handleClose"
  >
    <div class="payment-modal">
      <!-- Информация о заказе -->
      <div class="order-info">
        <div class="order-info__item">
          <span class="order-info__label">Номер заказа:</span>
          <span class="order-info__value">#{{ props.order.id.slice(0, 8).toUpperCase() }}</span>
        </div>
        <div class="order-info__item align-items-start">
          <span class="order-info__label">Состав заказа:</span>
          <div class="order-info__value">
            <ul class="order-items-list">
              <li v-for="item in props.order.items" :key="item.id" class="order-item">
                {{ item.name }} x{{ item.quantity }}
              </li>
            </ul>
          </div>
        </div>
        <div class="order-info__item">
          <span class="order-info__label">Дата заказа:</span>
          <span class="order-info__value">{{ props.order.createdAt.toDate().toLocaleString() }}</span>
        </div>
        <div class="order-info__item">
          <span class="order-info__label">Способ получения:</span>
          <span class="order-info__value">{{ props.order.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Доставка' }}</span>
        </div>
        <div class="order-info__item">
          <span class="order-info__label">Адрес доставки:</span>
          <span class="order-info__value">{{ props.order.deliveryAddress || 'Не указан' }}</span>
        </div>
        <div class="order-info__item order-info__item--total">
          <span class="order-info__label">Итого к оплате:</span>
          <span class="order-info__value order-info__value--amount">{{ formatPrice(props.order.totalAmount) }}</span>
        </div>
      </div>

      <!-- Выбор способа оплаты -->
      <div class="payment-methods">
        <h4 class="payment-methods__title">Способ оплаты</h4>
        <div class="payment-methods__options">
          <label class="payment-method" :class="{ 'payment-method--active': paymentMethod === 'card' }">
            <input type="radio" name="payment" value="card" v-model="paymentMethod">
            <div class="payment-method__content">
              <div class="payment-method__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M2 10H22" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="payment-method__info">
                <div class="payment-method__name">Банковская карта</div>
                <div class="payment-method__desc">Visa, Mastercard</div>
              </div>
            </div>
          </label>

          <label class="payment-method" :class="{ 'payment-method--active': paymentMethod === 'cash' }">
            <input type="radio" name="payment" value="cash" v-model="paymentMethod">
            <div class="payment-method__content">
              <div class="payment-method__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M6 12C6 10.8954 6.89543 10 8 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M18 12C18 13.1046 17.1046 14 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="payment-method__info">
                <div class="payment-method__name">Наличными</div>
                <div class="payment-method__desc">При получении заказа</div>
              </div>
            </div>
          </label>

          <label class="payment-method" :class="{ 'payment-method--active': paymentMethod === 'online-wallet' }">
            <input type="radio" name="payment" value="online-wallet" v-model="paymentMethod">
            <div class="payment-method__content">
              <div class="payment-method__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="17" cy="17" r="4" stroke="currentColor" stroke-width="2"/>
                  <path d="M17 15V19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="payment-method__info">
                <div class="payment-method__name">Электронный кошелек</div>
                <div class="payment-method__desc">ЮMoney, Qiwi</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Форма оплаты картой -->
      <transition name="slide-fade">
        <div v-if="paymentMethod === 'card'" class="card-form">
          <div class="form-group">
            <label class="form-label">Номер карты</label>
            <input
              type="text"
              class="form-control"
              placeholder="0000 0000 0000 0000"
              :value="cardData.number"
              @input="handleCardNumberInput"
              maxlength="19"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Имя владельца</label>
            <input
              type="text"
              class="form-control"
              placeholder="IVAN IVANOV"
              v-model="cardData.holder"
            >
          </div>

          <div class="row g-3">
            <div class="col-6">
              <div class="form-group">
                <label class="form-label">Срок действия</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="MM/YY"
                  :value="cardData.expiry"
                  @input="handleExpiryInput"
                  maxlength="5"
                >
              </div>
            </div>
            <div class="col-6">
              <div class="form-group">
                <label class="form-label">CVV</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="000"
                  :value="cardData.cvv"
                  @input="handleCvvInput"
                  maxlength="3"
                >
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Сообщение для наличных -->
      <transition name="slide-fade">
        <div v-if="paymentMethod === 'cash'" class="payment-note">
          <div class="payment-note__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="8" r="1" fill="currentColor"/>
            </svg>
          </div>
          <p>Оплата производится курьеру при получении заказа. Пожалуйста, подготовьте точную сумму.</p>
        </div>
      </transition>

      <!-- Сообщение для электронных кошельков -->
      <transition name="slide-fade">
        <div v-if="paymentMethod === 'online-wallet'" class="payment-note">
          <div class="payment-note__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="8" r="1" fill="currentColor"/>
            </svg>
          </div>
          <p>После подтверждения заказа вы будете перенаправлены на страницу оплаты выбранного сервиса.</p>
        </div>
      </transition>

      <!-- Статус оплаты -->
      <transition name="fade">
        <div v-if="paymentStatus === 'success'" class="payment-status payment-status--success">
          <div class="payment-status__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h4>Оплата прошла успешно!</h4>
          <p>Ваш заказ принят в обработку</p>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="paymentStatus === 'error'" class="payment-status payment-status--error">
          <div class="payment-status__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h4>Ошибка оплаты</h4>
          <p>{{ errorMessage }}</p>
        </div>
      </transition>

      <!-- Кнопки действий -->
      <div class="payment-actions" v-if="!paymentStatus">
        <button class="btn btn-secondary" @click="handleClose" :disabled="isProcessing">
          Отмена
        </button>
        <button 
          class="btn btn-primary"
          @click="handlePayment"
          :disabled="!isFormValid || isProcessing"
        >
          <span v-if="!isProcessing">
            {{ paymentMethod === 'cash' ? 'Подтвердить заказ' : 'Оплатить' }}
          </span>
          <span v-else class="d-flex align-items-center justify-content-center">
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
            Обработка...
          </span>
        </button>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.payment-modal {
  padding: 0;
}

// Информация о заказе
.order-info {
  background: #f9f9f9;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    &--total {
      padding-top: 12px;
      border-top: 1px solid #e0e0e0;
      margin-top: 12px;
    }
  }

  &__label {
    font-family: $second-family, sans-serif;
    font-size: 15px;
    color: #8e97a6;
  }

  &__value {
    font-family: $font-family, sans-serif;
    font-weight: 600;
    font-size: 15px;
    color: #323142;

    &--amount {
      font-weight: 700;
      font-size: 24px;
      color: $purple;
    }
  }
}

// Способы оплаты
.payment-methods {
  margin-bottom: 24px;

  &__title {
    font-family: $font-family, sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: #323142;
    margin-bottom: 16px;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.payment-method {
  position: relative;
  display: block;
  cursor: pointer;

  input[type="radio"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border: 2px solid #e0e0e0;
    border-radius: 16px;
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(108, 95, 188, 0.3);
      background: rgba(108, 95, 188, 0.02);
    }
  }

  &--active &__content {
    border-color: $purple;
    background: rgba(108, 95, 188, 0.05);
  }

  &__icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9f9f9;
    border-radius: 12px;
    color: $purple;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }

  &--active &__icon {
    background: $purple;
    color: #fff;
  }

  &__info {
    flex: 1;
  }

  &__name {
    font-family: $font-family, sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: #323142;
    margin-bottom: 2px;
  }

  &__desc {
    font-family: $second-family, sans-serif;
    font-size: 13px;
    color: #8e97a6;
  }
}

// Форма карты
.card-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-family: $font-family, sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #323142;
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-family: $second-family, sans-serif;
  font-size: 15px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: $purple;
    box-shadow: 0 0 0 3px rgba(108, 95, 188, 0.1);
  }

  &::placeholder {
    color: #c0c0c0;
  }
}

// Примечание
.payment-note {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(108, 95, 188, 0.05);
  border-radius: 12px;
  margin-bottom: 24px;

  &__icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    color: $purple;
  }

  p {
    font-family: $second-family, sans-serif;
    font-size: 14px;
    color: #666;
    margin: 0;
    line-height: 1.5;
  }
}

// Статус оплаты
.payment-status {
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 24px;
  border-radius: 16px;

  &__icon {
    margin-bottom: 16px;

    svg {
      width: 64px;
      height: 64px;
    }
  }

  h4 {
    font-family: $font-family, sans-serif;
    font-weight: 700;
    font-size: 22px;
    margin-bottom: 8px;
  }

  p {
    font-family: $second-family, sans-serif;
    font-size: 15px;
    margin: 0;
  }

  &--success {
    background: rgba(51, 172, 100, 0.05);
    
    .payment-status__icon {
      color: #33ac64;
    }

    h4 {
      color: #33ac64;
    }

    p {
      color: #666;
    }
  }

  &--error {
    background: rgba(229, 73, 43, 0.05);
    
    .payment-status__icon {
      color: #e5492b;
    }

    h4 {
      color: #e5492b;
    }

    p {
      color: #666;
    }
  }
}

// Кнопки действий
.payment-actions {
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;

  .btn {
    flex: 1;
    min-height: 48px;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

// Анимации
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Адаптивные стили
@media screen and (max-width: 767.98px) {
  .order-info {
    padding: 16px;

    &__value--amount {
      font-size: 20px;
    }
  }

  .payment-method {
    &__content {
      padding: 12px;
      gap: 12px;
    }

    &__icon {
      width: 44px;
      height: 44px;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    &__name {
      font-size: 15px;
    }

    &__desc {
      font-size: 12px;
    }
  }

  .payment-actions {
    flex-direction: column-reverse;

    .btn {
      width: 100%;
    }
  }

  .payment-status {
    padding: 30px 16px;

    &__icon svg {
      width: 56px;
      height: 56px;
    }

    h4 {
      font-size: 20px;
    }

    p {
      font-size: 14px;
    }
  }
}

@media screen and (max-width: 566.98px) {
  .order-info {
    &__item {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }

  .form-control {
    font-size: 14px;
    padding: 10px 14px;
  }

  .payment-method {
    &__icon {
      width: 40px;
      height: 40px;
    }

    &__name {
      font-size: 14px;
    }
  }
}
</style>