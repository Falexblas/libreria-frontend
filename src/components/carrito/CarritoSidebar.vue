<template>
  <!-- Overlay -->
  <div 
    v-if="carritoStore.mostrarCarrito" 
    class="carrito-overlay"
    @click="cerrarCarrito"
  ></div>

  <!-- Sidebar del carrito -->
  <div 
    class="carrito-sidebar"
    :class="{ 'carrito-abierto': carritoStore.mostrarCarrito }"
  >
    <!-- Header del carrito -->
    <div class="carrito-header">
      <h3 class="carrito-titulo">
        <i class="fas fa-shopping-cart me-2"></i>
        Mi Carrito
      </h3>
      <button @click="cerrarCarrito" class="btn-cerrar">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Contenido del carrito -->
    <div class="carrito-contenido">
      <!-- Carrito vacío -->
      <div v-if="carritoStore.items.length === 0" class="carrito-vacio">
        <div class="icono-vacio">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <h4>Tu carrito está vacío</h4>
        <p>¡Agrega algunos libros para comenzar!</p>
        <button @click="cerrarCarrito" class="btn btn-primary">
          Seguir Comprando
        </button>
      </div>

      <!-- Items del carrito -->
      <div v-else class="carrito-items">
        <div 
          v-for="item in carritoStore.items" 
          :key="item.id"
          class="carrito-item"
        >
          <!-- Imagen del libro -->
          <div class="item-imagen">
            <img 
              :src="item.portadaUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop'" 
              :alt="item.titulo"
              @error="handleImageError"
            >
          </div>

          <!-- Información del libro -->
          <div class="item-info">
            <h5 class="item-titulo">{{ item.titulo }}</h5>
            <p class="item-autor">{{ obtenerNombreAutor(item.autor) }}</p>
            <div class="item-precio">
              <!-- Precio original (si hay descuento) -->
              <div v-if="item.descuento && item.descuento > 0" class="precio-original">
                S/{{ calcularPrecioOriginal(item.precio, item.descuento) }}
              </div>
              <!-- Precio actual -->
              <div class="precio-actual">
                S/{{ item.precio.toFixed(2) }}
              </div>
              <!-- Precio total por cantidad -->
              <div class="precio-total">
                Total: S/{{ (item.precio * item.cantidad).toFixed(2) }}
              </div>
            </div>
          </div>

          <!-- Controles de cantidad y eliminar -->
          <div class="item-controles">
            <div class="controles-horizontales">
              <!-- Controles de cantidad -->
              <div class="cantidad-controles">
                <button 
                  @click="disminuirCantidad(item.id)"
                  class="btn-cantidad"
                  :disabled="item.cantidad <= 1"
                >
                  <i class="fas fa-minus"></i>
                </button>
                <span class="cantidad">{{ item.cantidad }}</span>
                <button 
                  @click="aumentarCantidad(item.id)"
                  class="btn-cantidad"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              
              <!-- Botón eliminar al lado -->
              <button 
                @click="eliminarItem(item.id)"
                class="btn-eliminar"
                title="Eliminar del carrito"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer del carrito -->
    <div v-if="carritoStore.items.length > 0" class="carrito-footer">
      <!-- Resumen -->
      <div class="carrito-resumen">
        <div class="resumen-linea">
          <span>Subtotal ({{ carritoStore.totalItems }} {{ carritoStore.totalItems === 1 ? 'libro' : 'libros' }}):</span>
          <span class="precio-subtotal">S/{{ carritoStore.subtotal.toFixed(2) }}</span>
        </div>
        <div class="resumen-linea">
          <span>Envío:</span>
          <span class="precio-envio">Gratis</span>
        </div>
        <div class="resumen-total">
          <span>Total:</span>
          <span class="precio-total">S/{{ carritoStore.total.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="carrito-acciones">
        <button @click="cerrarCarrito" class="btn btn-outline-secondary w-100 mb-2">
          Seguir Comprando
        </button>
        <button @click="procederCompra" class="btn btn-success w-100">
          <i class="fas fa-credit-card me-2"></i>
          Proceder con la Compra
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCarritoStore } from '@/stores/carrito'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const carritoStore = useCarritoStore()
const authStore = useAuthStore()
const router = useRouter()

// Métodos
function cerrarCarrito() {
  carritoStore.cerrarCarrito()
}

function aumentarCantidad(itemId) {
  carritoStore.aumentarCantidad(itemId)
}

function disminuirCantidad(itemId) {
  carritoStore.disminuirCantidad(itemId)
}

function eliminarItem(itemId) {
  carritoStore.eliminarItem(itemId)
}

function procederCompra() {
  // Validar si el usuario está autenticado
  if (!authStore.isAuthenticated) {
    Swal.fire({
      icon: 'warning',
      title: 'Inicia sesión para continuar',
      text: 'Debes iniciar sesión para proceder con la compra',
      confirmButtonText: 'Ir a Iniciar Sesión',
      confirmButtonColor: '#0d6efd',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        // Cerrar carrito y redirigir al login
        carritoStore.cerrarCarrito()
        setTimeout(() => {
          router.push('/login')
        }, 300)
      }
    })
    return
  }

  // Si está autenticado, proceder con la compra
  carritoStore.cerrarCarrito()
  
  // Pequeño delay para que la animación de cierre se vea suave
  setTimeout(() => {
    router.push('/checkout')
  }, 300) // 300ms = duración de la animación de cierre
}

