import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./authStore";
import { favoritesService } from "../services/favoritesService.js";
import {COLLECTIONS} from "../constants/collections.js";
import {Dish} from "../models/Dish.js";
import {Restaurant} from "../models/Restaurant.js";

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
        const dishesSnap = (await favoritesService.getFavoritesCollection(userId, COLLECTIONS.FAVORITE_DISHES)).snap;
        const dishes = [];
        dishesSnap.forEach((doc) => {
          dishes.push(new Dish({id: doc.id, ...doc.data()}));
        })

        const restaurantsSnap = (await favoritesService.getFavoritesCollection(userId, COLLECTIONS.FAVORITE_RESTAURANTS)).snap;
        const restaurants = [];
        restaurantsSnap.forEach((doc) => {
          restaurants.push(new Restaurant({id: doc.id, ...doc.data()}));
        })

        if (dishes && dishes.length > 0) {
          favoriteDishes.value = dishes;
        }
        if (restaurants && restaurants.length > 0) {
          favoriteRestaurants.value = restaurants;
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

