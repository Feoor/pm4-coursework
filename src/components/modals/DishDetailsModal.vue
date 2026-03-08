<script setup>
import { getBadgeClass, getBadgeText } from '@/utils/helpers'
import { formatDeliveryTime, formatPrice, formatCategories } from '@/utils/formatters'
import ModalLayout from "@/components/modals/ModalLayout.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  dish: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'add-to-cart'])

const handleClose = () => {
  emit('close')
}

const handleAddToCart = () => {
  emit('add-to-cart', props.dish)
}
</script>

<template>
  <ModalLayout
    :isOpen="isOpen"
    :title="''"
    :showFooter="false"
    maxWidth="640px"
    @close="handleClose"
  >
    <div v-if="dish" class="dish-details">
      <!-- Изображение блюда -->
      <div class="dish-details__image-wrapper">
        <img :src="dish.imageUrl" :alt="dish.name" class="dish-details__image">
        <!-- Бейдж поверх изображения -->
        <span
          v-if="dish.badge"
          :class="`badge ${getBadgeClass(dish.badge)} dish-details__badge`"
        >
          {{ getBadgeText(dish.badge) }}
        </span>
      </div>

      <!-- Основная информация -->
      <div class="dish-details__content">
        <!-- Заголовок и рейтинг -->
        <div class="dish-details__header">
          <h3 class="dish-details__name">{{ dish.name }}</h3>
          <div class="dish-details__rating">
            <img src="@/assets/icons/purple_star.svg" alt="Star">
            <span>{{ dish.rating }}</span>
          </div>
        </div>

        <!-- Ресторан -->
        <div v-if="dish.restaurant" class="dish-details__restaurant">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21V7L12 3L21 7V21H3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M9 21V13H15V21" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          <span>{{ dish.restaurant.name }}</span>
        </div>

        <!-- Мета-информация (время доставки, категории) -->
        <div class="dish-details__meta">
          <div class="dish-details__meta-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
              <path d="M12 7V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ formatDeliveryTime(dish.deliveryTime) }}</span>
          </div>
          <div v-if="dish.categories && dish.categories.length" class="dish-details__meta-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M4 12H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M4 18H18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>{{ formatCategories(dish.categories) }}</span>
          </div>
        </div>

        <!-- Описание -->
        <div v-if="dish.description" class="dish-details__description">
          <h5>Описание</h5>
          <p>{{ dish.description }}</p>
        </div>

        <!-- Разделитель -->
        <div class="dish-details__divider"></div>

        <!-- Цена и кнопка -->
        <div class="dish-details__footer">
          <div class="dish-details__price">
            <span class="dish-details__price-label">Цена</span>
            <span class="dish-details__price-value">{{ formatPrice(dish.price) }}</span>
          </div>
          <button class="btn btn-primary dish-details__cart-btn" @click="handleAddToCart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            В корзину
          </button>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style scoped lang="scss">
.dish-details {
  &__image-wrapper {
    position: relative;
    width: 100%;
    max-height: 320px;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 24px;
  }

  &__image {
    width: 100%;
    height: 100%;
    max-height: 320px;
    object-fit: cover;
    display: block;
  }

  &__badge {
    position: absolute;
    top: 16px;
    left: 16px;
    font-size: 13px !important;
    padding: 6px 12px !important;
    border-radius: 10px;
  }

  // Контент
  &__content {
    padding: 0 4px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 12px;
  }

  &__name {
    font-family: $font-family, sans-serif;
    font-weight: 800;
    font-size: 28px;
    color: #323142;
    margin: 0;
    line-height: 1.3;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    padding: 6px 14px;
    background: rgba(108, 95, 188, 0.08);
    border-radius: 12px;

    img {
      width: 20px;
      height: 20px;
    }

    span {
      font-family: $font-family, sans-serif;
      font-weight: 700;
      font-size: 18px;
      color: $purple;
    }
  }

  &__restaurant {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    color: #8e97a6;

    svg {
      flex-shrink: 0;
    }

    span {
      font-family: $second-family, sans-serif;
      font-weight: 500;
      font-size: 15px;
    }
  }

  // Мета
  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 20px;
  }

  &__meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: #f9f9f9;
    border-radius: 12px;

    svg {
      flex-shrink: 0;
      color: $purple;
    }

    span {
      font-family: $second-family, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #555;
    }
  }

  // Описание
  &__description {
    margin-bottom: 20px;

    h5 {
      font-family: $font-family, sans-serif;
      font-weight: 700;
      font-size: 18px;
      color: #323142;
      margin-bottom: 8px;
    }

    p {
      font-family: $second-family, sans-serif;
      font-size: 15px;
      line-height: 1.7;
      color: #666;
      margin: 0;
    }
  }

  // Разделитель
  &__divider {
    height: 1px;
    background: #f0f0f0;
    margin-bottom: 20px;
  }

  // Футер
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__price {
    display: flex;
    flex-direction: column;
    gap: 2px;

    &-label {
      font-family: $second-family, sans-serif;
      font-size: 13px;
      color: #8e97a6;
    }

    &-value {
      font-family: $font-family, sans-serif;
      font-weight: 800;
      font-size: 28px;
      color: #323142;
      line-height: 1.2;
    }
  }

  &__cart-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 28px;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 700;

    svg {
      flex-shrink: 0;
    }
  }
}

// Адаптивные стили
@media screen and (max-width: 767.98px) {
  .dish-details {
    &__image-wrapper {
      max-height: 240px;
      border-radius: 16px;
      margin-bottom: 20px;
    }

    &__image {
      max-height: 240px;
    }

    &__name {
      font-size: 24px;
    }

    &__rating {
      padding: 5px 12px;

      img {
        width: 18px;
        height: 18px;
      }

      span {
        font-size: 16px;
      }
    }

    &__meta {
      gap: 10px;
    }

    &__meta-item {
      padding: 6px 12px;

      span {
        font-size: 13px;
      }
    }

    &__description {
      h5 {
        font-size: 16px;
      }

      p {
        font-size: 14px;
      }
    }

    &__price-value {
      font-size: 24px;
    }

    &__cart-btn {
      padding: 12px 22px;
      font-size: 15px;
    }
  }
}

@media screen and (max-width: 566.98px) {
  .dish-details {
    &__image-wrapper {
      max-height: 200px;
      border-radius: 14px;
      margin-bottom: 16px;
    }

    &__image {
      max-height: 200px;
    }

    &__header {
      flex-direction: column;
      gap: 10px;
    }

    &__name {
      font-size: 22px;
    }

    &__rating {
      align-self: flex-start;
    }

    &__footer {
      flex-direction: column;
      align-items: stretch;
      gap: 14px;
    }

    &__price {
      flex-direction: row;
      align-items: baseline;
      gap: 8px;
    }

    &__price-value {
      font-size: 22px;
    }

    &__cart-btn {
      justify-content: center;
      width: 100%;
    }
  }
}
</style>