import { ref } from 'vue';
import { db } from '@/firebase-config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Restaurant } from '@/models/Restaurant';
import { Dish } from '@/models/Dish';

export function useDiscovery() {
  const restaurants = ref([]);
  const dishes = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchDiscoveryData = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Получаем топ 10 ресторанов по популярности из Firestore
      const restQuery = query(
        collection(db, 'restaurants'), 
        orderBy('popularity', 'desc'), 
        limit(10)
      );
      const restSnap = await getDocs(restQuery);
      restaurants.value = restSnap.docs.map(doc => (new Restaurant({ id: doc.id, ...doc.data() })));

      // Получаем топ 10 блюд по популярности из Firestore
      const dishQuery = query(
        collection(db, 'dishes'), 
        orderBy('popularity', 'desc'), 
        limit(10)
      );
      const dishSnap = await getDocs(dishQuery);
      dishes.value = dishSnap.docs.map(doc => {
        const data = doc.data();
        const dish = new Dish({ id: doc.id, restaurantId: data.restaurant?.id || 'unknown', ...data });
        return dish;
      });
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
    fetchDiscoveryData
  };
}