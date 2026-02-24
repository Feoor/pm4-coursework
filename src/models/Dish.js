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
    this.image = dishData?.image || '';
    this.section = dishData.section || '';  
    this.restaurant = {
      id: dishData.restaurant?.id || 'unknown',
      name: dishData.restaurant?.name || 'unknown restaurant',
    }
  }

  get imageUrl() {
    return this.image ? getImageUrl(this.image) : 'unknown-dish.png';
  }
}