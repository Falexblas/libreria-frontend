<template>
  <!-- Si estamos en modo checkout mostramos un banner superior que ocupa todo el ancho -->
  <div v-if="checkoutMode" class="checkout-top-banner py-2">
    <div class="container d-flex justify-content-between align-items-center">
      <div class="banner-left">Tu librería online abierta 24H</div>
      <div class="banner-help small">¿Necesitas ayuda en tu compra? +1 234 567 8900</div>
    </div>
  </div>

  <!-- Navbar Minimalista -->
  <nav class="navbar-minimalista">
    <div class="container">
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
          </div>
        </div>

        <!-- Centro: Logo (móvil) y Buscador (desktop) -->
        <div class="col d-flex justify-content-center align-items-center">
          <div style="width:100%;max-width:500px;display:flex;justify-content:center;">
            <router-link to="/" class="navbar-brand-minimalista d-lg-none me-2">
              <img src="@/assets/logo.png" alt="Librería Logo">
              <span class="d-none d-sm-inline">Mundo de papel</span>
            </router-link>
            <div v-if="!checkoutMode" class="buscador-wrapper d-none d-lg-block" style="flex:1;">
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

        <!-- Derecha: Iconos y Categorías (desktop) -->
        <div class="col-auto">
          <div class="d-flex align-items-center gap-2">
            <button @click="openSearch" class="btn-icon d-lg-none">
              <i class="bi bi-search"></i>
            </button>

            <!-- Botón Categorías solo desktop -->
            <div v-if="!checkoutMode" class="dropdown d-none d-lg-block mega-menu-categorias me-2">
              <button class="btn btn-categorias dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Categorías
              </button>
              <div class="dropdown-menu mega-menu p-4">
                <div class="row">
                  <div class="col-12 mb-2">
                    <router-link to="/libros" class="dropdown-item fw-bold">
                      <i class="bi bi-collection me-2"></i>
                      Todos los Libros
                    </router-link>
                    <hr class="dropdown-divider my-2">
                  </div>
                  <template v-for="categoria in categoriasStore.categorias" :key="categoria.id">
                    <div class="col-6 col-md-4 col-lg-3 mb-2">
                      <div class="fw-bold mb-1">
                        <i class="bi bi-bookmark me-2"></i>
                        {{ categoria.nombre }}
                      </div>
                      <ul class="list-unstyled ms-2">
                        <li v-if="categoria.subcategorias && categoria.subcategorias.length" v-for="sub in categoria.subcategorias" :key="sub.id">
                          <router-link :to="`/libros/categoria/${sub.id}`" class="dropdown-item py-1 px-2">
                            {{ sub.nombre }}
                          </router-link>
                        </li>
                        <li v-else>
                          <router-link :to="`/libros/categoria/${categoria.id}`" class="dropdown-item py-1 px-2">
                            {{ categoria.nombre }}
                          </router-link>
                        </li>
                      </ul>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- Iconos de usuario -->
            <div v-if="!checkoutMode && authStore.isAuthenticated" class="dropdown d-md-block">
              <a href="#" class="btn-user-dropdown d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle"></i>
                <span class="user-name d-none d-lg-inline">{{ authStore.nombreUsuario }}</span>
                <i class="bi bi-chevron-down d-none d-lg-inline" style="font-size: 0.75rem;"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li class="dropdown-header">
                  <div class="fw-bold">{{ authStore.nombreUsuario }}</div>
                  <div class="text-muted small">{{ authStore.user?.email }}</div>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li><router-link to="/perfil" class="dropdown-item"><i class="bi bi-person me-2"></i>Mi Perfil</router-link></li>
                <li><router-link to="/pedidos" class="dropdown-item"><i class="bi bi-box-seam me-2"></i>Mis Pedidos</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a href="#" @click="cerrarSesion" class="dropdown-item text-danger"><i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión</a></li>
              </ul>
            </div>
            <router-link v-else to="/login" v-if="!checkoutMode" class="btn-icon d-md-block">
              <i class="bi bi-person-circle"></i>
            </router-link>

            <router-link v-if="!checkoutMode" to="/favoritos" class="btn-icon d-md-block">
              <i class="bi bi-heart"></i>
            </router-link>

            <button v-if="!checkoutMode" @click="carritoStore.abrirCarrito()" class="btn-icon">
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
      <router-link v-if="!authStore.isAuthenticated" to="/login" @click="closeMobileMenu" class="mobile-menu-link auth-link btn-iniciar-sesion-movil">
        <i class="bi bi-person-circle me-2"></i>
        INICIAR SESIÓN
      </router-link>
      <router-link v-if="authStore.isAuthenticated" to="/perfil" @click="closeMobileMenu" class="mobile-menu-link auth-link">Mi Perfil</router-link>
      
      <hr>
      
      <h5>Categorías</h5>
      <div class="categorias-acordeon">
        <router-link to="/libros" @click="closeMobileMenu" class="categoria-item">
          TODOS LOS LIBROS
        </router-link>
        <div v-for="categoria in categoriasStore.categorias" :key="categoria.id">
          <template v-if="categoria.subcategorias && categoria.subcategorias.length">
            <div class="categoria-item" :class="{ open: categoriaAbierta === categoria.id }" @click="categoriaAbierta = categoriaAbierta === categoria.id ? null : categoria.id">
              {{ categoria.nombre }}
              <span class="arrow">&#9662;</span>
            </div>
            <transition name="fade">
              <div v-show="categoriaAbierta === categoria.id" class="subcategorias-list">
                <router-link v-for="sub in categoria.subcategorias" :key="sub.id" :to="`/libros/categoria/${sub.id}`" @click="closeMobileMenu" class="mobile-menu-link subcategoria-link">
                  {{ sub.nombre }}
                </router-link>
              </div>
            </transition>
          </template>
          <template v-else>
            <router-link :to="`/libros/categoria/${categoria.id}`" @click="closeMobileMenu" class="categoria-item">
              {{ categoria.nombre }}
            </router-link>
          </template>
        </div>
      </div>

      <hr>

      <router-link to="/favoritos" @click="closeMobileMenu" class="mobile-menu-link auth-link">
        <i class="bi bi-heart-fill me-2"></i>
        Mis Favoritos
      </router-link>
      <a v-if="authStore.isAuthenticated" href="#" @click="cerrarSesionYMenu" class="mobile-menu-link">Cerrar Sesión</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCarritoStore } from '@/stores/carrito'
