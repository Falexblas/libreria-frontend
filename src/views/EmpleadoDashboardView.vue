<template>
  <div class="empleado-dashboard">
    <div class="sidebar">
      <div class="sidebar-header">
        <i class="fas fa-clipboard-list me-2"></i>
        <h4 class="mb-0">Panel Empleado</h4>
      </div>

      <nav class="sidebar-nav">
        <a
          class="nav-item active"
        >
          <i class="fas fa-shopping-cart"></i>
          <span>Órdenes</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button @click="cerrarSesion" class="btn btn-outline-light btn-sm w-100">
          <i class="fas fa-sign-out-alt me-2"></i>
          Cerrar Sesión
        </button>
      </div>
    </div>

    <div class="main-content">
      <div class="content-header">
        <div>
          <h2 class="mb-1">Gestión de Órdenes</h2>
          <p class="text-muted mb-0">Visualiza y actualiza el estado de las órdenes de los clientes</p>
        </div>
        <div class="user-info">
          <span class="text-muted me-2">Empleado:</span>
          <strong>{{ authStore.user?.nombre }} {{ authStore.user?.apellido }}</strong>
          <span class="badge bg-primary ms-2">EMPLEADO</span>
        </div>
      </div>

      <div class="content-body">
        <div class="ordenes-view">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4>Órdenes</h4>
            <div class="d-flex gap-2">
              <select class="form-select form-select-sm" v-model="filtroEstadoOrden" style="width: auto;">
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="enviando">En camino</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>
          </div>

          <div class="card">
            <div class="card-body p-0">
              <div class="table-responsive" style="min-height: 400px; max-height: 600px; overflow-y: auto;">
                <table class="table table-hover table-compact">
                  <thead>
                    <tr>
                      <th style="width: 60px;">ID</th>
                      <th style="width: 150px;">Cliente</th>
                      <th style="width: 150px;">Email</th>
                      <th style="width: 100px;">Fecha</th>
                      <th style="width: 100px;">Total</th>
                      <th style="width: 120px;">Estado</th>
                      <th style="width: 200px;">Dirección</th>
                      <th style="width: 120px;">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="cargandoTodasOrdenes" class="text-center">
                      <td colspan="8" class="py-5">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Cargando...</span>
                        </div>
                      </td>
                    </tr>
                    <tr v-else-if="ordenesFiltradas.length === 0">
                      <td colspan="8" class="text-center text-muted py-4">
                        <i class="fas fa-shopping-cart me-2"></i>
                        No hay órdenes {{ filtroEstadoOrden ? `con estado "${filtroEstadoOrden}"` : 'registradas' }}
                      </td>
                    </tr>
                    <tr v-else v-for="orden in ordenesFiltradas" :key="orden.id">
                      <td class="text-muted">#{{ orden.id }}</td>
                      <td class="text-truncate" style="max-width: 150px;">
                        {{ orden.usuario?.nombre }} {{ orden.usuario?.apellido }}
                      </td>
                      <td class="text-truncate small" style="max-width: 150px;">
                        {{ orden.usuario?.email }}
                      </td>
                      <td class="small">{{ formatearFechaCorta(orden.fechaPedido) }}</td>
                      <td class="fw-bold text-primary">S/{{ orden.total.toFixed(2) }}</td>
                      <td>
                        <span :class="['badge', getBadgeClass(orden.estado)]">
                          {{ getEstadoTexto(orden.estado) }}
                        </span>
                      </td>
                      <td class="text-truncate small" style="max-width: 200px;">
                        {{ orden.direccionEnvio }}
                      </td>
                      <td>
                        <div class="d-flex gap-1">
                          <div class="dropdown">
                            <button 
                              class="btn btn-sm btn-outline-secondary" 
                              type="button" 
                              :id="'dropdown-orden-' + orden.id"
                              data-bs-toggle="dropdown" 
                              aria-expanded="false"
                              title="Cambiar estado"
                            >
                              <i class="fas fa-edit"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end" :aria-labelledby="'dropdown-orden-' + orden.id">
                              <li>
                                <a 
                                  class="dropdown-item" 
                                  href="#" 
                                  @click.prevent="cambiarEstado(orden.id, 'pendiente')"
                                  :class="{ active: orden.estado === 'pendiente' }"
                                >
                                  <span class="badge bg-warning text-dark me-2">●</span>
                                  Pendiente
                                </a>
                              </li>
                              <li>
                                <a 
                                  class="dropdown-item" 
                                  href="#" 
                                  @click.prevent="cambiarEstado(orden.id, 'enviando')"
                                  :class="{ active: orden.estado === 'enviando' }"
                                >
                                  <span class="badge bg-info text-white me-2">●</span>
                                  En camino
                                </a>
                              </li>
                              <li>
                                <a 
                                  class="dropdown-item" 
                                  href="#" 
                                  @click.prevent="cambiarEstado(orden.id, 'entregado')"
                                  :class="{ active: orden.estado === 'entregado' }"
                                >
                                  <span class="badge bg-success text-white me-2">●</span>
                                  Entregado
                                </a>
                              </li>
                            </ul>
                          </div>

                          <button 
                            class="btn btn-sm btn-outline-primary" 
                            title="Ver detalles"
                            @click="verDetalleOrden(orden.id)"
                          >
                            <i class="fas fa-eye"></i>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-success"
                            title="Descargar etiqueta"
                            aria-label="Descargar etiqueta"
                            @click="descargarOrden(orden)"
                          >
                            <i class="fas fa-download"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Detalle Orden -->
    <div v-if="mostrarModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-receipt me-2"></i>
              Detalle de Orden #{{ ordenSeleccionada?.id }}
            </h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="cargandoDetalle" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
            </div>
            <div v-else-if="ordenSeleccionada">
              <div class="mb-4">
                <h6 class="text-muted mb-3">Información del Cliente</h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <strong>Nombre:</strong> {{ ordenSeleccionada.usuario?.nombre }} {{ ordenSeleccionada.usuario?.apellido }}
                  </div>
                  <div class="col-md-6">
                    <strong>Email:</strong> {{ ordenSeleccionada.usuario?.email }}
                  </div>
                  <div class="col-md-6">
                    <strong>Teléfono:</strong> {{ ordenSeleccionada.telefonoContacto || 'N/A' }}
                  </div>
                  <div class="col-md-6">
                    <strong>Fecha:</strong> {{ formatearFecha(ordenSeleccionada.fechaPedido) }}
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <h6 class="text-muted mb-3">Información de Envío</h6>
                <div class="row g-3">
                  <div class="col-12">
                    <strong>Dirección:</strong> {{ ordenSeleccionada.direccionEnvio }}
                  </div>
                  <div class="col-md-6">
                    <strong>Ciudad:</strong> {{ ordenSeleccionada.ciudadEnvio }}
                  </div>
                  <div class="col-md-6">
                    <strong>Código Postal:</strong> {{ ordenSeleccionada.codigoPostalEnvio || 'N/A' }}
                  </div>
                  <div class="col-12" v-if="ordenSeleccionada.notas">
                    <strong>Notas:</strong> {{ ordenSeleccionada.notas }}
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <h6 class="text-muted mb-3">Productos</h6>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Libro</th>
                        <th class="text-center">Cantidad</th>
                        <th class="text-end">Precio Unit.</th>
                        <th class="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="detallesOrden.length === 0">
                        <td colspan="4" class="text-center text-muted py-4">
                          <i class="fas fa-box-open me-2"></i>
                          No se encontraron productos para esta orden
                        </td>
                      </tr>
                      <tr v-for="detalle in detallesOrden" :key="detalle.id">
                        <td>{{ detalle.libro?.titulo || 'N/A' }}</td>
                        <td class="text-center">{{ detalle.cantidad }}</td>
                        <td class="text-end">S/{{ detalle.precioUnitario?.toFixed(2) || '0.00' }}</td>
                        <td class="text-end fw-bold">S/{{ ((detalle.cantidad || 0) * (detalle.precioUnitario || 0)).toFixed(2) }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="3" class="text-end"><strong>Total:</strong></td>
                        <td class="text-end"><strong class="text-primary fs-5">S/{{ ordenSeleccionada.total.toFixed(2) }}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <strong>Estado:</strong>
                  <span :class="['badge ms-2', getBadgeClass(ordenSeleccionada.estado)]">
                    {{ getEstadoTexto(ordenSeleccionada.estado) }}
                  </span>
                </div>
                <div class="col-md-6">
                  <strong>Método de Pago:</strong> {{ ordenSeleccionada.metodoPago || 'N/A' }}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const todasLasOrdenes = ref([])
const cargandoTodasOrdenes = ref(false)
const filtroEstadoOrden = ref('')

const mostrarModal = ref(false)
const ordenSeleccionada = ref(null)
const detallesOrden = ref([])
const cargandoDetalle = ref(false)

const ordenesFiltradas = computed(() => {
  let ordenes = todasLasOrdenes.value
  if (filtroEstadoOrden.value) {
    ordenes = ordenes.filter(orden => orden.estado === filtroEstadoOrden.value)
  }
  return [...ordenes].sort((a, b) => a.id - b.id)
})

function formatearFecha(fecha) {
  if (!fecha) return 'N/A'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function formatearFechaCorta(fecha) {
  if (!fecha) return 'N/A'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short'
  })
}

