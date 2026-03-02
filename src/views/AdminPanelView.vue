<script setup>
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { formatPrice, formatDeliveryTime } from "@/utils/formatters.js";
import { getBadgeClass, getBadgeText } from "@/utils/helpers.js";
import { adminService } from "@/services/adminService.js";
import { useConfirmModal } from "@/composables/useConfirmModal.js";

const { confirm } = useConfirmModal();

// Активная вкладка
const activeTab = ref('restaurants') // 'restaurants' | 'menu'

// --- Рестораны ---
const restaurants = ref([])

const restaurantForm = ref({
  name: '',
  imageUrl: '',
  rating: '',
  deliveryTime: '',
  badge: '',
  categories: '',
})

const badgeOptions = [
  '',
  'healthy',
  'trending',
  'supreme',
  'spicy',
]

onMounted(async () => {
  restaurants.value = await adminService.getRestaurants(10);
})

const handleAddRestaurant = async () => {
  const restaurantDoc = await adminService.addRestaurant(restaurantForm.value);

  // После успешного добавления ресторана, очищаем форму и добавляем новый ресторан в список
  restaurantForm.value = {
    name: '',
    imageUrl: '',
    rating: '',
    deliveryTime: '',
    badge: '',
    categories: '',
  }
  restaurants.value.push(restaurantDoc);
}

const handleDeleteRestaurant = async (id) => {
  // Перед удалением стоит показать модальное окно с подтверждением действия, так как это критичная операция
  const ok = await confirm({
    title: `Удалить ресторан #${id}?`,
    message: 'Вы уверены, что хотите удалить этот ресторан? Это действие нельзя будет отменить.',
    confirmText: 'Удалить',
    cancelText: 'Отмена',
    variant: 'danger'
  })

  if (!ok) return;

  await adminService.deleteRestaurant(id)
  restaurants.value.filter(restaurant => restaurant.id !== id)
}

// --- Меню ---
const selectedRestaurantId = ref('')
const sections = ref([
  {
    id: 'sec1',
    name: 'Пицца'
  },
  {
    id: 'sec2',
    name: 'Суши'
  }
]) // Секции выбранного ресторана
const dishes = ref([]) // Блюда выбранного ресторана

const sectionForm = ref({
  name: ''
})

const dishForm = ref({
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  section: '',
  rating: '',
  deliveryTime: '',
  categories: '',
  badge: '',
  restaurantId: '',
})

const handleSelectRestaurant = async () => {
  // TODO: загрузить секции и блюда для выбранного ресторана
  console.log('Selected restaurant:', selectedRestaurantId.value)
  dishes.value = await adminService.getDishesByRestaurant(selectedRestaurantId.value)
}

const handleAddSection = () => {
  // TODO: логика добавления секции
  console.log('Add section:', sectionForm.value)
}

const handleDeleteSection = (id) => {
  // TODO: логика удаления секции
  console.log('Delete section:', id)
}

const handleAddDish = async () => {
  dishForm.value.restaurantId = selectedRestaurantId.value
  const dishDoc = await adminService.addDish(dishForm.value);

  // После успешного добавления блюда, очищаем форму и добавляем новое блюдо в список
  dishForm.value = {
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    section: '',
    rating: '',
    deliveryTime: '',
    categories: '',
  }
  dishes.value.push(dishDoc);
}

const handleDeleteDish = async (id) => {
  // Перед удалением стоит показать модальное окно с подтверждением действия, так как это критичная операция
  const ok = await confirm({
    title: `Удалить блюдо #${id}?`,
    message: 'Вы уверены, что хотите удалить это блюдо? Это действие нельзя будет отменить.',
    confirmText: 'Удалить',
    cancelText: 'Отмена',
    variant: 'danger'
  })

  if (!ok) return;

  await adminService.deleteDish(id)
  dishes.value.filter(dish => dish.id !== id);
}
</script>

