<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['next-page', 'prev-page', 'update:currentPage'])

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.totalItems / props.pageSize))
})

const isFirstPage = computed(() => props.currentPage <= 1)
const isLastPage = computed(() => props.currentPage >= totalPages.value)

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
  }
}

const prevPage = () => {
  emit('prev-page')
}

const nextPage = () => {
  emit('next-page')
}
</script>

<template>
  <!-- TODO: Переделать компонент чтобы можно было использовать через <slot></slot> -->
  <nav v-if="totalPages > 1" class="pagination-controls" aria-label="Пагинация">
    <!-- Кнопка для возврата на предыдущую страницу -->
    <button
      class="pagination-controls__btn pagination-controls__btn--prev"
      :disabled="isFirstPage"
      @click="prevPage"
      aria-label="Предыдущая страница"
    >
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
        <path d="M6 1L1 6L6 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Текущая страница -->
    <ul class="pagination-controls__pages">
      <li
        v-for="page in totalPages"
        :key="page"
        :class="['pagination-controls__page', { 'pagination-controls__page--active': page === currentPage }]"
      >
        <button @click="goToPage(page)" :aria-label="'Страница ' + page">
          {{ page }}
        </button>
      </li>
    </ul>

    <!-- Кнопка для перехода на следующую страницу -->
    <button
      class="pagination-controls__btn pagination-controls__btn--next"
      :disabled="isLastPage"
      @click="nextPage"
      aria-label="Следующая страница"
    >
      <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
        <path d="M1 1L6 6L1 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </nav>
</template>

<style lang="scss" scoped>
.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  margin-bottom: 24px;

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    background: #fff;
    color: #323142;
    cursor: pointer;
    transition: 0.2s all;

    &:hover:not(:disabled) {
      background: $purple;
      color: #fff;
      border-color: $purple;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__pages {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__page {
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 1px solid transparent;
      background: transparent;
      font-family: $font-family, sans-serif;
      font-weight: 600;
      font-size: 15px;
      color: #8e97a6;
      cursor: pointer;
      transition: 0.2s all;

      &:hover {
        background: rgba($purple, 0.08);
        color: $purple;
      }
    }

    &--active button {
      background: $purple;
      color: #fff;
      border-color: $purple;
      pointer-events: none;
    }
  }
}

@media screen and (max-width: 566.98px) {
  .pagination-controls {
    gap: 4px;

    &__btn,
    &__page button {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      font-size: 14px;
    }
  }
}
</style>
