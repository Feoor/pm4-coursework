<script setup>
import {getBadgeText} from "@/utils/helpers.js";
import AdminRestaurantCard from "@/components/admin/AdminRestaurantCard.vue";
import PaginationControls from "@/components/PaginationControls.vue";
import {adminService} from "@/services/adminService.js";
import {usePagination} from "@/composables/usePagination.js";
import { useConfirmModal } from "@/composables/useConfirmModal.js";
import {onMounted, ref} from "vue";

const { confirm } = useConfirmModal();

// --- Рестораны ---
const restaurantsPerPageSize = 10; // Кол-во ресторанов на странице (для пагинации)

// Функции для пагинации ресторанов
const fetchRestaurants = (params) => adminService.getRestaurants(params);
const countRestaurants = () => adminService.getRestaurantsCount();

// Пагинация ресторанов
const {
  displayedItems: displayedRestaurants,
  nextPage: nextRestaurantsPage,
  prevPage: prevRestaurantsPage,
  goToPage: goToRestaurantsPage,
  totalCount: restaurantsTotalCount,
  currentPage: restaurantsCurrentPage,
  fetchTotalCount: fetchRestaurantsTotalCount,
} = usePagination(
    fetchRestaurants,
    countRestaurants,
    restaurantsPerPageSize
)

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
  displayedRestaurants.value.push(restaurantDoc);
}

const handleDeleteRestaurant = async (id) => {
  // Перед удалением стоит показать модальное окно с подтверждением действия, так как это критичная операция
  const ok = await confirm({
    title: `Удалить ресторан #${id}?`,
    message: 'Вы уверены, что хотите удалить этот ресторан? Это действие нельзя будет отменить.',
    confirmText: 'Удалить',
    cancelText: 'Отмена',
    variant: 'danger'
  });

  if (!ok) return;

  await adminService.deleteRestaurant(id)
  displayedRestaurants.value.filter(restaurant => restaurant.id !== id)
}

onMounted(async () => {
  console.log('Загрузка ресторанов')
  await fetchRestaurantsTotalCount();
  await nextRestaurantsPage();
})
</script>

<template>
  <div class="admin-content">
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
            <span class="admin-card__counter">{{ restaurantsTotalCount }}</span>
          </div>
          <div class="admin-card__body">
            <!-- Пустое состояние -->
            <div v-if="restaurantsTotalCount === 0" class="admin-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21V7L12 3L21 7V21H3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M9 21V13H15V21" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
              <p>Ресторанов пока нет</p>
            </div>

            <!-- Список -->
            <div v-else class="admin-restaurants-list">
              <PaginationControls
                :current-page="restaurantsCurrentPage"
                :total-items="restaurantsTotalCount"
                :page-size="restaurantsPerPageSize"
                @go-to-page="goToRestaurantsPage"
                @next-page="nextRestaurantsPage"
                @prev-page="prevRestaurantsPage"
              />

              <AdminRestaurantCard
                v-for="rest in displayedRestaurants"
                :key="rest.id"
                :rest="rest"
                @delete-restaurant="handleDeleteRestaurant"
              />

              <PaginationControls
                :current-page="restaurantsCurrentPage"
                :total-items="restaurantsTotalCount"
                :page-size="restaurantsPerPageSize"
                @go-to-page="goToRestaurantsPage"
                @next-page="nextRestaurantsPage"
                @prev-page="prevRestaurantsPage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/admin-page.scss";

// Список ресторанов
.admin-restaurants-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media screen and (max-width: 566.98px) {
  .admin-restaurants-list__item-meta {
    flex-wrap: wrap;
    gap: 6px;
  }
}
</style>