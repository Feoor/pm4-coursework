<script setup>
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import {userService} from '@/services/userService';

const feedbackFullNameInput = ref('');
const feedbackEmailInput = ref('');
const feedbackComment = ref('');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateFullName = (fullName) => {
  const fullNameRegex = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
  return fullNameRegex.test(fullName);
};

const validateComment = (comment) => {
  return comment.trim().length > 0;
};

const checkValidity = () => {
  const isFullNameValid = validateFullName(feedbackFullNameInput.value);
  const isEmailValid = validateEmail(feedbackEmailInput.value);
  const isCommentValid = validateComment(feedbackComment.value);

  return isFullNameValid && isEmailValid && isCommentValid;
};

const handleSubmit = async (event) => {

  const form = event.target;
  if (checkValidity()) {
    const contactMessageId = await userService.sendContactForm({
      name: feedbackFullNameInput.value,
      email: feedbackEmailInput.value,
      message: feedbackComment.value
    });

    alert('Ваше сообщение успешно отправлено!');
    console.log('ID отправленного сообщения:', contactMessageId);
    form.reset();
  } else {
    alert('Пожалуйста, заполните все поля корректно.');
    form.classList.add('was-validated'); // Добавляем класс для отображения ошибок валидации
  }
};
</script>

<template>
  <Header />

  <main class="main">
    <!--  Контакты  -->
    <section class="contact position-relative">
      <div class="container-sm">
        <div class="contact__wrapper row g-0 gx-sm-5">

          <!--  Иллюстрации(слева)  -->
          <div class="contact__illustrations col-12 col-sm-4 col-md-6">
            <div class="illustrations__purple-block">
              <h2 class="illustrations__title text-center">Just Contact</h2>
            </div>
          </div>

          <!--  Форма обратной связи(справа)  -->
          <div class="contact__support col-12 col-sm-8 col-md-6">
            <h2 class="contact__title">
              Поддержка
              <span class="highlight--purple">клиентов</span>
            </h2>
            <form id="feedbackForm" class="contact__form needs-validation" @submit.prevent="handleSubmit" novalidate>
              <div class="contact__form-input contact__form-input--text form-floating mb-4">
                <input v-model="feedbackFullNameInput" type="text" class="form-control" id="feedbackFullNameInput" placeholder="Имя Фамилия" required>
                <label for="feedbackFullNameInput">Имя Фамилия</label>
              </div>
              <div class="contact__form-input contact__form-input--email form-floating mb-5 mb-sm-4 mb-xl-5">
                <input v-model="feedbackEmailInput" type="email" class="form-control" id="feedbackEmailInput" placeholder="Адрес электронной почты"
                  required>
                <label for="feedbackEmailInput">Адрес электронной почты</label>
              </div>
              <div class="contact__form-input contact__form-input--textarea form-floating">
                <textarea v-model="feedbackComment" class="form-control" placeholder="Leave a comment here" id="feedbackComment"
                  required></textarea>
                <label for="feedbackComment">Введите проблему или запрос</label>
              </div>
              <button class="contact__form-btn btn btn-primary w-100">Отправить</button>
            </form>
          </div>

        </div>
      </div>
    </section>
  </main>

  <Footer />

</template>

<style lang="scss" scoped>
main {
  padding-top: 0; // Необходимо для корректного отображения визуальных иллюстраций
}

.contact__wrapper {
  padding-top: 180px;
  padding-bottom: 50px;

  /* Стилия иллюстраций(слева) */
  .contact__illustrations {
    .illustrations__purple-block {
      width: calc(27.5% - 48px); /* Ширина блока на 50%(27.5% от всей ширины экрана) - отступ gx-5(48px) */
      height: calc(100% - 228px); /* Блок высотой наравне с высотой формы */
      padding-top: 60px;
      background: $purple;
      position: absolute;
      /* Внутренний отступ контейнера(180px) */
      top: 180px;
      left: 0;

      .illustrations__title {
        position: relative;
        font-family: $font-family, sans-serif;
        font-weight: 600;
        font-size: 34px;
        line-height: 105%;
        color: #f9f9f9;

        &::after {
          display: inline-block;
          content: '';
          width: 186px;
          height: 40px;
          background-image: url("@/assets/icons/white_straight_spiral_arrow.svg");
          background-size: contain;
          background-repeat: no-repeat;
          transition: .2s background-color ease-in-out;
          position: absolute;
          bottom: -150%;
          left: 50%;
          transform: translateX(-50%);
        }
      }
      /* Иллюстрация приложения на телефоне */
      &::after {
        display: inline-block;
        content: '';
        width: 189px;
        height: 378px;
        background-image: url("@/assets/img/mobile_screen.webp");
        background-size: contain;
        background-repeat: no-repeat;
        position: absolute;
        bottom: -50px;
        right: -25%;
      }
    }
  }

  /* Стили для формы(справа) */
  .contact__support {
    .contact__title {
      margin-bottom: 60px;
      font-family: $font-family, sans-serif;
      font-weight: 800;
      font-size: 40px;
      color: #252525;
    }

    .contact__form-input input,
    .contact__form-input textarea {
      border: 2px solid $purple;
      border-radius: 16px;
    }
    .contact__form-input--textarea textarea {
      height: 100px;
      margin-bottom: 42px;
    }
    .contact__form-btn {
      position: relative;
      padding: 1.5rem 0;
      border: none;
      border-radius: 16px;
      background-color: $purple;
      font-family: $font-family, sans-serif;
      font-weight: 700;
      font-size: 20px;
      color: #f9f9f9;
      transition: .2s background-color ease-in-out;

      &:hover {
        background-color: $purple-hover;
      }
      /* Иллюстрация */
      &::before {
        display: inline-block;
        content: '';
        width: 122px;
        height: 122px;
        background-image: url("@/assets/icons/spiral_arrow.svg");
        background-repeat: no-repeat;
        background-size: contain;
        transition: .2s background-color ease-in-out;
        position: absolute;
        top: 25%;
        left: -20%;
        transform: rotate(85deg);
      }
    }
  }
}

