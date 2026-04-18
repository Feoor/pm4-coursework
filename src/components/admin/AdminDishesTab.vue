<script setup>
import {getBadgeText} from "@/utils/helpers.js";
import PaginationControls from "@/components/PaginationControls.vue";
import AdminDishCard from "@/components/admin/AdminDishCard.vue";
import {usePagination} from "@/composables/usePagination.js";
import {adminService} from "@/services/adminService.js";
import {Dish} from "@/models/Dish.js";
import { useConfirmModal } from "@/composables/useConfirmModal.js";
import {onMounted, ref} from "vue";

// Icons
import { Info, Plus, NotepadTextDashed } from '@lucide/vue';

const { confirm } = useConfirmModal();

// Переменные
const restaurantsTotalCount = ref(0);
const restaurants = ref([]);
const badgeOptions = [
  '',
  'healthy',
  'trending',
  'supreme',
  'spicy',
]

onMounted(async () => {
  restaurantsTotalCount.value = await adminService.getRestaurantsCount();
  const res = await adminService.getRestaurants({ batchSize: restaurantsTotalCount.value });
  restaurants.value = res.items;
})

// --- Меню ---
const selectedRestaurantId = ref('')
const sections = ref([
  {
    id: 'Пицца',
    name: 'Пицца'
  },
  {
    id: 'Суши',
    name: 'Суши'
  },
  {
    id: 'Напитки',
    name: 'Напитки'
  }
]) // Секции выбранного ресторана
const dishesPerPageSize = 10; // Кол-во блюд на странице (для пагинации)

const {
  displayedItems: displayedDishes,
  nextPage: nextDishesPage,
  prevPage: prevDishesPage,
  goToPage: goToDishesPage,
  totalCount: dishesTotalCount,
  currentPage: dishesCurrentPage,
  reset: resetDishesPagination,
  updateItems: updateDishes,
} = usePagination(
    null, // fetchDishes будет устанавливаться динамически при выборе ресторана
    null,
    dishesPerPageSize
)

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
  console.log('Selected restaurant:', selectedRestaurantId.value)

  const fetchDishes = (params) => adminService.getDishesByRestaurant(selectedRestaurantId.value, params);
  const countDishes = () => adminService.getDishesCountByRestaurant(selectedRestaurantId.value);

  // Сбрасываем пагинацию на первую страницу при выборе нового пользователя
  // и обновляем функции для получения заказов и их количества
  await resetDishesPagination(fetchDishes, countDishes);
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
  const newDish = new Dish({
    id: dishDoc.id,
    ...dishForm.value
  })

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

  updateDishes([newDish], true) // Добавляем новое блюдо в начало списка, так как оно самое свежее
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
  displayedDishes.value.filter(dish => dish.id !== id);
}
</script>

<template>
  <div class="admin-content">
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
        <div v-if="restaurantsTotalCount === 0" class="admin-hint mt-3">
          <Info size="20" />
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
                  <Plus />
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
                    <Plus class="rotate-45" />
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
          <div class="admin-card">
            <div class="admin-card__header">
              <h4>Блюда ресторана</h4>
              <span class="admin-card__counter">{{ dishesTotalCount }}</span>
            </div>
            <div class="admin-card__body">
              <div v-if="dishesTotalCount === 0" class="admin-empty flex flex-col items-center">
                <NotepadTextDashed size="48"/>
                <p>Блюд пока нет</p>
              </div>

              <div v-else class="admin-dishes-list">
                <PaginationControls
                    :current-page="dishesCurrentPage"
                    :total-items="dishesTotalCount"
                    :page-size="dishesPerPageSize"
                    @go-to-page="goToDishesPage"
                    @next-page="nextDishesPage"
                    @prev-page="prevDishesPage"
                />

                <AdminDishCard
                    v-for="dish in displayedDishes"
                    :key="dish.id"
                    :dish="dish"
                    @delete-dish="handleDeleteDish"
                />

                <PaginationControls
                    :current-page="dishesCurrentPage"
                    :total-items="dishesTotalCount"
                    :page-size="dishesPerPageSize"
                    @go-to-page="goToDishesPage"
                    @next-page="nextDishesPage"
                    @prev-page="prevDishesPage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/admin-page.scss";

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

// Адаптивные стили
@media screen and (max-width: 566.98px) {
  .admin-dishes-list__item-meta {
    flex-wrap: wrap;
    gap: 6px;
  }
}
</style>