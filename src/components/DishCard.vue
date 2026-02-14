<script setup>
import { getBadgeClass, formatDeliveryTime, formatPrice } from '@/utils/helpers.js'

const props = defineProps({
  dish: {
    type: Object, // В будующем стоит создать отдельный тип для блюда, так как в объекте блюда может быть много полей, которые не нужны в компоненте DishCard
    required: true
  },
  mode: {
    type: String,
    default: 'preview' // 'preview' - отображение карточки как реклама, 'full' - отображение карточки на странице ресторана
  },
  restaurantId: {
    type: [String, Number], // В будующем стоит оставить только String, так как id ресторана должен быть строкой
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const handleClick = () => {
  if (props.mode === 'full') {
    emit('add-to-cart', props.dish)
  }
}
</script>

<template>
  <div class="dish-card card h-100">
    <!-- Для preview -->
    <router-link v-if="mode === 'preview'" :to="`/restaurant/${dish.restaurantId}`">
      <img :src="dish.image" :alt="dish.name" class="dish-card__image">

      <div class="card-body">
        <span :class="`badge ${getBadgeClass(dish.badge)}`">{{ dish.badge }}</span>
        <h5 class="dish-card__title">{{ dish.name }}</h5>

        <div class="dish-card__info d-flex align-items-center mb-2">
          <span class="me-1 me-xl-2">{{ formatDeliveryTime(dish.deliveryTime) }} •</span>
          <img src="@/assets/icons/purple_star.svg" alt="Purple star">
          <span class="ms-1">{{ dish.rating }}</span>
        </div>

        <h5 class="dish-card__price">{{ formatPrice(dish.price) }}</h5>
      </div>
    </router-link>

    <!-- Для full -->
    <div v-else>
      <img :src="dish.image" :alt="dish.name" class="dish-card__image">

      <div class="card-body">
        <span :class="`badge ${getBadgeClass(dish.badge)}`">{{ dish.badge }}</span>
        <h5 class="dish-card__title">{{ dish.name }}</h5>

        <div class="dish-card__info d-flex align-items-center mb-2">
          <span class="me-1 me-xl-2">{{ dish.deliveryTime }} •</span>
          <img src="@/assets/icons/purple_star.svg" alt="Purple star">
          <span class="ms-1">{{ dish.rating }}</span>
        </div>

        <h5 class="dish-card__price">{{ formatPrice(dish.price) }}</h5>
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

  .card-body {
    padding: 0;

    .dish-card__info {
      font-family: $font-family, sans-serif;
      font-weight: 400;
      font-size: 19px;
      line-height: 133%;
      color: #8e97a6;
    }
  }
}

@media screen and (max-width: 1199.98px) {
  // Планшеты в горизонтальной ориентации, Ipad Pro (>= 1024px)

  .dish-card {
    width: 175px;
    padding: 1rem;

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

    .card-body {
      .dish-card__info {
        font-size: 18px;

        img {
          width: 24px;
          height: 24px;
        }
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