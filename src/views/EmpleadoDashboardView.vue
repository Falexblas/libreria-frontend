<template>
  <div class="empleado-dashboard">
    <div class="sidebar">
      <div class="sidebar-header">
        <i class="fas fa-clipboard-list me-2"></i>
        <h4 class="mb-0">Panel Empleado</h4>
      </div>

      <nav class="sidebar-nav">
        <a
          class="nav-item"
          :class="{ active: seccionActiva === 'ordenes' }"
          @click.prevent="seccionActiva = 'ordenes'"
        >
          <i class="fas fa-shopping-cart"></i>
          <span>Órdenes</span>
        </a>
        <a
          class="nav-item"
          :class="{ active: seccionActiva === 'tickets' }"
          @click.prevent="seccionActiva = 'tickets'"
        >
          <i class="fas fa-ticket-alt"></i>
          <span>Solicitar ticket</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button
          @click="cerrarSesion"
          class="btn btn-outline-light btn-sm w-100"
        >
          <i class="fas fa-sign-out-alt me-2"></i>
          Cerrar Sesión
        </button>
      </div>
    </div>

    <div class="main-content">
      <div class="content-header">
        <div>
          <h2 class="mb-1">Gestión de Órdenes</h2>
          <p class="text-muted mb-0">
            Visualiza y actualiza el estado de las órdenes de los clientes
          </p>
        </div>
        <div class="user-info">
          <span class="text-muted me-2">Empleado:</span>
          <strong
            >{{ authStore.user?.nombre }} {{ authStore.user?.apellido }}</strong
          >
          <span class="badge bg-primary ms-2">EMPLEADO</span>
        </div>
      </div>

      <div class="content-body">
        <div v-if="seccionActiva === 'ordenes'" class="ordenes-view">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4>Órdenes</h4>
            <div class="d-flex gap-2">
              <select
                class="form-select form-select-sm"
                v-model="filtroEstadoOrden"
                style="width: auto"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="enviando">En camino</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>
          </div>

          <div class="card">
            <div class="card-body p-0">
              <div
                class="table-responsive"
                style="min-height: 400px; max-height: 600px; overflow-y: auto"
              >
                <table class="table table-hover table-compact">
                  <thead>
                    <tr>
                      <th style="width: 60px">ID</th>
                      <th style="width: 150px">Cliente</th>
                      <th style="width: 150px">Email</th>
                      <th style="width: 100px">Fecha</th>
                      <th style="width: 100px">Total</th>
                      <th style="width: 120px">Estado</th>
                      <th style="width: 200px">Dirección</th>
                      <th style="width: 120px">Acciones</th>
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
                        No hay órdenes
                        {{
                          filtroEstadoOrden
                            ? `con estado "${filtroEstadoOrden}"`
                            : "registradas"
                        }}
                      </td>
                    </tr>
                    <tr
                      v-else
                      v-for="orden in ordenesFiltradas"
                      :key="orden.id"
                    >
                      <td class="text-muted">#{{ orden.id }}</td>
                      <td class="text-truncate" style="max-width: 150px">
                        {{ orden.usuario?.nombre }}
                        {{ orden.usuario?.apellido }}
                      </td>
                      <td class="text-truncate small" style="max-width: 150px">
                        {{ orden.usuario?.email }}
                      </td>
                      <td class="small">
                        {{ formatearFechaCorta(orden.fechaPedido) }}
                      </td>
                      <td class="fw-bold text-primary">
                        S/{{ orden.total.toFixed(2) }}
                      </td>
                      <td>
                        <span :class="['badge', getBadgeClass(orden.estado)]">
                          {{ getEstadoTexto(orden.estado) }}
                        </span>
                      </td>
                      <td class="text-truncate small" style="max-width: 200px">
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
                            <ul
                              class="dropdown-menu dropdown-menu-end"
                              :aria-labelledby="'dropdown-orden-' + orden.id"
                            >
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="#"
                                  @click.prevent="
                                    abrirModalTicket(orden, 'pendiente')
                                  "
                                  :class="{
                                    active: orden.estado === 'pendiente',
                                  }"
                                >
                                  <span class="badge bg-warning text-dark me-2"
                                    >●</span
                                  >
                                  Pendiente
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="#"
                                  @click.prevent="
                                    abrirModalTicket(orden, 'enviando')
                                  "
                                  :class="{
                                    active: orden.estado === 'enviando',
                                  }"
                                >
                                  <span class="badge bg-info text-white me-2"
                                    >●</span
                                  >
                                  En camino
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="#"
                                  @click.prevent="
                                    abrirModalTicket(orden, 'entregado')
                                  "
                                  :class="{
                                    active: orden.estado === 'entregado',
                                  }"
                                >
                                  <span class="badge bg-success text-white me-2"
                                    >●</span
                                  >
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

        <div v-else class="ticket-view">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4>Solicitar ticket de cambio</h4>
            <span class="badge bg-secondary">Seguridad</span>
          </div>

          <div class="card shadow-sm border-0">
            <div class="card-body">
              <p class="text-muted mb-4">
                Solicita un ticket antes de cambiar el estado de una orden. Este
                ticket será requerido para pasar de pendiente → en camino →
                entregado.
              </p>

              <div class="row g-3 align-items-end">
                <div class="col-md-6">
                  <label class="form-label"
                    >Buscar cliente (nombre o email)</label
                  >
                  <div class="position-relative">
                    <input
                      type="text"
                      class="form-control"
                      v-model="ticketBusqueda"
                      placeholder="Ej: Fabrizio, alex@gmail.com"
                      @input="filtrarOrdenesTicket"
                    />
                    <div
                      v-if="
                        resultadoBusquedaTicket.length > 0 &&
                        ticketBusqueda.length >= 2
                      "
                      class="list-group position-absolute w-100 shadow-sm busqueda-dropdown"
                      style="z-index: 10; max-height: 240px; overflow-y: auto"
                    >
                      <button
                        v-for="item in resultadoBusquedaTicket"
                        :key="item.id"
                        class="list-group-item list-group-item-action"
                        @click="seleccionarOrdenTicket(item)"
                      >
                        <div class="d-flex justify-content-between">
                          <div>
                            <strong>#{{ item.id }}</strong> -
                            {{ item.usuario?.nombre }}
                            {{ item.usuario?.apellido }}
                            <div class="text-muted small">
                              {{ item.usuario?.email }}
                            </div>
                          </div>
                          <span
                            :class="['badge', getBadgeClass(item.estado)]"
                            >{{ getEstadoTexto(item.estado) }}</span
                          >
                        </div>
                      </button>
                    </div>
                  </div>
                  <div class="small text-muted mt-1">
                    Escribe al menos 2 caracteres para filtrar.
                  </div>
                </div>
                <div class="col-md-3">
                  <label class="form-label">ID de orden</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model="ticketForm.ordenId"
                    placeholder="Ej: 7"
                    @change="sincronizarOrdenDesdeId"
                  />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Estado objetivo</label>
                  <select class="form-select" v-model="ticketForm.nuevoEstado">
                    <option value="enviando">En camino</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </div>
                <div class="col-md-12">
                  <label class="form-label">Motivo / comentario</label>
                  <textarea
                    class="form-control"
                    rows="3"
                    v-model="ticketForm.motivo"
                    placeholder="Describe por qué se requiere el cambio de estado"
                  ></textarea>
                </div>
                <div v-if="ordenSeleccionadaTicket" class="col-12">
                  <div
                    class="alert alert-light border d-flex justify-content-between align-items-center mb-0"
                  >
                    <div>
                      <strong>Orden seleccionada:</strong> #{{
                        ordenSeleccionadaTicket.id
                      }}
                      · {{ ordenSeleccionadaTicket.usuario?.nombre }}
                      {{ ordenSeleccionadaTicket.usuario?.apellido }} ·
                      {{ ordenSeleccionadaTicket.usuario?.email }}
                    </div>
                    <span
                      :class="[
                        'badge',
                        getBadgeClass(ordenSeleccionadaTicket.estado),
                      ]"
                      >{{
                        getEstadoTexto(ordenSeleccionadaTicket.estado)
                      }}</span
                    >
                  </div>
                </div>
              </div>

              <div class="d-flex align-items-center gap-3 mt-4">
                <button
                  class="btn btn-primary"
                  :disabled="enviandoTicket"
                  @click="solicitarTicket"
                >
                  <span
                    v-if="enviandoTicket"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Solicitar ticket
                </button>
                <div
                  v-if="ticketMensaje"
                  :class="[
                    'small',
                    ticketEsError ? 'text-danger' : 'text-success',
                  ]"
                >
                  {{ ticketMensaje }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Detalle Orden -->
    <div
      v-if="mostrarModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-receipt me-2"></i>
              Detalle de Orden #{{ ordenSeleccionada?.id }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="cerrarModal"
            ></button>
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
                    <strong>Nombre:</strong>
                    {{ ordenSeleccionada.usuario?.nombre }}
                    {{ ordenSeleccionada.usuario?.apellido }}
                  </div>
                  <div class="col-md-6">
                    <strong>Email:</strong>
                    {{ ordenSeleccionada.usuario?.email }}
                  </div>
                  <div class="col-md-6">
                    <strong>Teléfono:</strong>
                    {{ ordenSeleccionada.telefonoContacto || "N/A" }}
                  </div>
                  <div class="col-md-6">
                    <strong>Fecha:</strong>
                    {{ formatearFecha(ordenSeleccionada.fechaPedido) }}
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <h6 class="text-muted mb-3">Información de Envío</h6>
                <div class="row g-3">
                  <div class="col-12">
                    <strong>Dirección:</strong>
                    {{ ordenSeleccionada.direccionEnvio }}
                  </div>
                  <div class="col-md-6">
                    <strong>Ciudad:</strong> {{ ordenSeleccionada.ciudadEnvio }}
                  </div>
                  <div class="col-md-6">
                    <strong>Código Postal:</strong>
                    {{ ordenSeleccionada.codigoPostalEnvio || "N/A" }}
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
                        <td>{{ detalle.libro?.titulo || "N/A" }}</td>
                        <td class="text-center">{{ detalle.cantidad }}</td>
                        <td class="text-end">
                          S/{{ detalle.precioUnitario?.toFixed(2) || "0.00" }}
                        </td>
                        <td class="text-end fw-bold">
                          S/{{
                            (
                              (detalle.cantidad || 0) *
                              (detalle.precioUnitario || 0)
                            ).toFixed(2)
                          }}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="3" class="text-end">
                          <strong>Total:</strong>
                        </td>
                        <td class="text-end">
                          <strong class="text-primary fs-5"
                            >S/{{ ordenSeleccionada.total.toFixed(2) }}</strong
                          >
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <strong>Estado:</strong>
                  <span
                    :class="[
                      'badge ms-2',
                      getBadgeClass(ordenSeleccionada.estado),
                    ]"
                  >
                    {{ getEstadoTexto(ordenSeleccionada.estado) }}
                  </span>
                </div>
                <div class="col-md-6">
                  <strong>Método de Pago:</strong>
                  {{ ordenSeleccionada.metodoPago || "N/A" }}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cerrarModal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ticket de seguridad -->
    <div
      v-if="mostrarModalTicket"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-shield-alt me-2"></i>
              Ticket requerido
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="cerrarModalTicket"
            ></button>
          </div>
          <div class="modal-body">
            <p class="mb-3">
              Ingresa el ticket de autorización para cambiar el estado de la
              orden
              <strong>#{{ solicitudCambio?.ordenId }}</strong> a
              <strong>{{ getEstadoTexto(solicitudCambio?.nuevoEstado) }}</strong
              >.
            </p>
            <div class="mb-3">
              <label class="form-label">Ticket de autorización</label>
              <input
                type="text"
                class="form-control"
                v-model="ticketAutorizacion"
                placeholder="Ej: TK-123456"
                @keyup.enter="confirmarCambioEstado"
              />
              <small class="text-muted"
                >Este paso evita cambios sin autorización en estados
                sensibles.</small
              >
              <div v-if="errorTicket" class="text-danger small mt-1">
                {{ errorTicket }}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cerrarModalTicket"
              :disabled="cargandoCambioEstado"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="confirmarCambioEstado"
              :disabled="cargandoCambioEstado"
            >
              <span
                v-if="cargandoCambioEstado"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Confirmar cambio
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ticket Generado -->
    <div
      v-if="mostrarModalTicketGenerado"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-success">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <i class="fas fa-check-circle me-2"></i>
              Ticket generado exitosamente
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="mostrarModalTicketGenerado = false"
            ></button>
          </div>
          <div class="modal-body text-center py-4">
            <p class="text-muted mb-3">{{ ticketGenerado.mensaje }}</p>
            <div class="p-3 bg-light rounded border-2 border-success mb-3">
              <p class="text-muted small mb-1">Tu número de ticket:</p>
              <p class="fs-4 fw-bold text-success mb-0" id="ticketNumero">
                {{ ticketGenerado.numero }}
              </p>
            </div>
            <p class="text-muted small">
              <i class="fas fa-info-circle me-1"></i>
              Guarda este número para poder cambiar el estado de la orden
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-success"
              @click="copiarAlPortapapeles"
            >
              <i class="fas fa-copy me-2"></i>
              Copiar número
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="mostrarModalTicketGenerado = false"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const todasLasOrdenes = ref([]);
const cargandoTodasOrdenes = ref(false);
const filtroEstadoOrden = ref("");
const seccionActiva = ref("ordenes");

