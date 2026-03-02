export const formatDeliveryTime = (time) => {
  return `${(time / 60).toFixed(1)} мин`;
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

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone; // Возвращаем исходное значение, если формат не совпадает
}

export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  const cleaned = ('' + cardNumber).replace(/\D/g, '');
  const match = cleaned.match(/.{1,4}/g);
  if (match) {
    return match.join(' ');
  }
  return cardNumber; // Возвращаем исходное значение, если формат не совпадает
}

export const formatExpiryDate = (expiry) => {
  if (!expiry) return '';
  const cleaned = ('' + expiry).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{2})$/);
  if (match) {
    return `${match[1]}/${match[2]}`;
  }
  return expiry; // Возвращаем исходное значение, если формат не совпадает
}