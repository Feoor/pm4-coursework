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

export const getImageUrl = (imageURL) => {
  if (imageURL.startsWith('http')) {
    return imageURL;
  }

  return new URL(`../assets/img/${imageURL}`, import.meta.url).href;
}

export const getDateObj = (date) => {
  // Обработка Firebase Timestamp (Proxy объект)
  if (date && typeof date === 'object' && typeof date.toDate === 'function') {
    return date.toDate();
  }

  // Обработка обычной строки или Date объекта
  return new Date(date);
}