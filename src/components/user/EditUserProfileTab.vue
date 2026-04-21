<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../store/authStore';
import { userService } from '../../services/userService.js';
import {formatPhoneNumber} from '../../utils/formatters'

// User Profile
const authStore = useAuthStore();

// Profile change
const isEditing = ref(false)
const editForm = ref({
  displayName: '',
  phoneNumber: '',
  address: ''
})

const handleEditProfile = () => {
  // Заполняем форму текущими данными профиля
  editForm.value = {
    displayName: authStore.profile?.displayName || '',
    phoneNumber: formatPhoneNumber(authStore.profile?.phoneNumber || ''),
    address: authStore.profile?.deliveryAddress || ''
  }
  isEditing.value = true
}

const handlePhoneNumberInput = (event) => {
  let value = event.target.value.replace(/\D/g, '') // Удаляем все не цифровые символы
  if (value.length > 11) value = value.slice(0, 11) // Ограничиваем до 11 цифр
  editForm.value.phoneNumber = formatPhoneNumber(value) // Форматируем номер телефона
}

const handleSaveProfile = async () => {
  if (!authStore.profile?.id) {
    console.error('Cannot save profile: user is not authenticated');
    return;
  }

  try {
    await userService.updateUserProfile(authStore.profile.id, {
      displayName: editForm.value.displayName,
      phoneNumber: editForm.value.phoneNumber,
      deliveryAddress: editForm.value.address
    })

    // Обновляем локальный профиль
    authStore.profile.displayName = editForm.value.displayName
    authStore.profile.phoneNumber = editForm.value.phoneNumber
    authStore.profile.deliveryAddress = editForm.value.address

    isEditing.value = false
  } catch (error) {
    console.error('Error saving profile:', error);
    alert('Error saving profile');
  }
}

const handleCancelEdit = () => {
  isEditing.value = false
  editForm.value = {
    displayName: authStore.profile?.displayName || '',
    phoneNumber: authStore.profile?.phoneNumber || '',
    address: authStore.profile?.deliveryAddress || ''
  }
}
</script>

<template>
  <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
    <h4>Личные данные</h4>
    <button
        v-if="!isEditing"
        class="btn btn-primary btn-sm"
        @click="handleEditProfile"
    >
      Редактировать
    </button>
    <div v-else class="d-flex gap-2">
      <button class="btn btn-primary btn-sm" @click="handleSaveProfile">
        Сохранить
      </button>
      <button class="btn btn-secondary btn-sm" @click="handleCancelEdit">
        Отмена
      </button>
    </div>
  </div>

  <div class="info-card__body">
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Имя</label>
        <input
            type="text"
            class="form-control"
            v-model="editForm.displayName"
            :disabled="!isEditing"
            placeholder="Введите ваше имя"
        >
      </div>
      <div class="col-md-6">
        <label class="form-label">Email</label>
        <input
            type="email"
            class="form-control"
            :value="authStore.profile?.email || ''"
            disabled
        >
      </div>
      <div class="col-md-6">
        <label class="form-label">Телефон</label>
        <input
            type="tel"
            class="form-control"
            :value="editForm.phoneNumber"
            @input="handlePhoneNumberInput"
            :disabled="!isEditing"
            placeholder="+7 (___) ___-__-__"
            maxlength="18"
        >
      </div>
      <div class="col-md-6">
        <label class="form-label">Дата регистрации</label>
        <input
            type="text"
            class="form-control"
            :value="authStore.profile?.formattedCreatedAt || 'Не указано'"
            disabled
        >
      </div>
      <div class="col-12">
        <label class="form-label">Адрес доставки</label>
        <input
            type="text"
            class="form-control"
            v-model="editForm.address"
            :disabled="!isEditing"
            placeholder="Введите адрес доставки"
            maxlength="255"
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
h4 {
  font-family: $font-family, sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: #323142;
  margin: 0;
}

.form-label {
  font-family: $font-family, sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #323142;
  margin-bottom: 8px;
}

.form-control {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  padding: 12px 16px;
  font-family: $second-family, sans-serif;
  font-size: 15px;

  &:disabled {
    background-color: #f9f9f9;
    color: #8e97a6;
    cursor: not-allowed;
  }
}
</style>