/* Адаптивность страницы контактов */
@media screen and (max-width: 1199.98px) {
  // Планшеты в горизонтальной ориентации, Ipad Pro (>= 1024px)
  .contact__wrapper {
    .contact__illustrations {
      .illustrations__purple-block {
        width: calc(42.5% - 48px); /* Ширина блока на 85%(42.5% от всей ширины экрана) - отступ gx-5(48px) */

        &::after {
          right: 50%;
          transform: translateX(50%);
        }
      }
    }
    .contact__support {
      .contact__title {
        font-size: 32px;
        margin-bottom: 42px;
      }
      .contact__form-input--textarea textarea {
        height: 100px;
        margin-bottom: 42px;
      }
      .contact__form-btn {
        padding: 1rem 0;

        &::before {
          width: 94px;
          height: 86px;
          top: 60%;
          left: -15%;
        }
      }
    }
  }
}

@media screen and (max-width: 991.98px) {
  // Планшеты в вертикальной ориентации (>= 768px)
  .contact__wrapper {
    padding-top: 140px;
    padding-bottom: 0;

    .contact__illustrations {
      .illustrations__purple-block {
        width: calc(50% - 48px); /* Ширина блока на 100%(50% от всей ширины экрана) - отступ gx-5(48px) */
        height: calc(100% - 140px);
        top: 140px;

        &::after {
          width: 148px;
          height: 296px;
          bottom: -20px;
        }
      }
    }
    .contact__support {
      .contact__title {
        font-size: 28px;
        margin-bottom: 36px;
      }
      .contact__form-btn {
        font-size: 18px;

        &::before {
          width: 74px;
          height: 86px;
          top: 60%;
          left: -15%;
        }
      }
    }
  }
}

@media screen and (max-width: 767.98px) {
  // Телефоны в горизонтальной ориентации (>= 576px)
  .contact__wrapper {
    .contact__illustrations {
      .illustrations__purple-block {
        width: calc(40% - 48px); /* Ширина блока на 80%(42.5% от всей ширины экрана) - отступ gx-5(48px) */

        .illustrations__title {
          &::after {
            width: 140px;
            height: 30px;
            bottom: -60%;
          }
        }
        &::after {
          width: 120px;
          height: 240px;
        }
      }
    }
    .contact__support {
      .contact__title {
        font-size: 28px;
        margin-bottom: 32px;
      }
      .contact__form-btn {
        &::before {
          width: 78px;
          height: 76px;
          left: -9%;
        }
      }
    }
  }
}

@media screen and (max-width: 566.98px) {
  // Телефоны в вертикальной ориентации (< 567px)
  .contact__wrapper {
    padding-bottom: 0;

    .contact__illustrations {
      .illustrations__purple-block {
        position: static;
        width: 100%; /* Ширина блока на 100%(100% от всей ширины экрана) */
        height: 100%;
        padding: 1.5rem 0 6rem;

        .illustrations__title {
          &::after {
            width: 110px;
            height: 28px;
            bottom: -50%;
            left: 73%;
            transform: translateY(50%) rotate(90deg);
          }
        }
        &::after {
          display: none;
        }
      }
    }
    .contact__support {
      margin-top: 48px;

      .contact__title {
        font-size: 32px;
        text-align: center;
      }
      .contact__form-btn {
        &::before {
          display: none;
        }
      }
    }
  }
}
</style>