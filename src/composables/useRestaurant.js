import { ref, computed } from 'vue';
import { db } from '@/firebase-config';
import { collection, query, where, orderBy, doc, getDocs, getDoc, } from 'firebase/firestore';
import { Restaurant } from '@/models/Restaurant';
import { Dish } from '@/models/Dish';

export function useRestaurant() {
  const restaurant = ref(null);
  const allDishes = ref([]);
  const isLoading = ref(false);

  const fetchRestaurantData = async (restaurantId) => {
    isLoading.value = true;

    try {
      // Получаем данные ресторана по ID
      const restaurantDoc = await getDoc(doc(db, 'restaurants', restaurantId));
      
      if (!restaurantDoc.exists()) {
        throw new Error('Restaurant not found');
      }
      restaurant.value = new Restaurant({ id: restaurantDoc.id, ...restaurantDoc.data() });

      // Получаем блюда, принадлежащие этому ресторану
      const dishesQuery = query(
        collection(db, 'dishes'),
        where('restaurant', '==', doc(db, 'restaurants', restaurantId))
      );
      const dishesSnap = await getDocs(dishesQuery);

      if (dishesSnap.empty) {
        console.warn('No dishes found for this restaurant');
        allDishes.value = [];
        return;
      }

      allDishes.value = dishesSnap.docs.map(doc => {
        const data = doc.data();
        return new Dish({ id: doc.id, ...data, restaurant: { id: restaurantId, name: restaurant.value.name } });
      });
    } catch (err) {
      console.error('Error fetching restaurant data:', err);
    } finally {
      isLoading.value = false;
    }
  }

  // Динамическая секция "Популярные блюда" - топ 5 блюд по популярности
  const popularDishes = computed(() => {
    // Чтобы не мутировать исходный массив, создаем его копию и сортируем по популярности, затем берем топ 5
    return [...allDishes.value]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5);
  });

  // Группируем блюда по секциям ресторана
  const menu = computed(() => {
    return allDishes.value.reduce((acc, dish) => {
      const section = dish.section || 'Без категории';
      if (!acc[section]) acc[section] = [];
      acc[section].push(dish);
      return acc;
    }, {})
  })

  return {
    // Variables
    restaurant, // Дескриптор ресторана
    isLoading,
    // Computed
    menu, // Сгруппированный массив блюд по секциям ресторана
    popularDishes, // Топ 5 популярных блюд ресторана
    // Methods
    fetchRestaurantData
  }
}