<template>
  <Header mode="lite" />

  <main class="admin-page">
    <div class="container-sm">
      <!-- Заголовок -->
      <div class="admin-page__header">
        <h2>Админ-панель</h2>
      </div>

      <!-- Табы навигации -->
      <div class="admin-tabs">
        <button
          class="admin-tabs__btn"
          :class="{ 'admin-tabs__btn--active': activeTab === 'restaurants' }"
          @click="activeTab = 'restaurants'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21V7L12 3L21 7V21H3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M9 21V13H15V21" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          Рестораны
        </button>
        <button
          class="admin-tabs__btn"
          :class="{ 'admin-tabs__btn--active': activeTab === 'menu' }"
          @click="activeTab = 'menu'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M4 18H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Меню и блюда
        </button>
      </div>

      <!-- ВКЛАДКА: РЕСТОРАНЫ -->
      <div v-if="activeTab === 'restaurants'" class="admin-content">
        <div class="row g-4">
          <!-- Форма добавления ресторана -->
          <div class="col-lg-5">
            <div class="admin-card">
              <div class="admin-card__header">
                <h4>Добавить ресторан</h4>
              </div>
              <div class="admin-card__body">
                <form @submit.prevent="handleAddRestaurant" class="admin-form">
                  <div class="admin-form__group">
                    <label class="admin-form__label">Название</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="restaurantForm.name"
                      placeholder="Название ресторана"
                      required
                    >
                  </div>

                  <div class="admin-form__group">
                    <label class="admin-form__label">Изображение (URL)</label>
                    <input
                      type="url"
                      class="form-control"
                      v-model="restaurantForm.imageUrl"
                      placeholder="https://example.com/image.jpg"
                    >
                    <!-- Превью изображения -->
                    <div v-if="restaurantForm.imageUrl" class="admin-form__preview">
                      <img :src="restaurantForm.imageUrl" alt="Preview">
                    </div>
                  </div>

                  <div class="row g-3">
                    <div class="col-6">
                      <div class="admin-form__group">
                        <label class="admin-form__label">Рейтинг</label>
                        <input
                          type="number"
                          class="form-control"
                          v-model="restaurantForm.rating"
                          placeholder="4.5"
                          min="0"
                          max="5"
                          step="0.1"
                        >
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="admin-form__group">
                        <label class="admin-form__label">Время доставки (мин)</label>
                        <input
                          type="number"
                          class="form-control"
                          v-model="restaurantForm.deliveryTime"
                          placeholder="30"
                          min="1"
                        >
                      </div>
                    </div>
                  </div>

                  <div class="admin-form__group">
                    <label class="admin-form__label">Бейдж</label>
                    <select class="form-control" v-model="restaurantForm.badge">
                      <option
                        v-for="opt in badgeOptions"
                        :key="opt"
                        :value="opt"
                      >
                        {{ getBadgeText(opt) }}
                      </option>
                    </select>
                  </div>

                  <div class="admin-form__group">
                    <label class="admin-form__label">Категории</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="restaurantForm.categories"
                      placeholder="asian, european, chicken..."
                    >
                  </div>

                  <button type="submit" class="btn btn-primary w-100 admin-form__submit">
                    Добавить ресторан
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Список ресторанов -->
          <div class="col-lg-7">
            <div class="admin-card">
              <div class="admin-card__header">
                <h4>Список ресторанов</h4>
                <span class="admin-card__counter">{{ restaurants.length }}</span>
              </div>
              <div class="admin-card__body">
                <!-- Пустое состояние -->
                <div v-if="restaurants.length === 0" class="admin-empty">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21V7L12 3L21 7V21H3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                    <path d="M9 21V13H15V21" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                  </svg>
                  <p>Ресторанов пока нет</p>
                </div>

                <!-- Список -->
                <!-- TODO: добавить пагинацию, если ресторанов будет много -->
                <div v-else class="admin-list">
                  <!-- TODO: Возможно стоит вынести в отдельный компонент -->
                  <div
                    v-for="rest in restaurants"
                    :key="rest.id"
                    class="admin-list__item"
                  >
                    <div class="admin-list__item-image">
                      <img :src="rest.imageUrl" :alt="rest.name">
                    </div>
                    <div class="admin-list__item-info">
                      <div class="admin-list__item-name">{{ rest.name }}</div>
                      <div class="admin-list__item-meta">
                        <span v-if="rest.badge" :class="`badge ${getBadgeClass(rest.badge)}`">{{ getBadgeText(rest.badge) }}</span>
                        <span class="admin-list__item-rating">⭐ {{ rest.rating }}</span>
                        <span class="admin-list__item-delivery">{{ formatDeliveryTime(rest.deliveryTime) }}</span>
                      </div>
                    </div>
                    <button class="admin-list__item-delete" @click="handleDeleteRestaurant(rest.id)" title="Удалить">
                      <!-- Иконка корзины для удаления -->
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="currentColor" stroke-width="2"/>
                        <path d="M5 6L6 20C6 20.5523 6.44772 21 7 21H17C17.5523 21 18 20.5523 18 20L19 6" stroke="currentColor" stroke-width="2"/>
                        <path d="M10 10V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M14 10V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ВКЛАДКА: МЕНЮ -->
      <div v-if="activeTab === 'menu'" class="admin-content">
        <!-- Выбор ресторана -->
        <div class="admin-card mb-4">
          <div class="admin-card__header">
            <h4>Выберите ресторан</h4>
          </div>
          <div class="admin-card__body">
            <select
              class="form-control admin-select--lg"
              v-model="selectedRestaurantId"
              @change="handleSelectRestaurant"
            >
              <option value="" disabled>— Выберите ресторан —</option>
              <option v-for="rest in restaurants" :key="rest.id" :value="rest.id">
                {{ rest.name }}
              </option>
            </select>

            <!-- Подсказка, если ресторанов нет -->
            <div v-if="restaurants.length === 0" class="admin-hint mt-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="8" r="1" fill="currentColor"/>
              </svg>
              Сначала добавьте хотя бы один ресторан во вкладке «Рестораны»
            </div>
          </div>
        </div>

        <!-- Контент меню (показывается при выбранном ресторане) -->
        <transition name="fade">
          <div v-if="selectedRestaurantId" class="row g-4">
            <!-- Секции -->
            <div class="col-lg-4">
              <div class="admin-card">
                <div class="admin-card__header">
                  <h4>Секции</h4>
                  <span class="admin-card__counter">{{ sections.length }}</span>
                </div>
                <div class="admin-card__body">
                  <!-- Форма добавления секции -->
                  <form @submit.prevent="handleAddSection" class="admin-form admin-form--inline">
                    <input
                      type="text"
                      class="form-control"
                      v-model="sectionForm.name"
                      placeholder="Название секции"
                      required
                    >
                    <button type="submit" class="btn btn-primary admin-form__btn-add" title="Добавить секцию">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </form>

                  <!-- Список секций -->
                  <div v-if="sections.length === 0" class="admin-empty admin-empty--sm">
                    <p>Секций пока нет</p>
                  </div>

                  <div v-else class="admin-sections-list">
                    <div
                      v-for="section in sections"
                      :key="section.id"
                      class="admin-sections-list__item"
                    >
                      <span class="admin-sections-list__item-name">{{ section.name }}</span>
                      <button
                        class="admin-sections-list__item-delete"
                        @click="handleDeleteSection(section.id)"
                        title="Удалить"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Добавление блюда + список блюд -->
            <div class="col-lg-8">
              <!-- Форма добавления блюда -->
              <div class="admin-card mb-4">
                <div class="admin-card__header">
                  <h4>Добавить блюдо</h4>
                </div>
                <div class="admin-card__body">
                  <form @submit.prevent="handleAddDish" class="admin-form">
                    <div class="row g-3">
                      <div class="col-md-6">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Название блюда</label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="dishForm.name"
                            placeholder="Маргарита"
                            required
                          >
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Секция</label>
                          <select class="form-control" v-model="dishForm.section" required>
                            <option value="" disabled>— Выберите секцию —</option>
                            <option v-for="sec in sections" :key="sec.id" :value="sec.id">
                              {{ sec.name }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Рейтинг</label>
                          <input
                            type="number"
                            class="form-control"
                            v-model="dishForm.rating"
                            placeholder="4.5"
                            min="0"
                            max="5"
                            step="0.1"
                          >
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Время доставки (мин)</label>
                          <input
                            type="number"
                            class="form-control"
                            v-model="dishForm.deliveryTime"
                            placeholder="30"
                            min="1"
                          >
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Цена (₸)</label>
                          <input
                            type="number"
                            class="form-control"
                            v-model="dishForm.price"
                            placeholder="590"
                            min="0"
                            step="1"
                            required
                          >
                        </div>
                      </div>
                      <div class="col-md-8">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Изображение (URL)</label>
                          <input
                            type="url"
                            class="form-control"
                            v-model="dishForm.imageUrl"
                            placeholder="https://example.com/dish.jpg"
                          >
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Бейдж</label>
                          <select class="form-control" v-model="dishForm.badge">
                            <option
                                v-for="opt in badgeOptions"
                                :key="opt"
                                :value="opt"
                            >
                              {{ getBadgeText(opt) }}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="admin-form__group">
                          <label class="admin-form__label">Категории</label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="dishForm.categories"
                            placeholder="asian, european, chicken..."
                          >
                        </div>
                      </div>
                    </div>

                    <!-- Превью блюда -->
                    <div v-if="dishForm.imageUrl" class="admin-form__preview admin-form__preview--dish">
                      <img :src="dishForm.imageUrl" alt="Preview">
                    </div>

                    <button type="submit" class="btn btn-primary w-100 admin-form__submit">
                      Добавить блюдо
                    </button>
                  </form>
                </div>
              </div>

              <!-- Список блюд -->
              <!-- TODO: Сделать пагинацию, если блюд слишком много -->
              <div class="admin-card">
                <div class="admin-card__header">
                  <h4>Блюда ресторана</h4>
                  <span class="admin-card__counter">{{ dishes.length }}</span>
                </div>
                <div class="admin-card__body">
                  <div v-if="dishes.length === 0" class="admin-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <p>Блюд пока нет</p>
                  </div>

                  <!-- TODO: Возможно стоит вынести в отдельный компонент -->
                  <div v-else class="admin-dishes-list">
                    <div
                      v-for="dish in dishes"
                      :key="dish.id"
                      class="admin-dishes-list__item"
                    >
                      <div class="admin-dishes-list__item-image">
                        <img :src="dish.imageUrl" :alt="dish.name">
                      </div>
                      <div class="admin-dishes-list__item-info">
                        <div class="admin-dishes-list__item-name">{{ dish.name }}</div>
                        <div class="admin-dishes-list__item-meta">
                          <span class="admin-dishes-list__item-section">{{ dish.section }}</span>
                          <span class="admin-dishes-list__item-price">{{ formatPrice(dish.price) }}</span>
                        </div>
                      </div>

                      <!-- Иконка корзины для удаления -->
                      <button class="admin-list__item-delete" @click="handleDeleteDish(dish.id)" title="Удалить">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="currentColor" stroke-width="2"/>
                          <path d="M5 6L6 20C6 20.5523 6.44772 21 7 21H17C17.5523 21 18 20.5523 18 20L19 6" stroke="currentColor" stroke-width="2"/>
                          <path d="M10 10V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          <path d="M14 10V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </main>

  <Footer />
</template>

<style scoped lang="scss">
.admin-page {
  padding: 40px 0 80px;
  min-height: calc(100vh - var(--header-height) - 200px);

  &__header {
    margin-bottom: 32px;

    h2 {
      margin: 0;
    }
  }
}

// Табы навигации
.admin-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0;

  &__btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 24px;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
    font-family: $font-family, sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: #8e97a6;
    cursor: pointer;
    transition: all 0.3s ease;

    svg {
      flex-shrink: 0;
    }

    &:hover {
      color: $purple;
      background: rgba(108, 95, 188, 0.03);
    }

    &--active {
      color: $purple;
      border-bottom-color: $purple;
    }
  }
}

