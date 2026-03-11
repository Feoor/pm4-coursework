import {getOrderStatusText} from "@/utils/helpers.js";

export class Order {
  constructor(orderData) {
    this.id = orderData.id;
    this.items = orderData.items || []; // [dish: {id, name, price, quantity, restaurantId, restaurantName}]
    this.totalPrice = orderData.totalAmount || 0;
    this.status = orderData.status || 'pending';
    this.createdAt = orderData.createdAt.toDate() || new Date();
    this.deliveryAddress = orderData.deliveryAddress || '';
    this.deliveryMethod = orderData.deliveryMethod || 'delivery'; // 'delivery' или 'pickup'
    this.paymentMethod = orderData.paymentMethod || null;
    this.paymentId = orderData.paymentId || null;
  }

  get shortId() {
    return this.id ? this.id.slice(0, 8) : 'unknown';
  }
  get createdAtFormatted() {
    return this.createdAt.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  get statusText() {
    return getOrderStatusText(this.status);
  }
  get statusClass() {
    return `order-status--${this.status}`;
  }
  get formattedTotalPrice() {
    return `${this.totalPrice.toLocaleString('kz-KZ')} ₸`;
  }

  /** Преобразует Order в простой объект для Firestore / localStorage */
  toPlainObject() {
    return {
      id: this.id,
      dishes: this.items,
      totalAmount: this.totalPrice,
      status: this.status,
      createdAt: this.createdAt,
      deliveryAddress: this.deliveryAddress,
      paymentMethod: this.paymentMethod,
      paymentId: this.paymentId,
    };
  }

  static fromPlainObject(data) {
    return new Order(data);
  }
}