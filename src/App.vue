<script setup>
import { onMounted, computed, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
import CarritoSidebar from '@/components/carrito/CarritoSidebar.vue'
import ChatBot from '@/components/ChatBot.vue'
import NotificacionRecomendacion from '@/components/NotificacionRecomendacion.vue'
import { useCarritoStore } from '@/stores/carrito'
import { useAuthStore } from '@/stores/auth'
import { useRecomendacionesStore } from '@/stores/recomendaciones'

const carritoStore = useCarritoStore()
const authStore = useAuthStore()
const recomendacionesStore = useRecomendacionesStore()
const route = useRoute()

// Verificar si estamos en una ruta de admin
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

// Función para cargar recomendaciones
const cargarRecomendaciones = () => {
  if (authStore.isAuthenticated && authStore.token && !isAdminRoute.value) {
    setTimeout(() => {
      recomendacionesStore.cargarRecomendacionesPersonalizadas(authStore.token)
    }, 1500)
  }
}

// Inicializar carrito al montar la app
onMounted(() => {
  carritoStore.inicializar()
  cargarRecomendaciones()
})

// Cargar recomendaciones cada vez que cambia de ruta
watch(() => route.path, () => {
  cargarRecomendaciones()
})
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
  <Navbar class="flex-shrink-0" :checkoutMode="route.name === 'checkout'" /> 
    <main class="flex-grow-1">
      <RouterView />
    </main>
    <!-- Footer solo para usuarios normales -->
    <Footer v-if="!isAdminRoute" class="flex-shrink-0" />
    
    <!-- Carrito Sidebar solo para usuarios normales -->
    <CarritoSidebar v-if="!isAdminRoute" />
    
    <!-- ChatBot solo para usuarios normales -->
    <ChatBot v-if="!isAdminRoute" />
    
    <!-- Notificación de recomendaciones -->
    <NotificacionRecomendacion 
      v-if="!isAdminRoute"
      :mostrar="recomendacionesStore.mostrarNotificacion"
      @cerrar="recomendacionesStore.cerrarNotificacion()"
    />
  </div>
</template>

<style>
/* Reset global */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Fondo global */
html, body {
  background-color: #EEEBE7 !important;
  margin: 0;
  padding: 0;
  height: 100%;
}

/* App principal */
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #EEEBE7;
}

/* Main sin espacios */
main {
  background-color: #EEEBE7;
  padding: 0;
  margin: 0;
}

/* Eliminar espacios de Bootstrap y separaciones */
.container-fluid {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

/* Eliminar separaciones entre navbar y main */
nav.navbar {
  margin-bottom: 0 !important;
}

main {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

/* Asegurar que no haya espacios en blanco */
#app > * {
  margin: 0 !important;
}

#app > nav,
#app > main,
#app > footer {
  width: 100%;
}

/* Estilos globales para enlaces */
a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Estilos para botones */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

/* Utilidades */
.text-center {
  text-align: center;
}

.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
</style>
