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
}