<script setup>
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatters';

// Icons
import { Plus, Minus } from '@lucide/vue';

const cartStore = useCartStore();

const emit = defineEmits(['order-payment']);

const handleClose = () => {
  cartStore.toggleMenu();
}

const handleIncrement = (dish) => {
  cartStore.incrementQuantity(dish);
}
const handleDecrement = (dish) => {
  cartStore.decrementQuantity(dish);
}

const handleOrderPayment = () => {
  cartStore.toggleMenu();
  emit('order-payment');
}
</script>

<template>
  <div class="sidebar__menu-cart sidebar__menu" :class="cartStore.isMenuOpen ? 'sidebar__menu-cart--show' : ''">
    <div class="sidebar__header">
      <h3 class="menu-cart__title pt-4 px-4">
        {{ cartStore.isEmpty() ? 'Корзина пуста' : `Ваш заказ` }}
      </h3>
      <button @click="handleClose" class="absolute top-6 right-6 p-1 hover:bg-(--translucent-white) rounded-5">
        <Plus class="rotate-45" size="32"/>
      </button>
    </div>

    <div class="menu-cart__content">
      <div class="menu-cart__group-wrapper">

        <div v-for="(group, resId) in cartStore.cartGroups" :key="resId" class="menu-cart__restaurant-group">
          <h4 class="menu-cart__restaurant-name my-3">{{ group.restaurantName }}</h4>

          <!-- Карточка блюда -->
          <div v-for="item in group.items" :key="item.dish.id"
            class="menu-cart__dish d-flex justify-content-between align-items-center">
            <!-- Краткая информация об блюде -->
            <div class="cart-dish__info d-flex align-items-center">
              <img :src="item.image" :alt="item.name" class="cart-dish__image">
              <div class="cart-dish__details">
                <h5 class="cart-dish__name">{{ item.name }}</h5>
                <span class="cart-dish__price">{{ formatPrice(item.price) }}</span>
              </div>
            </div>

            <!-- Кнопки управления количеством -->
            <div class="cart-dish__controls d-flex flex-column align-items-center">
              <div class="cart-dish__qty d-flex align-items-center">
                <button @click="handleDecrement(item.dish)" class="border-2 p-1 transition-colors hover:bg-(--translucent-white) rounded-3">
                  <Minus size="28" />
                </button>

                <span class="cart-dish__count">{{ item.quantity }}</span>

                <button @click="handleIncrement(item.dish)" class="border-2 p-1 transition-colors hover:bg-(--translucent-white) rounded-3">
                  <Plus size="28" />
                </button>
              </div>
              <div class="cart-dish__total-price">
                <span class="cart-dish__total">{{ formatPrice(item.cost) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="!cartStore.isEmpty()" class="sidebar__buttons">
      <button @click="handleOrderPayment()" class="flex items-center w-full border-2 p-2.5 transition-colors hover:bg-(--translucent-white) rounded-5">
        <span class="bg-danger rounded-full px-2 mr-3">{{ cartStore.totalItems() }}</span>
        Перейти к оплате
        <span class="cart__price ms-auto">{{ cartStore.formattedTotalPrice() }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Боковая корзина
.sidebar__menu-cart {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 95%;
  max-width: 550px;
  height: 100%;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
  padding: 0.75rem 0 0;
  background-color: $main-black;
  color: #fff;
  transform: translateX(100%);
  opacity: 0;
  transition: transform .3s ease, opacity .3s ease;
  z-index: 200;

  &--show {
    opacity: 1;
    transform: translateX(0);
  }
}

.sidebar__buttons {
  display: flex;
  gap: 12px;
  padding: 0 1.5rem;
  position: absolute;
  right: 0;
  bottom: 24px; // По какой-то причине 0 недостаточно и элемент уходи за экран
  left: 0;

  a,
  button {
    padding: 0.75rem 1rem;
    border-radius: 16px;
    font-family: $second-family, sans-serif;
    font-size: 16px;
    font-weight: 600;
    transition: background .2s ease, color .2s ease;
  }
}

.sidebar__header {
  display: flex;
  flex: 0 0 auto;
  // Размер главного хэдера страницы
  height: 42px;
  align-items: center;
  margin-bottom: 16px;

  .menu-cart__title {
    padding: 0 1.5rem;
    font-family: $font-family, sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #fff
  }
}

.menu-cart__content {
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin-bottom: 5rem;
  flex-grow: 1;
  color: #fff;

  &::-webkit-scrollbar {
    display: none;
  }

  .menu-cart__separator {
    width: 100%;
    height: 1px;
    background-color: $translucent-white;
    margin: 0.75rem 0;
  }

  .menu-cart__restaurant-name {
    padding: 0 1.5rem;
    font-family: $font-family, sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
  }
}

.menu-cart__dish {
  font-family: $font-family, sans-serif;
  font-weight: 600;
  padding: 0.75rem 1.5rem;

  &:hover {
    background-color: #353535;
  }

  // Информация о блюде
  .cart-dish__image {
    width: 100px;
    height: 100px;
    border-radius: 30px;
  }

  .cart-dish__details {
    margin-left: 16px;
  }

  .cart-dish__name {
    font-size: 20px;
  }

  .cart-dish__price {
    font-size: 18px;
  }

  // Кнопки управлением кол-вом блюд
  .cart-dish__qty {
    font-size: 20px;
    gap: 16px;
  }

  .cart-dish__total-price {
    margin-top: 4px;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }
}

.sidebar__checkout-btn {
  border: 1px solid #fff;
  background-color: $main-black;
  color: #fff;
  text-align: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
}

@media screen and (max-width: 566.98px) {

  // Телефоны в вертикальной ориентации (< 567px)
  // Боковая корзина
  .sidebar__menu-cart {
    border-radius: 0;
    padding: 1.5rem 0 0;
    width: 100%;
  }

  .menu-cart__dish {

    // Информация о блюде
    .cart-dish__image {
      width: 56px;
      height: 56px;
      border-radius: 30px;
    }

    .cart-dish__details {
      margin-left: 16px;
      margin-right: 16px;
    }

    .cart-dish__name {
      font-size: 18px;
    }

    .cart-dish__price {
      font-size: 16px;
    }

    // Кнопки управлением кол-вом блюд
    .cart-dish__qty {
      font-size: 16px;
      gap: 12px;
    }

    .cart-dish__total-price {
      margin-top: 4px;
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }
  }

  .sidebar__checkout-btn {
    border: 1px solid #fff;
    background-color: $main-black;
    color: #fff;
    text-align: center;

    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }
  }
}
</style>