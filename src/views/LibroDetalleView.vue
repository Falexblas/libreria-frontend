<template>
  <div class="container-fluid">
    <!-- Breadcrumb CENTRADO - Fuera del contenedor con fondo -->
    <div class="row justify-content-center breadcrumb-container">
      <div class="col-lg-10 col-xl-8">
        <nav aria-label="breadcrumb" class="mb-2">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/" class="text-decoration-none">Home</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/libros" class="text-decoration-none">Libros</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ libro?.titulo || 'Cargando...' }}
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Contenedor principal del libro - CENTRADO -->
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-8 libro-detalle-container">
        <div v-if="libro" class="row">
          <!-- Columna izquierda: Imagen + Detalles -->
          <div class="col-md-6 col-lg-5 mb-4">
            <!-- Imagen del libro -->
            <div class="d-flex justify-content-center mb-4">
              <div class="libro-imagen-container">
                <div class="position-relative">
                  <img 
                    :src="imagenLibro" 
                    :alt="libro.titulo"
                    class="img-fluid rounded shadow-lg libro-imagen-detalle"
                  >
                  <!-- Badge de descuento -->
                  <span v-if="libro.descuento > 0" class="badge bg-danger position-absolute top-0 start-0 m-2 fs-6">
                    -{{ libro.descuento }}%
                  </span>
                </div>
              </div>
            </div>

            <!-- Detalles del libro debajo de la imagen -->
            <div class="d-flex justify-content-center mb-4">
              <div class="libro-imagen-container">
                <div class="detalles-libro-tabla w-100">
                  <h6 class="fw-bold text-center mb-3 titulo-detalles">Detalles del libro</h6>
                  <div class="detalle-fila">
                  <span class="detalle-label">Autor:</span>
                  <span class="detalle-valor">{{ autorCompleto }}</span>
                </div>
                <div class="detalle-fila">
                  <span class="detalle-label">Editorial:</span>
                  <span class="detalle-valor">{{ libro.editorial?.nombre }}</span>
                </div>
                <div class="detalle-fila">
                  <span class="detalle-label">Año:</span>
                  <span class="detalle-valor">{{ libro.fechaPublicacion }}</span>
                </div>
                <div class="detalle-fila">
                  <span class="detalle-label">Páginas:</span>
                  <span class="detalle-valor">{{ libro.paginas }}</span>
                </div>
                <div class="detalle-fila">
                  <span class="detalle-label">ISBN:</span>
                  <span class="detalle-valor">{{ libro.isbn }}</span>
                </div>
              </div>
              </div>
            </div>
          </div>

          <!-- Columna derecha: Información principal del libro + Tabs -->
          <div class="col-md-6 col-lg-7">
            <div class="mb-4">
              <!-- Título -->
              <h1 class="display-5 fw-bold text-dark mb-2 titulo-libro">{{ libro.titulo }}</h1>
              
              <!-- Autor -->
              <h4 class="text-muted mb-4">
                <span class="por-texto">Por:</span> <span class="autor-libro">{{ autorCompleto }}</span>
              </h4>
              
              <!-- Precio -->
              <div class="mb-4">
                <div v-if="libro.descuento > 0" class="d-flex align-items-center gap-3">
                  <span class="fw-bold text-primary fs-3 precio-principal">
                    S/ {{ precioFinal }}
                  </span>
                  <span class="text-decoration-line-through text-muted fs-5 precio-tachado">
                    S/ {{ precioOriginal }}
                  </span>
                </div>
                <div v-else>
                  <span class="fw-bold text-primary fs-3 precio-principal">
                    S/ {{ precioFinal }}
                  </span>
                </div>
              </div>

              <!-- Acciones -->
              <div class="mb-4">
                <!-- Primera fila: Botón añadir al carrito y cantidad -->
                <div class="d-flex flex-wrap align-items-center gap-3 mb-1">
                  <!-- Botón añadir al carrito -->
                  <button 
                    @click="añadirAlCarrito" 
                    class="btn btn-warning btn-lg px-4 py-2 btn-mismo-tamaño boton-carrito"
                    :disabled="!libroDisponible"
                  >
                    <i class="fas fa-cart-plus me-2"></i>
                    {{ libroDisponible ? 'AÑADIR AL CARRITO' : 'AGOTADO' }}
                  </button>

                  <!-- Cantidad -->
                  <div class="cantidad-control">
                    <button 
                      @click="decrementarCantidad" 
                      class="btn-cantidad contador-cantidad"
                      :disabled="cantidad <= 1"
                    >
                      -
                    </button>
                    <span class="cantidad-display contador-cantidad">{{ cantidad }}</span>
                    <button 
                      @click="incrementarCantidad" 
                      class="btn-cantidad contador-cantidad"
                      :disabled="cantidad >= 10"
                    >
                      +
                    </button>
                  </div>
                </div>

                <!-- Segunda fila: Botón añadir a lista de deseos -->
                <div>
                  <!-- Botón añadir a lista de deseos -->
                  <button 
                    @click="toggleListaDeseos" 
                    class="btn btn-outline-primary btn-lg px-4 py-2 btn-mismo-tamaño boton-lista-deseos"
                    :class="{ 'btn-primary text-white': enListaDeseos }"
                  >
                    <i :class="enListaDeseos ? 'fas fa-heart' : 'far fa-heart'" class="me-2"></i>
                    {{ enListaDeseos ? 'En Lista de Deseos' : 'Añadir a Lista de Deseos' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Tabs de información en la derecha -->
            <div class="card mt-4">
              <div class="card-header">
                <ul class="nav nav-tabs card-header-tabs" id="myTab" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button 
                      class="nav-link active" 
                      id="info-tab" 
                      data-bs-toggle="tab" 
                      data-bs-target="#info" 
                      type="button" 
                      role="tab" 
                      aria-controls="info" 
                      aria-selected="true"
                    >
                      MÁS INFORMACIÓN
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button 
                      class="nav-link" 
                      id="stock-tab" 
                      data-bs-toggle="tab" 
                      data-bs-target="#stock" 
                      type="button" 
                      role="tab" 
                      aria-controls="stock" 
                      aria-selected="false"
                    >
                      DISPONIBILIDAD DE STOCK
                    </button>
                  </li>
                </ul>
              </div>

              <div class="card-body">
                <div class="tab-content" id="myTabContent">
                  <!-- Tab de Más Información -->
                  <div 
                    class="tab-pane fade show active" 
                    id="info" 
                    role="tabpanel" 
                    aria-labelledby="info-tab"
                  >
                    <h5 class="fw-bold mb-3">Sinopsis:</h5>
                    <p class="text-justify lh-lg sinopsis-texto">
                      {{ libro.descripcion }}
                    </p>
                    
                    <!-- Categorías -->
                    <div class="mt-4" v-if="libro.categorias && libro.categorias.length > 0">
                      <h6 class="fw-bold mb-3">Categorías:</h6>
                      <div class="d-flex flex-wrap gap-2">
                        <span 
                          v-for="categoria in libro.categorias" 
                          :key="categoria.id" 
                          class="badge bg-secondary"
                        >
                          {{ categoria.nombre }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Tab de Disponibilidad -->
                  <div 
                    class="tab-pane fade" 
                    id="stock" 
                    role="tabpanel" 
                    aria-labelledby="stock-tab"
                  >
                    <div class="row">
                      <div class="col-md-6">
                        <h6 class="fw-bold text-success">
                          <i class="fas fa-check-circle me-2"></i>
                          Estado: {{ libroDisponible ? 'Disponible' : 'Agotado' }}
                        </h6>
                        <p>{{ libroDisponible ? 'Tenemos este libro en stock y listo para envío.' : 'Libro temporalmente agotado.' }}</p>
                      </div>
                      <div class="col-md-6">
                        <h6 class="fw-bold">Stock disponible:</h6>
                        <p>{{ libro.stock || 'Más de 10' }} unidades disponibles</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje de carga -->
        <div v-else class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3">Cargando información del libro...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCarritoStore } from '@/stores/carrito'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const carritoStore = useCarritoStore()

// Estado reactivo
const libro = ref(null)
const cantidad = ref(1)
const enListaDeseos = ref(false)

// Computed properties
const autorCompleto = computed(() => {
  if (!libro.value?.autor) return 'Autor desconocido'
  
  if (typeof libro.value.autor === 'object') {
    const autor = libro.value.autor
    if (autor.nombre && autor.apellido) {
      return `${autor.nombre} ${autor.apellido}`
    }
    return autor.nombre || 'Autor desconocido'
  }
  
  return libro.value.autor
})

const imagenLibro = computed(() => {
  if (libro.value?.portadaUrl) {
    return libro.value.portadaUrl
  }
  return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'
})

const precioFinal = computed(() => {
  return libro.value?.precio ? Number(libro.value.precio).toFixed(2) : '0.00'
})

const precioOriginal = computed(() => {
  if (libro.value?.descuento > 0) {
    // Si hay un precio original en la BD, usarlo
    if (libro.value.precioOriginal) {
      return Number(libro.value.precioOriginal).toFixed(2)
    }
    // Si no, calcularlo basado en el precio actual y el descuento
    // precio actual = precio original * (1 - descuento/100)
    // precio original = precio actual / (1 - descuento/100)
    const precioActual = Number(libro.value.precio)
    const descuentoDecimal = Number(libro.value.descuento) / 100
    const precioOriginaleCalculado = precioActual / (1 - descuentoDecimal)
    return precioOriginaleCalculado.toFixed(2)
  }
  return precioFinal.value
})

// Computed para verificar si el libro está disponible
const libroDisponible = computed(() => {
  if (!libro.value) return false
  
  // Verificar que esté activo Y tenga stock
  return libro.value.activo && (libro.value.stock > 0)
})

// Métodos
async function cargarLibro() {
  const libroId = route.params.id
  
  try {
    // Intentar cargar libro específico desde el backend
    const response = await api.get(`/libros/${libroId}`)
    libro.value = response.data
    
    console.log('✅ Libro cargado desde backend:', response.data)
    
  } catch (err) {
    console.error('Error al cargar libro específico:', err)
    
    try {
      // Si no funciona el endpoint específico, obtener todos y filtrar
      const allBooksResponse = await api.get('/libros')
      const foundBook = allBooksResponse.data.find(book => book.id == libroId)
      
      if (foundBook) {
        libro.value = foundBook
        console.log('✅ Libro encontrado en lista completa:', foundBook)
        return
      }
      
      throw new Error(`Libro con ID ${libroId} no encontrado`)
      
    } catch (err2) {
      console.error('Error al cargar libros desde backend:', err2)
      
      // Si no se encuentra el libro, redirigir a la lista de libros
      console.warn('Libro no encontrado:', libroId)
      router.push('/libros')
    }
  }
}

function añadirAlCarrito() {
  if (libroDisponible.value) {
    carritoStore.agregarAlCarrito(libro.value, cantidad.value)
    
    // Mostrar feedback al usuario
    alert(`${libro.value.titulo} añadido al carrito`)
  }
}

function incrementarCantidad() {
  if (cantidad.value < 10) {
    cantidad.value++
  }
}

function decrementarCantidad() {
  if (cantidad.value > 1) {
    cantidad.value--
  }
}

function toggleListaDeseos() {
  enListaDeseos.value = !enListaDeseos.value
  // Aquí podrías integrar con un store de lista de deseos
  const mensaje = enListaDeseos.value ? 'añadido a' : 'removido de'
  alert(`${libro.value.titulo} ${mensaje} la lista de deseos`)
}

// Lifecycle
onMounted(() => {
  cargarLibro()
})
</script>

<style scoped>
/* Padding personalizado para el contenedor del breadcrumb */
.breadcrumb-container {
  
  padding-right: 0.5rem;
  padding-bottom: 0.1px;
  padding-left: 0.5rem;
}

/* Separador personalizado del breadcrumb con icono SVG chevron */
.breadcrumb-item + .breadcrumb-item::before {
  content: "";
  display: inline-block;
  
  width: 12px;
  height: 12px;
  
  margin-right: 5px;
  margin-bottom: 0;
  margin-left: 0.1px;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='currentColor' class='bi bi-chevron-compact-right' viewBox='0 0 16 16'%3e%3cpath fill-rule='evenodd' stroke-width='1.5' d='M6.276 1.053a.7.7 0 0 1 .971.323l3 6a.7.7 0 0 1 0 .648l-3 6a.7.7 0 1 1-1.294-.648L8.94 8 5.953 2.624a.7.7 0 0 1 .323-.971'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: center;
  vertical-align: middle;
  transform: translateY(8px);
}

/* Color del breadcrumb activo igual al navbar */
.breadcrumb-item.active {
  color: #134464 !important; /* Mismo color que el navbar */
  font-weight: 700 !important; /* Hacer el texto más grueso */
}

/* Hacer todos los elementos del breadcrumb más gruesos */
.breadcrumb-item {
  font-weight: 700 !important; /* Hacer todos los textos más gruesos */
  font-size: 0.9rem !important; /* Hacer la letra un poco más pequeña */
}

.breadcrumb-item a {
  font-weight: 700 !important; /* Hacer los enlaces también más gruesos */
  font-size: 0.9rem !important; /* Hacer los enlaces un poco más pequeños */
}

/* Fondo principal con estilo similar a la imagen de referencia */
.container-fluid {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  padding: 2rem 0;
  overflow-x: hidden; /* Prevenir scroll horizontal */
}

.container {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

/* Sombreado y estilo para el contenedor principal del libro */
.libro-detalle-container {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  margin: 0.5rem 0;
}

.text-justify {
  text-align: justify;
}

/* Estilo específico para la sinopsis - igual que en la imagen de referencia */
.sinopsis-texto {
  font-family: Sora-Regular, sans-serif !important;
  font-size: 14px !important;
  line-height: 1.7 !important;
  color: #333333 !important;
  letter-spacing: 0.3px !important;
  word-spacing: 1px !important;
  text-align: justify !important;
  margin-bottom: 1.5rem !important;
}



.btn-lg {
  padding: 0.75rem 1.5rem;
}

.nav-tabs .nav-link {
  font-weight: 600;
  color: #6c757d !important;
  border: none !important;
  background: transparent !important;
  padding: 0.75rem 1.5rem !important;
  margin-right: 2rem !important;
  border-radius: 0 !important;
  position: relative;
}

.nav-tabs .nav-link.active {
  color: #2196F3 !important;
  font-weight: 700 !important;
  border: none !important;
  background: transparent !important;
}

/* Línea inferior solo para la pestaña activa */
.nav-tabs .nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #2196F3;
  border-radius: 2px 2px 0 0;
}

.badge {
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
}

.list-unstyled li {
  margin-bottom: 0.5rem;
}

/* Clase para que ambos botones tengan el mismo tamaño */
.btn-mismo-tamaño {
  min-width: 250px;
}

/* Mover la sección de información del libro más a la izquierda */
.col-md-6.col-lg-7 {
  padding-left: 0rem !important; /* Reducir padding izquierdo */
  margin-left: -2rem !important; /* Margen negativo para mover más a la izquierda */
  padding-top: 2rem;
}

/* Estilos individuales para cambiar tamaño de letra por separado */
/* Título del libro */
.titulo-libro {
  font-size: 2rem !important;
  
}

/* Autor del libro */
.autor-libro {
  font-size: 1.1rem !important;
  color: rgb(198, 114, 45) !important;
  font-weight: 750 !important; /* Mismo grosor que "Por:" */
  text-transform: uppercase !important; /* Solo el nombre del autor en mayúsculas */
}

/* Texto "Por:" */
.por-texto {
  color: #212529 !important; /* Mismo color que el título (text-dark) */
  font-size: 1.1rem !important;
  font-weight: 700 !important; /* Más grueso */
}

/* Precio principal */
.precio-principal {
  font-size: 1.7rem !important;
}

/* Precio tachado */
.precio-tachado {
  font-size: 1rem !important;
}

/* Botón añadir al carrito */
.boton-carrito {
  font-size: 1rem !important;
  padding: 0.75rem  !important;
}

/* Contador de cantidad */
.contador-cantidad {
  font-size: 1rem !important;
}

/* Botón añadir a lista de deseos */
.boton-lista-deseos {
  font-size: 0.85rem !important;
}

/* Estilos para centrar y mejorar la imagen del libro */
.libro-imagen-container {
  width: 100%;
  max-width: 400px;
}

.libro-imagen-detalle {
  
  max-height: 500px;
  object-fit: cover;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}

/* Estilos para el control de cantidad */
.cantidad-control {
  display: flex;
  align-items: center;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-cantidad {
  background: none;
  border: none;
  padding: 0.1px 4px;
  font-size: 16px;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 28px;
}

.btn-cantidad:hover:not(:disabled) {
  background-color: #f8f9fa;
  color: #495057;
}

.btn-cantidad:disabled {
  color: #dee2e6;
  cursor: not-allowed;
}

.cantidad-display {
  padding: 10px 10px;
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  
  min-width: 3px;
  text-align: center;
}

/* Estilo mejorado para las cards de tabs - sin bordes como en la imagen */
.card {
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  background: transparent !important;
}

.card-header {
  background: transparent !important;
  border-bottom: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
}

/* Estilo de pestañas sin bordes como en la imagen de referencia */
.nav-tabs {
  border-bottom: none !important;
  background: transparent !important;
}

/* Card body sin bordes */
.card-body {
  padding: 1.5rem 0 !important;
  border: none !important;
}

/* Estilos para la tabla de detalles del libro (estructura de la imagen) */
.detalles-libro-tabla {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.2rem;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 320px; /* Ancho máximo más estrecho */
  
  } 

 

.detalle-fila {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
  font-size: 0.95rem;
}

.detalle-fila:last-child {
  border-bottom: none;
}

.detalle-label {
  font-weight: 600;
  color: #495057;
  text-align: left;
  margin: 0;
}

.detalle-valor {
  color: #212529;
  font-weight: 500;
  text-align: right;
  text-transform: uppercase;
  margin: 0;
}

@media (max-width: 1848px) {
  /* ===== RESPONSIVE SE ACTIVA SOLO EN 1848PX O MENOS ===== */
  
  /* Ajustar el contenedor principal */
  .libro-detalle-container {
    padding-top: 2.5rem;
    padding-right: 1rem;
    padding-bottom: 2.5rem;
    padding-left: 1rem;
    max-width: 95%;
    
  }
  
  /* Redistribuir las columnas */
  .col-md-6.col-lg-5 {
    flex: 0 0 auto;
    width: 42%;
  }
  
  .col-md-6.col-lg-7 {
    flex: 0 0 auto;
    width: 58%;
    padding-left: 2.9rem !important; /* Mismo padding que el estilo general */
    margin-left: -2.8rem !important; /* Mismo margen que el estilo general */
    padding-top: 1rem;
  }
  
  /* Ajustar imagen */
  .libro-imagen-container {
    max-width: 320px;
  }
  
  .libro-imagen-detalle {
    max-height: 550px;
  }
  
 
  /* Ajustar texto */
  .titulo-libro {
    font-size: 1.8rem !important;
  }
  
  .por-texto, .autor-libro {
    font-size: 1rem !important;
  }
  
  .precio-principal {
    font-size: 1.5rem !important;
  }
  
  .precio-tachado {
    font-size: 0.95rem !important;
  }
  
  /* Ajustar botones */
  .btn-mismo-tamaño {
    min-width: 220px;
  }
  
  .boton-carrito, .boton-lista-deseos {
    font-size: 0.9rem !important;
    padding: 0.65rem 1.2rem !important;
    height: 48px !important;
  }
  
  /* Control de cantidad con la misma altura pero ancho natural */
  .cantidad-control {
    font-size: 0.9rem !important;
    height: 48px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  /* Ajustar tabs - mantener estilo sin bordes en responsive */
  .card {
    margin-top: 2rem;
  }
  
  .nav-tabs .nav-link {
    font-size: 0.85rem !important;
    padding: 0.6rem 0.8rem !important;
    margin-right: 1.5rem !important;
    border: none !important;
    background: transparent !important;
  }
  
  .nav-tabs .nav-link.active {
    color: #2196F3 !important;
    border: none !important;
    background: transparent !important;
  }
}

/* ===== AJUSTES ESPECÍFICOS PARA BREAKPOINTS MENCIONADOS ===== */

@media (max-width: 1342px) {
  /* Aumentar separación en 1342px */
  .col-md-6.col-lg-7 {
    padding-left: 3rem !important;
    margin-left: -0.5rem !important;
  }
}

@media (max-width: 1052px) {
  /* Aumentar aún más la separación en 1052px */
  .col-md-6.col-lg-7 {
    padding-left: 3.5rem !important;
    margin-left: 0 !important;
  }
}

@media (max-width: 1094px) {
  .display-5 {
    font-size: 2rem;
  }
  
  .d-flex.gap-3 {
    flex-direction: column;
  }
  
  .d-flex.gap-3 > * {
    width: 100%;
  }

  /* En móviles, los botones ocupan todo el ancho disponible */
  .btn-mismo-tamaño {
    min-width: 100%;
  }
  
  .libro-detalle-container {
    padding: 1rem;
    margin: 0.5rem 0;
  }
}

@media (max-width: 1200px) {
  /* Reducir el padding para que el fondo blanco ocupe más espacio */
  .container-fluid {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
    min-height: 100vh !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0.5rem !important;
  }
  
  /* Hacer que el contenedor blanco ocupe más espacio */
  .col-lg-10.col-xl-8.libro-detalle-container{
    max-width: 7200px !important;
    margin: 0 auto !important;
    padding: 2rem !important;
  }
  
  /* Reorganizar el orden en pantallas menores a 991px */
  .row {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
  }
  
  /* La columna izquierda (imagen + detalles) va primero */
  .col-md-6.col-lg-5 {
    order: 1;
    width: 100%;
    margin-bottom: 2rem;
  }
  
  /* Agrandar un poco la imagen del libro */
  .libro-imagen-container{
    max-width: 420px !important;
  }
  
  .libro-imagen-detalle {
    max-height: 620px !important;
  }
  
  /* Agrandar un poco los detalles del libro */
  .detalles-libro-tabla {
    font-size: 1.05rem !important;
    padding: 1.2rem !important;
    max-width: 420px !important;
    margin: 0 auto !important;
  }
  
  .detalle-fila {
    padding: 0.9rem 0 !important;
  }
  
  /* La columna derecha (info + tabs) va después, centrada */
  .col-md-6.col-lg-7 {
    order: 2;
    width: 100%;
    padding-left: 0 !important;
    margin-left: 0 !important;
    padding-top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  /* Mantener la alineación original de la información del libro */
  .col-md-6.col-lg-7 > .mb-4 {
    width: 100%;
    max-width: 400px;
    text-align: left !important; /* Mantener alineación izquierda como en pantallas grandes */
  }
  
  /* Asegurar que el título mantenga su alineación */
  .col-md-6.col-lg-7 .titulo-libro {
    text-align: left !important;
  }
  
  /* Asegurar que el autor mantenga su alineación */
  .col-md-6.col-lg-7 .text-muted.mb-4 {
    text-align: left !important;
  }
  
  /* Mantener los botones alineados a la izquierda */
  .col-md-6.col-lg-7 .d-flex.flex-wrap {
    justify-content: flex-start !important;
  }
  
  /* Hacer las tabs más anchas */
  .col-md-6.col-lg-7 > .card {
    width: 100%;
    max-width: 600px;
  }
}




</style>