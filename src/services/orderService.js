import { db } from '@/firebase-config';
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  doc,
  serverTimestamp,
  query,
  orderBy,
  getDoc
} from 'firebase/firestore';
import { ORDER_STATUS } from '@/constants/orderStatus';
import { COLLECTIONS } from '@/constants/collections';

export const orderService = {
  /**
   *
   * @param userId - ID of the user who owns the order
   * @param {Object} orderData - Order data, includes totalAmount, items, deliveryAddress, paymentMethod
   * @returns {Object} Object containing success status and created order data
   * @throws {Error} If there was an error creating the order in Firestore
   *
   * orderData structure:
   * {
   *   totalAmount: Number,
   *   items: array<{ dishId, name, quantity, price, restaurantId, restaurantName }>,
   *   deliveryAddress: string,
   *   paymentMethod: string
   * }
   *
   * The order document created in Firestore will have the following structure:
   * {
   *   createdAt: Timestamp (дата создания заказа),
   *   status: string (статус заказа, например 'pending'),
   *   totalAmount: Number,
   *   items: array<{ dishId, name, quantity, price, restaurantId, restaurantName }>,
   *   deliveryAddress: string,
   *   paymentMethod: string,
   *   paymentId: string (ID транзакции оплаты, если применимо)
   * }
   */
  async createOrderInFirestore(userId, orderData) {
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
      return {success: true, order: {id: docRef.id, ...orderDoc, createdAt: new Date()}};
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  /**
   *
   * @param {string} userId - ID of the user who owns the order
   * @param {string} orderId - Order ID to retrieve
   * @returns {Object|null} Order data if found, or null if not found
   * @throws {Error} If there was an error retrieving the order from Firestore
   */
  async getOrderById(userId, orderId) {
    const orderRef = doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.ORDERS}/${orderId}`);
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
      return {id: orderSnap.id, ...orderSnap.data()};
    } else {
      console.warn(`Order with ID ${orderId} not found for user ${userId}`);
      return null;
    }
  },

  /**
   *
   * @param {string} userId - ID of the user who owns the orders
   * @param {boolean} sortByUnpaid - If true, unpaid orders will be sorted before paid ones
   * @returns {array} Array of order objects sorted by creation date (newest first)
   * @throws {Error} If there was an error retrieving the orders from Firestore
   */
  async getAllOrdersForUser(userId, sortByUnpaid = false) {
    const ordersCol = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.ORDERS}`);
    const ordersQuery = query(ordersCol, orderBy('createdAt', 'desc'));
    const ordersSnap = await getDocs(ordersQuery);

    const orders = [];
    ordersSnap.forEach(doc => {
      orders.push({id: doc.id, ...doc.data()});
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
  },

  /**
   *
   * @param {string} userId - ID of the user who owns the order
   * @param {string} orderId - Order ID to update
   * @param {string} newStatus - New status to set for the order (e.g. 'pending', 'paid', 'canceled')
   * @param additionalData - Optional object containing additional fields to update in the order document (e.g. paymentId)
   * @returns {Object} Object containing success status
   * @throws {Error} If there was an error updating the order status in Firestore
   */
  async updateOrderStatus(userId, orderId, newStatus, additionalData = {}) {
    const orderRef = doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.ORDERS}`, orderId);
    const orderDoc = {
      status: newStatus,
      ...additionalData
    }
    await updateDoc(orderRef, orderDoc);
    return { success: true };
  },
}