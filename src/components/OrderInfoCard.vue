<script setup>
import {Order} from "@/models/Order.js";

const emit = defineEmits(['pay', 'show-details'])

const props = defineProps({
  order: {
    type: Order,
    required: true
  }
})

const handlePayOrder = () => {
  emit('pay', props.order.id)
}

const handleShowDetails = () => {
  emit('show-details', props.order)
}
</script>

<template>
<div class="order-info-card" @click="handleShowDetails">
  <div class="order-item">
    <div class="order-item__header">
      <div class="order-number">Заказ #{{ props.order.id }}</div>
      <div class="order-date">{{ props.order.createdAtFormatted }}</div>
    </div>
    <div class="order-item__body">
      <div class="order-details">
        {{ props.order.items.length }} блюд, {{ props.order.paymentMethod === 'pickup' ? 'Самовывоз' : 'Доставка' }}
      </div>
      <div class="order-price">{{ props.order.formattedTotalPrice }}</div>
    </div>
    <div class="order-item__footer">
      <span class="order-status" :class="props.order.statusClass">
        {{ props.order.statusText }}
      </span>
      <button v-if="props.order.status === 'pending'"
       class="btn btn-primary btn-sm"
       @click="handlePayOrder"
      >
        Оплатить
      </button>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.order-info-card {
  cursor: pointer;
  transition: all 0.2s ease;

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