<template>
  <div class="empleado-dashboard">
    <div class="sidebar">
      <div class="sidebar-header">
        <i class="fas fa-clipboard-list me-2"></i>
        <h4 class="mb-0">Panel Empleado</h4>
      </div>

      <nav class="sidebar-nav">
        <a class="nav-item active">
          <i class="fas fa-shopping-cart"></i>
          <span>Órdenes</span>
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
        <div class="ordenes-view">
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
                                    abrirModalEstado(orden, 'pendiente')
                                  "
                                  :class="{
                                    active: orden.estado === 'pendiente',
                                    disabled: !puedeCambiarA(
                                      orden.estado,
                                      'pendiente'
                                    ),
                                  }"
                                  :style="{
                                    cursor: puedeCambiarA(
                                      orden.estado,
                                      'pendiente'
                                    )
                                      ? 'pointer'
                                      : 'not-allowed',
                                    opacity: puedeCambiarA(
                                      orden.estado,
                                      'pendiente'
                                    )
                                      ? 1
                                      : 0.5,
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
                                    abrirModalEstado(orden, 'enviando')
                                  "
                                  :class="{
                                    active: orden.estado === 'enviando',
                                    disabled: !puedeCambiarA(
                                      orden.estado,
                                      'enviando'
                                    ),
                                  }"
                                  :style="{
                                    cursor: puedeCambiarA(
                                      orden.estado,
                                      'enviando'
                                    )
                                      ? 'pointer'
                                      : 'not-allowed',
                                    opacity: puedeCambiarA(
                                      orden.estado,
                                      'enviando'
                                    )
                                      ? 1
                                      : 0.5,
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
                                    abrirModalEstado(orden, 'entregado')
                                  "
                                  :class="{
                                    active: orden.estado === 'entregado',
                                    disabled: !puedeCambiarA(
                                      orden.estado,
                                      'entregado'
                                    ),
                                  }"
                                  :style="{
                                    cursor: puedeCambiarA(
                                      orden.estado,
                                      'entregado'
                                    )
                                      ? 'pointer'
                                      : 'not-allowed',
                                    opacity: puedeCambiarA(
                                      orden.estado,
                                      'entregado'
                                    )
                                      ? 1
                                      : 0.5,
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
      </div>
    </div>

    <!-- Modal Cambio Estado -->
    <div
      v-if="mostrarModalEstado"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-light border-bottom">
            <div>
              <h5 class="modal-title d-flex align-items-center gap-2 mb-1">
                <i class="fas fa-clipboard-check text-primary"></i>
                Confirmar cambio a
                <span
                  class="badge"
                  :class="
                    getBadgeClass(nuevoEstadoSeleccionado)
                      ? getBadgeClass(nuevoEstadoSeleccionado)
                      : 'bg-secondary'
                  "
                >
                  {{ getEstadoTexto(nuevoEstadoSeleccionado) }}
                </span>
              </h5>
              <small class="text-muted">
                <i class="fas fa-info-circle me-1"></i>
                Orden #{{ ordenCambioEstado?.id }}
              </small>
            </div>
            <button
              type="button"
              class="btn-close"
              @click="cerrarModalEstado"
            ></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-info border-0 rounded-3 mb-4">
              <i class="fas fa-exclamation-circle me-2"></i>
              <strong>Información requerida:</strong> Sube la foto del paquete y
              añade detalles del estado actual.
            </div>

            <!-- Foto del Paquete -->
            <div class="mb-4">
              <label class="form-label fw-bold mb-3">
                <i class="fas fa-image text-danger me-2"></i>Foto del paquete *
              </label>
              <div class="row g-3">
                <div class="col-md-6">
                  <div
                    class="upload-zone border-2 border-dashed rounded-3 p-4 text-center"
                    @click="$refs.fileInput?.click()"
                    :class="fotoPaquete ? 'bg-success-light' : 'bg-light'"
                  >
                    <input
                      ref="fileInput"
                      type="file"
                      class="d-none"
                      accept="image/*"
                      @change="manejarArchivo"
                      :disabled="enviandoCambioEstado"
                    />
                    <div v-if="!fotoPaquete">
                      <i
                        class="fas fa-cloud-upload-alt fa-2x text-muted mb-2 d-block"
                      ></i>
                      <p class="mb-1"><strong>Clic para subir</strong></p>
                      <small class="text-muted"
                        >o arrastra la imagen aquí</small
                      >
                      <p class="mt-2 mb-0">
                        <small class="text-muted">PNG, JPG (máx 5MB)</small>
                      </p>
                    </div>
                    <div v-else class="text-success">
                      <i class="fas fa-check-circle fa-2x mb-2 d-block"></i>
                      <p class="mb-0"><strong>Foto cargada</strong></p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6" v-if="fotoPreview">
                  <label class="form-label fw-semibold mb-2"
                    >Vista previa</label
                  >
                  <div class="preview-wrapper rounded-3 overflow-hidden">
                    <img
                      :src="fotoPreview"
                      alt="Foto del paquete"
                      class="preview-img w-100"
                      style="max-height: 250px; object-fit: cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Detalles Adicionales -->
            <div class="mb-4">
              <label class="form-label fw-bold mb-2">
                <i class="fas fa-note-sticky text-warning me-2"></i>Detalles
                adicionales *
              </label>
              <textarea
                class="form-control form-control-lg rounded-3"
                rows="4"
                v-model="detallesEnvio.notas"
                placeholder="Ej. Paquete bien empacado, sin daños visibles, entregado a domicilio..."
                :disabled="enviandoCambioEstado"
              ></textarea>
              <small class="text-muted mt-1 d-block">
                {{ detallesEnvio.notas?.length || 0 }} caracteres
              </small>
            </div>

            <!-- Estado Actual -->
            <div class="row g-3 mb-4 p-3 bg-light rounded-3">
              <div class="col-md-6">
                <small class="text-muted">Estado anterior</small>
                <div class="fw-bold text-dark">
                  {{ getEstadoTexto(ordenCambioEstado?.estado) }}
                </div>
              </div>
              <div class="col-md-6">
                <small class="text-muted">Cambio a</small>
                <div class="fw-bold">
                  <span
                    :class="'badge ' + getBadgeClass(nuevoEstadoSeleccionado)"
                  >
                    {{ getEstadoTexto(nuevoEstadoSeleccionado) }}
                  </span>
                </div>
              </div>
            </div>

            <div
              v-if="errorCambioEstado"
              class="alert alert-danger border-0 rounded-3"
            >
              <i class="fas fa-exclamation-triangle me-2"></i>
              {{ errorCambioEstado }}
            </div>
          </div>
          <div class="modal-footer bg-light border-top">
            <button
              type="button"
              class="btn btn-light border"
              @click="cerrarModalEstado"
              :disabled="enviandoCambioEstado"
            >
              <i class="fas fa-times me-2"></i>Cancelar
            </button>
            <button
              type="button"
              class="btn btn-primary btn-lg"
              @click="confirmarCambioEstado"
              :disabled="
                enviandoCambioEstado || !fotoPaquete || !detallesEnvio.notas
              "
            >
              <span
                v-if="enviandoCambioEstado"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              <i v-else class="fas fa-check me-2"></i>
              {{
                enviandoCambioEstado
                  ? "Guardando..."
                  : "Guardar y actualizar estado"
              }}
            </button>
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
              <!-- Información del Cliente -->
              <div class="info-card mb-4">
                <div class="card-header-custom">
                  <i class="fas fa-user-circle me-2"></i>
                  <span>Información del Cliente</span>
                </div>
                <div class="card-body-custom">
                  <div class="row g-4">
                    <div class="col-md-6">
                      <div class="info-field">
                        <label class="info-label">
                          <i class="fas fa-user text-primary me-2"></i>Nombre
                        </label>
                        <p class="info-value">
                          {{ ordenSeleccionada.usuario?.nombre }}
                          {{ ordenSeleccionada.usuario?.apellido }}
                        </p>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-field">
                        <label class="info-label">
                          <i class="fas fa-envelope text-info me-2"></i>Email
                        </label>
                        <p class="info-value">
                          {{ ordenSeleccionada.usuario?.email }}
                        </p>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-field">
                        <label class="info-label">
                          <i class="fas fa-phone text-success me-2"></i>Teléfono
                        </label>
                        <p class="info-value">
                          {{ ordenSeleccionada.telefonoContacto || "N/A" }}
                        </p>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-field">
                        <label class="info-label">
                          <i class="fas fa-calendar text-warning me-2"></i>Fecha
                        </label>
                        <p class="info-value">
                          {{ formatearFecha(ordenSeleccionada.fechaPedido) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Información de Envío -->
              <div class="info-card mb-4">
                <div class="card-header-custom">
                  <i class="fas fa-truck me-2"></i>
                  <span>Información de Envío</span>
                </div>
                <div class="card-body-custom">
                  <div class="row g-4">
                    <div class="col-12">
                      <div class="info-field">
                        <label class="info-label">
                          <i class="fas fa-map-marker-alt text-danger me-2"></i
                          >Dirección
                        </label>
                        <p class="info-value">
                          {{ ordenSeleccionada.direccionEnvio }}
                        </p>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-field">
                        <label class="info-label">
                          <i class="fas fa-city text-secondary me-2"></i>Ciudad
                        </label>
                        <p class="info-value">
                          {{ ordenSeleccionada.ciudadEnvio }}
                        </p>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="info-field">
                        <label class="info-label">
                          <i class="fas fa-mailbox text-purple me-2"></i>Código
                          Postal
                        </label>
                        <p class="info-value">
                          {{ ordenSeleccionada.codigoPostalEnvio || "N/A" }}
                        </p>
                      </div>
                    </div>
                    <div class="col-12" v-if="ordenSeleccionada.notas">
                      <div class="info-field">
                        <label class="info-label">
                          <i class="fas fa-sticky-note text-info me-2"></i>Notas
                        </label>
                        <p class="info-value bg-light p-2 rounded">
                          {{ ordenSeleccionada.notas }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tickets Generados -->
              <div class="info-card mb-4">
                <div class="card-header-custom">
                  <i class="fas fa-ticket-alt me-2"></i>
                  <span>Tickets Generados</span>
                  <span
                    class="badge bg-primary ms-auto"
                    v-if="ticketsOrden.length"
                    >{{ ticketsOrden.length }}</span
                  >
                </div>
                <div class="card-body-custom">
                  <div
                    v-if="ticketsOrden.length === 0"
                    class="text-center text-muted py-4"
                  >
                    <i class="fas fa-info-circle me-2"></i>
                    No hay tickets registrados para esta orden.
                  </div>
                  <div v-else class="tickets-container">
                    <div
                      class="ticket-card"
                      v-for="(ticket, index) in ticketsOrden"
                      :key="ticket.id"
                    >
                      <div class="ticket-header">
                        <div class="ticket-id">
                          <i class="fas fa-hashtag"></i>{{ ticket.id }}
                        </div>
                        <span class="ticket-date">{{
                          formatearFechaCorta(ticket.createdAt)
                        }}</span>
                      </div>
                      <div class="ticket-body">
                        <div class="ticket-row">
                          <label class="ticket-label">
                            <i class="fas fa-exchange-alt text-primary me-1"></i
                            >Cambio de Estado
                          </label>
                          <div class="state-change">
                            <span class="state-badge old">{{
                              getEstadoTexto(ticket.estadoAnterior)
                            }}</span>
                            <i class="fas fa-arrow-right mx-2 text-muted"></i>
                            <span class="state-badge new">{{
                              getEstadoTexto(ticket.estadoNuevo)
                            }}</span>
                          </div>
                        </div>
                        <div v-if="ticket.motivo" class="ticket-row">
                          <label class="ticket-label">
                            <i class="fas fa-comment text-info me-1"></i>Motivo
                          </label>
                          <p class="ticket-value">{{ ticket.motivo }}</p>
                        </div>
                        <div class="ticket-row">
                          <label class="ticket-label">
                            <i class="fas fa-user-shield text-success me-1"></i
                            >Creado por
                          </label>
                          <p class="ticket-value">
                            {{ ticket.creadoPor || "N/D" }}
                          </p>
                        </div>
                        <div
                          v-if="ticket.fotoUrl"
                          class="ticket-row mt-2 pt-2 border-top"
                        >
                          <button
                            @click="abrirModalFoto(ticket.fotoUrl)"
                            class="btn btn-sm btn-primary"
                          >
                            <i class="fas fa-image me-1"></i>Ver foto
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Productos -->
              <div class="info-card">
                <div class="card-header-custom">
                  <i class="fas fa-box-open me-2"></i>
                  <span>Productos</span>
                </div>
                <div class="card-body-custom p-0">
                  <div class="table-responsive">
                    <table class="table table-hover mb-0">
                      <thead class="table-light">
                        <tr>
                          <th>
                            <i class="fas fa-book text-primary me-2"></i>Libro
                          </th>
                          <th class="text-center">
                            <i class="fas fa-cubes text-info me-2"></i>Cantidad
                          </th>
                          <th class="text-end">
                            <i class="fas fa-tag text-success me-2"></i>Precio
                            Unit.
                          </th>
                          <th class="text-end">
                            <i class="fas fa-calculator text-warning me-2"></i
                            >Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="detallesOrden.length === 0">
                          <td colspan="4" class="text-center text-muted py-5">
                            <i class="fas fa-box-open me-2"></i>
                            No se encontraron productos para esta orden
                          </td>
                        </tr>
                        <tr
                          v-for="detalle in detallesOrden"
                          :key="detalle.id"
                          class="align-middle"
                        >
                          <td class="fw-500">
                            {{ detalle.libro?.titulo || "N/A" }}
                          </td>
                          <td class="text-center">
                            <span class="badge bg-light text-dark">{{
                              detalle.cantidad
                            }}</span>
                          </td>
                          <td class="text-end">
                            <span class="text-success fw-bold">
                              S/{{
                                detalle.precioUnitario?.toFixed(2) || "0.00"
                              }}
                            </span>
                          </td>
                          <td class="text-end">
                            <span class="fw-bold text-primary fs-6">
                              S/{{
                                (
                                  (detalle.cantidad || 0) *
                                  (detalle.precioUnitario || 0)
                                ).toFixed(2)
                              }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="total-row">
                    <div class="d-flex justify-content-end align-items-center">
                      <span class="total-label">Total:</span>
                      <span class="total-amount">
                        S/{{ ordenSeleccionada.total.toFixed(2) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row g-3 mt-3 pt-3 border-top">
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

    <!-- Modal Foto Paquete -->
    <div
      v-if="mostrarModalFoto"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Foto del Paquete</h5>
            <button
              type="button"
              class="btn-close"
              @click="cerrarModalFoto"
            ></button>
          </div>
          <div class="modal-body text-center">
            <img
              v-if="fotoSeleccionada"
              :src="fotoSeleccionada"
              alt="Foto del paquete"
              class="img-fluid"
              style="max-height: 500px; max-width: 100%"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cerrarModalFoto"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Éxito Actualización -->
    <div
      v-if="mostrarModalExito"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.6)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div
          class="modal-content border-0 shadow-xl"
          style="border-radius: 20px"
        >
          <div class="modal-body p-5 text-center">
            <!-- Checkmark animado -->
            <div class="mb-4">
              <div
                style="
                  display: inline-block;
                  width: 80px;
                  height: 80px;
                  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  animation: scaleIn 0.6s ease-out;
                "
              >
                <i class="fas fa-check fa-3x text-white"></i>
              </div>
            </div>

            <!-- Titulo éxito -->
            <h4 class="mb-2 fw-bold text-dark">¡Estado Actualizado!</h4>
            <p class="text-muted mb-4">
              El cambio ha sido registrado exitosamente
            </p>

            <!-- Detalles de cambio -->
            <div class="card border-0 bg-light mb-4 rounded-3">
              <div class="card-body">
                <div class="mb-3">
                  <small class="text-muted d-block">Estado actualizado a</small>
                  <h5 class="mb-0">
                    <span
                      :class="'badge ' + getBadgeClass(estadoActualizado)"
                      style="font-size: 0.95rem; padding: 0.6rem 1rem"
                    >
                      {{ getEstadoTexto(estadoActualizado) }}
                    </span>
                  </h5>
                </div>
                <hr class="my-3" />
                <div>
                  <small class="text-muted d-block">Número de Ticket</small>
                  <div
                    class="d-flex align-items-center justify-content-center gap-2 mt-2"
                  >
                    <i
                      class="fas fa-ticket-alt text-primary"
                      style="font-size: 1.2rem"
                    ></i>
                    <code
                      style="
                        font-size: 1.1rem;
                        font-weight: 600;
                        background: white;
                        padding: 0.5rem 1rem;
                        border-radius: 10px;
                        border: 2px solid #dee2e6;
                      "
                      >{{ ticketGenerado }}</code
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Mensaje informativo -->
            <p class="small text-muted mb-4">
              <i class="fas fa-info-circle me-1"></i>
              El ticket ha sido registrado y puede verse en los detalles de la
              orden.
            </p>
          </div>
          <div
            class="modal-footer bg-light border-top-0 d-flex justify-content-center"
            style="border-radius: 0 0 20px 20px"
          >
            <button
              type="button"
              class="btn btn-primary btn-lg px-5"
              @click="cerrarModalExito"
              style="border-radius: 50px"
            >
              <i class="fas fa-check me-2"></i>Confirmar
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
const mostrarModal = ref(false);
const mostrarModalEstado = ref(false);
const ordenSeleccionada = ref(null);
const ordenCambioEstado = ref(null);
const nuevoEstadoSeleccionado = ref("");
const fotoPaquete = ref(null);
const fotoPreview = ref(null);
const detallesEnvio = ref({ notas: "" });
const enviandoCambioEstado = ref(false);
const errorCambioEstado = ref("");
const detallesOrden = ref([]);
const ticketsOrden = ref([]);
const cargandoDetalle = ref(false);
const mostrarModalFoto = ref(false);
const fotoSeleccionada = ref(null);
const mostrarModalExito = ref(false);
const ticketGenerado = ref(null);
const estadoActualizado = ref("");

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

/**
 * Valida que la transición de estado sea permitida
 * pendiente → enviando → entregado (solo transiciones hacia adelante)
 */
function puedeCambiarA(estadoActual, nuevoEstado) {
  if (!estadoActual || !nuevoEstado) {
    return false;
  }

  // El estado no puede cambiar a sí mismo
  if (estadoActual === nuevoEstado) {
    return false;
  }

  // Si está entregado, no se puede cambiar
  if (estadoActual === "entregado") {
    return false;
  }

  // Si está en enviando, solo puede ir a entregado
  if (estadoActual === "enviando") {
    return nuevoEstado === "entregado";
  }

  // Si está pendiente, solo puede ir a enviando
  if (estadoActual === "pendiente") {
    return nuevoEstado === "enviando";
  }

  return false;
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
function abrirModalEstado(orden, estadoDestino) {
  ordenCambioEstado.value = orden;
  nuevoEstadoSeleccionado.value = estadoDestino;
  detallesEnvio.value = { notas: "" };
  fotoPaquete.value = null;
  fotoPreview.value = null;
  errorCambioEstado.value = "";
  mostrarModalEstado.value = true;
}

function manejarArchivo(event) {
  const archivo = event.target.files?.[0];
  if (!archivo) {
    fotoPaquete.value = null;
    fotoPreview.value = null;
    return;
  }
  fotoPaquete.value = archivo;
  const reader = new FileReader();
  reader.onload = () => {
    fotoPreview.value = reader.result;
  };
  reader.readAsDataURL(archivo);
}

async function confirmarCambioEstado() {
  if (!ordenCambioEstado.value || !nuevoEstadoSeleccionado.value) return;
  if (!fotoPaquete.value) {
    errorCambioEstado.value = "Sube la foto del paquete para continuar";
    return;
  }
  if (!detallesEnvio.value.notas) {
    errorCambioEstado.value = "Agrega detalles adicionales del envío";
    return;
  }

  errorCambioEstado.value = "";
  enviandoCambioEstado.value = true;

  try {
    const formData = new FormData();
    formData.append("estado", nuevoEstadoSeleccionado.value);
    formData.append("detalles", detallesEnvio.value.notas || "");
    formData.append("fotoPaquete", fotoPaquete.value);

    const response = await fetch(
      `http://localhost:8080/api/empleado/ordenes/${ordenCambioEstado.value.id}/estado`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json().catch(() => null);
      const ordenActualizada = data?.orden || null;
      const ticketId = data?.ticketId;

      const orden = todasLasOrdenes.value.find(
        (o) => o.id === ordenCambioEstado.value.id
      );
      if (orden && ordenActualizada) {
        orden.estado = ordenActualizada.estado;
      } else if (orden) {
        orden.estado = nuevoEstadoSeleccionado.value;
      }
      if (
        ordenSeleccionada.value &&
        ordenSeleccionada.value.id === ordenCambioEstado.value.id
      ) {
        if (ordenActualizada) {
          ordenSeleccionada.value.estado = ordenActualizada.estado;
        } else {
          ordenSeleccionada.value.estado = nuevoEstadoSeleccionado.value;
        }
      }
      cerrarModalEstado();
      ticketGenerado.value = ticketId;
      estadoActualizado.value = nuevoEstadoSeleccionado.value;
      mostrarModalExito.value = true;
    } else {
      const respuestaJson = await response.json().catch(() => null);
      const mensajeError =
        respuestaJson?.error ||
        "No se pudo actualizar el estado. Intenta nuevamente.";
      errorCambioEstado.value = mensajeError;
    }
  } catch (error) {
    console.error("Error al cambiar estado (empleado):", error);
    errorCambioEstado.value = "Error de conexión al actualizar el estado";
  } finally {
    enviandoCambioEstado.value = false;
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

    const [responseDetalles, responseTickets] = await Promise.all([
      fetch(`http://localhost:8080/api/empleado/ordenes/${ordenId}/detalles`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }),
      fetch(`http://localhost:8080/api/empleado/ordenes/${ordenId}/tickets`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }),
    ]);

    if (responseDetalles.ok) {
      detallesOrden.value = await responseDetalles.json();
    } else {
      console.error(
        "Error al obtener detalles (empleado):",
        responseDetalles.status
      );
    }

    if (responseTickets.ok) {
      ticketsOrden.value = await responseTickets.json();
    } else {
      console.error(
        "Error al obtener tickets (empleado):",
        responseTickets.status
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
import { useEtiqueta } from "@/composables/useEtiqueta";
const { generarEtiqueta } = useEtiqueta();

function descargarOrden(orden) {
  // Llama al generador de etiqueta con el ID de la orden
  if (!orden || !orden.id) {
    alert("Orden inválida");
    return;
  }
  generarEtiqueta(orden.id);
}

function cerrarModalEstado() {
  mostrarModalEstado.value = false;
  ordenCambioEstado.value = null;
  nuevoEstadoSeleccionado.value = "";
  fotoPaquete.value = null;
  fotoPreview.value = null;
  detallesEnvio.value = { notas: "" };
  errorCambioEstado.value = "";
}

function cerrarModal() {
  mostrarModal.value = false;
  ordenSeleccionada.value = null;
  detallesOrden.value = [];
  ticketsOrden.value = [];
}

function abrirModalFoto(fotoUrl) {
  fotoSeleccionada.value = fotoUrl;
  mostrarModalFoto.value = true;
}

function cerrarModalFoto() {
  mostrarModalFoto.value = false;
  fotoSeleccionada.value = null;
}

function cerrarModalExito() {
  mostrarModalExito.value = false;
  ticketGenerado.value = null;
  estadoActualizado.value = "";
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

.preview-wrapper {
  border: 1px dashed #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  background: #f9fafb;
}

.preview-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 0.35rem;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Estilos mejorados para detalle de orden */
.info-card {
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  background: #fff;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-header-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.card-body-custom {
  padding: 1.5rem;
}

.info-field {
  margin-bottom: 0.5rem;
}

.info-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.4rem;
}

.info-value {
  font-size: 0.95rem;
  color: #1f2937;
  margin: 0;
  line-height: 1.5;
}

/* Estilos para tarjetas de tickets */
.tickets-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ticket-card {
  border: 1px solid #e5e7eb;
  border-left: 4px solid #667eea;
  border-radius: 0.5rem;
  background: #f9fafb;
  padding: 1rem;
  transition: all 0.3s ease;
}

.ticket-card:hover {
  background: #f3f4f6;
  border-left-color: #764ba2;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.ticket-id {
  font-family: "Monaco", "Courier New", monospace;
  font-weight: 700;
  color: #667eea;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.ticket-date {
  background: #e0e7ff;
  color: #667eea;
  padding: 0.3rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
}

.ticket-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ticket-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.ticket-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ticket-value {
  color: #374151;
  font-size: 0.9rem;
  margin: 0;
}

.state-change {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.state-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.state-badge.old {
  background: #fecaca;
  color: #991b1b;
}

.state-badge.new {
  background: #bbf7d0;
  color: #065f46;
}

/* Estilos para tabla de productos */
.table {
  margin: 0;
}

.table thead th {
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b7280;
}

.table tbody tr {
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f9fafb;
}

.total-row {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  padding: 1.25rem 1.5rem;
  border-top: 2px solid #d1d5db;
  margin-top: 1rem;
  border-radius: 0 0 0.75rem 0.75rem;
}

.total-label {
  font-weight: 700;
  color: #374151;
  font-size: 0.95rem;
  margin-right: 1rem;
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