// Контент
.admin-content {
  animation: fadeIn 0.3s ease;
}

// Карточки
.admin-card {
  background: #fff;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;

    h4 {
      font-family: $font-family, sans-serif;
      font-weight: 700;
      font-size: 22px;
      color: #323142;
      margin: 0;
    }
  }

  &__counter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 10px;
    background: rgba(108, 95, 188, 0.1);
    color: $purple;
    border-radius: 50px;
    font-family: $font-family, sans-serif;
    font-weight: 700;
    font-size: 14px;
  }
}

// Формы
.admin-form {
  &__group {
    margin-bottom: 18px;
  }

  &__label {
    display: block;
    font-family: $font-family, sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: #323142;
    margin-bottom: 8px;
  }

  .form-control,
  select.form-control,
  textarea.form-control {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid #e0e0e0;
    border-radius: 12px;
    font-family: $second-family, sans-serif;
    font-size: 15px;
    background: #fff;
    transition: all 0.2s ease;
    appearance: auto;

    &:focus {
      outline: none;
      border-color: $purple;
      box-shadow: 0 0 0 3px rgba(108, 95, 188, 0.1);
    }

    &::placeholder {
      color: #c0c0c0;
    }
  }

  textarea.form-control {
    resize: vertical;
    min-height: 60px;
  }

  &__preview {
    margin-top: 12px;
    border-radius: 16px;
    overflow: hidden;
    border: 2px solid #f0f0f0;
    max-height: 180px;

    img {
      width: 100%;
      height: 100%;
      max-height: 180px;
      object-fit: cover;
      display: block;
    }

    &--dish {
      max-height: 120px;
      margin-bottom: 18px;

      img {
        max-height: 120px;
      }
    }
  }

  &__submit {
    margin-top: 8px;
    padding: 14px;
    font-size: 16px;
    border-radius: 14px;
  }

  &__checkbox {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-family: $font-family, sans-serif;
    font-weight: 600;
    font-size: 15px;
    color: #323142;
    user-select: none;

    input[type="checkbox"] {
      display: none;
    }

    &-mark {
      width: 22px;
      height: 22px;
      border: 2px solid #d0d0d0;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;

      &::after {
        content: '';
        width: 12px;
        height: 12px;
        background: $purple;
        border-radius: 3px;
        transform: scale(0);
        transition: transform 0.2s ease;
      }
    }

    input[type="checkbox"]:checked + &-mark {
      border-color: $purple;

      &::after {
        transform: scale(1);
      }
    }
  }

  // Инлайновая форма (секции)
  &--inline {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .form-control {
      flex: 1;
    }
  }

  &__btn-add {
    width: 48px;
    height: 48px;
    min-width: 48px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    flex-shrink: 0;
  }
}

