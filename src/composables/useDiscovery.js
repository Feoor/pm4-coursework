import { ref } from 'vue';
import { db } from '@/firebase-config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Restaurant } from '@/models/Restaurant';
import { Dish } from '@/models/Dish';
import {COLLECTIONS} from "@/constants/collections.js";

export function useDiscovery() {
  const restaurants = ref([]);
  const dishes = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Функция для получения топ-10 ресторанов по популярности
  const fetchRestaurants = async () => {
    try {
      const restQuery = query(
        collection(db, COLLECTIONS.RESTAURANTS),
        orderBy('popularity', 'desc'),
        limit(10)
      );
      const restSnap = await getDocs(restQuery);
      restaurants.value = restSnap.docs.map(doc => (new Restaurant({ id: doc.id, ...doc.data() })));
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching restaurants:', err);
    }
  }

  // Функция для получения топ-10 блюд по популярности
  const fetchDishes = async () => {
    try {
      const dishQuery = query(
        collection(db, COLLECTIONS.DISHES),
        orderBy('popularity', 'desc'),
        limit(10)
      );
      const dishSnap = await getDocs(dishQuery);
      dishes.value = dishSnap.docs.map(doc => {
        const data = doc.data();
        return new Dish({ id: doc.id, restaurantId: data.restaurant?.id || 'unknown', ...data });
      });
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching dishes:', err);
    }
  }

  const fetchDiscoveryData = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      await fetchRestaurants();

      await fetchDishes();
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching discovery data:', err);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    restaurants,
    dishes,
    isLoading,
    error,
    fetchRestaurants,
    fetchDishes,
    fetchDiscoveryData,
  };
}