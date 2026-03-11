import { getImageUrl } from '@/utils/helpers'

export class Restaurant {
  constructor(restaurantData) {
    this.id = restaurantData.id;
    this.name = restaurantData.name;
    this.badge = restaurantData.badge_type || '';
    this.categories = restaurantData.categories || [];
    this.rating = restaurantData.rating || 0;
    this.deliveryTime = restaurantData.delivery_time || 0;
    this.popularity = restaurantData.popularity || 0;
    this.imageUrl = restaurantData.image ? getImageUrl(restaurantData.image) : '';
  }

  get formattedDeliveryTime() {
    return `${(this.deliveryTime / 60).toFixed(1)} мин`;
  }
  get badgeClass() {
    const badgeClasses = {
      'healthy': 'badge-healthy',
      'trending': 'badge-trending',
      'supreme': 'badge-supreme',
      'spicy': 'badge-spicy'
    };
    return badgeClasses[this.badge] || 'badge-default';
  }
  get badgeText() {
    const badgeTexts = {
      'healthy': 'Полезное',
      'trending': 'Популярно',
      'supreme': 'Эксклюзив',
      'spicy': 'Острое'
    };
    return badgeTexts[this.badge] || 'Без бейджа';
  }

   /** Преобразует Restaurant в простой объект для Firestore / localStorage */
   toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      badge_type: this.badge,
      categories: this.categories,
      rating: this.rating,
      delivery_time: this.deliveryTime,
      popularity: this.popularity,
      image: this.imageUrl ? this.imageUrl.split('/').pop() : '',
    };
  }

  /** Восстанавливает Restaurant из простого объекта */
  static fromPlainObject(data) {
    return new Restaurant(data);
  }
}