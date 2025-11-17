import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LibrosView from '../views/LibrosView.vue'
import LibroDetalleView from '../views/LibroDetalleView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import PedidosView from '@/views/PedidosView.vue'
import FavoritosView from '@/views/FavoritosView.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import { useAuthStore } from '@/stores/auth'

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
    {
      path: '/libros/:id',
      name: 'libro-detalle',
      component: LibroDetalleView,
      props: true
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
    },
    {
      path: '/nosotros',
      name: 'nosotros',
      component: () => import('@/views/NosotrosView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: ProfileView,
      meta: { requiresAuth: true }  // Requiere autenticación
    },
    {
      path: '/pedidos',
      name: 'pedidos',
      component: PedidosView,
      meta: { requiresAuth: true }  // Requiere autenticación
    },
    {
      path: '/favoritos',
      name: 'favoritos',
      component: FavoritosView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardView,
      meta: { requiresAuth: true, requiresAdmin: true }  // Requiere ser admin
    },
  ],
  // Scroll automático al inicio en cada navegación
  scrollBehavior(to, from, savedPosition) {
    // Si hay una posición guardada (botón atrás del navegador), usarla
    if (savedPosition) {
      return savedPosition
    }
    // Si hay un hash (#section), ir a ese elemento
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    // Por defecto, ir al inicio de la página
    return { top: 0, behavior: 'smooth' }
  }
})

// Guard de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirigir al login
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  
  // Si la ruta requiere ser admin
  if (to.meta.requiresAdmin) {
    const isAdmin = authStore.user?.rol?.nombre === 'ADMIN' || authStore.user?.rol === 'ADMIN'
    
    if (!isAdmin) {
      alert('No tienes permisos para acceder a esta página')
      next({ name: 'home' })
      return
    }
  }
  
  next()
})

export default router
