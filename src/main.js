import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import App from './App.vue'
import { useAuthStore } from "@/store/authStore.js";
import { useCartStore } from "@/store/cartStore.js";

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
setActivePinia(pinia)

async function bootstrap() {
  const { default: router } = await import('./router')
  app.use(router)

  // Initialize stores
  // Init auth store first to set up the listener
  const authStore = useAuthStore(pinia)
  authStore.initAuthListener()

  // Initialize cart after auth is ready
  const cartStore = useCartStore(pinia)
  authStore.waitForInitialization().then(() => {
    if (authStore.isAuthenticated()) {
      cartStore.initializeCart()
    }
  })

  app.mount('#app')
}

bootstrap()