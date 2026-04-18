<script setup>
import { computed } from 'vue'
import { getBadgeClass, getBadgeText } from '@/utils/helpers'
import { Dish } from '@/models/Dish.js'
import { useFavoritesStore } from "../store/favoritesStore.js";

// Icons
import { Star, Plus, Heart } from '@lucide/vue';

const props = defineProps({
  dish: {
    type: Dish,
    required: true,
  },
  mode: {
    type: String,
    default: 'preview' // 'preview' - отображение карточки как реклама, 'full' - отображение карточки на странице ресторана
  }
})

const favoriteStore = useFavoritesStore();

const isFavorite = computed(() => favoriteStore.dishInFavorite(props.dish.id));

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
      <img :src="dish.imageUrl" :alt="dish.name" class="dish-card__image card-img-top rounded-circle">

      <div class="card-body">
        <span :class="`badge ${getBadgeClass(dish.badge)}`">{{ getBadgeText(dish.badge) }}</span>
        <h5 class="dish-card__title card-title mt-0">{{ dish.name }}</h5>

        <div class="dish-card__info d-flex align-items-center mb-2">
          <span class="me-1 me-xl-2">{{ dish.formattedDeliveryTime }} •</span>
          <Star size="24" fill="#6c5fbc" strokeWidth="0" />
          <span class="ms-1">{{ dish.rating }}</span>
        </div>

        <h5 class="dish-card__price">{{ dish.formattedPrice }}</h5>
      </div>
    </router-link>

    <!-- Для full -->
    <div v-else @click="handleShowDetails">
      <button class="absolute top-3 right-3 p-1.5 transition-colors hover:bg-gray-400/25" style="border-radius: 50%" @click.stop="handleFavoriteClick">
        <Heart class="text-red-500" :fill="isFavorite ? 'currentColor' : 'none'" />
      </button>

      <img :src="dish.imageUrl" :alt="dish.name" class="dish-card__image card-img-top rounded-circle">

      <div class="card-body">
        <span :class="`badge ${getBadgeClass(dish.badge)}`">{{ getBadgeText(dish.badge) }}</span>
        <h5 class="dish-card__title card-title mt-0">{{ dish.name }}</h5>

        <div class="dish-card__info d-flex align-items-center mb-2">
          <span class="me-2">{{ dish.formattedDeliveryTime }} •</span>
          <Star size="24" fill="#6c5fbc" strokeWidth="0" />
          <span class="ms-1">{{ dish.rating }}</span>
        </div>
        <h5 class="dish-card__price menu-section__dish-price">{{ dish.formattedPrice }}</h5>

        <!-- Кнопка "Добавить в корзину" -->
        <button class="absolute bg-(--main-black) bottom-5 right-5 rounded-3 p-1.5 transition-colors hover:bg-(--primary)" @click.stop="handleAddToCart">
          <Plus class="text-white" size="28" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dish-card {
  flex: 0 0 auto;
  scroll-snap-align: start;
  width: 225px;
  padding: 37px 20px 20px;
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