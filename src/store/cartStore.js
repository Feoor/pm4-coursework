import { defineStore } from "pinia";
import { CartItem } from "@/models/CartItem";
import { Dish } from "@/models/Dish";
import { ref } from "vue";
import { createOrderInFirestore } from "@/services/orderService";

// TODO: Сделать сохранение корзины в Firestore для авторизованных пользователей, чтобы корзина сохранялась между устройствами и сессиями. 
// Для неавторизованных пользователей оставить localStorage. При авторизации переносить корзину из localStorage в Firestore и очищать localStorage.
export const useCartStore = defineStore("cart", () => {
  // State
  const cartGroups = ref({}); // { restaurantId: { restaurantName: restaurantName, items: [CartItem, CartItem, ...] }, ... }
  const isMenuOpen = ref(false);
  const lastUpdate = ref(null); // Для отслеживания последнего обновления корзины (может быть полезно для синхронизации между вкладками)

  // Getters
  const totalPrice = () => {
    return Object.values(cartGroups.value).reduce((total, group) => {
      return total + group.items.reduce((groupTotal, item) => groupTotal + item.cost, 0);
    }, 0);
  }
  const totalItems = () => {
    return Object.values(cartGroups.value).reduce((total, group) => {
      return total + group.items.reduce((groupTotal, item) => groupTotal + item.quantity, 0);
    }, 0);
  }
  const isEmpty = () => {
    return Object.keys(cartGroups.value).length === 0;
  }

  // Actions
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  }

  const addToCart = (dish) => {
    const resId = dish.restaurant.id;
    const resName = dish.restaurant.name;

    // Если группы для этого ресторана нет, создаем её
    if (!cartGroups.value[resId]) {
      cartGroups.value[resId] = {
        restaurantName: resName,
        items: []
      };
    }

    // Проверяем, есть ли уже этот товар в корзине
    const existingItem = cartGroups.value[dish.restaurant.id].items.find(item => item.id === dish.id);

    if (existingItem) {
      existingItem.increment();
    } else {
      // Если блюда нет, добавляем его в корзину
      cartGroups.value[dish.restaurant.id].items.push(new CartItem(dish));
    }

    saveToLocalStorage();
  }

  const incrementQuantity = (dish) => {
    const item = cartGroups.value[dish.restaurant.id]?.items.find(item => item.id === dish.id);
    if (item) {
      item.increment();
      saveToLocalStorage();
    } else {
      console.warn("Dish with ID", dish.id, "not found in cart for incrementing quantity.");
    }
  }
  
  const decrementQuantity = (dish) => {
    const item = cartGroups.value[dish.restaurant.id]?.items.find(item => item.id === dish.id);
    if (item) {
      if (item.quantity > 1) {
        item.decrement();
        saveToLocalStorage();
      } else {
        removeFromCart(dish);
      }
    } else {
      console.warn("Dish with ID", dish.id, "not found in cart for decrementing quantity.");
    }
  }
  
  const removeFromCart = (dish) => {
    const group = cartGroups.value[dish.restaurant.id];
    if (group) {
      group.items = group.items.filter(item => item.id !== dish.id);
      if (group.items.length === 0) {
        delete cartGroups.value[dish.restaurant.id];
      }
      saveToLocalStorage();
    }
  }

  const clearCart = () => {
    cartGroups.value = {};
    saveToLocalStorage();
  }

  const createOrder = async (userData) => {
    const orderData = {
      totalAmount: totalPrice(),
      items: Object.values(cartGroups.value).flatMap(group => group.items),
      deliveryAddress: userData.deliveryAddress,
      paymentMethod: userData.paymentMethod
    };

    try {
      const res = await createOrderInFirestore(userData.id, orderData);
      clearCart();
      return res;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Private methods for cart storage
  const saveToLocalStorage = () => {
    lastUpdate.value = Date.now();
    localStorage.setItem("cart", JSON.stringify({ lastUpdate: lastUpdate.value, cart: cartGroups.value }));
  }

  const loadFromLocalStorage = () => {
    const savedCart = localStorage.getItem("cart");
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        lastUpdate.value = parsedCart.lastUpdate || null;

        // Преобразуем сохраненные данные обратно в объекты CartItem
        for (const resId in parsedCart.cart) {
          const group = parsedCart.cart[resId];
          cartGroups.value[resId] = {
            restaurantName: group.restaurantName,
            items: group.items.map(itemData => {
              const dish = new Dish(itemData.dish);
              return new CartItem(dish, itemData.quantity);
            })
          };
        }
      } catch (error) {
        console.error("Ошибка при загрузке корзины из localStorage:", error);
        cartGroups.value = {};
      }
    } else {
      cartGroups.value = {};
    }
  }

  // Загружаем корзину из localStorage при инициализации
  loadFromLocalStorage();

  return {
    // State
    cartGroups,
    isMenuOpen,

    // Getters
    totalPrice,
    totalItems,
    isEmpty,

    // Actions
    toggleMenu,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    createOrder,
  }
});