import { useCategoriasStore } from '@/stores/categorias'

const router = useRouter()
const authStore = useAuthStore()
const carritoStore = useCarritoStore()
const categoriasStore = useCategoriasStore()

// Prop para activar comportamiento específico en checkout
const props = defineProps({
  checkoutMode: { type: Boolean, default: false }
})

const terminoBusqueda = ref('')
const searchOverlayOpen = ref(false)
const mobileMenuOpen = ref(false)
const searchInput = ref(null)
// Estado para el acordeón móvil
const categoriaAbierta = ref(null)

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
/* --- Categorías acordeón móvil tipo Crisol --- */
.categorias-acordeon {
  margin: 0;
  padding: 0;
}
.categoria-item {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
  margin-bottom: 1rem;
  padding: 1.2rem 1rem;
  font-weight: 700;
  font-size: 1.1rem;
  color: #2d3a4a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border: none;
  transition: box-shadow 0.2s;
  text-decoration: none;
}
.categoria-item:active,
.categoria-item.open {
  box-shadow: 0 4px 16px rgba(44, 62, 80, 0.15);
}
.categoria-item .arrow {
  font-size: 1.3rem;
  color: #b0b8c1;
  transition: transform 0.2s;
}
.categoria-item.open .arrow {
  transform: rotate(180deg);
}
.subcategorias-list {
  padding-left: 1.5rem;
  padding-bottom: 0.7rem;
  font-weight: 400;
  font-size: 1rem;
  color: #4a5568;
}
@media (min-width: 992px) {
  .categorias-acordeon {
    display: none;
  }
}
/* Mega menú de categorías estilo Crisol */
 .mega-menu-categorias .dropdown-menu.mega-menu {
  width: 650px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  border: 1px solid #e5e5e5;
}
/* Ajuste de columnas para nombres largos */
.mega-menu-categorias .dropdown-menu.mega-menu .col-6,
.mega-menu-categorias .dropdown-menu.mega-menu .col-md-4,
.mega-menu-categorias .dropdown-menu.mega-menu .col-lg-3 {
  min-width: 200px;
  max-width: 220px;
  word-break: break-word;
}
.mega-menu-categorias .dropdown-item.fw-bold,
.mega-menu-categorias .fw-bold.mb-1 {
  font-size: 1.1em;
  color: #1a1a1a;
  white-space: normal;
  word-break: break-word;
  border-left: 3px solid #0cc3dd;
  padding-left: 0.5em;
}
.mega-menu-categorias .dropdown-item.py-1 {
  font-size: 0.98em;
  color: #444;
}
.mega-menu-categorias .dropdown-item.py-1:hover {
  background: #ffffff;
  color: #0cc3dd;
}
/* Submenús anidados para Bootstrap 5 */
.dropdown-submenu {
  position: relative;
}
.dropdown-submenu > .dropdown-menu {
  top: 0;
  left: 100%;
  margin-top: -0.125rem;
  margin-left: 0.1rem;
  display: none;
  min-width: 180px;
}
.dropdown-submenu:hover > .dropdown-menu {
  display: block;
}
.dropdown-submenu > .dropdown-item.dropdown-toggle::after {
  content: "\25B6";
  float: right;
  margin-left: 0.5em;
  font-size: 0.7em;
}
/* --- Estructura Principal del Navbar --- */
.navbar-minimalista {
  background-color: #ffffff;
  border-bottom: 1px solid #ffffff;
  height: 80px;
  padding: 0 1rem;
  position: sticky;
  top: 0;
  z-index: 1020;
  display: flex;
  align-items: center; /* Centrar verticalmente */
  box-shadow: 0 8px 32px 0 rgba(44, 62, 80, 0.18), 0 2px 0 rgba(44,62,80,0.10);
}

