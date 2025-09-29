<template>
  <!-- Navbar principal profesional -->
  <nav class="navbar navbar-dark sticky-top py-3 navbar-profesional" style="background-color: #002e4d; margin: 0; padding-top: 1rem; padding-bottom: 1rem;">
    <div class="container" style="max-width: 1200px;">
      <!-- Layout simple y funcional -->
      <div class="d-flex align-items-center justify-content-between w-100">
        <!-- Logo -->
        <div style="flex: 0 0 100px;">
          <router-link to="/" class="navbar-brand mb-0">
            <img src="@/assets/logo.png" alt="Bookify" height="40" class="d-inline-block align-text-top">
          </router-link>
        </div>

        <!-- Buscador central profesional -->
        <div class="flex-grow-1 px-4 buscador-desktop">
          <div class="input-group buscador-profesional" style="max-width: 500px; margin: 0 auto;">
            <input 
              type="text" 
              class="form-control buscador-input" 
              placeholder="Buscar libros, autores, categorías..."
              v-model="terminoBusqueda"
              @keyup.enter="buscarLibros"
            >
            <button 
              class="btn btn-buscador" 
              type="button" 
              @click="buscarLibros"
            >
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>

        <!-- Acciones usuario -->
        <div style="flex: 0 0 200px;">
          <div class="d-flex justify-content-end align-items-center gap-3">
            <!-- Login/Usuario -->
            <div v-if="!authStore.isAuthenticated">
              <router-link to="/login" class="nav-link text-white p-0 icono-profesional">
                <i class="bi bi-person-circle fs-4"></i>
              </router-link>
            </div>
            
            <!-- Usuario logueado -->
            <div v-else class="dropdown">
              <a 
                class="nav-link dropdown-toggle text-white p-0 icono-profesional" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person-circle fs-4"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><router-link to="/perfil" class="dropdown-item">Mi Perfil</router-link></li>
                <li><router-link to="/mis-pedidos" class="dropdown-item">Mis Pedidos</router-link></li>
                <li><router-link to="/favoritos" class="dropdown-item">Favoritos</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><button @click="cerrarSesion" class="dropdown-item text-danger">Cerrar Sesión</button></li>
              </ul>
            </div>

            <!-- Carrito -->
            <div>
              <router-link to="/carrito" class="nav-link text-white position-relative p-0 icono-profesional">
                <i class="bi bi-cart fs-4"></i>
                <span 
                  v-if="carritoStore.contadorItems > 0" 
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-profesional"
                  style="font-size: 0.6rem;"
                >
                  {{ carritoStore.contadorItems }}
                </span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Barra de categorías con slider horizontal -->
  <nav class="categorias-nav" style="background-color: #002e4d; border-top: 1px solid #134464; min-height: 80px;">
    <div class="container-fluid">
      <!-- Botón para categorías en móvil -->
      <button 
        class="btn btn-outline-light d-lg-none mb-3 w-100" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#categoriasMovil"
        aria-controls="categoriasMovil" 
        aria-expanded="false"
      >
        <i class="bi bi-list me-2"></i> Ver Categorías
      </button>

      <!-- Slider profesional de categorías -->
      <div class="categorias-slider-wrapper d-block">
        <div class="d-flex align-items-center">
          <!-- Botón izquierdo -->
          <button 
            @click="deslizarIzquierda" 
            class="btn-slider me-2"
            :disabled="!puedeIrIzquierda"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          
          <!-- Contenedor del slider -->
          <div class="categorias-slider-container flex-grow-1">
            <div 
              class="categorias-slider-track d-flex" 
              ref="sliderTrack"
              :style="{ transform: `translateX(${desplazamiento}px)` }"
            >
              <!-- Todos los libros -->
              <router-link 
                to="/libros" 
                class="categoria-item categoria-principal flex-shrink-0"
              >
                <i class="bi bi-collection me-2"></i>
                Todos los Libros
              </router-link>
              
              <!-- Categorías dinámicas -->
              <router-link 
                v-for="categoria in categoriasStore.categorias" 
                :key="categoria.id"
                :to="`/libros/categoria/${categoria.id}`" 
                class="categoria-item flex-shrink-0"
              >
                {{ categoria.nombre }}
              </router-link>
            </div>
          </div>
          
          <!-- Botón derecho -->
          <button 
            @click="deslizarDerecha" 
            class="btn-slider ms-2"
            :disabled="!puedeIrDerecha"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Categorías colapsables para móvil -->
      <div class="collapse d-lg-none" id="categoriasMovil">
        <div class="py-3">
          <div class="mb-2">
            <router-link to="/libros" class="categoria-mobile categoria-principal">
              <i class="bi bi-collection me-2"></i>
              Todos los Libros
            </router-link>
          </div>
          
          <div 
            class="mb-2" 
            v-for="categoria in categoriasStore.categorias" 
            :key="categoria.id"
          >
            <router-link 
              :to="`/libros/categoria/${categoria.id}`" 
              class="categoria-mobile"
            >
              {{ categoria.nombre }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Buscador móvil (solo visible en pantallas pequeñas) -->
  <div class="d-md-none" style="background-color: #002e4d; border-top: 1px solid #134464;">
    <div class="container py-3">
      <div class="input-group">
        <input 
          type="text" 
          class="form-control" 
          placeholder="Buscar libros, autores, categorías..."
          v-model="terminoBusqueda"
          @keyup.enter="buscarLibros"
          style="background-color: white; border-color: white;"
        >
        <button 
          class="btn btn-outline-light" 
          type="button" 
          @click="buscarLibros"
        >
          <i class="bi bi-search"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCarritoStore } from '@/stores/carrito'
