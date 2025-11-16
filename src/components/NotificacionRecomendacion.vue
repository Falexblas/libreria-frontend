<template>
  <Teleport to="body">
    <Transition name="slide-in">
      <div v-if="mostrar" class="notificacion-container">
        <!-- Botón cerrar -->
        <button @click="cerrar" class="btn-cerrar" aria-label="Cerrar notificación">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Contenido -->
        <div class="notificacion-content">
          <!-- Header -->
          <div class="notificacion-header">
            <div class="header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="header-text">
              <h3> Recomendación para {{ recomendacionesStore.nombreUsuario }}</h3>
              <p class="subtitle">Basado en tus compras y favoritos</p>
            </div>
          </div>

          <!-- Libro recomendado -->
          <div v-if="libroDestacado" class="libro-destacado">
            <div class="libro-imagen">
              <img 
                :src="libroDestacado.portadaUrl || '/placeholder-book.jpg'" 
                :alt="libroDestacado.titulo"
                class="portada"
              />
              <span class="badge-recomendado">Recomendado</span>
            </div>
            
            <div class="libro-info">
              <h4>{{ libroDestacado.titulo }}</h4>
              <p class="autor">{{ libroDestacado.autor }}</p>
              <p class="categoria">{{ libroDestacado.categoria }}</p>
              <p class="precio">${{ libroDestacado.precio?.toFixed(2) }}</p>
              
              <button @click="agregarAlCarrito" class="btn-agregar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Agregar al carrito
              </button>
            </div>
          </div>

          <!-- Más recomendaciones -->
          <div v-if="masRecomendaciones.length > 0" class="mas-recomendaciones">
            <p class="label">Más recomendaciones:</p>
            <div class="mini-libros">
              <div 
                v-for="libro in masRecomendaciones.slice(0, 2)" 
                :key="libro.id"
                class="mini-libro"
                @click="verDetalles(libro.id)"
              >
                <img 
                  :src="libro.portadaUrl || '/placeholder-book.jpg'" 
                  :alt="libro.titulo"
                />
                <span class="titulo-mini">{{ libro.titulo }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Barra de progreso -->
        <div class="progress-bar">
          <div class="progress" :style="{ width: progressWidth }"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRecomendacionesStore } from '@/stores/recomendaciones'
import { useCarritoStore } from '@/stores/carrito'

const router = useRouter()
const recomendacionesStore = useRecomendacionesStore()
const carritoStore = useCarritoStore()

const props = defineProps({
  mostrar: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cerrar'])

const mostrar = computed(() => props.mostrar)

const libroDestacado = computed(() => {
  return recomendacionesStore.recomendaciones[0] || null
})

const masRecomendaciones = computed(() => {
  return recomendacionesStore.recomendaciones.slice(1) || []
})

const progressWidth = computed(() => {
  return `${(recomendacionesStore.tiempoMostrado / 8) * 100}%`
})

function cerrar() {
  emit('cerrar')
  recomendacionesStore.cerrarNotificacion()
}

function agregarAlCarrito() {
  if (libroDestacado.value) {
    carritoStore.agregarAlCarrito(libroDestacado.value)
    cerrar()
  }
}

function verDetalles(libroId) {
  router.push(`/libros/${libroId}`)
  cerrar()
}
</script>

<style scoped>
.notificacion-container {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 380px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 999;
  animation: slideIn 0.4s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(400px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.4s ease;
}

.slide-in-enter-from {
  opacity: 0;
  transform: translateX(400px);
}

.slide-in-leave-to {
  opacity: 0;
  transform: translateX(400px);
}

.btn-cerrar {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  z-index: 10;
}

.btn-cerrar:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #1f2937;
}

.notificacion-content {
  padding: 20px;
}

.notificacion-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.header-text h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.subtitle {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #9ca3af;
}

.libro-destacado {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 12px;
}

.libro-imagen {
  position: relative;
  flex-shrink: 0;
}

.portada {
  width: 70px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.badge-recomendado {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #333;
  font-size: 10px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
}

.libro-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.libro-info h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
}

.autor {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.categoria {
  margin: 0;
  font-size: 11px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.precio {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #667eea;
}

.btn-agregar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #333;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}

.btn-agregar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.5);
}

.mas-recomendaciones {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.label {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.mini-libros {
  display: flex;
  gap: 8px;
}

.mini-libro {
  flex: 1;
  cursor: pointer;
  transition: all 0.2s;
}

.mini-libro img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.mini-libro:hover img {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

.titulo-mini {
  display: block;
  font-size: 10px;
  color: #6b7280;
  margin-top: 4px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.progress-bar {
  height: 3px;
  background: #e5e7eb;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
  transition: width 0.1s linear;
}

@media (max-width: 480px) {
  .notificacion-container {
    width: calc(100vw - 40px);
    bottom: 10px;
    right: 20px;
  }
}
</style>
