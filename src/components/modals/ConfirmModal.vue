<script setup>
import ModalLayout from '@/components/modals/ModalLayout.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Подтверждение'
  },
  message: {
    type: String,
    default: 'Вы уверены, что хотите продолжить?'
  },
  confirmText: {
    type: String,
    default: 'Подтвердить'
  },
  cancelText: {
    type: String,
    default: 'Отмена'
  },
  variant: {
    type: String,
    default: 'danger', // 'danger' | 'primary'
    validator: (v) => ['danger', 'primary'].includes(v)
  }
})

const emit = defineEmits(['close', 'confirm'])

const handleConfirm = () => {
  emit('confirm', true)
  emit('close')
}

const handleCancel = () => {
  emit('confirm', false)
  emit('close')
}
</script>

<template>
  <ModalLayout
    :is-open="isOpen"
    :title="title"
    max-width="460px"
    :close-on-overlay-click="false"
    @close="handleCancel"
  >
    <p class="confirm-message">{{ message }}</p>

    <template #footer>
      <button class="btn btn-cancel" @click="handleCancel">
        {{ cancelText }}
      </button>
      <button
        class="btn"
        :class="variant === 'danger' ? 'btn-danger' : 'btn-primary'"
        @click="handleConfirm"
      >
        {{ confirmText }}
      </button>
    </template>
  </ModalLayout>
</template>

<style scoped lang="scss">
@import '@/assets/styles/_variables.scss';

.confirm-message {
  font-family: $second-family, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  margin: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 12px;
  font-family: $font-family, sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  min-width: 130px;

  &-cancel {
    background: #f0f0f0;
    color: #555;

    &:hover {
      background: #e0e0e0;
    }
  }

  &-danger {
    background: #e74c3c;
    color: #fff;

    &:hover {
      background: #c0392b;
    }
  }

  &-primary {
    background: $purple;
    color: #fff;

    &:hover {
      background: $purple-hover;
    }
  }
}
</style>