import { useCategoriasStore } from '@/stores/categorias'

const router = useRouter()
const authStore = useAuthStore()
const carritoStore = useCarritoStore()
const categoriasStore = useCategoriasStore()

const terminoBusqueda = ref('')

// Referencias y estado del slider
const sliderTrack = ref(null)
const desplazamiento = ref(0)
const itemWidth = 180 // Ancho de cada item + gap
const puedeIrIzquierda = ref(false)
const puedeIrDerecha = ref(true)

// Cargar categorías al montar el componente
onMounted(() => {
  categoriasStore.cargarCategorias()
  
  // Configurar slider después de que se rendericen las categorías
  setTimeout(() => {
    actualizarEstadoBotones()
  }, 300)
})

// Funciones del slider
function deslizarIzquierda() {
  const nuevoDesplazamiento = Math.min(desplazamiento.value + itemWidth * 3, 0)
  desplazamiento.value = nuevoDesplazamiento
  actualizarEstadoBotones()
}

function deslizarDerecha() {
  if (!sliderTrack.value) return
  
  const containerWidth = sliderTrack.value.parentElement.offsetWidth
  const trackWidth = sliderTrack.value.scrollWidth
  const maxDesplazamiento = -(trackWidth - containerWidth + 40)
  
  const nuevoDesplazamiento = Math.max(desplazamiento.value - itemWidth * 3, maxDesplazamiento)
  desplazamiento.value = nuevoDesplazamiento
  actualizarEstadoBotones()
}

function actualizarEstadoBotones() {
  if (!sliderTrack.value) {
    // Habilitar ambos botones por defecto hasta que se cargue
    puedeIrIzquierda.value = true
    puedeIrDerecha.value = true
    return
  }
  
  const containerWidth = sliderTrack.value.parentElement.offsetWidth
  const trackWidth = sliderTrack.value.scrollWidth
  
  // Si el contenido cabe en el contenedor, deshabilitar ambos
  if (trackWidth <= containerWidth) {
    puedeIrIzquierda.value = false
    puedeIrDerecha.value = false
    return
  }
  
  const maxDesplazamiento = -(trackWidth - containerWidth + 40)
  
  puedeIrIzquierda.value = desplazamiento.value < 0
  puedeIrDerecha.value = desplazamiento.value > maxDesplazamiento
}

// Funciones existentes
function buscarLibros() {
  if (terminoBusqueda.value.trim()) {
    router.push(`/libros?busqueda=${encodeURIComponent(terminoBusqueda.value)}`)
  }
}

function cerrarSesion() {
  authStore.logout()
  router.push('/')
}

</script>

