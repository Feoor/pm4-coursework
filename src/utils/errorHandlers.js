const AUTH_ERRORS = {
  'auth/invalid-credential': 'Неверный email или пароль.',
  'auth/user-not-found': 'Пользователь с таким email не найден.',
  'auth/wrong-password': 'Неверный пароль.',
  'auth/email-already-in-use': 'Этот email уже занят другим аккаунтом.',
  'auth/weak-password': 'Пароль должен быть не менее 6 символов.',
  'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже.',
  'auth/network-request-failed': 'Ошибка сети. Проверьте интернет.'
};

export const getAuthErrorMessage = (code) => {
  return AUTH_ERRORS[code] || 'Произошла неизвестная ошибка. Попробуйте снова.';
}