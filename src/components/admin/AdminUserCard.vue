<script setup>
import {formatPrice} from "@/utils/formatters.js";
import {ORDER_STATUS} from "@/constants/orderStatus.js";
import {Order} from "@/models/Order.js";

const props = defineProps({
  order: {
    type: Order,
    required: true
  },
})

const orderStatusOptions = [
  { value: ORDER_STATUS.PENDING, label: 'В ожидании оплаты' },
  { value: ORDER_STATUS.PAID, label: 'Оплачен' },
  { value: ORDER_STATUS.DELIVERED, label: 'Доставлен' },
  { value: ORDER_STATUS.CANCELED, label: 'Отменён' },
]

const emit = defineEmits(['change-order-status']);

const handleChangeOrderStatus = (order, newStatus) => {
  emit('change-order-status', { orderId: order.id, newStatus });
}
</script>

<template>
  <div class="admin-orders-list__item">
    <div class="admin-orders-list__item-header">
      <div class="admin-orders-list__item-id">#{{ props.order.shortId }}</div>
      <div class="admin-orders-list__item-date">{{ props.order.createdAtFormatted }}</div>
    </div>

    <div class="admin-orders-list__item-body">
      <!-- Товары заказа -->
      <div class="admin-orders-list__item-items">
        <div
            v-for="(item, idx) in props.order.items"
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
          Итого: <strong>{{ props.order.formattedTotalPrice }}</strong>
        </div>

        <!-- Смена статуса -->
        <div class="admin-orders-list__item-status">
          <span class="admin-orders-list__status-badge" :class="props.order.statusClass">
            {{ props.order.statusText }}
          </span>
          <select
            class="form-control admin-orders-list__status-select"
            :value="props.order.status"
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
</template>

<style scoped lang="scss">
.admin-orders-list__item {
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

.admin-orders-list__status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 8px;
  font-family: $font-family, sans-serif;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
}

.admin-orders-list__status-select {
  padding: 6px 10px !important;
  font-size: 13px !important;
  border-radius: 8px !important;
  min-width: 160px;
  border: 1.5px solid #e0e0e0;
}
</style>