<script setup>
import { computed } from 'vue'
import { formatPrice } from '@/utils/formatters'
import { ORDER_STATUS } from '@/constants/orderStatus'
import ModalLayout from "@/components/modals/ModalLayout.vue"
import {Order} from "@/models/Order.js";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  order: {
    type: Order,
    default: null
  }
})

const emit = defineEmits(['close', 'pay'])

const handleClose = () => {
  emit('close')
}

const handlePay = () => {
  emit('pay', props.order.id)
}

const canPay = computed(() => {
  return props.order?.status === ORDER_STATUS.PENDING
})
</script>

<template>
  <ModalLayout
    :isOpen="isOpen"
    title=""
    :showFooter="false"
    maxWidth="640px"
    @close="handleClose"
  >
    <div v-if="order" class="order-details">
      <!-- Шапка заказа -->
      <div class="order-details__header">
        <div class="order-details__header-left">
          <div class="order-details__id">#{{ order.shortId.toUpperCase() }}</div>
          <div class="order-details__date">{{ order.createdAtFormatted }}</div>
        </div>
        <span class="order-details__status" :class="order.statusClass">
          {{ order.statusText }}
        </span>
      </div>

      <!-- Список товаров -->
      <div class="order-details__items">
        <h5 class="order-details__section-title">Состав заказа</h5>
        <div class="order-details__items-list">
          <div
            v-for="(item, idx) in order.items"
            :key="idx"
            class="order-details__item"
          >
            <div class="order-details__item-info">
              <span class="order-details__item-name">{{ item.name }}</span>
              <span v-if="item.restaurantName" class="order-details__item-restaurant">{{ item.restaurantName }}</span>
            </div>
            <div class="order-details__item-right">
              <span class="order-details__item-qty">×{{ item.quantity }}</span>
              <span class="order-details__item-price">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Разделитель -->
      <div class="order-details__divider"></div>

      <!-- Детали доставки -->
      <div class="order-details__meta">
        <h5 class="order-details__section-title">Детали</h5>
        <div class="order-details__meta-grid">
          <div class="order-details__meta-item">
            <div class="order-details__meta-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="order-details__meta-content">
              <span class="order-details__meta-label">Адрес доставки</span>
              <span class="order-details__meta-value">{{ order.deliveryAddress || 'Не указан' }}</span>
            </div>
          </div>

          <div class="order-details__meta-item">
            <div class="order-details__meta-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M2 10H22" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="order-details__meta-content">
              <span class="order-details__meta-label">Способ оплаты</span>
              <span class="order-details__meta-value">
                {{ order.paymentMethod === 'card' ? 'Банковская карта' : order.paymentMethod === 'cash' ? 'Наличными' : order.paymentMethod === 'online-wallet' ? 'Электронный кошелёк' : 'Не выбран' }}
              </span>
            </div>
          </div>

          <div v-if="order.paymentId" class="order-details__meta-item">
            <div class="order-details__meta-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="order-details__meta-content">
              <span class="order-details__meta-label">ID транзакции</span>
              <span class="order-details__meta-value order-details__meta-value--mono">{{ order.paymentId }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Разделитель -->
      <div class="order-details__divider"></div>

      <!-- Итого и действия -->
      <div class="order-details__footer">
        <div class="order-details__total">
          <span class="order-details__total-label">Итого</span>
          <span class="order-details__total-value">{{ order.formattedTotalPrice }}</span>
        </div>

        <div class="order-details__actions">
          <button class="btn btn-secondary" @click="handleClose">
            Закрыть
          </button>
          <button v-if="canPay" class="btn btn-primary" @click="handlePay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M2 10H22" stroke="currentColor" stroke-width="2"/>
            </svg>
            Оплатить заказ
          </button>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style scoped lang="scss">
.order-details {
  // Шапка
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 28px;
  }

  &__header-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__id {
    font-family: $font-family, sans-serif;
    font-weight: 800;
    font-size: 28px;
    color: #323142;
    line-height: 1.2;
  }

  &__date {
    font-family: $second-family, sans-serif;
    font-size: 15px;
    color: #8e97a6;
  }

  &__status {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 10px;
    font-family: $font-family, sans-serif;
    font-weight: 700;
    font-size: 14px;
    white-space: nowrap;
    flex-shrink: 0;

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

  // Заголовки секций
  &__section-title {
    font-family: $font-family, sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: #323142;
    margin-bottom: 14px;
  }

  // Список товаров
  &__items {
    margin-bottom: 24px;
  }

  &__items-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 14px 16px;
    background: #f9f9f9;
    border-radius: 14px;
    transition: background 0.2s ease;

    &:hover {
      background: #f4f2ff;
    }
  }

  &__item-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__item-name {
    font-family: $font-family, sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #323142;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__item-restaurant {
    font-family: $second-family, sans-serif;
    font-size: 13px;
    color: #8e97a6;
  }

  &__item-right {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-shrink: 0;
  }

  &__item-qty {
    font-family: $second-family, sans-serif;
    font-size: 14px;
    color: #8e97a6;
    background: rgba(108, 95, 188, 0.08);
    padding: 2px 8px;
    border-radius: 6px;
  }

  &__item-price {
    font-family: $font-family, sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #323142;
    min-width: 70px;
    text-align: right;
  }

  // Разделитель
  &__divider {
    height: 1px;
    background: #f0f0f0;
    margin-bottom: 24px;
  }

  // Мета-информация
  &__meta {
    margin-bottom: 24px;
  }

  &__meta-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__meta-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 16px;
    background: #f9f9f9;
    border-radius: 14px;
  }

  &__meta-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(108, 95, 188, 0.08);
    border-radius: 10px;
    color: $purple;
    flex-shrink: 0;
  }

  &__meta-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__meta-label {
    font-family: $second-family, sans-serif;
    font-size: 13px;
    color: #8e97a6;
  }

  &__meta-value {
    font-family: $font-family, sans-serif;
    font-weight: 600;
    font-size: 15px;
    color: #323142;

    &--mono {
      font-family: monospace;
      font-size: 13px;
      color: #8e97a6;
      word-break: break-all;
    }
  }

  // Футер
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__total {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__total-label {
    font-family: $second-family, sans-serif;
    font-size: 13px;
    color: #8e97a6;
  }

  &__total-value {
    font-family: $font-family, sans-serif;
    font-weight: 800;
    font-size: 28px;
    color: #323142;
    line-height: 1.2;
  }

  &__actions {
    display: flex;
    gap: 12px;

    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 700;

      svg {
        flex-shrink: 0;
      }
    }
  }
}

// Адаптивные стили
@media screen and (max-width: 767.98px) {
  .order-details {
    &__header {
      flex-direction: column;
      gap: 12px;
    }

    &__id {
      font-size: 24px;
    }

    &__item {
      padding: 12px;
    }

    &__item-right {
      gap: 10px;
    }

    &__item-price {
      min-width: 60px;
      font-size: 14px;
    }

    &__meta-item {
      padding: 10px 14px;
    }

    &__meta-icon {
      width: 36px;
      height: 36px;
    }

    &__total-value {
      font-size: 24px;
    }

    &__footer {
      flex-direction: column;
      align-items: stretch;
    }

    &__actions {
      flex-direction: column-reverse;

      .btn {
        justify-content: center;
        width: 100%;
      }
    }
  }
}

@media screen and (max-width: 566.98px) {
  .order-details {
    &__id {
      font-size: 22px;
    }

    &__section-title {
      font-size: 16px;
    }

    &__item {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    &__item-right {
      align-self: flex-end;
    }

    &__total-value {
      font-size: 22px;
    }

    &__actions .btn {
      padding: 12px 18px;
      font-size: 14px;
    }
  }
}
</style>