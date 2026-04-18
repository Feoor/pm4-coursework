<script setup>
import { ref, watch } from 'vue'
import ModalLayout from '@/components/modals/ModalLayout.vue'

// Icons
import { Upload, File, Plus } from '@lucide/vue';

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
  <ModalLayout
    :isOpen="isOpen"
    title="Изменить фото профиля"
    @close="handleClose"
  >
    <template #default>
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
            <div class="upload-zone__icon flex justify-center">
              <Upload size="48" />
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
              <File />
            </div>
            <div class="file-info__details">
              <div class="file-name">{{ selectedFile.name }}</div>
              <div class="file-size">{{ (selectedFile.size / 1024).toFixed(2) }} KB</div> 
            </div>
            <button class="file-info__remove" @click="handleRemovePhoto">
              <Plus class="rotate-45" />
            </button>
          </div>
    </template>

    <template #footer>
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
    </template>
  </ModalLayout>
</template>

<style lang="scss" scoped>
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

// Стили для кнопок в футере
:deep(.btn) {
  min-width: 120px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// Адаптивные стили
@media screen and (max-width: 767.98px) {
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
}

@media screen and (max-width: 566.98px) {
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