.navbar-minimalista .container-fluid {
  height: 100%;
  display: flex;
  align-items: center;
}

/* Banner superior para checkout */
.checkout-top-banner {
  background: #002e4d; /* conservamos azul primario */
  color: #fff;
  width: 100%;
}
.checkout-top-banner .banner-left { 
  font-weight:700;
  /* Tamaño de texto del banner superior en checkout - ajustar según sea necesario */
  font-size: 0.9rem; /* ~18px */
}
.checkout-top-banner .banner-help { color: #fff; opacity:0.95 }
.navbar-minimalista .container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* para que .badge-carrito se posicione dentro */
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
  background-color: #2c3e50;
  
  color: #ffffff;
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
  border:#2c3e50 solid 1px;
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
  margin: 0 auto;
  
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
  padding: 0.40rem 1rem 0.75rem 3rem;
  border-radius: 25px;
  border: 2px solid #2c3e50;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.buscador-wrapper input:focus {
  outline: none;
  border-color: #2c3e50;
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
  border-radius: 100%;
  width: 44px;
  height: 44px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  vertical-align: middle;
  padding: 0;
}
.btn-icon i {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
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
  background-color: #2c3e50;
  color: #fff;
}

.navbar-minimalista .container .badge-carrito {
  position: absolute;
  top: 1rem;
  right: 1.3rem;
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
  background: #f5f7f9;
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0cc3dd !important;
  color: #fff !important;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 10px;
  margin-bottom: 1.2rem;
  
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border: none;
  transition: background 0.2s, color 0.2s;
  opacity: 1 !important;
  filter: none !important;
  box-shadow: none;
  gap: 0.7rem;
}
.mobile-menu-link.auth-link:hover {
  background: #0bb6c1 !important;
  color: #fff;
  opacity: 1 !important;
}
.mobile-menu-link.auth-link i {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}
.mobile-menu hr {
  margin: 1rem 0;
}

/* --- Dropdown de Usuario --- */
.btn-user-dropdown {
  background: none;
  border: none;
  color: #2c3e50;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-user-dropdown:hover {
  background-color: #f8f9fa;
  color: #2c3e50;
}

.btn-user-dropdown .user-name {
  font-weight: 600;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-user-dropdown i.bi-person-circle {
  font-size: 1.5rem;
}

.dropdown-menu {
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
  min-width: 250px;
}

.dropdown-header {
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  padding-left: 1.25rem;
}

.dropdown-item.text-danger:hover {
  background-color: #fff5f5;
  color: #dc3545 !important;
}

/* --- Transiciones --- */
.fade-enter-active, .fade-leave-active {
  transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
.fade-enter-to, .fade-leave-from {
  max-height: 500px;
  opacity: 1;
  overflow: hidden;
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

/* --- Subrayado animado para enlaces de subcategoría en menú móvil --- */
.subcategoria-link {
  position: relative;
  transition: color 0.2s;
}
.subcategoria-link:hover, .subcategoria-link:focus {
  color: #00b4d8 !important;
}
.subcategoria-link::after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  bottom: 0.2rem;
  width: 0;
  height: 2px;
  background: #00b4d8;
  transition: width 0.2s cubic-bezier(0.4,0,0.2,1);
}
.subcategoria-link:hover::after, .subcategoria-link:focus::after {
  width: 100%;
}



</style>


