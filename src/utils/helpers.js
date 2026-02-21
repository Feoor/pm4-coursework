export const getBadgeClass = (badge) => {
  const badgeClasses = {
    'healthy': 'badge-healthy',
    'popularity': 'badge-trending',
    'supreme': 'badge-supreme'
  };

  return badgeClasses[badge] || '';
}

export const getBadgeText = (badge) => {
  const badgeTexts = {
    'healthy': 'Полезное',
    'popularity': 'Популярно',
    'supreme': 'Эксклюзив'
  };

  return badgeTexts[badge] || '';
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