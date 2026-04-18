<script setup>
import {Restaurant} from "@/models/Restaurant.js";

// Icons
import { Trash2 } from '@lucide/vue';

const props = defineProps({
  rest: {
    type: Restaurant,
    required: true
  },
});

const emit = defineEmits(['delete-restaurant']);

const handleDeleteRestaurant = (id) => {
  emit('delete-restaurant', id);
};
</script>

<template>
  <div class="admin-list__item">
    <div class="admin-list__item-image">
      <img :src="props.rest.image" :alt="props.rest.name">
    </div>
    <div class="admin-list__item-info">
      <div class="admin-list__item-name">{{ props.rest.name }}</div>
      <div class="admin-list__item-meta">
        <span v-if="props.rest.badge" :class="`badge ${props.rest.badgeClass}`">{{ props.rest.badgeText }}</span>
        <span class="admin-list__item-rating">⭐ {{ props.rest.rating }}</span>
        <span class="admin-list__item-delivery">{{ props.rest.formattedDeliveryTime }}</span>
      </div>
    </div>
    <button class="admin-list__item-delete" @click="handleDeleteRestaurant(props.rest.id)" title="Удалить">
      <!-- Иконка корзины для удаления -->
      <Trash2 class="admin-list__item-delete-icon" size="20" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.admin-list__item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px;
  background: #f9f9f9;
  border-radius: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: #f4f2ff;
  }

  &-image {
    width: 64px;
    height: 50px;
    border-radius: 10px;
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
    font-size: 16px;
    color: #323142;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
  }

  &-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: $second-family, sans-serif;
    font-size: 13px;
    color: #8e97a6;
  }

  &-rating,
  &-delivery {
    white-space: nowrap;
  }

  &-delete {
    width: 40px;
    height: 40px;
    min-width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(229, 73, 43, 0.08);
    border: none;
    border-radius: 10px;
    color: #e5492b;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(229, 73, 43, 0.15);
      transform: scale(1.05);
    }
  }
}

@media screen and (max-width: 767.98px) {
  .admin-list__item {
    padding: 12px;
    gap: 12px;

    &-image {
      width: 52px;
      height: 40px;
    }

    &-name {
      font-size: 15px;
    }

    &-delete {
      width: 36px;
      height: 36px;
      min-width: 36px;
    }
  }
}
</style>