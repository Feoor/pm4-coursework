import { defineStore } from "pinia";
import { CartItem } from "@/models/CartItem";
import { ref } from "vue";

export const useCartStore = defineStore("cart", () => {
  // State
  const items = ref([]);

  // Getters
  const totalPrice = () => {
    return items.value.reduce((total, item) => total + item.cost, 0);
  }
  const totalItems = () => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  }
  const isEmpty = () => {
    return items.value.length === 0;
  }

  // Actions
  const addToCart = (dish) => {
    // Проверяем, есть ли уже этот товар в корзине
    const existingItem = items.value.find(item => item.dish.id === dish.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.value.push(new CartItem(dish));
    }
  }

  const incrementQuantity = (dishId) => {
    const item = items.value.find(item => item.dish.id === dishId);
    if (item) {
      item.quantity++;
    }
  }
  
  const decrementQuantity = (dishId) => {
    const item = items.value.find(item => item.dish.id === dishId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        removeFromCart(dishId);
      }
    }
  }
  
  const removeFromCart = (dishId) => {
    items.value = items.value.filter(item => item.dish.id !== dishId);
  }

  const clearCart = () => {
    items.value = [];
  }

  const saveToLocalStorage = () => {
    localStorage.setItem("cart", JSON.stringify(items.value));
  }

  return {
    // State
    items,

    // Getters
    totalPrice,
    totalItems,
    isEmpty,

    // Actions
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    saveToLocalStorage
  }
});