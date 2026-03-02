import {db} from '@/firebase-config.js';
import {addDoc, deleteDoc, collection, doc, getDocs, query, where, orderBy, limit} from 'firebase/firestore';
import {Restaurant} from "@/models/Restaurant.js";
import {Dish} from "@/models/Dish.js";

const normalizeCategories = (str) => {
  return str.split(',').map(cat => cat.trim()).filter(cat => cat.length > 0);
}

const normalizeDeliveryTime = (minutes) => {
  return minutes * 60; // конвертируем минуты в секунды
}

export const adminService = {
  async addRestaurant(restaurantData) {
    try {
      const normalizedCategories = normalizeCategories(restaurantData.categories);
      const normalizedDeliveryTime = normalizeDeliveryTime(restaurantData.deliveryTime);

      const restaurantDataToSave = {
        // Строго указываем поля, которые хотим сохранить в Firestore
        name: restaurantData.name,
        categories: normalizedCategories,
        delivery_time: normalizedDeliveryTime,
        image: restaurantData.imageUrl,
        popularity: 1, // Инициализируем популярность новым рестораном
        badge_type: restaurantData.badge,
        rating: restaurantData.rating,
      }

      const restaurantRef = await addDoc(
        collection(db, 'restaurants'),
        restaurantDataToSave
      );
      console.log('Restaurant added with ID:', restaurantRef.id);
      return new Restaurant({ id: restaurantRef.id, ...restaurantDataToSave });
    } catch (error) {
      console.error('Error adding restaurant:', error);
    }
  },

  async deleteRestaurant(restaurantId) {
    try {
      // Delete all dishes associated with the restaurant
      const restaurantRef = doc(db, 'restaurants', restaurantId);
      const dishesQuery = query(
        collection(db, 'dishes'),
        where('restaurant', '==', restaurantRef)
      )
      const dishesSnapshot = await getDocs(dishesQuery);
      const deleteDishPromises = dishesSnapshot.docs.map((dishDoc) => {
        return deleteDoc(doc(db, 'dishes', dishDoc.id));
      });
      await Promise.all(deleteDishPromises);

      // Delete restaurant document
      await deleteDoc(restaurantRef);
      console.log(`Restaurant with ID ${restaurantId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  },

  async addDish(dishData) {
    try {
      const normalizedCategories = normalizeCategories(dishData.categories);
      const normalizedDeliveryTime = normalizeDeliveryTime(dishData.deliveryTime);

      const dishDataToSave = {
        // Строго указываем поля, которые хотим сохранить в Firestore
        name: dishData.name,
        categories: normalizedCategories,
        delivery_time: normalizedDeliveryTime,
        image: dishData.imageUrl,
        price: dishData.price,
        rating: dishData.rating,
        badge_type: dishData.badge,
        section: dishData.section,
        restaurant: doc(db, 'restaurants', dishData.restaurantId), // Ссылка на ресторан
        popularity: 1, // Инициализируем популярность новым блюдом
      }

      const dishRef = await addDoc(
        collection(db, 'dishes'),
        dishDataToSave
      );
      console.log('Dish added with ID:', dishRef.id);
      return new Dish({ id: dishRef.id, ...dishDataToSave });
    } catch (error) {
      console.error('Error adding dish:', error);
    }
  },

  async deleteDish(dishId) {
    try {
      const dishRef = doc(db, 'dishes', dishId);

      await deleteDoc(dishRef);
      console.log(`Dish with ID ${dishId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  },

  // Methods for getting restaurants and dishes can be added here if needed for admin management
  async getRestaurants(restaurantsLimit = 10) {
    try {
      const restQuery = query(
        collection(db, 'restaurants'),
        orderBy('popularity', 'desc'),
        limit(restaurantsLimit),
      );
      const restSnap = await getDocs(restQuery);
      return restSnap.docs.map(doc => (new Restaurant({id: doc.id, ...doc.data()})));
    } catch (err) {
      console.error('Error getting restaurants:', err);
    }
  },

  async getDishes(dishesLimit = 10) {
    try {
      const dishQuery = query(
        collection(db, 'dishes'),
        orderBy('popularity', 'desc'),
        limit(dishesLimit),
      );
      const dishSnap = await getDocs(dishQuery);
      return dishSnap.docs.map(doc => {
        const data = doc.data();
        return new Dish({id: doc.id, restaurantId: data.restaurant?.id || 'unknown', ...data});
      });
    } catch (err) {
      console.error('Error getting dishes:', err);
    }
  },

  async getDishesByRestaurant(restaurantId) {
    try {
      const restaurantRef = doc(db, 'restaurants', restaurantId);
      const dishQuery = query(
        collection(db, 'dishes'),
        where('restaurant', '==', restaurantRef)
      );
      const dishSnap = await getDocs(dishQuery);
      return dishSnap.docs.map(doc => {
        const data = doc.data();
        return new Dish({id: doc.id, restaurantId: data.restaurant?.id || 'unknown', ...data});
      });
    } catch (err) {
      console.error('Error getting dishes for restaurant:', err);
    }
  }
}