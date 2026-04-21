<script setup>
import {onMounted, ref} from 'vue'
import { Heart, Utensils, Store } from '@lucide/vue'
import { useFavoritesStore } from "../../store/favoritesStore.js";
import DishCard from "../DishCard.vue";
import RestaurantCard from "../RestaurantCard.vue";

// Управление активной подвкладкой ('dishes' или 'restaurants')
const activeSubTab = ref('dishes')

// User favorites
const favoritesStore = useFavoritesStore()

onMounted(() => {
  favoritesStore.initialState();
})
</script>

<template>
  <div class="flex flex-col space-y-6 w-full">

    <!-- Навигация: Блюда / Рестораны -->
    <div class="flex items-center gap-3 border-b border-gray-100 pb-4">
      <button
        @click="activeSubTab = 'dishes'"
        class="flex items-center gap-2 px-5 py-2.5 rounded-4 text-sm font-semibold transition-all duration-200"
        :class="activeSubTab === 'dishes' ? 'bg-(--primary)/15 text-(--primary)' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
      >
        <Utensils size="18" />
        Блюда
      </button>

      <button
        @click="activeSubTab = 'restaurants'"
        class="flex items-center gap-2 px-5 py-2.5 rounded-4 text-sm font-semibold transition-all duration-200"
        :class="activeSubTab === 'restaurants' ? 'bg-(--primary)/15 text-(--primary)' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
      >
        <Store size="18" />
        Рестораны
      </button>
    </div>

    <!-- Область контента -->
    <div class="pt-2">
      <!-- СЕКЦИЯ: БЛЮДА -->
      <div v-show="activeSubTab === 'dishes'">

        <div v-if="favoritesStore.favoriteDishes.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <DishCard v-for="dish in favoritesStore.favoriteDishes" :key="dish.id" :dish="dish" mode="favorite" />
        </div>

        <!-- Пустое состояние для блюд -->
        <div v-else class="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 rounded-3xl">
          <Heart size="48" class="text-gray-300 mb-4" />
          <h4 class="text-xl font-bold text-gray-800 mb-2">Нет избранных блюд</h4>
          <p class="text-gray-500 mb-6">Вы еще не добавили ни одного блюда в избранное.</p>
          <router-link to="/menu" class="px-6 py-3 bg-(--primary) text-white rounded-4 font-medium hover:bg-(--primary-hover) transition-colors">
            Перейти к меню
          </router-link>
        </div>
      </div>

      <!-- СЕКЦИЯ: РЕСТОРАНЫ -->
      <div v-show="activeSubTab === 'restaurants'">

        <div v-if="favoritesStore.favoriteRestaurants.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RestaurantCard v-for="restaurant in favoritesStore.favoriteRestaurants" :key="restaurant.id" :restaurant="restaurant" mode="favorite" />
        </div>

        <!-- Пустое состояние для ресторанов -->
        <div v-else class="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 rounded-3xl">
          <Store size="48" class="text-gray-300 mb-4" />
          <h4 class="text-xl font-bold text-gray-800 mb-2">Нет избранных ресторанов</h4>
          <p class="text-gray-500 mb-6">Добавляйте рестораны, чтобы не потерять их.</p>
          <router-link to="/restaurants" class="px-6 py-3 bg-(--primary) text-white rounded-4 font-medium hover:bg-(--primary-hover) transition-colors">
            Найти рестораны
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">

</style>