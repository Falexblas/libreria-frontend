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

const route = useRoute()
const categoriasStore = useCategoriasStore()

// Estado reactivo
const libros = ref([])
const todosLosLibros = ref([]) // Guardamos todos los libros para filtrar
const cargando = ref(false)
const error = ref(null)

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

// Computed para libros filtrados
const librosFiltrados = computed(() => {
  if (!categoriaActual.value) {
    return todosLosLibros.value // Mostrar todos si no hay categoría
  }
  
  // Filtrar por categoría (por ahora simulado, luego conectarás con tu backend)
  const filtrados = todosLosLibros.value.filter(libro => {
    const categoriaLibro = asignarCategoriaSimulada(libro)
    return categoriaLibro === categoriaActual.value
  })
  
  console.log(`📂 Categoría ${categoriaActual.value}: ${filtrados.length} libros encontrados`)
  return filtrados
})

// Función para simular categorías (temporal hasta que tengas el backend completo)
function asignarCategoriaSimulada(libro) {
  const titulo = (libro.titulo || '').toLowerCase()
  
  // Manejar diferentes formatos del autor
  let autorString = ''
  if (typeof libro.autor === 'string') {
    autorString = libro.autor.toLowerCase()
  } else if (libro.autor && typeof libro.autor === 'object') {
    // Si es un objeto autor con nombre y apellido
    if (libro.autor.nombre && libro.autor.apellido) {
      autorString = `${libro.autor.nombre} ${libro.autor.apellido}`.toLowerCase()
    } else if (libro.autor.nombre) {
      autorString = libro.autor.nombre.toLowerCase()
    }
  }
  
  // Mapeo simulado basado en títulos/autores conocidos
  if (titulo.includes('harry potter') || autorString.includes('rowling')) return 2 // Fantasía
  if (titulo.includes('resplandor') || autorString.includes('king')) return 8 // Terror
  if (titulo.includes('código') || titulo.includes('da vinci') || autorString.includes('brown')) return 3 // Misterio
  if (titulo.includes('soledad') || autorString.includes('garcía márquez') || autorString.includes('márquez')) return 11 // Literatura Latinoamericana
  if (titulo.includes('espíritus') || autorString.includes('allende')) return 11 // Literatura Latinoamericana
  if (titulo.includes('quijote') || autorString.includes('cervantes')) return 7 // Historia
  
  // Distribución más variada para tener libros en diferentes categorías
  const hashCode = titulo.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  const categorias = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  return categorias[Math.abs(hashCode) % categorias.length]
}

// Métodos
async function cargarLibros() {
  cargando.value = true
  error.value = null
  
  try {
    // Intentar cargar desde el backend
    const response = await fetch('http://localhost:8080/api/libros')
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log(`✅ ${data.length} elementos recibidos del backend`)
    
    // Debug: verificar si son libros o autores
    if (data.length > 0) {
      const primerElemento = data[0]
      console.log('🔍 Primer elemento recibido:', primerElemento)
      
      // Verificar si es un libro (tiene titulo) o un autor (tiene nombre/apellido sin titulo)
      if (primerElemento.titulo) {
        console.log('✅ Datos correctos: son libros')
      } else if (primerElemento.nombre && primerElemento.apellido && !primerElemento.titulo) {
        console.error('❌ ERROR: El backend está devolviendo autores en lugar de libros')
        console.log('💡 Verifica que el endpoint sea /api/libros y no /api/autores')
      }
      
      // Verificar que portadaUrl tenga una URL válida
      if (primerElemento.portadaUrl && !primerElemento.portadaUrl.startsWith('http')) {
        console.warn('⚠️ portadaUrl no parece ser una URL completa:', primerElemento.portadaUrl)
      }
    }
    
    // Filtrar solo elementos que parezcan libros (tienen titulo)
    const librosValidos = data.filter(item => item.titulo)
    
    if (librosValidos.length !== data.length) {
      console.warn(`⚠️ Se filtraron ${data.length - librosValidos.length} elementos que no son libros`)
    }
    
    todosLosLibros.value = librosValidos.length > 0 ? librosValidos : data
    
  } catch (err) {
    console.error('Error al cargar libros:', err)
    error.value = err.message
    
    // Sin datos de prueba - solo mostrar error
    todosLosLibros.value = []
    
  } finally {
    cargando.value = false
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

// Watcher para reaccionar a cambios de ruta
watch(() => route.params.id, (newId, oldId) => {
  console.log(`🔄 Ruta cambió de ${oldId} a ${newId}`)
  console.log(`📂 Nueva categoría: ${nombreCategoria.value}`)
  console.log(`🔢 ID de categoría: ${categoriaActual.value}`)
}, { immediate: true })

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
