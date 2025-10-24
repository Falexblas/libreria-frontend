<template>
  <!-- Bootstrap Card -->
  <div class="card h-100 libro-card shadow-sm">
    <!-- Imagen del libro con aspect ratio responsivo -->
    <div class="position-relative libro-imagen-wrapper">
      <img 
        :src="imagenUrl" 
        :alt="tituloLibro"
        class="card-img-top libro-imagen"
        @error="handleImageError"
        loading="lazy"
      >
      
      <!-- Botón de favoritos -->
      <button 
        @click="toggleFavorito" 
        class="btn btn-favorito position-absolute d-flex align-items-center justify-content-center"
        :class="{ 'btn-danger text-white': esFavorito, 'btn-light': !esFavorito }"
        title="Agregar a favoritos"
      >
        <i :class="esFavorito ? 'fas fa-heart' : 'far fa-heart'" class="favorito-icon"></i>
      </button>
      
      <!-- Badge de descuento -->
      <span v-if="descuentoLibro > 0" class="badge bg-danger position-absolute libro-badge">
        -{{ descuentoLibro }}%
      </span>
      
      <!-- Overlay con acciones al hover -->
      <div class="libro-overlay position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
        <button @click="verDetalles" class="btn btn-outline-light btn-sm">
          <i class="fas fa-eye"></i> Ver 
        </button>
      </div>
      
       <!-- Botón de carrito flotante (solo para modo carrusel, visible en hover) -->
      <button 
        v-if="modoCarrusel"
        @click.stop="agregarAlCarrito" 
        class="btn btn-carrito-flotante position-absolute"
        :disabled="!disponibleLibro"
      >
        <i v-if="disponibleLibro" class="fas fa-plus"></i>
        <i v-else class="fas fa-times"></i>
        {{ disponibleLibro ? 'Agregar al Carrito' : 'Agotado' }}
      </button>
    </div>
    
    <!-- Cuerpo de la card (oculto en modo carrusel) -->
    <div v-if="!modoCarrusel" class="card-body d-flex flex-column p-3">
      <!-- Título del libro -->
      <h6 class="card-title libro-titulo text-truncate mb-1" :title="tituloLibro">
        {{ tituloLibro }}
      </h6>
      
      <!-- Autor del libro -->
      <p class="card-text text-muted small mb-2 lh-1">
        <i class="fas fa-user-edit me-1"></i>{{ autorCompleto }}
      </p>
      
      <!-- Precio -->
      <div class="mb-2">
        <div v-if="descuentoLibro > 0" class="d-flex align-items-center gap-1">
          <span class="text-decoration-line-through text-muted" style="font-size: 0.75rem;">
            S/{{ precioOriginal }}
          </span>
          <span class="fw-bold text-primary" style="font-size: 1.1rem;">
            S/{{ precioLibro }}
          </span>
        </div>
        <div v-else>
          <span class="fw-bold text-primary" style="font-size: 1.1rem;">
            S/{{ precioLibro }}
          </span>
        </div>
      </div>
      
      <!-- Botón de agregar al carrito -->
      <button 
        @click="agregarAlCarrito" 
        class="btn btn-primary mt-auto w-100 btn-sm py-2"
        :disabled="!disponibleLibro"
      >
        <i v-if="disponibleLibro" class="fas fa-plus me-1"></i>
        <i v-else class="fas fa-times me-1"></i>
        {{ disponibleLibro ? 'Agregar al Carrito' : 'Agotado' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCarritoStore } from '@/stores/carrito'
import { useFavoritosStore } from '@/stores/favoritos'
import Swal from 'sweetalert2'

// Props
const props = defineProps({
  libro: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      titulo: '',
      autor: '',
      precio: 0,
      portadaUrl: '',
      disponible: true,
      descuento: null,
      stock: 0
    })
  },
  // NUEVA PROP: modo carrusel
  modoCarrusel: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['agregar-carrito', 'ver-detalles'])

const router = useRouter()
const carritoStore = useCarritoStore()
const favoritosStore = useFavoritosStore()

// Computed para verificar si es favorito
const esFavorito = computed(() => favoritosStore.esFavorito(props.libro.id))

