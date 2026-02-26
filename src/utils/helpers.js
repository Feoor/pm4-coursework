export const getBadgeClass = (badge) => {
  const badgeClasses = {
    'healthy': 'badge-healthy',
    'trending': 'badge-trending',
    'supreme': 'badge-supreme',
    'spicy': 'badge-spicy'
  };

  return badgeClasses[badge] || '';
}

export const getBadgeText = (badge) => {
  const badgeTexts = {
    'healthy': 'Полезное',
    'trending': 'Популярно',
    'supreme': 'Эксклюзив',
    'spicy': 'Острое'
  };

  return badgeTexts[badge] || '';
}

export const getImageUrl = (imageName) => {
  return new URL(`../assets/img/${imageName}`, import.meta.url).href;
}