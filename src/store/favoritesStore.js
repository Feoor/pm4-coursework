import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./authStore";
import { favoritesService } from "../services/favoritesService.js";
import {COLLECTIONS} from "../constants/collections.js";

export const useFavoritesStore = defineStore("favorites", () => {
  // State
  const favoriteDishes = ref([]);
  const favoriteRestaurants = ref([]);

  const authStore = useAuthStore();

  // Init
  const initialState = async () => {
    try {
      const userId = authStore.profile?.id;

      if (userId) {
        // Авторизован → пробуем загрузить из Firestore
        const dishesResult = await favoritesService.getFavoritesCollection(userId, COLLECTIONS.FAVORITE_DISHES);
        const restaurantsResult = await favoritesService.getFavoritesCollection(userId, COLLECTIONS.FAVORITE_RESTAURANTS);

        if (dishesResult && dishesResult.items.length > 0) {
          favoriteDishes.value = dishesResult.items;
        }
        if (restaurantsResult && restaurantsResult.items.length > 0) {
          favoriteRestaurants.value = restaurantsResult.items;
        }
      }
    } catch (error) {
      console.error("Error initializing favorites store:", error);
    }
  }

  // Actions
  const toggleDishFavorite = async (dish) => {
    if (!authStore.isAuthenticated()) {
      console.error("User must be authenticated to toggle favorite dishes.");
      return;
    }

    const isFav = favoriteDishes.value.some(fav => fav.id === dish.id);

    if (isFav) {
      await favoritesService.removeDishFromFavorite(authStore.profile.id, dish.id);
      favoriteDishes.value = favoriteDishes.value.filter(fav => fav.id !== dish.id);
      return {status: 200, action: 'removed'}
    } else {
      await favoritesService.addDishToFavorite(authStore.profile.id, dish);
      favoriteDishes.value.push(dish);
      return {status: 200, action: 'added'}
    }
  }

  const toggleRestaurantFavorite = async (restaurant) => {
    if (!authStore.isAuthenticated()) {
      console.error("User must be authenticated to toggle favorite dishes.");
      return;
    }

    const isFav = favoriteRestaurants.value.some(fav => fav.id === restaurant.id);

    if (isFav) {
      await favoritesService.removeRestaurantFromFavorite(authStore.profile.id, restaurant.id);
      favoriteRestaurants.value = favoriteRestaurants.value.filter(fav => fav.id !== restaurant.id);
      return {status: 200, action: 'removed'}
    } else {
      await favoritesService.addRestaurantToFavorite(authStore.profile.id, restaurant);
      favoriteRestaurants.value.push(restaurant);
      return {status: 200, action: 'added'}
    }
  }

  const dishInFavorite = (dishId) => {
    return favoriteDishes.value.some(fav => fav.id === dishId);
  }

  const restaurantInFavorite = (restaurantId) => {
    return favoriteRestaurants.value.some(fav => fav.id === restaurantId);
  }

  //  Return
  return {
    // Init
    initialState,

    // State
    favoriteDishes,
    favoriteRestaurants,

    // Actions
    toggleDishFavorite,
    toggleRestaurantFavorite,
    dishInFavorite,
    restaurantInFavorite,
  };
});

