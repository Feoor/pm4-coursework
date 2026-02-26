import { db } from '@/firebase-config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  getDocs, 
  doc, 
  serverTimestamp, 
  query, 
  orderBy
} from 'firebase/firestore';
import { ORDER_STATUS } from '@/constants/orderStatus';
import { COLLECTIONS } from '@/constants/collections';

/**
 * 
 * @param {Object} orderData - Данные заказа, включая totalAmount, items, deliveryAddress, paymentMethod
 * @returns {Object} Объект с полем success (boolean) и order (Object)
 * @throws {Error} Если произошла ошибка при создании заказа
 * 
 * Структура orderData:
 * {
 *   totalAmount: Number,
 *   items: Array<{ dishId, name, quantity, price, restaurantId, restaurantName }>,
 *   deliveryAddress: String,
 *   paymentMethod: String
 * }
 * 
 * Структура документа заказа в Firestore:
 * {
 *   createdAt: Timestamp (дата создания заказа),
 *   status: String (статус заказа, например 'pending'),
 *   totalAmount: Number,
 *   items: Array<{ dishId, name, quantity, price, restaurantId, restaurantName }>,
 *   deliveryAddress: String,
 *   paymentMethod: String,
 *   paymentId: String (ID транзакции оплаты, если применимо)
 * }
 */
export const createOrderInFirestore = async (userId, orderData) => {
  const orderDoc = {
    createdAt: serverTimestamp(),
    status: ORDER_STATUS.PENDING,
    totalAmount: orderData.totalAmount,
    items: orderData.items.map(item => {
      const dish = item.dish || {};
      const restaurant = dish.restaurant || {};

      return {
        dishId: dish.id || console.warn(`Cart item is missing dish info`),
        name: dish.name || console.warn(`Cart item is missing dish name`),
        quantity: item.quantity,
        price: dish.price || console.warn(`Dish ${item.name} is missing price info`),
        restaurantId: restaurant.id || console.warn(`Dish ${item.name} is missing restaurant info`),
        restaurantName: restaurant.name || console.warn(`Dish ${item.name} is missing restaurant info`),
      };
    }),
    deliveryAddress: orderData.deliveryAddress || null,
    paymentMethod: orderData.paymentMethod || null,
    paymentId: null
  }

  try {
    const docRef = await addDoc(collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.ORDERS}`), orderDoc);
    return { success: true, order: { id: docRef.id, ...orderDoc, createdAt: new Date() } };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

/**
 * 
 * @param {String} userId - ID пользователя, которому принадлежит заказ
 * @param {String} orderId - ID заказа, который нужно получить
 * @returns {Object|null} Данные заказа или null, если заказ не найден
 */
export const getOrderById = async (userId, orderId) => {
  const orderRef = doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.ORDERS}/${orderId}`);
  const orderSnap = await getDoc(orderRef);

  if (orderSnap.exists()) {
    return { id: orderSnap.id, ...orderSnap.data() };
  } else {
    console.warn(`Order with ID ${orderId} not found for user ${userId}`);
    return null;
  }
}

/**
 * 
 * @param {String} userId - ID пользователя, для которого нужно получить все заказы
 * @returns {Array} Массив заказов пользователя
 * @throws {Error} Если произошла ошибка при получении заказов
 */
export const getAllOrdersForUser = async (userId, sortByUnpaid = false) => {
  const ordersCol = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.ORDERS}`);
  const ordersQuery = query(ordersCol, orderBy('createdAt', 'desc'));
  const ordersSnap = await getDocs(ordersQuery);

  const orders = [];
  ordersSnap.forEach(doc => {
    orders.push({ id: doc.id, ...doc.data() });
  });

  if (sortByUnpaid) {
    orders.sort((a, b) => {
      if (a.status !== ORDER_STATUS.PENDING && b.status === ORDER_STATUS.PENDING) {
        return 1; // a идет после b
      } else if (a.status === ORDER_STATUS.PENDING && b.status !== ORDER_STATUS.PENDING) {
        return -1; // a идет перед b
      } else {
        return 0; // порядок не изменяется
      }
    });
  }

  return orders;
}

/**
 * 
 * @param {String} userId - ID пользователя, которому принадлежит заказ
 * @param {String} orderId - ID заказа, статус которого нужно обновить
 * @param {String} newStatus - Новый статус заказа
 * @returns {Object} Результат обновления статуса заказа
 * @throws {Error} Если произошла ошибка при обновлении статуса заказа
 */
export const updateOrderStatus = async (userId, orderId, newStatus, additionalData = {}) => {
  const orderRef = doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.ORDERS}/${orderId}`);
  await updateDoc(orderRef, { status: newStatus, ...additionalData }, { merge: true });
  return { success: true };
}