// Computed properties para manejar los datos correctamente
const tituloLibro = computed(() => {
  // Debug: ver si el título está llegando correctamente
  if (!props.libro.titulo) {
    console.warn('⚠️ No se encontró título del libro. Datos recibidos:', props.libro)
  }
  
  return props.libro.titulo || 'Título no disponible'
})

const autorCompleto = computed(() => {
  // Si tiene array de autores (nuevo formato N:M)
  if (props.libro.autores && Array.isArray(props.libro.autores) && props.libro.autores.length > 0) {
    return props.libro.autores
      .map(autor => `${autor.nombre || ''} ${autor.apellido || ''}`.trim())
      .filter(nombre => nombre)
      .join(', ') || 'Autor desconocido'
  }
  
  // Si el objeto libro tiene una propiedad autor que es un objeto (formato antiguo)
  if (props.libro.autor && typeof props.libro.autor === 'object') {
    const autor = props.libro.autor
    if (autor.nombre && autor.apellido) {
      return `${autor.nombre} ${autor.apellido}`
    }
    if (autor.nombre) return autor.nombre
    return 'Autor desconocido'
  }
  
  // Si viene como string en autor
  if (props.libro.autor && typeof props.libro.autor === 'string') {
    return props.libro.autor
  }
  
  return 'Autor desconocido'
})

const precioLibro = computed(() => {
  return props.libro.precio ? Number(props.libro.precio).toFixed(2) : '0.00'
})

const descuentoLibro = computed(() => {
  return props.libro.descuento ? Number(props.libro.descuento) : 0
})

const disponibleLibro = computed(() => {
  // Si el libro no está activo, no está disponible
  if (props.libro.activo === false) return false
  
  // Si no hay stock o el stock es 0 o menor, no está disponible
  if (props.libro.stock === undefined || props.libro.stock <= 0) return false
  
  // Si tiene stock y está activo, está disponible
  return true
})

const precioOriginal = computed(() => {
  if (descuentoLibro.value > 0) {
    const precio = Number(precioLibro.value) / (1 - descuentoLibro.value / 100)
    return precio.toFixed(2)
  }
  return precioLibro.value
})

const imagenUrl = computed(() => {
  // Manejar tanto portadaUrl como portada_url (snake_case de BD)
  const portadaUrl = props.libro.portadaUrl || props.libro.portada_url
  
  if (portadaUrl && portadaUrl.trim() !== '') {
    return portadaUrl
  }
  
  // Fallback a imagen de Unsplash si no hay imagen
  return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop'
})

// Métodos
function handleImageError(event) {
  // Solo log una vez por error, no repetitivo
  console.warn(`❌ Error cargando imagen: ${props.libro.titulo}`)
  
  // Fallback a una imagen de Unsplash que sabemos que funciona
  const fallbackImages = [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'
  ]
  
  // Usar una imagen aleatoria de fallback
  const randomIndex = Math.floor(Math.random() * fallbackImages.length)
  event.target.src = fallbackImages[randomIndex]
}

function verDetalles() {
  emit('ver-detalles', props.libro)
  router.push(`/libros/${props.libro.id}`)
}

function agregarAlCarrito() {
  if (disponibleLibro.value) {
    // Agregar directamente al store del carrito
    carritoStore.agregarAlCarrito(props.libro)
    
    // Mostrar alerta de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Agregado al carrito!',
      text: `"${props.libro.titulo}" fue agregado al carrito`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    })
    
    // También emitir el evento para compatibilidad
    emit('agregar-carrito', props.libro)
  }
}

function toggleFavorito() {
  // Usar el store de favoritos que maneja todo (validación, alertas, persistencia)
  favoritosStore.toggleFavorito(props.libro)
}
</script>

<style scoped>
/* Bootstrap Card personalizada */
.libro-card {
  border: none;
  border-radius: 15px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.libro-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
}

/* Contenedor de imagen responsivo */
.libro-imagen-wrapper {
  overflow: hidden;
  /* Aspect ratio 3:4 para libros */
  aspect-ratio: 3/4;
}

/* Imagen responsiva que se ajusta automáticamente */
.libro-imagen {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.libro-card:hover .libro-imagen {
  transform: scale(1.08);
}

/* Botón de favoritos */
.btn-favorito {
  top: 10px;
  left: 10px;
  width: 42px;
  height: 42px;
  border-radius: 50% !important;
  z-index: 10;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 0 !important;
}

.btn-favorito:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-favorito:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.3) !important;
  outline: none;
}

