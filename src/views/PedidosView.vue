<template>
  <div class="pedidos-view">
    <div class="container py-5">
      <!-- Header -->
      <div class="page-header mb-4">
        <h1 class="h3 fw-bold mb-2">
          <i class="fas fa-shopping-bag me-2 text-primary"></i>
          Mis Pedidos
        </h1>
        <p class="text-muted">Revisa el estado de tus compras</p>
      </div>

      <!-- Loading -->
      <div v-if="cargando" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-muted mt-3">Cargando tus pedidos...</p>
      </div>

      <!-- Sin pedidos -->
      <div v-else-if="pedidos.length === 0" class="empty-state text-center py-5">
        <div class="empty-icon mb-3">
          <i class="fas fa-box-open fa-4x text-muted"></i>
        </div>
        <h3 class="h5 mb-2">No tienes pedidos aún</h3>
        <p class="text-muted mb-4">Cuando realices tu primera compra, aparecerá aquí</p>
        <router-link to="/libros" class="btn btn-primary">
          <i class="fas fa-book me-2"></i>
          Explorar libros
        </router-link>
      </div>

      <!-- Lista de pedidos -->
      <div v-else class="pedidos-lista">
        <div v-for="(pedido, index) in pedidos" :key="pedido.id" class="pedido-card mb-4">
          <div class="card shadow-sm border-0 rounded-4">
            <!-- Header limpio y consistente -->
            <div class="card-header border-0 rounded-top-4 p-4">
              <div class="row align-items-center g-3">
                <div class="col-md-2">
                  <div class="small text-muted mb-1">Pedido</div>
                  <div class="fw-bold fs-5">#{{ index + 1 }}</div>
                </div>
                <div class="col-md-3">
                  <div class="small text-muted mb-1">
                    <i class="fas fa-calendar me-1"></i>Fecha
                  </div>
                  <div class="fw-bold">{{ formatearFecha(pedido.fechaPedido).split(',')[0] }}</div>
                </div>
                <div class="col-md-2">
                  <div class="small text-muted mb-1">
                    <i class="fas fa-money-bill me-1"></i>Total
                  </div>
                  <div class="fw-bold text-success fs-5">S/{{ pedido.total.toFixed(2) }}</div>
                </div>
                <div class="col-md-3">
                  <div class="small text-muted mb-2">Estado</div>
                  <span :class="['badge badge-lg', getBadgeClass(pedido.estado)]">
                    <i :class="getIconClass(pedido.estado)" class="me-2"></i>
                    {{ getEstadoTexto(pedido.estado) }}
                  </span>
                </div>
                <div class="col-md-2 text-end">
                  <button @click="verDetalle(pedido)" class="btn btn-sm btn-primary rounded-pill">
                    <i class="fas fa-eye me-1"></i>Ver
                  </button>
                </div>
              </div>
            </div>

            <div class="card-body p-4">
              <!-- Grid de información principal - SIMPLIFICADO -->
              <div class="info-grid mb-4">
                <div class="info-item">
                  <div class="info-label">
                    <i class="fas fa-credit-card text-primary"></i>Método de Pago
                  </div>
                  <div class="info-value">{{ formatearMetodoPago(pedido.metodoPago) }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">
                    <i class="fas fa-map-marker-alt text-danger"></i>Dirección de Entrega
                  </div>
                  <div class="info-value text-truncate" :title="pedido.direccionEnvio">{{ pedido.direccionEnvio }}</div>
                </div>
                <div class="info-item" v-if="pedido.telefonoContacto">
                  <div class="info-label">
                    <i class="fas fa-phone text-success"></i>Contacto
                  </div>
                  <div class="info-value">{{ pedido.telefonoContacto }}</div>
                </div>
              </div>

              <!-- Información de Envío - Limpia y sin repeticiones -->
              <div class="envio-info-card mb-4 p-4 rounded-3">
                <h6 class="mb-3 fw-bold d-flex align-items-center">
                  <i class="fas fa-truck me-2"></i>Información de Envío
                </h6>
                
                <div class="envio-grid">
                  <!-- Número de Seguimiento (solo si no está pendiente) -->
                  <div class="envio-item" v-if="pedido.estado !== 'pendiente'">
                    <div class="envio-label">Número de Seguimiento</div>
                    <div class="d-flex align-items-center gap-2 mt-2">
                      <code class="tracking-code">{{ generarNumeroSeguimiento(pedido.id) }}</code>
                      <button 
                        @click="copiarSeguimiento(pedido.id)" 
                        class="btn btn-sm btn-outline-secondary rounded-pill"
                        title="Copiar"
                      >
                        <i class="fas fa-copy"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Fecha Estimada de Entrega -->
                  <div class="envio-item">
                    <div class="envio-label">Fecha Estimada de Entrega</div>
                    <div class="envio-value fw-bold mt-2">
                      {{ calcularFechaEntrega(pedido.fechaPedido) }}
                    </div>
                    <small class="text-muted">(3-5 días hábiles)</small>
                  </div>

                  <!-- Cobertura -->
                  <div class="envio-item">
                    <div class="envio-label">Cobertura</div>
                    <div class="envio-value fw-bold mt-2">
                      <i class="fas fa-map-marked-alt me-1"></i>A nivel nacional
                    </div>
                    <small class="text-muted">Envío incluido en total</small>
                  </div>
                </div>
              </div>

              <!-- Notas -->
              <div v-if="pedido.notas" class="alert alert-info mb-3">
                <small>
                  <i class="fas fa-sticky-note me-1"></i>
                  <strong>Nota:</strong> {{ pedido.notas }}
                </small>
              </div>

              <!-- Timeline de estado -->
              <div class="estado-timeline mt-3">
                <div class="timeline">
                  <div :class="['timeline-item', { active: true }]">
                    <div class="timeline-icon">
                      <i class="fas fa-check"></i>
                    </div>
                    <div class="timeline-content">
                      <div class="small fw-bold">Pedido realizado</div>
                      <div class="text-muted small">{{ formatearFecha(pedido.fechaPedido) }}</div>
                    </div>
                  </div>

                  <div :class="['timeline-item', { active: pedido.estado !== 'pendiente' }]">
                    <div class="timeline-icon">
                      <i class="fas fa-truck"></i>
                    </div>
                    <div class="timeline-content">
                      <div class="small fw-bold">En camino</div>
                      <div class="text-muted small">{{ pedido.estado === 'enviando' ? formatearFecha(pedido.fechaActualizacion) : 'Pendiente' }}</div>
                    </div>
                  </div>

                  <div :class="['timeline-item', { active: pedido.estado === 'entregado' }]">
                    <div class="timeline-icon">
                      <i class="fas fa-box-open"></i>
                    </div>
                    <div class="timeline-content">
                      <div class="small fw-bold">Entregado</div>
                      <div class="text-muted small">{{ pedido.estado === 'entregado' ? formatearFecha(pedido.fechaActualizacion) : 'Pendiente' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Acciones -->
              <div class="d-flex gap-2 mt-4 pt-3 border-top">
                <button 
                  v-if="pedido.estado === 'entregado'" 
                  @click="descargarFactura(pedido.id)"
                  class="btn btn-sm btn-success rounded-pill"
                >
                  <i class="fas fa-download me-1"></i>
                  Descargar Factura
                </button>
                <button v-else class="btn btn-sm btn-secondary rounded-pill disabled">
                  <i class="fas fa-file me-1"></i>
                  Factura (disponible al entregar)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalle - Solo Libros y Total -->
    <div v-if="mostrarModal" class="modal-overlay" @click="cerrarModal">
      <div class="modal-dialog modal-lg" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-book me-2"></i>
              Libros del Pedido
            </h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          
          <div class="modal-body" v-if="pedidoSeleccionado">
            <!-- Productos del pedido -->
            <div class="info-section mb-3">
              <div v-if="cargandoDetalle" class="text-center py-3">
                <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                <small class="d-block mt-2 text-muted">Cargando libros...</small>
              </div>
              <div v-else-if="detallesPedido.length > 0">
                <div v-for="detalle in detallesPedido" :key="detalle.id" class="producto-item d-flex align-items-center mb-3 p-3 border rounded">
                  <img 
                    :src="detalle.libro?.portadaUrl || 'https://via.placeholder.com/60x80?text=Libro'" 
                    :alt="detalle.libro?.titulo"
                    class="producto-img me-3"
                  />
                  <div class="flex-grow-1">
                    <div class="fw-bold mb-1">{{ detalle.libro?.titulo || 'Libro' }}</div>
                    <small class="text-muted d-block mb-2">
                      <i class="fas fa-user me-1"></i>
                      {{ detalle.libro?.autor?.nombre }} {{ detalle.libro?.autor?.apellido }}
                    </small>
                    <div class="d-flex gap-3">
                      <small class="text-muted">
                        <i class="fas fa-shopping-cart me-1"></i>
                        Cantidad: <strong>{{ detalle.cantidad }}</strong>
                      </small>
                      <small class="text-muted">
                        <i class="fas fa-tag me-1"></i>
                        Precio: <strong>S/{{ detalle.precioUnitario.toFixed(2) }}</strong>
                      </small>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="text-muted small mb-1">Subtotal</div>
                    <strong class="text-primary fs-5">S/{{ (detalle.cantidad * detalle.precioUnitario).toFixed(2) }}</strong>
                  </div>
                </div>

                <!-- Total -->
                <div class="border-top pt-3 mt-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="fs-5 fw-bold">Total del Pedido:</span>
                    <strong class="text-primary fs-4">S/{{ pedidoSeleccionado.total.toFixed(2) }}</strong>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-muted py-3">
                No se encontraron productos
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
            <button 
              v-if="pedidoSeleccionado?.estado === 'entregado'" 
              type="button" 
              class="btn btn-success"
              @click="descargarFactura(pedidoSeleccionado.id)"
            >
              <i class="fas fa-download me-2"></i>
              Descargar Factura
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFactura } from '@/composables/useFactura'

const authStore = useAuthStore()
const { descargarFactura } = useFactura()

const pedidos = ref([])
const cargando = ref(true)
const mostrarModal = ref(false)
const pedidoSeleccionado = ref(null)
const detallesPedido = ref([])
const cargandoDetalle = ref(false)

// Cargar pedidos del usuario
async function cargarPedidos() {
  if (!authStore.isAuthenticated) {
    window.location.href = '/login'
    return
  }

  try {
    const response = await fetch('http://localhost:8080/api/ordenes', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      // Ordenar por fecha: más antiguo primero
      pedidos.value = data.sort((a, b) => {
        return new Date(a.fechaPedido) - new Date(b.fechaPedido)
      })
      console.log('✅ Pedidos cargados y ordenados:', pedidos.value)
    } else {
      console.error('❌ Error al cargar pedidos')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    cargando.value = false
  }
}

// Formatear fecha
function formatearFecha(fecha) {
  if (!fecha) return 'N/A'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatear método de pago
function formatearMetodoPago(metodo) {
  const metodos = {
    'tarjeta': 'Tarjeta de crédito/débito',
    'yape': 'Yape',
    'plin': 'Plin'
  }
  return metodos[metodo] || metodo
}

// Obtener clase del badge según estado
function getBadgeClass(estado) {
  const clases = {
    'pendiente': 'bg-warning text-dark',
    'enviando': 'bg-info text-white',
    'entregado': 'bg-success text-white'
  }
  return clases[estado] || 'bg-secondary'
}

// Obtener icono según estado
function getIconClass(estado) {
  const iconos = {
    'pendiente': 'fas fa-clock',
    'enviando': 'fas fa-truck',
    'entregado': 'fas fa-check-circle'
  }
  return iconos[estado] || 'fas fa-question'
}

// Obtener texto del estado
function getEstadoTexto(estado) {
  const textos = {
    'pendiente': 'Pendiente',
    'enviando': 'En camino',
    'entregado': 'Entregado'
  }
  return textos[estado] || estado
}

// Ver detalle del pedido
async function verDetalle(pedido) {
  const numeroPedido = pedidos.value.indexOf(pedido) + 1
  pedidoSeleccionado.value = { ...pedido, numeroPedido }
  mostrarModal.value = true
  
  // Cargar detalles del pedido
  await cargarDetallesPedido(pedido.id)
}

// Cargar detalles (productos) del pedido
async function cargarDetallesPedido(pedidoId) {
  cargandoDetalle.value = true
  detallesPedido.value = []
  
  try {
    const response = await fetch(`http://localhost:8080/api/ordenes/${pedidoId}/detalles`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      detallesPedido.value = await response.json()
      console.log('✅ Detalles cargados:', detallesPedido.value)
    } else {
      console.error('❌ Error al cargar detalles')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    cargandoDetalle.value = false
  }
}

// Cerrar modal
function cerrarModal() {
  mostrarModal.value = false
  pedidoSeleccionado.value = null
  detallesPedido.value = []
}

// Generar número de seguimiento basado en ID del pedido
function generarNumeroSeguimiento(pedidoId) {
  const timestamp = Date.now().toString().slice(-6)
  const id = String(pedidoId).padStart(5, '0')
  return `PE${id}${timestamp}`
}

// Copiar número de seguimiento al portapapeles
function copiarSeguimiento(pedidoId) {
  const numero = generarNumeroSeguimiento(pedidoId)
  navigator.clipboard.writeText(numero).then(() => {
    // Mostrar feedback visual
    const event = new CustomEvent('copiar-exito')
    window.dispatchEvent(event)
  })
}

// Calcular fecha estimada de entrega (3-5 días hábiles)
function calcularFechaEntrega(fechaPedido) {
  if (!fechaPedido) return 'N/A'
  
  const fecha = new Date(fechaPedido)
  // Agregar 4 días (promedio de 3-5 días)
  fecha.setDate(fecha.getDate() + 4)
  
  return fecha.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

onMounted(() => {
  cargarPedidos()
})
</script>

<style scoped>
.pedidos-view {
  min-height: 80vh;
  background: #f8f9fa;
}

.page-header {
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.pedido-card .card {
  border: none;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
}

.pedido-card .card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.12) !important;
}

.card-header {
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  color: #2c3e50;
}

.badge-lg {
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  border-radius: 25px;
}

/* Grid de información */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #0d6efd;
}

.info-label {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-value {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

/* Timeline */
.timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 1rem 0;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e9ecef;
  z-index: 0;
}

.timeline-item {
  flex: 1;
  text-align: center;
  position: relative;
  z-index: 1;
}

.timeline-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  transition: all 0.3s ease;
}

.timeline-item.active .timeline-icon {
  background: #0d6efd;
  color: white;
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.2);
}

.timeline-content {
  font-size: 0.85rem;
}

.empty-state {
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
}

.empty-icon {
  opacity: 0.3;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-dialog {
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.producto-img {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.producto-item {
  transition: background 0.2s;
}

.producto-item:hover {
  background: #f8f9fa;
}

/* Información de Envío - Consistente y limpia */
.envio-info-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-left: 4px solid #0d6efd;
}

.envio-info-card h6 {
  color: #2c3e50;
}

.envio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 992px) {
  .envio-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.envio-item {
  padding: 1.25rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.envio-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #0d6efd;
}

.envio-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.envio-value {
  font-size: 1rem;
  color: #2c3e50;
}

.tracking-code {
  background: #f8f9fa;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #0056b3;
  letter-spacing: 0.5px;
  border: 1px solid #dee2e6;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 992px) {
  .card-header .row > div {
    margin-bottom: 0.75rem;
  }
  
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .card-header {
    padding: 1rem;
  }
  
  .card-header .row {
    gap: 1rem !important;
  }
  
  .card-header .col-md-2,
  .card-header .col-md-3 {
    flex: 0 0 auto;
    width: auto;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .envio-grid {
    grid-template-columns: 1fr;
  }
  
  .timeline {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .timeline::before {
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    height: auto;
  }
  
  .timeline-item {
    display: flex;
    text-align: left;
    gap: 1rem;
  }
  
  .timeline-icon {
    margin: 0;
    flex-shrink: 0;
  }
  
  .envio-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .envio-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
}
</style>
