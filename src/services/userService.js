import { db } from "@/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "@/models/User";

// Константы
const COLLECTIONS = {
  USERS: "users"
};

/**
 * Создает профиль пользователя в Firestore
 * @param {Object} firebaseUser - Объект пользователя из Firebase Auth
 * @param {Object} additionalData - Дополнительные данные (имя, и т.д.)
 * @returns {Promise<User>} Созданный профиль пользователя
 */
export const createUserProfile = async (firebaseUser, additionalData) => {
  const userDoc = {
    displayName: additionalData.name || firebaseUser.displayName || "Пользователь",
    createdAt: new Date().toISOString(),
    // Будущие другие поля
  };

  const docRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
  await setDoc(docRef, userDoc);

  return new User(firebaseUser, userDoc);
};

/**
 * Получает профиль пользователя из Firestore
 * @param {Object} firebaseUser - Объект пользователя из Firebase Auth
 * @returns {Promise<User>} Профиль пользователя
 */
export const getUserProfile = async (firebaseUser) => {
  const docRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return new User(firebaseUser, docSnap.data());
  }
  
  // Если профиль не существует, создаем его
  return createUserProfile(firebaseUser, {
    name: firebaseUser.displayName || "Пользователь"
  });
};
