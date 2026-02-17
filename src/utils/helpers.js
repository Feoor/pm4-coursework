export const getBadgeClass = (badge) => {
  const badgeClasses = {
    'Полезно': 'badge-healthy',
    'Популярно': 'badge-trending',
    'Эксклюзив': 'badge-supreme'
  };

  return badgeClasses[badge] || '';
}

export const formatDeliveryTime = (time) => {
  return `${(time / 60).toFixed(1)} min`;
}

export const formatPrice = (price) => {
  return `${price.toLocaleString('kz-KZ')} ₸`;
}

export const getImageUrl = (imageName) => {
  return new URL(`../assets/img/${imageName}`, import.meta.url).href;
}