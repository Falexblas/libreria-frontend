<template>
  <div class="libros-view">
    <!-- Título de la categoría -->
    <div class="categoria-header">
      <div class="container">
        <h1 class="page-title">{{ nombreCategoria }}</h1>
        <p class="page-subtitle" v-if="categoriaActual">
          Explora nuestra selección de libros de {{ nombreCategoria.toLowerCase() }}
        </p>
        <p class="page-subtitle" v-else>
          Descubre todos nuestros libros disponibles
        </p>
      </div>
    </div>

    <!-- Grid de libros -->
    <div class="libros-content"> 
      <div class="container">
        <!-- Loading -->
        <div v-if="cargando" class="loading">
          <div class="spinner"></div>
          <p>Cargando libros...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="error">
          <p>❌ Error al cargar los libros: {{ error }}</p>
          <button @click="cargarLibros" class="btn-retry">Reintentar</button>
        </div>

        <!-- Sin resultados -->
        <div v-else-if="librosFiltrados.length === 0" class="sin-resultados">
          <p>📚 No se encontraron libros en esta categoría</p>
          <router-link to="/libros" class="btn-volver">Ver todos los libros</router-link>
        </div>

        <!-- Grid de libros con Bootstrap - 5 por fila -->
        <div v-else class="row g-2 g-lg-3">
          <div 
            v-for="libro in librosFiltrados" 
            :key="libro.id"
            class="col-12 col-sm-6 col-md-4 col-lg-2-4"
          >
            <LibroCard 
              :libro="libro"
              @agregar-carrito="agregarAlCarrito"
              @ver-detalles="verDetalles"
              @toggle-favorito="toggleFavorito"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import LibroCard from '@/components/libros/LibroCard.vue'
import { useCategoriasStore } from '@/stores/categorias'
import { useLibrosStore } from '@/stores/libros'

const route = useRoute()
const categoriasStore = useCategoriasStore()
const librosStore = useLibrosStore()

// Estado reactivo
const cargando = computed(() => librosStore.cargando)
const error = computed(() => librosStore.error)

// Computed para obtener la categoría actual
const categoriaActual = computed(() => {
  return route.params.id ? parseInt(route.params.id) : null
})

// Computed para el nombre de la categoría
const nombreCategoria = computed(() => {
  if (!categoriaActual.value) return 'Todos los Libros'
  
  const categoria = categoriasStore.categorias.find(c => c.id === categoriaActual.value)
  return categoria ? categoria.nombre : 'Categoría no encontrada'
})

// Computed para libros filtrados desde el store
const librosFiltrados = computed(() => {
  if (!categoriaActual.value) {
    // Si no hay categoría, mostrar todos los libros
    return librosStore.todosLosLibros
  }
  // Filtrar por categoría usando el computed del store
  return librosStore.librosPorCategoria(categoriaActual.value)
})

// Métodos
async function cargarLibros() {
  try {
    // Cargar todos los libros si no están en caché
    if (!librosStore.cargaInicial) {
      await librosStore.cargarTodosLosLibros()
    }
  } catch (err) {
    console.error('Error al cargar libros:', err)
  }
}

function agregarAlCarrito(libro) {
  console.log('Agregar al carrito:', libro)
  // Aquí implementarás la lógica del carrito
  alert(`¡${libro.titulo} agregado al carrito!`)
}

function verDetalles(libro) {
  console.log('Ver detalles:', libro)
  // Navegar a la página de detalles del libro
  alert(`Ver detalles de: ${libro.titulo}`)
}

function toggleFavorito(data) {
  console.log('Toggle favorito:', data)
  // Manejar favoritos
  const mensaje = data.esFavorito ? 'agregado a' : 'removido de'
  alert(`${data.libro.titulo} ${mensaje} favoritos`)
}

// Watcher para reaccionar a cambios de ruta y recargar libros
watch(() => route.params.id, (newId, oldId) => {
  console.log(`🔄 Ruta cambió de ${oldId} a ${newId}`)
  console.log(`📂 Nueva categoría: ${nombreCategoria.value}`)
  console.log(`🔢 ID de categoría: ${categoriaActual.value}`)
  
  // Recargar libros cuando cambia la categoría
  cargarLibros()
})

// Lifecycle
onMounted(() => {
  // Cargar categorías primero
  categoriasStore.cargarCategorias()
  // Luego cargar libros
  cargarLibros()
})
</script>

<style scoped>
.libros-view {
  min-height: 100vh;
  background: #EEEBE7;
}

/* Header de categoría */
.categoria-header {
  background:#D4AF37;
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  background: #EEEBE7;
}

.categoria-header .container {
  background: transparent;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
  color: white;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  text-align: center;
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.9);
}

/* Content */
.libros-content {
  padding: 0 0 3rem;
  background: #EEEBE7;
}

/* Clase personalizada para 5 columnas */
@media (min-width: 992px) {
  .col-lg-2-4 {
    flex: 0 0 auto;
    width: 20%; /* 100% / 5 = 20% */
  }
}

/* Para pantallas muy grandes, mantener 5 columnas */
@media (min-width: 1400px) {
  .col-lg-2-4 {
    width: 20%;
    max-width: 240px; /* Limitar el ancho máximo */
  }
}

/* Loading */
.loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error */
.error {
  text-align: center;
  padding: 3rem;
  color: #e74c3c;
}

.btn-retry {
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 1rem;
}

/* Sin resultados */
.sin-resultados {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--color-text);
}

.btn-volver {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #002e4d;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.btn-volver:hover {
  background: #134464;
  color: white;
  text-decoration: none;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
}
</style>
