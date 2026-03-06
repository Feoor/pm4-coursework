import {db} from '@/firebase-config';
import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  onSnapshot
} from 'firebase/firestore';
import {ORDER_STATUS} from '@/constants/orderStatus';
import {COLLECTIONS} from '@/constants/collections';

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
   * Retrieves all orders for a given user, sorted by creation date (newest first).
   * If sortByUnpaid is true, unpaid orders will be sorted before paid ones.
   * Supports pagination using Firestore document snapshots (lastVisible) and batch size.
   * @param {string} userId - ID of the user who owns the orders
   * @param {boolean} sortByUnpaid - If true, unpaid orders will be sorted before paid ones
   * @param {QueryDocumentSnapshot} lastVisible - Optional Firestore document snapshot to start pagination from (for infinite scrolling)
   * @param {number} batchSize - Optional number of orders to retrieve per batch (default is 10)
   * @returns {array} Array of order objects sorted by creation date (newest first)
   * @throws {Error} If there was an error retrieving the orders from Firestore
   */
  async getUserOrders(userId, sortByUnpaid = false, { lastVisible = null, batchSize = 10 } = {}) {
    const ordersCol = collection(
      db,
      `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.ORDERS}`
    );
    let ordersQuery = query(
      ordersCol,
      orderBy('createdAt', 'desc'),
      limit(batchSize)
    );

    if (lastVisible) {
      ordersQuery = query(ordersQuery, startAfter(lastVisible));
    }

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

    return {
      items: orders,
      lastVisible: ordersSnap.docs.length > 0 ? ordersSnap.docs[ordersSnap.docs.length - 1] : null
    };
  },

  /**
   * Returns the total count of orders for a given user.
   * This can be used for pagination purposes to determine how many pages of orders there are.
   * @param userId
   * @returns {Promise<number>}
   */
  async getOrdersCountForUser(userId) {
    const ordersCol = collection(
      db,
      `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.ORDERS}`
    );
    const snapshot = await getCountFromServer(ordersCol);
    return snapshot.data().count;
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

  /**
   * Subscribes to real-time updates for a user's orders.
   * The callback will be called with the updated list of orders whenever there is a change.
   * @param userId
   * @param callback
   * @param limitCount
   * @returns {Unsubscribe}
   */
  subscribeToUserOrders(userId, callback, limitCount = 10) {
    const ordersCol = collection(
      db,
      `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.ORDERS}`
    );
    const ordersQuery = query(
      ordersCol,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    // Возвращаем функцию для отписки от слушателя
    return onSnapshot(ordersQuery, (snapshot) => {
      const orders = [];
      snapshot.forEach(doc => {
        orders.push({id: doc.id, ...doc.data()});
      });
      callback(orders);
    }, (error) => {
      console.error("Error subscribing to user orders:", error);
    });
  }
}