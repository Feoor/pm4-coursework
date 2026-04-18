<script setup>
import {Dish} from "@/models/Dish.js";

// Icons
import { Trash2 } from '@lucide/vue';

const props = defineProps({
  dish: {
    type: Dish,
    required: true
  }
})

const emit = defineEmits(['delete-dish']);

const handleDeleteDish = (dishId) => {
  emit('delete-dish', dishId);
}
</script>

<template>
  <div class="admin-dishes-list__item">
    <div class="admin-dishes-list__item-image">
      <img :src="props.dish.imageUrl" :alt="props.dish.name">
    </div>
    <div class="admin-dishes-list__item-info">
      <div class="admin-dishes-list__item-name">{{ props.dish.name }}</div>
      <div class="admin-dishes-list__item-meta">
        <span class="admin-dishes-list__item-section">{{ props.dish.section }}</span>
        <span class="admin-dishes-list__item-price">{{ props.dish.formattedPrice }}</span>
      </div>
    </div>

    <!-- Иконка корзины для удаления -->
    <button class="admin-list__item-delete" @click="handleDeleteDish(props.dish.id)" title="Удалить">
      <Trash2 size="20" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.admin-list__item {
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

.admin-dishes-list__item {
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
    width: 72px;
    height: 56px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
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
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-meta {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &-section {
    font-family: $second-family, sans-serif;
    font-size: 13px;
    color: #8e97a6;
    background: rgba(108, 95, 188, 0.08);
    padding: 2px 8px;
    border-radius: 6px;
  }

  &-price {
    font-family: $font-family, sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: $purple;
  }

  &-popular {
    font-size: 16px;
  }
}

@media screen and (max-width: 767.98px) {
  .admin-dishes-list__item {
    padding: 12px;
    gap: 12px;

    &-image {
      width: 56px;
      height: 44px;
    }
  }
}
</style>