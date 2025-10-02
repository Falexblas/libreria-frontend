<template>
  <!-- Navbar Minimalista -->
  <nav class="navbar-minimalista">
    <div class="container-fluid">
      <!-- Contenido del Navbar con Bootstrap Grid -->
      <div class="row w-100 align-items-center gx-3">

        <!-- Izquierda: Menú Hamburguesa (móvil) y Logo (desktop) -->
        <div class="col-auto">
          <div class="d-flex align-items-center gap-3">
            <button @click="toggleMobileMenu" class="btn-icon d-lg-none me-2">
              <i class="bi bi-list"></i>
            </button>
            <router-link to="/" class="navbar-brand-minimalista d-lg-flex">
              <img src="@/assets/logo.png" alt="Librería Logo">
              <span>Mundo de papel</span>
            </router-link>
            
            <!-- Dropdown de Categorías (solo desktop) -->
            <div class="dropdown d-none d-lg-block">
              <button class="btn btn-categorias dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i class="bi bi-grid-3x3-gap me-2"></i>
                Categorías
              </button>
              <ul class="dropdown-menu">
                <li>
                  <router-link to="/libros" class="dropdown-item">
                    <i class="bi bi-collection me-2"></i>
                    Todos los Libros
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li v-for="categoria in categoriasStore.categorias" :key="categoria.id">
                  <router-link :to="`/libros/categoria/${categoria.id}`" class="dropdown-item">
                    <i class="bi bi-bookmark me-2"></i>
                    {{ categoria.nombre }}
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Centro: Logo (móvil) y Buscador (desktop) -->
        <div class="col">
          <div class="d-flex justify-content-center">
            <router-link to="/" class="navbar-brand-minimalista d-lg-none">
              <img src="@/assets/logo.png" alt="Librería Logo">
              <span class="d-none d-sm-inline">Mundo de papel</span>
            </router-link>
            <div class="buscador-wrapper d-none d-lg-block">
              <i class="bi bi-search"></i>
              <input 
                type="text" 
                placeholder="Buscar en Mundo de papel..." 
                v-model="terminoBusqueda"
                @keyup.enter="buscarLibros"
              >
            </div>
          </div>
        </div>

        <!-- Derecha: Iconos -->
        <div class="col-auto">
          <div class="d-flex align-items-center gap-2">
            <button @click="openSearch" class="btn-icon d-lg-none">
              <i class="bi bi-search"></i>
            </button>

            <!-- Iconos de usuario -->
            <div v-if="authStore.isAuthenticated" class="dropdown d-md-block">
              <a href="#" class="btn-icon" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><router-link to="/perfil" class="dropdown-item">Mi Perfil</router-link></li>
                <li><router-link to="/pedidos" class="dropdown-item">Mis Pedidos</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a href="#" @click="cerrarSesion" class="dropdown-item">Cerrar Sesión</a></li>
              </ul>
            </div>
            <router-link v-else to="/login" class="btn-icon d-md-block">
              <i class="bi bi-person-circle"></i>
            </router-link>

            <router-link to="/favoritos" class="btn-icon d-md-block">
              <i class="bi bi-heart"></i>
            </router-link>

            <button @click="carritoStore.abrirCarrito()" class="btn-icon">
              <i class="bi bi-bag"></i>
              <span v-if="carritoStore.totalItems > 0" class="badge-carrito">{{ carritoStore.totalItems }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Overlay de Búsqueda para Móvil -->
  <div class="search-overlay" :class="{ 'open': searchOverlayOpen }">
    <div class="search-overlay-header">
      <input 
        type="text" 
        placeholder="Buscar en Mundo de papel..." 
        v-model="terminoBusqueda"
        @keyup.enter="buscarLibrosYcerrar"
        ref="searchInput"
      >
      <button @click="closeSearch" class="btn-icon">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
    <div class="search-overlay-body">
      <p>Escribe para buscar libros, autores o géneros.</p>
    </div>
  </div>

  <!-- Menú Lateral para Móvil -->
  <div class="mobile-menu-overlay" :class="{ 'open': mobileMenuOpen }" @click="closeMobileMenu"></div>
  <div class="mobile-menu" :class="{ 'open': mobileMenuOpen }">
    <!-- Header -->
    <div class="mobile-menu-header">
      <h5>Menú</h5>
      <button @click="closeMobileMenu" class="btn-icon">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
    <!-- Body -->
    <div class="mobile-menu-body">
      <router-link v-if="!authStore.isAuthenticated" to="/login" @click="closeMobileMenu" class="mobile-menu-link auth-link">Iniciar Sesión</router-link>
      <router-link v-if="authStore.isAuthenticated" to="/perfil" @click="closeMobileMenu" class="mobile-menu-link auth-link">Mi Perfil</router-link>
      
      <hr>
      
      <h5>Categorías</h5>
      <router-link to="/libros" @click="closeMobileMenu" class="mobile-menu-link">Todos los Libros</router-link>
      <router-link 
        v-for="categoria in categoriasStore.categorias" 
        :key="categoria.id"
        :to="`/libros/categoria/${categoria.id}`" 
        @click="closeMobileMenu"
        class="mobile-menu-link"
      >
        {{ categoria.nombre }}
      </router-link>

      <hr>

      <router-link to="/favoritos" @click="closeMobileMenu" class="mobile-menu-link">Mis Favoritos</router-link>
      <a v-if="authStore.isAuthenticated" href="#" @click="cerrarSesionYMenu" class="mobile-menu-link">Cerrar Sesión</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCarritoStore } from '@/stores/carrito'