function getBadgeClass(estado) {
  const clases = {
    pendiente: 'bg-warning text-dark',
    enviando: 'bg-info text-white',
    entregado: 'bg-success text-white'
  }
  return clases[estado] || 'bg-secondary'
}

function getEstadoTexto(estado) {
  const textos = {
    pendiente: 'Pendiente',
    enviando: 'En camino',
    entregado: 'Entregado'
  }
  return textos[estado] || estado
}

async function cargarTodasLasOrdenes() {
  cargandoTodasOrdenes.value = true
  try {
    const response = await fetch('http://localhost:8080/api/empleado/ordenes', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    if (response.ok) {
      todasLasOrdenes.value = await response.json()
    }
  } catch (error) {
    console.error('Error al cargar órdenes (empleado):', error)
  } finally {
    cargandoTodasOrdenes.value = false
  }
}

async function cambiarEstado(ordenId, nuevoEstado) {
  try {
    const response = await fetch(`http://localhost:8080/api/empleado/ordenes/${ordenId}/estado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ estado: nuevoEstado })
    })

    if (response.ok) {
      const orden = todasLasOrdenes.value.find(o => o.id === ordenId)
      if (orden) {
        orden.estado = nuevoEstado
      }
      if (ordenSeleccionada.value && ordenSeleccionada.value.id === ordenId) {
        ordenSeleccionada.value.estado = nuevoEstado
      }
      alert(`✅ Estado actualizado a: ${getEstadoTexto(nuevoEstado)}`)
    } else {
      alert('❌ Error al actualizar el estado')
    }
  } catch (error) {
    console.error('Error al cambiar estado (empleado):', error)
    alert('❌ Error de conexión')
  }
}

async function verDetalleOrden(ordenId) {
  mostrarModal.value = true
  cargandoDetalle.value = true

  try {
    const responseOrden = await fetch(`http://localhost:8080/api/empleado/ordenes/${ordenId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    if (responseOrden.ok) {
      ordenSeleccionada.value = await responseOrden.json()
    } else {
      console.error('Error al obtener orden (empleado):', responseOrden.status)
    }

    const responseDetalles = await fetch(`http://localhost:8080/api/empleado/ordenes/${ordenId}/detalles`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    if (responseDetalles.ok) {
      detallesOrden.value = await responseDetalles.json()
    } else {
      console.error('Error al obtener detalles (empleado):', responseDetalles.status)
    }
  } catch (error) {
    console.error('Error al cargar detalles (empleado):', error)
    alert('❌ Error al cargar los detalles de la orden')
  } finally {
    cargandoDetalle.value = false
  }
}

// Reemplaza la descarga directa por generación de etiqueta vía composable
import { useEtiqueta } from '@/composables/useEtiqueta'
const { generarEtiqueta } = useEtiqueta()

function descargarOrden(orden) {
  // Llama al generador de etiqueta con el ID de la orden
  if (!orden || !orden.id) {
    alert('Orden inválida')
    return
  }
  generarEtiqueta(orden.id)
}

function cerrarModal() {
  mostrarModal.value = false
  ordenSeleccionada.value = null
  detallesOrden.value = []
}

function cerrarSesion() {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  const isEmpleado =
    authStore.user?.rol?.nombre === 'EMPLEADO' || authStore.user?.rol === 'EMPLEADO'

  if (!isEmpleado) {
    alert('No tienes permisos para acceder a esta página')
    router.push('/')
    return
  }

  await cargarTodasLasOrdenes()
})
</script>

<style scoped>
.empleado-dashboard {
  display: flex;
  min-height: calc(100vh - 70px);
  background-color: #f5f5f9;
}

.sidebar {
  width: 240px;
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.sidebar-nav {
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #e5e7eb;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.nav-item i {
  width: 18px;
}

.nav-item.active,
.nav-item:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: #fff;
}

.sidebar-footer {
  margin-top: 1rem;
}

.main-content {
  flex: 1;
  padding: 1.5rem 2rem;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
}

.content-body {
  background: #fff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
}
</style>

