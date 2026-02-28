import { db } from "@/firebase-config";
import { doc, getDoc, setDoc, updateDoc, deleteField, serverTimestamp } from "firebase/firestore";
import _ from "lodash";
import { COLLECTIONS } from "@/constants/collections";
import { CartItem } from "@/models/CartItem.js";

/**
 * Преобразует cartGroups (с CartItem объектами) в простой объект для хранения.
 * Используется перед записью в Firestore и localStorage.
 *
 * @param {Object} cartGroups - { restaurantId: { restaurantName, items: CartItem[] } }
 * @returns {Object} - { restaurantId: { restaurantName, items: plainObject[] } }
 */
const serializeCartGroups = (cartGroups) => {
  const plain = {};
  for (const restaurantId in cartGroups) {
    const group = cartGroups[restaurantId];
    plain[restaurantId] = {
      restaurantName: group.restaurantName,
      items: Array.isArray(group.items)
        ? group.items.map(item =>
            item instanceof CartItem ? item.toPlainObject() : item
          )
        : [],
    };
  }
  return plain;
};

/**
 * Преобразует простой объект (из Firestore / localStorage) обратно в cartGroups с CartItem.
 *
 * @param {Object} rawData - данные из хранилища (без служебных полей вроде updatedAt)
 * @returns {Object} - { restaurantId: { restaurantName, items: CartItem[] } }
 */
const deserializeCartGroups = (rawData) => {
  if (!rawData || typeof rawData !== "object") return {};

  const groups = {};
  for (const restaurantId in rawData) {
    if (restaurantId === "updatedAt") continue; // служебное поле Firestore

    const group = rawData[restaurantId];
    groups[restaurantId] = {
      restaurantName: group.restaurantName,
      items: Array.isArray(group.items)
        ? group.items.map(item => CartItem.fromPlainObject(item))
        : [],
    };
  }
  return groups;
};

// Сохраняет последние переданные аргументы и вызывает saveCart с задержкой.
let _pendingSaveArgs = null;

const _debouncedFirestoreSave = _.debounce(async () => {
  if (!_pendingSaveArgs) return;
  const { service, cartData, userId } = _pendingSaveArgs;
  _pendingSaveArgs = null;
  try {
    await service.saveCart(userId, cartData);
  } catch (error) {
    console.error("Debounced save to Firestore failed:", error);
  }
}, 2000);

// Service to synchronize user cart between localStorage and Firestore.
export const cartSyncService = {
  // Firestore

  /**
   * Сохраняет корзину в Firestore (и параллельно в localStorage).
   * Все аргументы: userId первый, cartData второй — единый порядок.
   *
   * @param {string|null} userId
   * @param {Object}      cartData - cartGroups (может содержать CartItem)
   */
  async saveCart(userId, cartData) {
    // Всегда сохраняем в localStorage мгновенно
    this._saveToLocalStorage(cartData);

    if (!userId) return;

    const plainCartData = serializeCartGroups(cartData);

    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(
      docRef,
      { cart: { ...plainCartData, updatedAt: serverTimestamp() } },
      { merge: true }
    );
  },

  /**
   * Debounced-версия saveCart — мгновенно пишет в localStorage,
   * а в Firestore — с задержкой 2 сек (сбрасывается при повторном вызове).
   *
   * @param {string|null} userId
   * @param {Object}      cartData
   */
  saveCartDebounced(userId, cartData) {
    this._saveToLocalStorage(cartData);

    if (!userId) return;

    _pendingSaveArgs = { service: this, cartData, userId };
    _debouncedFirestoreSave();
  },

  /**
   * Загружает корзину из Firestore и возвращает cartGroups с CartItem.
   *
   * @param {string} userId
   * @returns {Promise<Object|null>} cartGroups или null
   */
  async loadFromFirestore(userId) {
    if (!userId) throw new Error("userId is required to load cart from Firestore");

    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return null;

    const rawCart = snap.data()?.cart;
    if (!rawCart) return null;

    return deserializeCartGroups(rawCart);
  },

  /**
   * Полностью очищает поле `cart` в документе пользователя.
   *
   * @param {string|null} userId
   */
  async clearCart(userId = null) {
    this._saveToLocalStorage({});

    if (!userId) return;

    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(docRef, { cart: deleteField() });
  },

  // localStorage

  /**
   * Сохраняет cartGroups в localStorage (преобразуя CartItem → plain).
   * @param {Object} cartGroups
   */
  _saveToLocalStorage(cartGroups) {
    const data = {
      updatedAt: Date.now(),
      groups: serializeCartGroups(cartGroups),
    };
    localStorage.setItem("cart_cache", JSON.stringify(data));
  },

  /**
   * Загружает корзину из localStorage и возвращает cartGroups с CartItem.
   * @returns {Object|null} cartGroups или null
   */
  loadFromLocalStorage() {
    const raw = localStorage.getItem("cart_cache");
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      const groups = parsed.groups || {};

      // Десериализуем каждый элемент обратно в CartItem
      const cartGroups = {};
      for (const resId in groups) {
        const group = groups[resId];
        cartGroups[resId] = {
          restaurantName: group.restaurantName,
          items: Array.isArray(group.items)
            ? group.items.map(item => CartItem.fromPlainObject(item))
            : [],
        };
      }
      return cartGroups;
    } catch (error) {
      console.error("Ошибка при загрузке корзины из localStorage:", error);
      return null;
    }
  },
};