.admin-select--lg {
  padding: 14px 18px !important;
  font-size: 16px !important;
  font-weight: 500;
}

// Подсказка
.admin-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: $second-family, sans-serif;
  font-size: 14px;
  color: #8e97a6;

  svg {
    flex-shrink: 0;
    color: $purple;
  }
}

// Пустое состояние
.admin-empty {
  text-align: center;
  padding: 40px 20px;
  color: #c0c0c0;

  svg {
    margin-bottom: 12px;
    opacity: 0.5;
  }

  p {
    font-family: $second-family, sans-serif;
    font-size: 15px;
    color: #8e97a6;
    margin: 0;
  }

  &--sm {
    padding: 20px 10px;

    svg {
      display: none;
    }
  }
}

// Список ресторанов
.admin-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px;
    background: #f9f9f9;
    border-radius: 16px;
    transition: all 0.2s ease;

    &:hover {
      background: #f4f2ff;
    }

    &-image {
      width: 64px;
      height: 50px;
      border-radius: 10px;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-info {
      flex: 1;
      min-width: 0;
    }

    &-name {
      font-family: $font-family, sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: #323142;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 4px;
    }

    &-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: $second-family, sans-serif;
      font-size: 13px;
      color: #8e97a6;
    }

    &-rating,
    &-delivery {
      white-space: nowrap;
    }

    &-delete {
      width: 40px;
      height: 40px;
      min-width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(229, 73, 43, 0.08);
      border: none;
      border-radius: 10px;
      color: #e5492b;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(229, 73, 43, 0.15);
        transform: scale(1.05);
      }
    }
  }
}

