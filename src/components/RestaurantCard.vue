<script setup>
import { getBadgeClass, getBadgeText } from '@/utils/helpers.js'
import { Restaurant } from '@/models/Restaurant.js'

defineProps({
  restaurant: {
    type: Restaurant,
    required: true
  }
})
</script>

<template>
  <div class="restaurant-card card h-100">

    <router-link :to="`/restaurant/${restaurant.id}`">
      <img :src="restaurant.imageUrl" :alt="restaurant.name" class="card-img-top">

      <div class="card-body">
        <span :class="`badge ${getBadgeClass(restaurant.badge)} mb-1`">{{ getBadgeText(restaurant.badge) }}</span>
        <h5 class="card-title mb-2">{{ restaurant.name }}</h5>

        <div class="restaurant-card__info d-flex align-items-center">
          <span class="me-1 me-xl-2">{{ restaurant.formattedDeliveryTime }} •</span>
          <img src="@/assets/icons/purple_star.svg" alt="Purple star">
          <span class="ms-1">{{ restaurant.rating }}</span>
        </div>
      </div>
    </router-link>

  </div>
</template>

<style lang="scss" scoped>
.restaurant-card {
  flex: 0 0 auto;
  scroll-snap-align: start;
  width: 396px;
  border: 2px solid #f4f4f4 !important;
  transition: transform .3s ease;
  position: relative;

  &:hover {
    transform: translateY(-10px);
  }

  .restaurant-card__info {
    font-family: $font-family, sans-serif;
    font-weight: 400;
    font-size: 19px;
    line-height: 133%;
    color: #8e97a6;
  }
}

@media screen and (max-width: 1199.98px) {
  // Планшеты в горизонтальной ориентации, Ipad Pro (>= 1024px)

  .restaurant-card {
    .restaurant-card__info {
      font-size: 18px;

      img {
        width: 24px;
        height: 24px;
      }
    }
  }
}

@media screen and (max-width: 991.98px) {
  // Планшеты в вертикальной ориентации (>= 768px)

  .restaurant-card {
    width: 350px;
  }
}

@media screen and (max-width: 767.98px) {
  // Телефоны в горизонтальной ориентации (>= 576px)

  .restaurant-card {
    width: 300px;
  }
}

@media screen and (max-width: 566.98px) {
  // Телефоны в вертикальной ориентации (< 567px)

  .restaurant-card {
    width: 250px;

    .restaurant-card__info {
      font-size: 16px;
    }
  }
}
</style>