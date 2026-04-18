import {db} from "@/firebase-config";
import {
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
  collection,
  query,
  limit,
  startAfter,
  deleteDoc,
  getCountFromServer
} from "firebase/firestore";
import { COLLECTIONS } from "@/constants/collections";

const isFavoriteCollection = (collectionName) => {
  return collectionName === COLLECTIONS.FAVORITE_DISHES || collectionName === COLLECTIONS.FAVORITE_RESTAURANTS;
}

export const favoritesService = {
  async getFavoritesCollection(userId, collectionName, { lastVisible, batchSize = 10 } = {}) {
    if (!userId) return null;
    if (!isFavoriteCollection(collectionName)) {
      console.error(`Invalid collection type: ${collectionName}. Expected ${COLLECTIONS.FAVORITE_DISHES} or ${COLLECTIONS.FAVORITE_RESTAURANTS}.`);
      return;
    }

    const docsCols = collection(
      db,
      `${COLLECTIONS.USERS}/${userId}/${collectionName}`,
    )

    let docsQuery = query(
      docsCols,
      limit(batchSize)
    )

    if (lastVisible) {
      docsQuery = query(docsQuery, startAfter(lastVisible));
    }

    const docsSnap = await getDocs(docsQuery);

    return {
      items: docsSnap.docs,
      lastVisible: docsSnap.docs.length > 0 ? docsSnap.docs[docsSnap.docs.length - 1] : null,
    }
  },

  async getTotalFavoritesCount(userId) {
    if (!userId) return 0;

    const dishesCol = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.FAVORITE_DISHES}`);
    const restaurantsCol = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.FAVORITE_RESTAURANTS}`);

    const [dishesCountSnap, restaurantsCountSnap] = await Promise.all([
      getCountFromServer(dishesCol),
      getCountFromServer(restaurantsCol)
    ]);

    return {
      dishesCount: dishesCountSnap.data().count,
      restaurantsCount: restaurantsCountSnap.data().count,
      totalCount: dishesCountSnap.data().count,
    }
  },

  async addDishToFavorite(userId, dish) {
    if (!userId || !dish) return false;

    const favoriteDoc = {
      dishId: dish.id,
      name: dish.name,
      image: dish.image,
      price: dish.price,
      restaurantName: dish.restaurant.name,
      addedAt: serverTimestamp()
    }

    try {
      await setDoc(doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.FAVORITE_DISHES}`, dish.id), favoriteDoc);
      return {success: true, id: dish.id};
    } catch (error) {
      console.error("Error adding dish to favorite:", error);
      throw error;
    }
  },

  async removeDishFromFavorite(userId, dishId) {
    if (!userId || !dishId ) {
      return false;
    }

    try {
      const docRef = doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.FAVORITE_DISHES}`, dishId);
      await deleteDoc(docRef);
      return {success: true, id: dishId};
    } catch (error) {
      console.error("Error removing dish from favorite:", error);
    }
  },

  async addRestaurantToFavorite(userId, restaurant) {
    if (!userId || !restaurant) return false;

    const favoriteDoc = {
      dishId: restaurant.id,
      name: restaurant.name,
      image: restaurant.image,
      addedAt: serverTimestamp()
    }

    try {
      await setDoc(doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.FAVORITE_RESTAURANTS}`, restaurant.id), favoriteDoc);
      return {success: true, id: restaurant.id};
    } catch (error) {
      console.error("Error adding restaurant to favorite:", error);
      throw error;
    }
  },

  async removeRestaurantFromFavorite(userId, restaurantId) {
    if (!userId || !restaurantId) return false;

    try {
      const docRef = doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.FAVORITE_RESTAURANTS}`, restaurantId);
      await deleteDoc(docRef);
      return {success: true, id: restaurantId};
    } catch (error) {
      console.error("Error removing restaurant from favorite:", error);
    }
  }
}