const mostrarModal = ref(false);
const ordenSeleccionada = ref(null);
const detallesOrden = ref([]);
const cargandoDetalle = ref(false);
const mostrarModalTicket = ref(false);
const solicitudCambio = ref(null);
const ticketAutorizacion = ref("");
const errorTicket = ref("");
const cargandoCambioEstado = ref(false);
const ticketForm = ref({ ordenId: "", nuevoEstado: "enviando", motivo: "" });
const enviandoTicket = ref(false);
const ticketMensaje = ref("");
const ticketEsError = ref(false);
const ticketBusqueda = ref("");
const resultadoBusquedaTicket = ref([]);
const ordenSeleccionadaTicket = ref(null);
const mostrarModalTicketGenerado = ref(false);
const ticketGenerado = ref({ numero: "", mensaje: "" });

const ordenesFiltradas = computed(() => {
  let ordenes = todasLasOrdenes.value;
  if (filtroEstadoOrden.value) {
    ordenes = ordenes.filter(
      (orden) => orden.estado === filtroEstadoOrden.value
    );
  }
  return [...ordenes].sort((a, b) => a.id - b.id);
});

function formatearFecha(fecha) {
  if (!fecha) return "N/A";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatearFechaCorta(fecha) {
  if (!fecha) return "N/A";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
  });
}