<style scoped>
/* Navbar profesional */
.navbar-profesional {
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-profesional::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

/* Logo profesional */
.navbar-brand img {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.navbar-brand:hover img {
  transform: scale(1.08) translateY(-1px);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

/* Buscador profesional */
.buscador-profesional {
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.buscador-profesional:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.buscador-profesional:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 123, 255, 0.2);
  background: rgba(255, 255, 255, 1);
}

.buscador-input {
  border: none;
  background: transparent;
  padding: 12px 20px;
  font-size: 0.95rem;
  color: #2c3e50;
  transition: all 0.3s ease;
}

.buscador-input:focus {
  box-shadow: none;
  background: transparent;
  color: #2c3e50;
}

.buscador-input::placeholder {
  color: #6c757d;
  font-weight: 400;
}

.btn-buscador {
  background: #007bff;
  border: none;
  padding: 12px 20px;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.1rem;
}

.btn-buscador:hover {
  background: #0056b3;
  transform: scale(1.05);
  color: white;
}

.btn-buscador:focus {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
  color: white;
}

/* Iconos profesionales sin fondo */
.icono-profesional {
  position: relative;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icono-profesional:hover {
  transform: translateY(-3px) scale(1.1);
}

.icono-profesional i {
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.icono-profesional:hover i {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

/* Badge profesional del carrito */
.badge-profesional {
  animation: pulse 2s infinite;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Badge del carrito */
.badge {
  font-size: 0.65rem !important;
}

/* Dropdown profesional */
.dropdown-menu {
  border: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: dropdownFadeIn 0.3s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 0.75rem 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  margin: 0.25rem 0.5rem;
  font-weight: 500;
}

.dropdown-item:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Input group personalizado */
.input-group .form-control {
  border-right: none;
}

.input-group .btn {
  border-left: none;
}

/* Spinner de carga */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Espaciado y centrado mejorado */
.container {
  max-width: 1200px;
}

/* Control de visibilidad del buscador */
.buscador-desktop {
  display: block;
}

@media (max-width: 767px) {
  .buscador-desktop {
    display: none !important;
  }
}

/* Iconos más grandes y mejor espaciados */
.fs-4 {
  font-size: 1.8rem !important;
}

/* Hover effects mejorados */
.nav-link:hover i {
  transform: scale(1.1);
}

/* Badge del carrito más pequeño */
.badge {
  font-size: 0.6rem !important;
  min-width: 1.2rem;
  height: 1.2rem;
}

/* Ajustes para móvil */
@media (max-width: 767px) {
  /* Logo más pequeño en móvil */
  .navbar-brand img {
    height: 35px;
  }
  
  /* Iconos ligeramente más pequeños en móvil */
  .fs-4 {
    font-size: 1.6rem !important;
  }
  
  /* Espaciado reducido en móvil */
  .gap-3 {
    gap: 1.5rem !important;
  }
}

/* Categorías profesionales */
.categoria-profesional {
  position: relative;
  padding: 0.75rem 1.5rem !important;
  margin: 0 0.25rem;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  overflow: hidden;
}

.categoria-profesional::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ffffff, transparent);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-50%);
}

.categoria-profesional:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  color: #ffffff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.categoria-profesional:hover::before {
  width: 80%;
}

.categoria-profesional.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff !important;
  font-weight: 600;
}

.categoria-profesional.router-link-active::before {
  width: 100%;
  background: linear-gradient(90deg, transparent, #007bff, transparent);
}

.categoria-principal {
  background: rgba(0, 123, 255, 0.2);
  font-weight: 600;
  border: 1px solid rgba(0, 123, 255, 0.3);
}
.categoria-principal:hover {
  background: rgba(0, 123, 255, 0.3);
  border-color: rgba(0, 123, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 123, 255, 0.3);
}
.categoria-mobile {
  display: block;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.categoria-mobile:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.categoria-mobile.router-link-active {
  background: rgba(0, 123, 255, 0.3);
  border-color: rgba(0, 123, 255, 0.5);
  font-weight: 600;
}

.categoria-mobile.categoria-principal {
  background: rgba(0, 123, 255, 0.25);
  border-color: rgba(0, 123, 255, 0.4);
  font-weight: 600;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 991px) {
  .categorias-slider-wrapper {
    display: none !important;
  }
}

@media (max-width: 576px) {
  .categoria-mobile {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
  }
}

/* Mejoras del buscador móvil */
.d-md-none .input-group {
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 0.5rem;
  overflow: hidden;
}

.d-md-none .form-control {
  border-right: none;
}

.d-md-none .btn {
  border-left: none;
}

/* ===== SLIDER PROFESIONAL DE CATEGORÍAS ===== */

/* Wrapper del slider */
.categorias-slider-wrapper {
  padding: 0.75rem 0;
}

/* Contenedor del slider con overflow hidden */
.categorias-slider-container {
  overflow: hidden;
  position: relative;
}

/* Track que se desliza */
.categorias-slider-track {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 0.75rem;
  will-change: transform;
}

/* Items individuales del slider */
.categoria-item {
  min-width: 160px;
  padding: 0.75rem 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 25px;
  font-weight: 500;
  font-size: 0.9rem;
  text-align: center;
  white-space: nowrap;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.categoria-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.categoria-item:hover::before {
  opacity: 1;
}

.categoria-item:hover {
  background: rgba(255, 255, 255, 0.15);
  
  color: white;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.categoria-item.router-link-active {
  background: rgba(0, 123, 255, 0.25);
  color: white;
  font-weight: 600;
  border-color: rgba(0, 123, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 123, 255, 0.3);
}

.categoria-item.categoria-principal {
  background: rgba(0, 123, 255, 0.2);
  border-color: rgba(0, 123, 255, 0.4);
  font-weight: 600;
  min-width: 180px;
}

.categoria-item.categoria-principal:hover {
  background: rgba(0, 123, 255, 0.3);
  border-color: rgba(0, 123, 255, 0.6);
}

/* Botones del slider */
.btn-slider {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-slider:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.btn-slider:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}
</style>
