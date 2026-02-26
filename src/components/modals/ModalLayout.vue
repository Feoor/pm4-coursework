<script setup>
import { watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: '600px'
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  closeOnOverlayClick: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

// Блокировка/разблокировка скролла
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.classList.add('lock')
  } else {
    document.body.classList.remove('lock')
  }
})

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    emit('close')
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click.self="handleOverlayClick">
      <div class="modal-container" :style="{ maxWidth }">
        <!-- Заголовок -->
        <div v-if="showHeader" class="modal-header">
          <slot name="header">
            <h3>{{ title }}</h3>
          </slot>
          <button class="close-btn" @click="handleClose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Тело модального окна -->
        <div class="modal-body">
          <slot></slot>
        </div>

        <!-- Футер -->
        <div v-if="showFooter" class="modal-footer">
          <slot name="footer">
            <button class="btn btn-secondary" @click="handleClose">
              Закрыть
            </button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

// Оверлей
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

// Контейнер модального окна
.modal-container {
  background: #fff;
  border-radius: 30px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  scrollbar-width: none;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  &::-webkit-scrollbar {
    display: none;
  }
}

// Заголовок
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 30px 20px;
  border-bottom: 1px solid #f0f0f0;

  h3 {
    font-family: $font-family, sans-serif;
    font-weight: 700;
    font-size: 24px;
    color: #323142;
    margin: 0;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 50%;
    color: #8e97a6;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #f0f0f0;
      color: #323142;
    }
  }
}

// Тело модального окна
.modal-body {
  padding: 30px;
}

// Футер
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 30px 30px;
  border-top: 1px solid #f0f0f0;
}

// Анимация модального окна
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-container {
    transform: scale(0.9) translateY(-20px);
  }
}

// Адаптивные стили
@media screen and (max-width: 767.98px) {
  .modal-container {
    border-radius: 20px;
  }

  .modal-header {
    padding: 20px 20px 16px;

    h3 {
      font-size: 20px;
    }
  }

  .modal-body {
    padding: 20px;
  }

  .modal-footer {
    padding: 16px 20px 20px;
    flex-direction: column-reverse;

    :deep(.btn) {
      width: 100%;
      min-width: unset;
    }
  }
}

@media screen and (max-width: 566.98px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal-header h3 {
    font-size: 18px;
  }
}
</style>