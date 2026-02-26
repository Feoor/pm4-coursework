export const formatDeliveryTime = (time) => {
  return `${(time / 60).toFixed(1)} min`;
}

export const formatPrice = (price) => {
  return `${price.toLocaleString('kz-KZ')} ₸`;
}

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
}