function obtenerNombreAutor(autor) {
  if (typeof autor === 'string') return autor
  if (autor && typeof autor === 'object') {
    if (autor.nombre && autor.apellido) return `${autor.nombre} ${autor.apellido}`
    if (autor.nombre) return autor.nombre
  }
  return 'Autor desconocido'
}

function calcularPrecioOriginal(precioConDescuento, descuento) {
  const precioOriginal = precioConDescuento / (1 - descuento / 100)
  return precioOriginal.toFixed(2)
}

function handleImageError(event) {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop'
  ]
  const randomIndex = Math.floor(Math.random() * fallbackImages.length)
  event.target.src = fallbackImages[randomIndex]
}
</script>

<style scoped>
/* Overlay */
.carrito-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  backdrop-filter: blur(2px);
}

/* Sidebar principal */
.carrito-sidebar {
  position: fixed;
  top: 0;
  right: -488px;
  width: 488px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 1050;
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.carrito-sidebar.carrito-abierto {
  right: 0;
}

/* Header */
.carrito-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.carrito-titulo {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.btn-cerrar {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-cerrar:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #495057;
}

/* Contenido */
.carrito-contenido {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* Carrito vacío */
.carrito-vacio {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.icono-vacio {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.carrito-vacio h4 {
  margin-bottom: 0.5rem;
  color: #495057;
}

.carrito-vacio p {
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

/* Items del carrito */
.carrito-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.carrito-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.carrito-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Imagen del item */
.item-imagen {
  flex-shrink: 0;
  width: 60px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.item-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Información del item */
.item-info {
  flex: 1;
  min-width: 0;
}

.item-titulo {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #2c3e50;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.item-autor {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.item-precio {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.precio-original {
  font-size: 0.75rem;
  color: #6c757d;
  text-decoration: line-through;
}

.precio-actual {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
}

.precio-total {
  font-size: 0.8rem;
  font-weight: 600;
  color: #28a745;
}

/* Controles */
.item-controles {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.controles-horizontales {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cantidad-controles {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border-radius: 20px;
  padding: 0.25rem;
  border: 1px solid #dee2e6;
}

.btn-cantidad {
  width: 28px;
  height: 28px;
  border: none;
  background: #f8f9fa;
  color: #495057;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.75rem;
}

.btn-cantidad:hover:not(:disabled) {
  background: #e9ecef;
}

.btn-cantidad:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cantidad {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-eliminar {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  font-size: 0.75rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-eliminar:hover {
  background: rgba(220, 53, 69, 0.1);
  transform: scale(1.1);
}

/* Footer */
.carrito-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.carrito-resumen {
  margin-bottom: 1.5rem;
}

.resumen-linea {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.resumen-total {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.1rem;
  padding-top: 0.5rem;
  border-top: 1px solid #dee2e6;
  margin-top: 0.5rem;
}

.precio-envio {
  color: #28a745;
  font-weight: 500;
}

.precio-subtotal,
.precio-total {
  color: #2c3e50;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 480px) {
  .carrito-sidebar {
    width: 100vw;
    right: -100vw;
  }
  
  .carrito-item {
    flex-direction: column;
    text-align: center;
  }
  
  .item-imagen {
    align-self: center;
  }
  
  .item-controles {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
