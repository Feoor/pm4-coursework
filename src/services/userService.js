import { db } from "@/firebase-config";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "@/models/User";
import { COLLECTIONS } from "@/constants/collections";


export const userService = {
  /**
   * Создает профиль пользователя в Firestore
   * @param {Object} firebaseUser - Объект пользователя из Firebase Auth
   * @param {Object} additionalData - Дополнительные данные (имя, и т.д.)
   * @returns {Promise<User>} Созданный профиль пользователя
   */
  async createUserProfile(firebaseUser, additionalData) {
    const userDoc = {
      email: firebaseUser.email || null,
      displayName: additionalData.displayName || firebaseUser.displayName || "Пользователь",
      createdAt: serverTimestamp(),
      photoURL: additionalData.photoURL || firebaseUser.photoURL || 'src/assets/img/defaultProfileImage.jpg', // Используем Gravatar по умолчанию, если нет изображения
      phoneNumber: firebaseUser.phoneNumber || additionalData.phoneNumber || null,
      role: 'user', // По умолчанию роль "user"
    };

    const docRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
    await setDoc(docRef, userDoc);

    return new User(firebaseUser, userDoc);
  },

  /**
   *
   * @param {String} userId
   * @param {Object} updatedData - Объект с обновленными данными профиля
   */
  async updateUserProfile(userId, updatedData) {
    if (!userId) {
      throw new Error('userId is required for updateUserProfile');
    }
    if (!updatedData || Object.keys(updatedData).length === 0) {
      throw new Error('updatedData is required and cannot be empty');
    }

    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(docRef, updatedData, {merge: true});
  },

  /**
   * Получает профиль пользователя из Firestore
   * @param {Object} firebaseUser - Объект пользователя из Firebase Auth
   * @returns {Promise<User>} Профиль пользователя
   */
  async getUserProfile(firebaseUser) {
    const docRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return new User(firebaseUser, docSnap.data());
    }

    // Если профиль не существует, создаем его
    return this.createUserProfile(firebaseUser, {
      displayName: firebaseUser.displayName || "Пользователь"
    });
  },
}