export const getBadgeClass = (badge) => {
  const badgeClasses = {
    'healthy': 'badge-healthy',
    'trending': 'badge-trending',
    'supreme': 'badge-supreme',
    'spicy': 'badge-spicy'
  };

  return badgeClasses[badge] || 'badge-default';
}

export const getBadgeText = (badge) => {
  const badgeTexts = {
    'healthy': 'Полезное',
    'trending': 'Популярно',
    'supreme': 'Эксклюзив',
    'spicy': 'Острое'
  };

  return badgeTexts[badge] || 'Без бейджа';
}

export const getOrderStatusText = (status) => {
  const statusTexts = {
    'pending': 'В ожидании оплаты',
    'paid': 'Оплачен',
    'delivered': 'Доставлен',
    'canceled': 'Отменён'
  };

  return statusTexts[status] || 'Неизвестный статус';
}

export const getOrderStatusClass = (status) => {
  const statusClasses = {
    'pending': 'status-pending',
    'paid': 'status-paid',
    'delivered': 'status-delivered',
    'canceled': 'status-canceled'
  };

  return statusClasses[status] || 'status-unknown';
}

export const getImageUrl = (imageName) => {
  return new URL(`../assets/img/${imageName}`, import.meta.url).href;
}