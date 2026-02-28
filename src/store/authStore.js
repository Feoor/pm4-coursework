import {defineStore} from "pinia";
import {ref, watch} from "vue";
import {auth} from "@/firebase-config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { userService } from "@/services/userService";
import { orderService } from "@/services/orderService";

export const useAuthStore = defineStore("auth", () => {
  // State
  const profile = ref(null);
  const isAuthInitialized = ref(false);
  const isLoading = ref(false);
  const error = ref(null);

  // Инициализация слушателя аутентификации
  const initAuthListener = () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          profile.value = await userService.getUserProfile(firebaseUser);
        } else {
          profile.value = null;
        }
      } catch (err) {
        console.error("Ошибка при получении профиля:", err);
        error.value = err;
      } finally {
        isAuthInitialized.value = true;
      }
    });
  };

  // Вызываем инициализацию
  initAuthListener();

  // Actions
  const waitForInitialization = async () => {
    if (!isAuthInitialized.value) {

      return new Promise((resolve) => {
        const unwatch = watch(() => isAuthInitialized.value, (isInitialized) => {
          if (isInitialized) {
            unwatch();
            resolve();
          }
        });
      });
    }
  };

  const signUp = async (email, password, additionalData) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      profile.value = await userService.createUserProfile(userCredential.user, additionalData);
    } catch (err) {
      console.error("Ошибка при регистрации:", err);
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const signIn = async (email, password) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      profile.value = await userService.getUserProfile(userCredential.user);
    } catch (err) {
      console.error("Ошибка при входе:", err);
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const signInWithGoogle = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      profile.value = await userService.getUserProfile(userCredential.user);
    } catch (err) {
      console.error("Ошибка при входе через Google:", err);
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      await signOut(auth);
      profile.value = null;
    } catch (err) {
      console.error("Ошибка при выходе:", err);
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Getters
  const isAuthenticated = () => !!profile.value;

  const getUserOrderById = async (orderId) => {
    if (!profile.value) {
      throw new Error("User is not authenticated");
    }
    
    try {
      return await orderService.getOrderById(profile.value.id, orderId);
    } catch (err) {
      console.error(`Ошибка при получении заказа с ID ${orderId}:`, err);
      throw err;
    }
  };

  const getUserOrders = async (sortByUnpaid = false) => {
    if (!profile.value) {
      throw new Error("User is not authenticated");
    }
    
    try {
      return await orderService.getAllOrdersForUser(profile.value.id, sortByUnpaid);
    } catch (err) {
      console.error("Ошибка при получении заказов пользователя:", err);
      throw err;
    }
  };

  return {
    // State
    profile,
    isAuthInitialized,
    isLoading,
    error,
    
    // Actions
    waitForInitialization,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    
    // Getters
    isAuthenticated,
    getUserOrderById,
    getUserOrders
  };
});