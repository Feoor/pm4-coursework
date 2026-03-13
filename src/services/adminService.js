import {db} from '@/firebase-config.js';
import {
  addDoc,
  deleteDoc,
  updateDoc,
  collection,
  doc,
  getDocs,
  query,
  or,
  where,
  orderBy,
  limit,
  startAfter, getCountFromServer
} from 'firebase/firestore';
import {Restaurant} from "@/models/Restaurant.js";
import {Dish} from "@/models/Dish.js";
import {User} from "@/models/User.js";

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
        delivery_time: normalizedDeliveryTime, // FIXME: Привести в camelCase(Firestore)
        image: restaurantData.imageUrl,
        popularity: 1, // Инициализируем популярность новым рестораном
        badge_type: restaurantData.badge, // FIXME: Привести в camelCase(Firestore)
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

  async updateUserRole(userId, newRole) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      console.log(`User with ID ${userId} role updated to ${newRole}.`);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  },

  // Methods for getting restaurants, dishes and users can be added here if needed for admin management
  async getRestaurants({ lastVisible = null, batchSize = 10 } = {}) {
    try {
      let restQuery = query(
        collection(db, 'restaurants'),
        orderBy('popularity', 'desc'),
        limit(batchSize),
      );

      if (lastVisible) {
        restQuery = query(restQuery, startAfter(lastVisible));
      }

      const restSnap = await getDocs(restQuery);
      const restaurants = restSnap.docs.map(doc => (new Restaurant({id: doc.id, ...doc.data()})));
      return {
        items: restaurants,
        lastVisible: restSnap.docs.length > 0 ? restSnap.docs[restSnap.docs.length - 1] : null,
      }
    } catch (err) {
      console.error('Error getting restaurants:', err);
    }
  },

  async getRestaurantsCount() {
    try {
      const restSnap = await getCountFromServer(collection(db, 'restaurants'));
      return restSnap.data().count;
    } catch (err) {
      console.error('Error getting restaurants count:', err);
      return 0;
    }
  },

  async getDishes(batchSize = 10) {
    try {
      const dishQuery = query(
        collection(db, 'dishes'),
        orderBy('popularity', 'desc'),
        limit(batchSize),
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

  async getDishesByRestaurant(restaurantId, { lastVisible = null, batchSize = 10 } = {}) {
    try {
      const restaurantRef = doc(db, 'restaurants', restaurantId);
      let dishQuery = query(
        collection(db, 'dishes'),
        where('restaurant', '==', restaurantRef),
        limit(batchSize),
      );

      if (lastVisible) {
        dishQuery = query(dishQuery, startAfter(lastVisible));
      }

      const dishSnap = await getDocs(dishQuery);
      const dishes = dishSnap.docs.map(doc => {
        const data = doc.data();
        return new Dish({id: doc.id, restaurantId: data.restaurant?.id || 'unknown', ...data});
      });
      return {
        items: dishes,
        lastVisible: dishSnap.docs.length > 0 ? dishSnap.docs[dishSnap.docs.length - 1] : null,
      }
    } catch (err) {
      console.error('Error getting dishes for restaurant:', err);
    }
  },

  async getDishesCountByRestaurant(restaurantId) {
    try {
      const restaurantRef = doc(db, 'restaurants', restaurantId);
      const dishQuery = query(
        collection(db, 'dishes'),
        where('restaurant', '==', restaurantRef),
      );
      const dishSnap = await getCountFromServer(dishQuery);
      return dishSnap.data().count;
    } catch (err) {
      console.error('Error getting dishes count for restaurant:', err);
      return 0;
    }
  },

  async getUsers(usersLimit = 10) {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(usersLimit),
      );
      const usersSnap = await getDocs(usersQuery);
      return usersSnap.docs.map(doc => {
        const authData = {
          uid: doc.id,
          email: doc.data()?.email || 'unknown',
        }
        return new User(authData, doc.data());
      });
    } catch (err) {
      console.error('Error getting users:', err);
    }
  },

  async getUserBySearchTerm(searchTerm) {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        or(
          where('email', '==', searchTerm),
          where('displayName', '==', searchTerm)
        )
      );
      const usersSnap = await getDocs(usersQuery);
      return usersSnap.docs.map(doc => {
        const authData = {
          uid: doc.id,
          email: doc.data()?.email || 'unknown',
        }
        return new User(authData, doc.data());
      });
    } catch (err) {
      console.error('Error searching users:', err);
    }
  },
}