function getBadgeClass(estado) {
  const clases = {
    pendiente: "bg-warning text-dark",
    enviando: "bg-info text-white",
    entregado: "bg-success text-white",
  };
  return clases[estado] || "bg-secondary";
}

function getEstadoTexto(estado) {
  const textos = {
    pendiente: "Pendiente",
    enviando: "En camino",
    entregado: "Entregado",
  };
  return textos[estado] || estado;
}

function copiarAlPortapapeles() {
  const numero = ticketGenerado.value.numero;
  navigator.clipboard
    .writeText(numero)
    .then(() => {
      alert("✅ Ticket copiado al portapapeles");
    })
    .catch(() => {
      alert("No se pudo copiar al portapapeles");
    });
}

function filtrarOrdenesTicket() {
  const term = ticketBusqueda.value.trim().toLowerCase();
  if (term.length < 2) {
    resultadoBusquedaTicket.value = [];
    return;
  }

  resultadoBusquedaTicket.value = todasLasOrdenes.value
    .filter((o) => {
      const nombre = `${o.usuario?.nombre || ""} ${
        o.usuario?.apellido || ""
      }`.toLowerCase();
      const email = (o.usuario?.email || "").toLowerCase();
      return nombre.includes(term) || email.includes(term);
    })
    .slice(0, 20);
}

