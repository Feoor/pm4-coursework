<script setup>
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { Home, Frown } from '@lucide/vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50/30">
    <Header />
    <main class="flex-grow flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div class="text-center max-w-xl mx-auto flex flex-col items-center">
        <div class="flex justify-center mb-6">
          <Frown class="w-32 h-32 text-(--primary)/80" stroke-width="1" />
        </div>
        <h2 class="text-(--primary) font-bold tracking-widest uppercase text-sm mb-3">Ошибка 404</h2>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-(--main-black) mb-5 tracking-tight">
          Страница не найдена
        </h1>
        <p class="text-lg text-gray-500 mb-10 max-w-md mx-auto">
          Кажется, вы заблудились. Запрашиваемая страница не существует, была удалена или вы ввели неверный адрес.
        </p>
        <button
          @click="goHome"
          class="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-4 text-white bg-(--primary) hover:bg-(--primary-hover) transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--primary)"
        >
          <Home class="w-5 h-5 mr-2.5" />
          Вернуться на главную
        </button>
      </div>
    </main>
    <Footer />
  </div>
</template>