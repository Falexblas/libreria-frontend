import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // Aquí agregaremos las rutas de la librería:
    // /libros, /login, /registro, /carrito, /perfil, /admin, etc.
  ],
})

export default router
