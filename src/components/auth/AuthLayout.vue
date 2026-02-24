<script setup>
import Header from '@/components/Header.vue'
import { onMounted, onUnmounted, ref } from 'vue';
import { getImageUrl } from '@/utils/helpers';

onMounted(() => {
  document.body.classList.add('auth-bg');
});

onUnmounted(() => {
  document.body.classList.remove('auth-bg');
});

const carouselItems = ref([
  {
    id: 1,
    image: getImageUrl('eatly_preview.png'),
    title: 'Откройте для себя новые вкусы',
    description: 'С Eatly вы можете попробовать блюда из разных уголков мира, не выходя из дома. Мы доставляем только свежие и качественные продукты.'
  },
  {
    id: 2,
    image: getImageUrl('eatly_preview.png'),
    title: 'Быстрая доставка',
    description: 'Наши курьеры доставляют заказы максимально быстро, чтобы вы могли наслаждаться горячими блюдами в любое время.'
  },
  {
    id: 3,
    image: getImageUrl('eatly_preview.png'),
    title: 'Удобное приложение',
    description: 'Управляйте своими заказами, отслеживайте доставку и находите любимые блюда с помощью интуитивно понятного интерфейса Eatly.'
  }
])
</script>

<template>
  <Header :mode="'lite'" />

  <main class="main">
    <section class="auth">
      <div class="container-sm">

        <!--  Обёртка авторизации  -->
        <div class="auth__wrapper row justify-content-center justify-content-md-between">

          <!--  Форма  -->
          <div class="auth__form col-12 col-sm-8 col-md-5 col-lg-4 offset-md-1">
            <slot></slot>
          </div>

          <!-- Карусель наших преимуществ -->
          <div class="auth__carousel col-5 d-none d-md-block">
            <div id="authCarousel" class="carousel slide carousel-fade h-100">
              <div class="carousel-indicators">
                <button type="button" data-bs-target="#authCarousel" data-bs-slide-to="0" class="active"
                  aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#authCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#authCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
              </div>
              <div class="carousel-inner h-100">
                <!-- <div class="carousel-item active">
                  <img src="@/assets/img/eatly_preview.png" class="d-block w-100" alt="...">
                  <div class="carousel-caption d-none d-md-block">
                    <h5>Откройте для себя новые вкусы</h5>
                    <p>
                      С Eatly вы можете попробовать блюда из разных уголков мира, не выходя из дома.
                      Мы доставляем только свежие и качественные продукты.
                    </p>
                  </div>
                </div> -->
                <div v-for="(item, index) in carouselItems" :key="item.id" :class="['carousel-item', { active: index === 0 }]">
                  <img :src="item.image" class="d-block w-100" alt="...">
                  <div class="carousel-caption d-none d-md-block">
                    <h5>{{ item.title }}</h5>
                    <p>{{ item.description }}</p>
                  </div>
                </div>
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#authCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Предыдущий</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#authCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Следующий</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use "@/assets/styles/auth-page.scss";

</style>