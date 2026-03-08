<script setup>
import { getBadgeClass, getBadgeText } from '@/utils/helpers'
import { formatDeliveryTime, formatPrice } from '@/utils/formatters'
import { Dish } from '@/models/Dish.js'

const props = defineProps({
  dish: {
    type: Dish,
  },
  mode: {
    type: String,
    default: 'preview' // 'preview' - отображение карточки как реклама, 'full' - отображение карточки на странице ресторана
  }
})

const emit = defineEmits(['add-to-cart', 'add-to-favorites', 'show-details'])

const handleAddToCart = () => {
  emit('add-to-cart', props.dish)
}

const handleFavoriteClick = () => {
  emit('add-to-favorites', props.dish)
}

const handleShowDetails = () => {
  emit('show-details', props.dish)
}
</script>

<template>
  <div class="dish-card card h-100">
    <!-- Для preview -->
    <router-link v-if="mode === 'preview'" :to="`/restaurant/${dish.restaurant.id}`">
      <img :src="dish.imageUrl" :alt="dish.name" class="dish-card__image">

      <div class="card-body">
        <span :class="`badge ${getBadgeClass(dish.badge)}`">{{ getBadgeText(dish.badge) }}</span>
        <h5 class="dish-card__title card-title mt-0">{{ dish.name }}</h5>

        <div class="dish-card__info d-flex align-items-center mb-2">
          <span class="me-1 me-xl-2">{{ formatDeliveryTime(dish.deliveryTime) }} •</span>
          <img src="@/assets/icons/purple_star.svg" alt="Purple star">
          <span class="ms-1">{{ dish.rating }}</span>
        </div>

        <h5 class="dish-card__price">{{ formatPrice(dish.price) }}</h5>
      </div>
    </router-link>

    <!-- Для full -->
    <div v-else @click="handleShowDetails">
      <button class="dish-card__favorite-btn" @click.stop="handleFavoriteClick"></button>

      <img :src="dish.imageUrl" :alt="dish.name" class="dish-card__image card-img-top rounded-circle">

      <div class="card-body">
        <span :class="`badge ${getBadgeClass(dish.badge)}`">{{ getBadgeText(dish.badge) }}</span>
        <h5 class="dish-card__title card-title mt-0">{{ dish.name }}</h5>

        <div class="dish-card__info d-flex align-items-center mb-2">
          <span class="me-2">{{ formatDeliveryTime(dish.deliveryTime) }} •</span>
          <img src="@/assets/icons/purple_star.svg" alt="Purple star">
          <span class="ms-1">{{ dish.rating }}</span>
        </div>
        <h5 class="dish-card__price menu-section__dish-price">{{ formatPrice(dish.price) }}</h5>

        <!-- Кнопка "Добавить в корзину" -->
        <button class="dish-card__cart-btn add-to-cart" @click.stop="handleAddToCart"></button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dish-card {
  flex: 0 0 auto;
  scroll-snap-align: start;
  width: 225px;
  padding: 37px 20px 26px;
  border: 2px solid #f4f4f4 !important;
  border-radius: 30px;
  position: relative;
  cursor: pointer;
  transition: transform .3s ease;

  &:hover {
    transform: translateY(-10px);
  }

  .card-img-top {
    border-radius: 30px 30px 0 0;
  }

  /* Добавить блюдо в любимое */
  .dish-card__favorite-btn {
    position: absolute;
    top: 14px;
    right: 12px;
    border: none;
    border-radius: 50%;
    background: transparent;
    width: 40px;
    height: 40px;
    transition: background-color .2s;

    &::after {
      display: inline-block;
      content: "";
      max-width: 22px;
      max-height: 19px;
      background: url("@/assets/icons/heart.svg") no-repeat;
      background-size: contain;
      position: absolute;
      margin: auto;
      top: 0; left: 0; bottom: 0; right: 0;
    }
    &:hover {
      background-color: #f7c5ba;
    }
  }

  .card-body {
    padding: 0;

    .dish-card__info {
      font-family: $font-family, sans-serif;
      font-weight: 400;
      font-size: 19px;
      line-height: 133%;
      color: #8e97a6;
    }

    /* Добавить блюдо в корзину */
    .dish-card__cart-btn {
      position: absolute;
      bottom: 26px;
      right: 24px;
      border: none;
      border-radius: 9px;
      background-color: #323142;
      width: 44px;
      height: 40px;
      transition: background-color .2s;

      &::after {
        display: inline-block;
        content: "";
        width: 24px;
        height: 24px;
        background: url("@/assets/icons/plus.svg") no-repeat;
        background-size: contain;
        position: absolute;
        margin: auto;
        top: 0; left: 0; bottom: 0; right: 0;
      }
      &:hover {
        background-color: $purple;
      }
    }
  }
}

@media screen and (max-width: 1199.98px) {
  // Планшеты в горизонтальной ориентации, Ipad Pro (>= 1024px)

  .dish-card {
    width: 175px;
    padding: 1rem;

    .dish-card__favorite-btn {
      top: 8px;
      right: 8px;
    }

    h5 {
      font-size: 22px;
    }

    .card-body {
      .dish-card__info {
        font-size: 16px;

        img {
          width: 23px;
          height: 23px;
        }
      }

      .add-to-cart {
        width: 40px;
        height: 36px;
        right: 16px;
        bottom: 20px;
      }
    }
  }
}

@media screen and (max-width: 991.98px) {
  // Планшеты в вертикальной ориентации (>= 768px)

  .dish-card {
    width: 200px;
    padding: 1rem;

    h5 {
      font-size: 24px;
    }

    .dish-card__favorite-btn {
      top: 12px;
      width: 35px;
      height: 35px;

      &::after {
        width: 23px;
        height: 19px;
      }
    }

    .card-body {
      .dish-card__info {
        font-size: 18px;

        img {
          width: 24px;
          height: 24px;
        }
      }

      .dish-card__cart-btn {
        width: 40px;
        height: 36px;
      }
    }
  }
}

@media screen and (max-width: 767.98px) {
  // Телефоны в горизонтальной ориентации (>= 576px)

  .dish-card {
    width: 175px;
    padding: 1rem;

    h5 {
      font-size: 20px;
    }

    .card-body {
      .dish-card__info {
        font-size: 16px;

        img {
          width: 22px;
          height: 22px;
        }
      }
    }
  }
}

@media screen and (max-width: 566.98px) {
  // Телефоны в вертикальной ориентации (< 567px)
  
  .dish-card {
    h5 {
      font-size: 20px;
    }

    .card-body {
      .dish-card__info {
        font-size: 16px;
      }
    }
  }
}
</style>