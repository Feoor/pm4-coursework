import { defineStore } from "pinia";
import { CartItem } from "@/models/CartItem";
import { ref, watch } from "vue";
import { orderService } from "@/services/orderService";
import { cartSyncService } from "@/services/cartSyncService.js";
import { useAuthStore } from "@/store/authStore";

export const useCartStore = defineStore("cart", () => {
  // State
  const cartGroups = ref({});
  const isMenuOpen = ref(false);

  const authStore = useAuthStore();

  //  Initialization
  const initializeCart = async () => {
    try {
      const userId = authStore.profile?.id;

      if (userId) {
        // Авторизован → пробуем загрузить из Firestore
        const firestoreCart = await cartSyncService.loadFromFirestore(userId);

        if (firestoreCart && Object.keys(firestoreCart).length > 0) {
          cartGroups.value = firestoreCart;
          return;
        }

        // Firestore пуст → проверяем localStorage (мог добавить до входа)
        const localCart = cartSyncService.loadFromLocalStorage();
        if (localCart && Object.keys(localCart).length > 0) {
          cartGroups.value = localCart;
          await cartSyncService.saveCart(userId, localCart); // переносим в Firestore
          return;
        }
      } else {
        // Не авторизован → только localStorage
        const localCart = cartSyncService.loadFromLocalStorage();
        if (localCart) {
          cartGroups.value = localCart;
          return;
        }
      }

      cartGroups.value = {};
    } catch (error) {
      console.error("Error initializing cart:", error);
    }
  };

  // Дожидаемся готовности auth, затем инициализируем
  authStore.waitForInitialization().then(initializeCart);

  // При смене пользователя — переинициализируем
  watch(
    () => authStore.profile?.id,
    async (newUserId, oldUserId) => {
      if (newUserId && !oldUserId) {
        await initializeCart();
      }
    }
  );

  //  Getters
  const totalPrice = () => {
    return Object.values(cartGroups.value).reduce(
      (total, group) => total + group.items.reduce((sum, item) => sum + item.cost, 0),
      0
    );
  };

  const totalItems = () => {
    return Object.values(cartGroups.value).reduce(
      (total, group) => total + group.items.reduce((sum, item) => sum + item.quantity, 0),
      0
    );
  };

  const isEmpty = () => Object.keys(cartGroups.value).length === 0;

  //  Helpers
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  /** Сохраняет текущее состояние корзины: мгновенно в localStorage, с debounce в Firestore */
  const persistCart = () => {
    cartSyncService.saveCartDebounced(authStore.profile?.id ?? null, cartGroups.value);
  };

  const formattedTotalPrice = () => {
    return `${totalPrice().toLocaleString('kz-KZ')} ₸`;
  }

  //  Actions
  const addToCart = (dish) => {
    const resId = dish.restaurant.id;

    if (!cartGroups.value[resId]) {
      cartGroups.value[resId] = {
        restaurantName: dish.restaurant.name,
        items: [],
      };
    }

    const existing = cartGroups.value[resId].items.find((item) => item.id === dish.id);
    if (existing) {
      existing.increment();
    } else {
      cartGroups.value[resId].items.push(new CartItem(dish));
    }

    persistCart();
  };

  const incrementQuantity = (dish) => {
    const item = cartGroups.value[dish.restaurant.id]?.items.find((i) => i.id === dish.id);
    if (item) {
      item.increment();
      persistCart();
    } else {
      console.warn("Dish with ID", dish.id, "not found in cart for incrementing.");
    }
  };

  const decrementQuantity = (dish) => {
    const item = cartGroups.value[dish.restaurant.id]?.items.find((i) => i.id === dish.id);
    if (!item) {
      console.warn(`Dish with ID ${dish.id} not found in cart for decrementing.`);
      return;
    }

    if (item.quantity > 1) {
      item.decrement();
      persistCart();
    } else {
      removeFromCart(dish);
    }
  };

  const removeFromCart = (dish) => {
    const group = cartGroups.value[dish.restaurant.id];
    if (!group) return;

    group.items = group.items.filter((item) => item.id !== dish.id);
    if (group.items.length === 0) {
      delete cartGroups.value[dish.restaurant.id];
    }
    persistCart();
  };

  const clearCart = async () => {
    cartGroups.value = {};
    try {
      await cartSyncService.clearCart(authStore.profile?.id ?? null);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const createOrder = async (userData) => {
    const orderData = {
      totalAmount: totalPrice(),
      items: Object.values(cartGroups.value).flatMap((group) => group.items),
      deliveryAddress: userData.deliveryAddress,
      paymentMethod: userData.paymentMethod,
    };

    try {
      const res = await orderService.createOrderInFirestore(userData.id, orderData);
      await clearCart();
      return res;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  //  Return

  return {
    // State
    cartGroups,
    isMenuOpen,

    // Getters
    totalPrice,
    totalItems,
    isEmpty,

    // Helpers
    toggleMenu,
    formattedTotalPrice,

    // Actions
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    createOrder,
  };
});

