import { formatDate } from "@/utils/formatters";
export class User {
  constructor(authData, profileData = {}) {
    this.id = authData.uid;
    this.email = authData.email;
    this.role = profileData.role || 'user'; // Роль по умолчанию - "user"
    this.displayName = profileData.displayName || authData.displayName || "Пользователь";
    this.photoURL = profileData.photoURL || authData.photoURL || "src/assets/img/defaultProfileImage.jpg"; // Используем Gravatar по умолчанию, если нет изображения
    this.phoneNumber = profileData.phoneNumber || authData.phoneNumber || null;
    this.createdAt = profileData.createdAt || authData.metadata?.createdAt || 'Неизвестно';
    this.deliveryAddress = profileData.deliveryAddress || null;
  }

  get shortName() {
    return this.displayName.split(' ')[0]; // Возвращаем только первое имя для краткого отображения
  }
  get formattedCreatedAt() {
    return formatDate(this.createdAt);
  }
  get isAdmin() {
    return this.role === 'admin' || this.role === 'superadmin';
  }
}