import { useCategoriasStore } from '@/stores/categorias'

const router = useRouter()
const authStore = useAuthStore()
const carritoStore = useCarritoStore()
const categoriasStore = useCategoriasStore()

const terminoBusqueda = ref('')
const searchOverlayOpen = ref(false)
const mobileMenuOpen = ref(false)
const searchInput = ref(null)

onMounted(() => {
  categoriasStore.cargarCategorias()
})

// --- Lógica de Búsqueda Móvil ---
async function openSearch() {
  searchOverlayOpen.value = true
  await nextTick()
  searchInput.value?.focus()
}

function closeSearch() {
  searchOverlayOpen.value = false
}

function buscarLibrosYcerrar() {
  buscarLibros()
  closeSearch()
}

// --- Lógica de Menú Móvil ---
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function cerrarSesionYMenu() {
  cerrarSesion()
  closeMobileMenu()
}

// --- Funciones Comunes ---
function buscarLibros() {
  if (terminoBusqueda.value.trim()) {
    router.push(`/libros?busqueda=${encodeURIComponent(terminoBusqueda.value)}`)
    terminoBusqueda.value = '' // Limpiar después de buscar
  }
}

function cerrarSesion() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
/* --- Estructura Principal del Navbar --- */
.navbar-minimalista {
  background-color: #fff;
  border-bottom: 1px solid #e9ecef;
  height: 70px;
  padding: 0 1rem;
  position: sticky;
  top: 0;
  z-index: 1020;
  display: flex;
  align-items: center; /* Centrar verticalmente */
}

.navbar-minimalista .container-fluid {
  height: 100%;
  display: flex;
  align-items: center;
}

/* --- Logo --- */
.navbar-brand-minimalista {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #2c3e50;
}

.navbar-brand-minimalista img {
  height: 36px;
  transition: transform 0.3s ease;
}

/* Logo más pequeño en móvil */
@media (max-width: 575.98px) {
  .navbar-brand-minimalista.d-lg-none img {
    height: 28px;
  }
  
  .navbar-brand-minimalista.d-lg-none span {
    font-size: 1rem;
  }
}

.navbar-brand-minimalista span {
  font-size: 1.25rem;
  font-weight: 700;
  font-family: 'Georgia', serif;
}

.navbar-brand-minimalista:hover img {
  transform: rotate(-10deg);
}

/* --- Botón de Categorías --- */
.btn-categorias {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #2c3e50;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-categorias:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
  color: #2c3e50;
}

.btn-categorias i {
  font-size: 1rem;
}

/* --- Buscador (Desktop) --- */
.buscador-wrapper {
  position: relative;
  width: 100%;
  max-width: 450px;
}

.buscador-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  pointer-events: none;
}