// Список секций
.admin-sections-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    background: #f9f9f9;
    border-radius: 12px;
    transition: all 0.2s ease;

    &:hover {
      background: #f4f2ff;
    }

    &-name {
      font-family: $font-family, sans-serif;
      font-weight: 600;
      font-size: 15px;
      color: #323142;
    }

    &-delete {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: #c0c0c0;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(229, 73, 43, 0.1);
        color: #e5492b;
      }
    }
  }
}

// Список блюд
.admin-dishes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px;
    background: #f9f9f9;
    border-radius: 16px;
    transition: all 0.2s ease;

    &:hover {
      background: #f4f2ff;
    }

    &-image {
      width: 72px;
      height: 56px;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &-info {
      flex: 1;
      min-width: 0;
    }

    &-name {
      font-family: $font-family, sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: #323142;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    &-section {
      font-family: $second-family, sans-serif;
      font-size: 13px;
      color: #8e97a6;
      background: rgba(108, 95, 188, 0.08);
      padding: 2px 8px;
      border-radius: 6px;
    }

    &-price {
      font-family: $font-family, sans-serif;
      font-weight: 700;
      font-size: 15px;
      color: $purple;
    }

    &-popular {
      font-size: 16px;
    }
  }
}

// Анимации
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

// Адаптивные стили
@media screen and (max-width: 1199.98px) {
  .admin-card {
    padding: 24px;

    &__header h4 {
      font-size: 20px;
    }
  }
}

