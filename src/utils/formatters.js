export const formatDeliveryTime = (time) => {
  return `${(time / 60).toFixed(1)} min`;
}

export const formatPrice = (price) => {
  return `${price.toLocaleString('kz-KZ')} ₸`;
}

export const formatDate = (dateInput) => {
  let dateObj;

  // Обработка Firebase Timestamp (Proxy объект)
  if (dateInput && typeof dateInput === 'object' && typeof dateInput.toDate === 'function') {
    dateObj = dateInput.toDate();
  }
  // Обработка обычной строки или Date объекта
  else {
    dateObj = new Date(dateInput);
  }

  // Проверка на валидность даты
  if (isNaN(dateObj.getTime())) {
    return 'Неизвестно';
  }

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return dateObj.toLocaleDateString('ru-RU', options);
}