function seleccionarOrdenTicket(orden) {
  ordenSeleccionadaTicket.value = orden;
  ticketForm.value.ordenId = orden.id;
  ticketBusqueda.value = `${orden.usuario?.nombre || ""} ${
    orden.usuario?.apellido || ""
  }`.trim();
  resultadoBusquedaTicket.value = [];
}

function sincronizarOrdenDesdeId() {
  const idNum = Number(ticketForm.value.ordenId);
  if (!idNum) {
    ordenSeleccionadaTicket.value = null;
    return;
  }
  const encontrada = todasLasOrdenes.value.find((o) => o.id === idNum);
  ordenSeleccionadaTicket.value = encontrada || null;
}

async function cargarTodasLasOrdenes() {
  cargandoTodasOrdenes.value = true;
  try {
    const response = await fetch("http://localhost:8080/api/empleado/ordenes", {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    if (response.ok) {
      todasLasOrdenes.value = await response.json();
    }
  } catch (error) {
    console.error("Error al cargar órdenes (empleado):", error);
  } finally {
    cargandoTodasOrdenes.value = false;
  }
}

async function solicitarTicket() {
  ticketMensaje.value = "";
  ticketEsError.value = false;

  const ordenIdLimpio = ticketForm.value.ordenId?.toString().trim();

  if (!ordenIdLimpio || !ticketForm.value.nuevoEstado) {
    ticketMensaje.value = "Completa el ID de orden y el estado objetivo.";
    ticketEsError.value = true;
    return;
  }

  enviandoTicket.value = true;

  try {
    const response = await fetch(
      `http://localhost:8080/api/empleado/ordenes/${ordenIdLimpio}/tickets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({
          ordenId: Number(ordenIdLimpio),
          estadoObjetivo: ticketForm.value.nuevoEstado,
          motivo: ticketForm.value.motivo,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();

      // Capturar ticket si el backend lo devuelve
      if (data.ticket || data.numero) {
        ticketGenerado.value = {
          numero: data.ticket || data.numero,
          mensaje: data.mensaje || "Ticket generado exitosamente",
        };
        mostrarModalTicketGenerado.value = true;
      }

      ticketMensaje.value =
        "Ticket solicitado correctamente. Revisa tu bandeja o ingrésalo en el modal de cambio.";
      ticketEsError.value = false;
      ticketForm.value = { ordenId: "", nuevoEstado: "enviando", motivo: "" };
    } else {
      // Mostrar mensaje devuelto por el backend si existe para facilitar el diagnóstico
      let detalle = "";
      try {
        const data = await response.json();
        detalle = data?.mensaje || data?.error || data?.message || "";
      } catch (e) {
        /* respuesta no es JSON */
      }
      if (!detalle) {
        try {
          detalle = await response.text();
        } catch (e) {
          /* sin cuerpo de texto */
        }
      }

      ticketMensaje.value =
        detalle ||
        `No se pudo generar el ticket (código ${response.status}). Verifica el ID de orden o intenta nuevamente.`;
      ticketEsError.value = true;
    }
  } catch (error) {
    console.error("Error al solicitar ticket:", error);
    ticketMensaje.value = "Error de conexión al solicitar ticket.";
    ticketEsError.value = true;
  } finally {
    enviandoTicket.value = false;
  }
}

function abrirModalTicket(orden, nuevoEstado) {
  solicitudCambio.value = {
    ordenId: orden.id,
    estadoActual: orden.estado,
    nuevoEstado,
  };
  ticketAutorizacion.value = "";
  errorTicket.value = "";
  mostrarModalTicket.value = true;
}

async function confirmarCambioEstado() {
  if (!solicitudCambio.value) return;
  if (!ticketAutorizacion.value.trim()) {
    errorTicket.value = "Debes ingresar el ticket de autorización.";
    return;
  }

  cargandoCambioEstado.value = true;
  errorTicket.value = "";

  await cambiarEstado(
    solicitudCambio.value.ordenId,
    solicitudCambio.value.nuevoEstado,
    ticketAutorizacion.value.trim()
  );

  cargandoCambioEstado.value = false;
}

function cerrarModalTicket() {
  mostrarModalTicket.value = false;
  solicitudCambio.value = null;
  ticketAutorizacion.value = "";
  errorTicket.value = "";
}

async function cambiarEstado(ordenId, nuevoEstado, ticket) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/empleado/ordenes/${ordenId}/estado`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
          "X-Orden-Ticket": ticket || "",
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      }
    );

    if (response.ok) {
      const orden = todasLasOrdenes.value.find((o) => o.id === ordenId);
      if (orden) {
        orden.estado = nuevoEstado;
      }
      if (ordenSeleccionada.value && ordenSeleccionada.value.id === ordenId) {
        ordenSeleccionada.value.estado = nuevoEstado;
      }
      cerrarModalTicket();
      alert(`✅ Estado actualizado a: ${getEstadoTexto(nuevoEstado)}`);
    } else {
      errorTicket.value =
        "Ticket no válido o sin autorización para este cambio.";
      alert("❌ Error al actualizar el estado");
    }
  } catch (error) {
    console.error("Error al cambiar estado (empleado):", error);
    errorTicket.value = "No se pudo validar el ticket, intenta nuevamente.";
    alert("❌ Error de conexión");
  }
}

async function verDetalleOrden(ordenId) {
  mostrarModal.value = true;
  cargandoDetalle.value = true;

  try {
    const responseOrden = await fetch(
      `http://localhost:8080/api/empleado/ordenes/${ordenId}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (responseOrden.ok) {
      ordenSeleccionada.value = await responseOrden.json();
    } else {
      console.error("Error al obtener orden (empleado):", responseOrden.status);
    }

    const responseDetalles = await fetch(
      `http://localhost:8080/api/empleado/ordenes/${ordenId}/detalles`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    if (responseDetalles.ok) {
      detallesOrden.value = await responseDetalles.json();
    } else {
      console.error(
        "Error al obtener detalles (empleado):",
        responseDetalles.status
      );
    }
  } catch (error) {
    console.error("Error al cargar detalles (empleado):", error);
    alert("❌ Error al cargar los detalles de la orden");
  } finally {
    cargandoDetalle.value = false;
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
  mostrarModal.value = false;
  ordenSeleccionada.value = null;
  detallesOrden.value = [];
}

function cerrarSesion() {
  authStore.logout();
  router.push("/login");
}

onMounted(async () => {
  const isEmpleado =
    authStore.user?.rol?.nombre === "EMPLEADO" ||
    authStore.user?.rol === "EMPLEADO";

  if (!isEmpleado) {
    alert("No tienes permisos para acceder a esta página");
    router.push("/");
    return;
  }

  await cargarTodasLasOrdenes();
});
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