@media screen and (max-width: 991.98px) {
  .admin-page {
    padding: 30px 0 60px;

    &__header h2 {
      font-size: 36px;
    }
  }

  .admin-tabs {
    &__btn {
      padding: 12px 18px;
      font-size: 15px;
    }
  }

  .admin-card {
    padding: 20px;
  }
}

@media screen and (max-width: 767.98px) {
  .admin-page {
    padding: 20px 0 40px;

    &__header {
      margin-bottom: 20px;

      h2 {
        font-size: 28px;
      }
    }
  }

  .admin-tabs {
    gap: 4px;
    overflow-x: auto;

    &__btn {
      padding: 10px 14px;
      font-size: 14px;
      white-space: nowrap;

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }

  .admin-card {
    padding: 18px;
    border-radius: 20px;

    &__header {
      margin-bottom: 18px;
      padding-bottom: 14px;

      h4 {
        font-size: 18px;
      }
    }
  }

  .admin-form {
    &__label {
      font-size: 13px;
    }

    .form-control {
      padding: 10px 14px;
      font-size: 14px;
    }

    &--inline {
      gap: 8px;
    }

    &__btn-add {
      width: 44px;
      height: 44px;
      min-width: 44px;
    }
  }

  .admin-list__item {
    padding: 12px;
    gap: 12px;

    &-image {
      width: 52px;
      height: 40px;
    }

    &-name {
      font-size: 15px;
    }

    &-delete {
      width: 36px;
      height: 36px;
      min-width: 36px;
    }
  }

  .admin-dishes-list__item {
    padding: 12px;
    gap: 12px;

    &-image {
      width: 56px;
      height: 44px;
    }
  }
}

@media screen and (max-width: 566.98px) {
  .admin-tabs {
    &__btn {
      padding: 10px 12px;
      font-size: 13px;
      gap: 6px;
    }
  }

  .admin-card {
    padding: 14px;
    border-radius: 16px;
  }

  .admin-list__item-meta {
    flex-wrap: wrap;
    gap: 6px;
  }

  .admin-dishes-list__item-meta {
    flex-wrap: wrap;
    gap: 6px;
  }
}
</style>