import { defineStore } from "pinia";
import { ref } from "vue";
import { auth } from "@/firebase-config";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from "firebase/auth";
import { createUserProfile, getUserProfile } from "@/services/userService";

// Setup-стиль (современный подход в Pinia)
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
          profile.value = await getUserProfile(firebaseUser);
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
  const signUp = async (email, password, additionalData) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      profile.value = await createUserProfile(userCredential.user, additionalData);
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
      profile.value = await getUserProfile(userCredential.user);
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
      profile.value = await getUserProfile(userCredential.user);
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

  return {
    // State
    profile,
    isAuthInitialized,
    isLoading,
    error,
    
    // Actions
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    
    // Getters
    isAuthenticated
  };
});