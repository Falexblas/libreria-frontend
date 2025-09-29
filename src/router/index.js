import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LibrosView from '../views/LibrosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/libros',
      name: 'libros',
      component: LibrosView,
    },
    {
      path: '/libros/categoria/:id',
      name: 'libros-categoria',
      component: LibrosView,
      props: true
    },
    // Aquí agregaremos más rutas:
    // /login, /registro, /carrito, /perfil, /admin, etc.
  ],
})

export default router
