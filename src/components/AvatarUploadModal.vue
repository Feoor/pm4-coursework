<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  currentAvatar: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'upload'])

// Локальное состояние
const selectedFile = ref(null)
const previewUrl = ref(props.currentAvatar)
const fileInput = ref(null)
const isDragging = ref(false)

// Сброс превью при открытии модального окна
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    previewUrl.value = props.currentAvatar
    selectedFile.value = null
  } else {
    // Блокировка/разблокировка скролла
    document.body.classList.remove('lock')
  }
  
  if (newValue) {
    document.body.classList.add('lock')
  }
})

// Обработчик выбора файла
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Drag and Drop
const handleDragOver = (event) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false
  
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Открыть диалог выбора файла
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Удалить текущее фото
const handleRemovePhoto = () => {
  selectedFile.value = null
  previewUrl.value = 'https://via.placeholder.com/300'
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Сохранить изменения
const handleSave = () => {
  if (selectedFile.value) {
    // TODO: Логика загрузки файла
    emit('upload', selectedFile.value)
  }
  emit('close')
}

// Закрыть модальное окно
const handleClose = () => {
  emit('close')
}
</script>

<template>
  <transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
      <div class="modal-container">
        <!-- Заголовок -->
        <div class="modal-header">
          <h3>Изменить фото профиля</h3>
          <button class="close-btn" @click="handleClose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Тело модального окна -->
        <div class="modal-body">
          <!-- Превью -->
          <div class="preview-section">
            <div class="avatar-preview">
              <img :src="previewUrl || 'https://via.placeholder.com/300'" alt="Preview">
            </div>
          </div>

          <!-- Зона загрузки -->
          <div 
            class="upload-zone"
            :class="{ 'upload-zone--dragging': isDragging }"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
          >
            <div class="upload-zone__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h4>Перетащите изображение сюда</h4>
            <p>или</p>
            <button class="btn btn-secondary" @click="triggerFileInput">
              Выбрать файл
            </button>
            <input 
              ref="fileInput"
              type="file" 
              accept="image/*"
              class="file-input"
              @change="handleFileSelect"
            >
            <span class="upload-hint">PNG, JPG, GIF до 5MB</span>
          </div>

          <!-- Информация о выбранном файле -->
          <div v-if="selectedFile" class="file-info">
            <div class="file-info__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13 2V9H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="file-info__details">
              <div class="file-name">{{ selectedFile.name }}</div>
              <div class="file-size">{{ (selectedFile.size / 1024).toFixed(2) }} KB</div>
            </div>
            <button class="file-info__remove" @click="handleRemovePhoto">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Футер -->
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="handleClose">
            Отмена
          </button>
          <button 
            class="btn btn-primary" 
            :disabled="!selectedFile"
            @click="handleSave"
          >
            Сохранить
          </button>
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  scrollbar-width: none;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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

// Превью
.preview-section {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;

  .avatar-preview {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid #f0f0f0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

// Зона загрузки
.upload-zone {
  border: 2px dashed #d0d0d0;
  border-radius: 20px;
  padding: 40px 20px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: $purple;
    background: rgba(108, 95, 188, 0.02);
  }

  &--dragging {
    border-color: $purple;
    background: rgba(108, 95, 188, 0.05);
  }

  &__icon {
    color: $purple;
    margin-bottom: 16px;

    svg {
      opacity: 0.6;
    }
  }

  h4 {
    font-family: $font-family, sans-serif;
    font-weight: 600;
    font-size: 18px;
    color: #323142;
    margin-bottom: 8px;
  }

  p {
    font-family: $second-family, sans-serif;
    font-size: 14px;
    color: #8e97a6;
    margin-bottom: 16px;
  }

  .file-input {
    display: none;
  }

  .upload-hint {
    display: block;
    margin-top: 12px;
    font-family: $second-family, sans-serif;
    font-size: 13px;
    color: #8e97a6;
  }
}

// Информация о файле
.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 16px;

  &__icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 10px;
    color: $purple;
    flex-shrink: 0;
  }

  &__details {
    flex: 1;
    min-width: 0;

    .file-name {
      font-family: $font-family, sans-serif;
      font-weight: 600;
      font-size: 14px;
      color: #323142;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 2px;
    }

    .file-size {
      font-family: $second-family, sans-serif;
      font-size: 12px;
      color: #8e97a6;
    }
  }

  &__remove {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: #e5492b;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(229, 73, 43, 0.1);
    }
  }
}

// Футер
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 30px 30px;
  border-top: 1px solid #f0f0f0;

  .btn {
    min-width: 120px;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
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

  .preview-section .avatar-preview {
    width: 150px;
    height: 150px;
  }

  .upload-zone {
    padding: 30px 16px;

    h4 {
      font-size: 16px;
    }
  }

  .modal-footer {
    padding: 16px 20px 20px;
    flex-direction: column-reverse;

    .btn {
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

  .preview-section .avatar-preview {
    width: 120px;
    height: 120px;
  }

  .upload-zone {
    padding: 24px 12px;

    &__icon svg {
      width: 40px;
      height: 40px;
    }

    h4 {
      font-size: 15px;
    }

    p {
      font-size: 13px;
    }
  }

  .file-info {
    padding: 12px;

    &__icon {
      width: 36px;
      height: 36px;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    &__details .file-name {
      font-size: 13px;
    }
  }
}
</style>
