<template>
  <nav class="navbar-principal">
    <!-- Barra superior -->
    <div class="navbar-superior">
      <div class="container">
        <div class="navbar-contenido">
          <!-- Logo (izquierda) -->
          <div class="navbar-logo">
            <router-link to="/" class="logo-enlace">
              <div class="logo-placeholder">
                📚 LibreriaOnline
              </div>
            </router-link>
          </div>

          <!-- Buscador central -->
          <div class="navbar-busqueda">
            <div class="buscador">
              <input 
                type="text" 
                placeholder="Buscar libros, autores, categorías..." 
                class="input-busqueda"
                v-model="terminoBusqueda"
                @keyup.enter="buscarLibros"
              >
              <button class="btn-buscar" @click="buscarLibros">
                🔍
              </button>
            </div>
          </div>

          <!-- Acciones usuario (derecha) -->
          <div class="navbar-acciones">
            <!-- Botón Login/Usuario -->
            <div class="accion-usuario">
              <router-link 
                v-if="!authStore.isAuthenticated" 
                to="/login" 
                class="btn-accion"
              >
                <span class="icono">👤</span>
                <span class="texto">Iniciar Sesión</span>
              </router-link>
              
              <div v-else class="usuario-logueado" @click="toggleMenuUsuario">
                <span class="icono">👤</span>
                <span class="texto">{{ authStore.user?.nombre || 'Usuario' }}</span>
                <span class="flecha">▼</span>
                
                <!-- Menú desplegable usuario -->
                <div v-if="mostrarMenuUsuario" class="menu-usuario">
                  <router-link to="/perfil" class="menu-item">Mi Perfil</router-link>
                  <router-link to="/mis-pedidos" class="menu-item">Mis Pedidos</router-link>
                  <router-link to="/favoritos" class="menu-item">Favoritos</router-link>
                  <div class="menu-separador"></div>
                  <button @click="cerrarSesion" class="menu-item btn-logout">Cerrar Sesión</button>
                </div>
              </div>
            </div>

            <!-- Carrito -->
            <router-link to="/carrito" class="btn-carrito">
              <div class="carrito-icono">
                <span class="icono">🛒</span>
                <span 
                  v-if="carritoStore.contadorItems > 0" 
                  class="contador-carrito"
                >
                  {{ carritoStore.contadorItems }}
                </span>
              </div>
              <span class="texto">Carrito</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de categorías -->
    <div class="navbar-categorias">
      <div class="container">
        <div class="categorias-contenido">
          <router-link to="/libros" class="categoria-item categoria-todos">
            Todos los Libros
          </router-link>
          
          <router-link 
            v-for="categoria in categoriasStore.categorias" 
            :key="categoria.id"
            :to="`/libros/categoria/${categoria.id}`"
            class="categoria-item"
          >
            {{ categoria.nombre }}
          </router-link>
          
          <!-- Loading categorías -->
          <div v-if="categoriasStore.cargandoCategorias" class="categoria-item">
            Cargando...
          </div>
        </div>
      </div>
    </div>
  </nav>
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
const mostrarMenuUsuario = ref(false)

// Cargar categorías al montar el componente
onMounted(() => {
  categoriasStore.cargarCategorias()
})

// Funciones
function buscarLibros() {
  if (terminoBusqueda.value.trim()) {
    router.push(`/libros?busqueda=${encodeURIComponent(terminoBusqueda.value)}`)
  }
}

function toggleMenuUsuario() {
  mostrarMenuUsuario.value = !mostrarMenuUsuario.value
}

function cerrarSesion() {
  authStore.logout()
  mostrarMenuUsuario.value = false
  router.push('/')
}

// Cerrar menú al hacer click fuera
document.addEventListener('click', (e) => {
  if (!e.target.closest('.usuario-logueado')) {
    mostrarMenuUsuario.value = false
  }
})
</script>

<style scoped>
.navbar-principal {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Barra Superior */
.navbar-superior {
  padding: 1rem 0;
}

.navbar-contenido {
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* Logo */
.navbar-logo {
  flex-shrink: 0;
}

.logo-enlace {
  text-decoration: none;
}

.logo-placeholder {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  padding: 0.5rem 1rem;
  border: 2px dashed rgba(255,255,255,0.5);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.logo-placeholder:hover {
  background: rgba(255,255,255,0.1);
  border-color: white;
}

/* Buscador */
.navbar-busqueda {
  flex: 1;
  max-width: 500px;
}

.buscador {
  display: flex;
  background: white;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.input-busqueda {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  outline: none;
  font-size: 1rem;
}

.btn-buscar {
  padding: 0.75rem 1rem;
  background: #ff6b6b;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-buscar:hover {
  background: #ff5252;
}

/* Acciones Usuario */
.navbar-acciones {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-accion, .btn-carrito {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-width: 70px;
}

.btn-accion:hover, .btn-carrito:hover {
  background: rgba(255,255,255,0.1);
  transform: translateY(-2px);
}

.icono {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.texto {
  font-size: 0.8rem;
  font-weight: 500;
}

/* Usuario Logueado */
.usuario-logueado {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 70px;
}

.usuario-logueado:hover {
  background: rgba(255,255,255,0.1);
}

.flecha {
  font-size: 0.7rem;
  margin-top: 0.25rem;
}

/* Menú Usuario */
.menu-usuario {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  min-width: 180px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.menu-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  transition: background 0.3s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-separador {
  height: 1px;
  background: #eee;
  margin: 0.5rem 0;
}

.btn-logout {
  color: #ff6b6b;
  font-weight: 500;
}

/* Carrito */
.carrito-icono {
  position: relative;
}

.contador-carrito {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
}

/* Barra Categorías */
.navbar-categorias {
  background: rgba(0,0,0,0.1);
  padding: 0.75rem 0;
}

.categorias-contenido {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 0.25rem 0;
}

.categoria-item {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  white-space: nowrap;
  transition: all 0.3s ease;
  font-weight: 500;
}

.categoria-item:hover {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

.categoria-todos {
  background: rgba(255,255,255,0.2);
  font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-contenido {
    flex-direction: column;
    gap: 1rem;
  }
  
  .navbar-busqueda {
    order: 3;
    width: 100%;
    max-width: none;
  }
  
  .categorias-contenido {
    gap: 1rem;
  }
  
  .texto {
    display: none;
  }
}
</style>
