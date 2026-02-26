import { db } from "@/firebase-config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "@/models/User";
import { COLLECTIONS } from "@/constants/collections";

/**
 * Создает профиль пользователя в Firestore
 * @param {Object} firebaseUser - Объект пользователя из Firebase Auth
 * @param {Object} additionalData - Дополнительные данные (имя, и т.д.)
 * @returns {Promise<User>} Созданный профиль пользователя
 */
export const createUserProfile = async (firebaseUser, additionalData) => {
  const userDoc = {
    displayName: additionalData.displayName || firebaseUser.displayName || "Пользователь",
    createdAt: serverTimestamp(),
    photoURL: additionalData.photoURL || firebaseUser.photoURL || 'src/assets/img/defaultProfileImage.jpg', // Используем Gravatar по умолчанию, если нет изображения
    phoneNumber: firebaseUser.phoneNumber || additionalData.phoneNumber || null
    // Будущие другие поля
  };

  const docRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
  await setDoc(docRef, userDoc);

  return new User(firebaseUser, userDoc);
};

/**
 * 
 * @param {String} userId 
 * @param {Object} updatedData - Объект с обновленными данными профиля
 */
export const updateUserProfile = async (userId, updatedData) => {
  if (!userId) {
    throw new Error('userId is required for updateUserProfile');
  }
  if (!updatedData || Object.keys(updatedData).length === 0) {
    throw new Error('updatedData is required and cannot be empty');
  }
  
  const docRef = doc(db, COLLECTIONS.USERS, userId);
  await setDoc(docRef, updatedData, { merge: true });
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
    displayName: firebaseUser.displayName || "Пользователь"
  });
};
