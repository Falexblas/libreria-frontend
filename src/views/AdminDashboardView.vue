<template>
  <div class="admin-dashboard">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <i class="fas fa-shield-alt me-2"></i>
        <h4 class="mb-0">Panel Admin</h4>
      </div>
      
      <nav class="sidebar-nav">
        <a 
          v-for="item in menuItems" 
          :key="item.id"
          @click="currentView = item.id"
          :class="['nav-item', { active: currentView === item.id }]"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button @click="cerrarSesion" class="btn btn-outline-light btn-sm w-100">
          <i class="fas fa-sign-out-alt me-2"></i>
          Cerrar Sesión
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <div class="content-header">
        <div>
          <h2 class="mb-1">{{ currentViewTitle }}</h2>
          <p class="text-muted mb-0">{{ currentViewDescription }}</p>
        </div>
        <div class="user-info">
          <span class="text-muted me-2">Bienvenido,</span>
          <strong>{{ authStore.user?.nombre }} {{ authStore.user?.apellido }}</strong>
          <span class="badge bg-danger ms-2">ADMIN</span>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-body">
        <!-- Dashboard Overview -->
        <div v-if="currentView === 'dashboard'" class="dashboard-view">
          <div class="row g-4 mb-4">
            <div class="col-md-3">
              <div class="stat-card">
                <div class="stat-icon bg-primary">
                  <i class="fas fa-book"></i>
                </div>
                <div class="stat-info">
                  <h3>{{ stats.totalLibros }}</h3>
                  <p>Total Libros</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card">
                <div class="stat-icon bg-success">
                  <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="stat-info">
                  <h3>{{ stats.totalOrdenes }}</h3>
                  <p>Total Órdenes</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card">
                <div class="stat-icon bg-warning">
                  <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                  <h3>{{ stats.totalUsuarios }}</h3>
                  <p>Total Usuarios</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card">
                <div class="stat-icon bg-info">
                  <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="stat-info">
                  <h3>S/{{ stats.ventasTotales.toFixed(2) }}</h3>
                  <p>Ventas Totales</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Órdenes Recientes -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Órdenes Recientes</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="orden in ordenesRecientes" :key="orden.id">
                      <td>#{{ orden.id }}</td>
                      <td>{{ orden.usuario?.nombre }} {{ orden.usuario?.apellido }}</td>
                      <td>{{ formatearFecha(orden.fechaPedido) }}</td>
                      <td class="fw-bold">S/{{ orden.total.toFixed(2) }}</td>
                      <td>
                        <span :class="['badge', getBadgeClass(orden.estado)]">
                          {{ orden.estado }}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary">
                          <i class="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Gestión de Libros -->
        <div v-if="currentView === 'libros'" class="libros-view">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4>Gestión de Libros</h4>
            <button class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>
              Agregar Libro
            </button>
          </div>
          <p class="text-muted">Aquí podrás gestionar todos los libros del catálogo</p>
        </div>

        <!-- Gestión de Órdenes -->
        <div v-if="currentView === 'ordenes'" class="ordenes-view">
          <h4 class="mb-4">Gestión de Órdenes</h4>
          <p class="text-muted">Aquí podrás gestionar todas las órdenes</p>
        </div>

        <!-- Gestión de Usuarios -->
        <div v-if="currentView === 'usuarios'" class="usuarios-view">
          <h4 class="mb-4">Gestión de Usuarios</h4>
          <p class="text-muted">Aquí podrás gestionar todos los usuarios</p>
        </div>

        <!-- Reportes -->
        <div v-if="currentView === 'reportes'" class="reportes-view">
          <h4 class="mb-4">Reportes y Estadísticas</h4>
          <p class="text-muted">Aquí podrás ver reportes detallados</p>
        </div>

        <!-- Configuración -->
        <div v-if="currentView === 'configuracion'" class="configuracion-view">
          <h4 class="mb-4">Configuración</h4>
          <p class="text-muted">Aquí podrás configurar el sistema</p>
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

const currentView = ref('dashboard')

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  { id: 'libros', label: 'Libros', icon: 'fas fa-book' },
  { id: 'ordenes', label: 'Órdenes', icon: 'fas fa-shopping-cart' },
  { id: 'usuarios', label: 'Usuarios', icon: 'fas fa-users' },
  { id: 'reportes', label: 'Reportes', icon: 'fas fa-chart-bar' },
  { id: 'configuracion', label: 'Configuración', icon: 'fas fa-cog' }
]

const stats = ref({
  totalLibros: 0,
  totalOrdenes: 0,
  totalUsuarios: 0,
  ventasTotales: 0
})

const ordenesRecientes = ref([])

const currentViewTitle = computed(() => {
  const item = menuItems.find(m => m.id === currentView.value)
  return item?.label || 'Dashboard'
})

const currentViewDescription = computed(() => {
  const descriptions = {
    dashboard: 'Resumen general del sistema',
    libros: 'Administra el catálogo de libros',
    ordenes: 'Gestiona las órdenes de compra',
    usuarios: 'Administra los usuarios del sistema',
    reportes: 'Visualiza estadísticas y reportes',
    configuracion: 'Configura el sistema'
  }
  return descriptions[currentView.value] || ''
})

// Verificar que el usuario sea admin
onMounted(async () => {
  const isAdmin = authStore.user?.rol?.nombre === 'ADMIN' || authStore.user?.rol === 'ADMIN'
  
  if (!isAdmin) {
    alert('No tienes permisos para acceder a esta página')
    router.push('/')
    return
  }

  await cargarEstadisticas()
  await cargarOrdenesRecientes()
})

async function cargarEstadisticas() {
  try {
    const response = await fetch('http://localhost:8080/api/admin/estadisticas', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      stats.value = await response.json()
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
  }
}

async function cargarOrdenesRecientes() {
  try {
    const response = await fetch('http://localhost:8080/api/admin/ordenes/recientes', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      ordenesRecientes.value = await response.json()
    }
  } catch (error) {
    console.error('Error al cargar órdenes:', error)
  }
}

function formatearFecha(fecha) {
  if (!fecha) return 'N/A'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function getBadgeClass(estado) {
  const clases = {
    'pendiente': 'bg-warning text-dark',
    'enviando': 'bg-info text-white',
    'entregado': 'bg-success text-white'
  }
  return clases[estado] || 'bg-secondary'
}

function cerrarSesion() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 1000;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
}

.sidebar-header h4 {
  font-size: 1.25rem;
  font-weight: 600;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.nav-item i {
  width: 20px;
  margin-right: 0.75rem;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-left: 3px solid #60a5fa;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Main Content */
.main-content {
  margin-left: 260px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.user-info {
  display: flex;
  align-items: center;
}

.content-body {
  padding: 2rem;
  flex: 1;
}

/* Stat Cards */
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-info h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #111827;
}

.stat-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Card */
.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.25rem 1.5rem;
}

.table {
  margin-bottom: 0;
}

.table thead th {
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }

  .sidebar-header h4,
  .nav-item span,
  .sidebar-footer button span {
    display: none;
  }

  .main-content {
    margin-left: 70px;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
