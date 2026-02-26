<script setup>
import { getOrderStatusText } from '@/utils/helpers'
import { formatPrice, formatDate } from '@/utils/formatters'

const emit = defineEmits(['pay'])

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const handlePayOrder = () => {
  emit('pay', props.order.id)
}
</script>

<template>
<div class="order-item">
  <div class="order-item__header">
    <div class="order-number">Заказ #{{ props.order.id }}</div>
    <div class="order-date">{{ formatDate(props.order.createdAt) }}</div>
  </div>
  <div class="order-item__body">
    <div class="order-details">
      {{ props.order.items.length }} блюд, {{ props.order.deliveryMethod === 'pickup' ? 'Самовывоз' : 'Доставка' }}
    </div>
    <div class="order-price">{{ formatPrice(props.order.totalAmount) }}</div>
  </div>
  <div class="order-item__footer">
    <span class="order-status" :class="`order-status--${props.order.status}`">
      {{ getOrderStatusText(props.order.status) }}
    </span>
    <button v-if="props.order.status === 'pending'"
     class="btn btn-primary btn-sm"
     @click="handlePayOrder"
    >
      Оплатить
    </button>
  </div>
</div>
</template>

<style lang="scss" scoped>
.order-item {
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  transition: .3s all;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:last-child {
    margin-bottom: 0;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .order-number {
      font-family: $font-family, sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: #323142;
    }

    .order-date {
      font-family: $second-family, sans-serif;
      font-size: 14px;
      color: #8e97a6;
    }
  }

  &__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .order-details {
      font-family: $second-family, sans-serif;
      font-size: 14px;
      color: #666;
    }

    .order-price {
      font-family: $font-family, sans-serif;
      font-weight: 700;
      font-size: 18px;
      color: #323142;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .order-status {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 8px;
      font-family: $font-family, sans-serif;
      font-weight: 600;
      font-size: 12px;

      &--pending {
        background: #fff3cd;
        color: #856404;
      }

      &--paid {
        background: #d1ecf1;
        color: #0c5460;
      }

      &--delivered {
        background: #d4edda;
        color: #155724;
      }

      &--cancelled {
        background: #f8d7da;
        color: #721c24;
      }
    }
  }
}

@media screen and (max-width: 566.98px) {
  .order-item {
    padding: 16px;

    &__header {
      .order-number {
        font-size: 14px;
      }

      .order-date {
        font-size: 12px;
      }
    }

    &__body {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      .order-price {
        font-size: 16px;
      }
    }
  }
}
</style>