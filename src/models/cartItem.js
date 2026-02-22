export class CartItem {
  constructor(dish, quantity = 1) {
    this.dish = dish;
    this.quantity = quantity;
  }

  get cost() {
    return this.dish.price * this.quantity;
  }
}