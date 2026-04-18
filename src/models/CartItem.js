import { Dish } from "@/models/Dish";

export class CartItem {
  constructor(dish, quantity = 1) {
    this.dish = dish;
    this.quantity = quantity;
  }

  increment() {
    this.quantity++;
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  get cost() {
    return this.dish.price * this._quantity;
  }
  get price() {
    return this.dish.price;
  }
  get name() {
    return this.dish.name;
  }
  get imageUrl() {
    return this.dish.image;
  }
  get id() {
    return this.dish.id;
  }
  get quantity() {
    return this._quantity;
  }

  set quantity(value) {
    this._quantity = value;
  }

  /** Преобразует CartItem в простой объект для Firestore / localStorage */
  toPlainObject() {
    return {
      dish: this.dish.toPlainObject(),
      quantity: this.quantity,
    };
  }

  /** Восстанавливает CartItem из простого объекта */
  static fromPlainObject(data) {
    return new CartItem(Dish.fromPlainObject(data.dish), data.quantity);
  }
}