.buscador-wrapper input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: 25px;
  border: 1px solid #dee2e6;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.buscador-wrapper input:focus {
  outline: none;
  border-color: #007bff;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* --- Iconos --- */
.btn-icon {
  background: none;
  border: none;
  color: #2c3e50;
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background-color 0.3s ease;
}

/* Iconos más pequeños en móvil */
@media (max-width: 575.98px) {
  .btn-icon {
    font-size: 1.3rem;
    padding: 0.4rem;
  }
}

.btn-icon:hover {
  background-color: #f8f9fa;
  color: #007bff;
}

.badge-carrito {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background-color: #dc3545;
  color: white;
  font-size: 0.6rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* --- Overlay de Búsqueda (Móvil) --- */
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  z-index: 1050;
  display: flex;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.search-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.search-overlay-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.search-overlay-header input {
  flex-grow: 1;
  border: none;
  background: none;
  font-size: 1.2rem;
  outline: none;
}

.search-overlay-body {
  padding: 2rem;
  text-align: center;
  color: #6c757d;
}

/* --- Menú Lateral (Móvil) --- */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1040;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.mobile-menu-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100%;
  background-color: #fff;
  z-index: 1045;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.mobile-menu.open {
  transform: translateX(0);
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.mobile-menu-header h5 {
  margin: 0;
  font-weight: 600;
}

.mobile-menu-body {
  padding: 1rem;
  overflow-y: auto;
}

.mobile-menu-link {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #2c3e50;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.mobile-menu-link:hover {
  background-color: #f8f9fa;
}

.mobile-menu-link.auth-link {
  font-weight: 600;
  background-color: #f8f9fa;
  text-align: center;
  margin-bottom: 1rem;
}

.mobile-menu hr {
  margin: 1rem 0;
}

/* --- Dropdown de Usuario --- */
.dropdown-menu {
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
}

/* --- Responsive --- */

/* Móvil muy pequeño (< 576px) */
@media (max-width: 575.98px) {
  .navbar-minimalista {
    height: 60px;
    padding: 0 0.5rem;
  }
  
  /* Ocultar logo y categorías de desktop */
  .col-auto .navbar-brand-minimalista:not(.d-lg-none) {
    display: none !important;
  }
  
  .col-auto .dropdown {
    display: none !important;
  }
  
  /* Ocultar iconos de usuario/favoritos */
  .dropdown.d-md-block,
  .btn-icon.d-md-block {
    display: none !important;
  }
  
  /* Ajustar espaciado */
  .d-flex.gap-2 {
    gap: 0.25rem !important;
  }
}

/* Móvil pequeño (576px - 767px) */
@media (min-width: 576px) and (max-width: 767.98px) {
  /* Ocultar logo y categorías de desktop */
  .col-auto .navbar-brand-minimalista:not(.d-lg-none) {
    display: none !important;
  }
  
  .col-auto .dropdown {
    display: none !important;
  }
  
  /* Ocultar iconos de usuario/favoritos */
  .dropdown.d-md-block,
  .btn-icon.d-md-block {
    display: none !important;
  }
}

/* Tablet (768px - 991px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  /* Ocultar logo y categorías de desktop */
  .col-auto .navbar-brand-minimalista:not(.d-lg-none) {
    display: none !important;
  }
  
  .col-auto .dropdown.d-lg-block {
    display: none !important;
  }
}

/* Desktop (≥ 992px) */
@media (min-width: 992px) {
  /* Ocultar logo de móvil */
  .navbar-brand-minimalista.d-lg-none {
    display: none !important;
  }
  
  /* Ocultar botón de búsqueda móvil */
  .btn-icon.d-lg-none {
    display: none !important;
  }
  
  /* Mostrar buscador en desktop */
  .buscador-wrapper.d-none.d-lg-block {
    display: block !important;
  }
  
  /* Mostrar dropdown de categorías en desktop */
  .col-auto .dropdown.d-none.d-lg-block {
    display: block !important;
  }
  
  /* Mostrar logo de desktop */
  .col-auto .navbar-brand-minimalista.d-lg-flex {
    display: flex !important;
  }
}
</style>
