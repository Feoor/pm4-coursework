import { getImageUrl } from '@/utils/helpers'

export class Dish {
  constructor(dishData) {
    this.id = dishData.id;
    this.name = dishData.name;
    this.badge = dishData.badge_type || '';
    this.categories = dishData.categories || [];
    this.price = dishData.price || 0;
    this.rating = dishData.rating || 0;
    this.popularity = dishData.popularity || 0;
    this.deliveryTime = dishData.delivery_time || 0;
    this.imageUrl = dishData.image ? getImageUrl(dishData.image) : '';
    this.restaurantId = dishData.restaurantId || '';
    this.section = dishData.section || '';  
  }
}