<script setup>
import {Dish} from "@/models/Dish.js";

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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="currentColor" stroke-width="2"/>
        <path d="M5 6L6 20C6 20.5523 6.44772 21 7 21H17C17.5523 21 18 20.5523 18 20L19 6" stroke="currentColor" stroke-width="2"/>
        <path d="M10 10V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M14 10V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
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