.btn-favorito.btn-danger:hover {
  background-color: #dc3545 !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
}

.btn-favorito.btn-light:hover {
  background-color: #ffffff !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
}

/* Icono de favorito */
.favorito-icon {
  font-size: 16px;
  line-height: 1;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Animación del corazón cuando se activa */
.btn-favorito.btn-danger .favorito-icon {
  animation: heartBeat 0.6s ease-in-out;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1.1); }
  75% { transform: scale(1.25); }
  100% { transform: scale(1); }
}

/* Badge de descuento */
.libro-badge {
  top: 10px;
  right: 10px;
  z-index: 10;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 12px !important;
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

/* Overlay con efectos */
.libro-overlay {
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 5;
  backdrop-filter: blur(2px);
}

.libro-card:hover .libro-overlay {
  opacity: 1;
}

/* Título del libro compacto */
.libro-titulo {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  /* Limitar a 2 líneas */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
  height: 2.4rem; /* Altura fija para 2 líneas */
}

/* Responsive breakpoints */
@media (max-width: 576px) {
  .libro-imagen-wrapper {
    aspect-ratio: 2/3; /* Más cuadrado en móviles */
  }
  
  .libro-titulo {
    font-size: 0.9rem;
    height: 2.2rem; /* Altura ajustada para móvil */
  }
  
  .btn-favorito {
    width: 35px;
    height: 35px;
  }
  
  .card-body {
    min-height: 120px; /* Altura menor en móviles */
    padding: 0.6rem !important;
  }
  
  .card-body .btn-sm {
    padding: 0.35rem 0.7rem;
    font-size: 0.8rem;
  }
}

@media (min-width: 577px) and (max-width: 768px) {
  .libro-imagen-wrapper {
    aspect-ratio: 3/4; /* Proporción estándar en tablets */
  }
}

@media (min-width: 769px) {
  .libro-imagen-wrapper {
    aspect-ratio: 3/4.5; /* Más alto en desktop */
  }
}

/* Card body compacto */
.card-body {
  transition: all 0.3s ease;
  padding: 0.75rem !important; /* Padding más pequeño */
  min-height: 140px; /* Altura mínima fija para consistencia */
}

.libro-card:hover .card-body {
  background-color: #f8f9fa;
}

/* Espaciado compacto para elementos internos */
.card-body .mb-1 {
  margin-bottom: 0.25rem !important;
}

.card-body .mb-2 {
  margin-bottom: 0.5rem !important;
}

/* Botón compacto */
.card-body .btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

/* Estados del botón de agregar */
.btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
  opacity: 0.65;
}

/* Mejoras de accesibilidad */
.btn-favorito:focus,
.btn:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Efectos de hover para botones del overlay */
.libro-overlay .btn:hover {
  transform: scale(1.05);
}

/* Botón de carrito flotante para modo carrusel */
.btn-carrito-flotante {
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%) translateY(60px); /* Oculto inicialmente */
  z-index: 10;
  background-color: #0d6efd;
  color: white;
  border: none;
  padding: 0.35rem 0.75rem; /* Más pequeño */
  border-radius: 20px; /* Más pequeño */
  font-size: 0.75rem; /* Texto más pequeño */
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(13, 110, 253, 0.4);
  transition: all 0.3s ease;
  white-space: nowrap;
  opacity: 0; /* Invisible inicialmente */
}

/* Mostrar el botón al hacer hover sobre la imagen */
.libro-imagen-wrapper:hover .btn-carrito-flotante {
  transform: translateX(-50%) translateY(0); /* Aparece en su posición */
  opacity: 1; /* Se hace visible */
}

.btn-carrito-flotante:hover:not(:disabled) {
  background-color: #0b5ed7;
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 5px 14px rgba(13, 110, 253, 0.5);
}

.btn-carrito-flotante:disabled {
  background-color: #6c757d;
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-carrito-flotante i {
  margin-right: 0.25rem;
  font-size: 0.7rem; /* Icono más pequeño */
}

/* Responsive para móviles */
@media (max-width: 576px) {
  .btn-carrito-flotante {
    font-size: 0.7rem;
    padding: 0.3rem 0.6rem;
  }
}

</style>
