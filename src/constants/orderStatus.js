export const ORDER_STATUS = {
  PENDING: 'pending', // Заказ создан, ожидает оплаты
  PAID: 'paid', // Заказ оплачен, ожидает обработки
  DELIVERED: 'delivered', // Заказ доставлен клиенту
  CANCELED: 'canceled' // Заказ отменён
}