<template>
  <div class="checkout-page container py-4">
    <!-- Stepper -->
    <div class="mb-4">
      <div class="stepper d-flex align-items-center justify-content-between">
        <div class="step d-flex flex-column align-items-center" :class="{ active: step === 1, completed: step > 1 }" role="button" tabindex="0" @click.prevent="irAlPaso(1)" @keydown.enter.prevent="irAlPaso(1)">
          <div class="step-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.44C8.89 16.37 9.5 18 11 18h8v-2h-7.42c-.14 0-.25-.11-.25-.25l.03-.12L13.1 13h4.45c.75 0 1.41-.41 1.75-1.03L21.82 6H6.21" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="step-label small mt-2 text-muted">Carrito</div>
        </div>

        <div class="step-line flex-grow-1 mx-3">
          <div class="line-inner" :class="{ filled: step > 1 }"></div>
        </div>

        <div class="step d-flex flex-column align-items-center" :class="{ active: step === 2, completed: step > 2 }" role="button" tabindex="0" @click.prevent="irAlPaso(2)" @keydown.enter.prevent="irAlPaso(2)">
          <div class="step-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM4 20c0-3.31 4.03-6 8-6s8 2.69 8 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="step-label small mt-2 text-muted">Datos</div>
        </div>

        <div class="step-line flex-grow-1 mx-3">
          <div class="line-inner" :class="{ filled: step > 2 }"></div>
        </div>

        <div class="step d-flex flex-column align-items-center" :class="{ active: step === 3, completed: step > 3 }" role="button" tabindex="0" @click.prevent="irAlPaso(3)" @keydown.enter.prevent="irAlPaso(3)">
          <div class="step-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18v13H3zM16 3l3 4H5l3-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="step-label small mt-2 text-muted">Entrega</div>
        </div>

        <div class="step-line flex-grow-1 mx-3">
          <div class="line-inner" :class="{ filled: step > 3 }"></div>
        </div>

        <div class="step d-flex flex-column align-items-center" :class="{ active: step === 4 }" role="button" tabindex="0" @click.prevent="irAlPaso(4)" @keydown.enter.prevent="irAlPaso(4)">
          <div class="step-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 7H3v10a2 2 0 002 2h14a2 2 0 002-2V7zM3 7l9 6 9-6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="step-label small mt-2 text-muted">Pago</div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <template v-if="step === 1">
        <!-- Left: listado de productos -->
        <div class="col-lg-8">
          <div class="checkout-card p-4 rounded shadow-sm">
            <h5 class="mb-3">Mi carrito</h5>

            <div class="checkout-header row gx-2 pb-2 mb-2 border-bottom text-muted small">
              <div class="col-12 col-md-6">Producto</div>
              <div class="col-12 col-md-3 text-center">Cantidad</div>
              <div class="col-12 col-md-3 text-end">Precio</div>
            </div>

            <div v-if="carritoStore.items.length === 0" class="text-center py-4 text-muted">Tu carrito está vacío.</div>

            <div v-for="item in carritoStore.items" :key="item.id" class="checkout-item py-3 border-bottom">
              <div class="row align-items-center gx-2">
                <!-- Nombre / imagen -->
                <div class="col-12 col-md-6 d-flex align-items-center">
                  <div class="item-imagen me-3">
                    <img :src="item.portadaUrl" alt="img" />
                  </div>
                  <div class="item-detalle">
                    <div class="fw-bold">{{ item.titulo }}</div>
                    <div class="text-muted small mt-1">{{ obtenerNombreAutor(item.autor) }}</div>
                  </div>
                </div>

                <!-- Cantidad: col-3 en md+ -->
                <div class="col-12 col-md-3 d-flex justify-content-center cantidad-col">
                  <div class="controles-horizontales">
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
                  </div>
                </div>

                <!-- Precio + eliminar: col-3 en md+ -->
                <div class="col-12 col-md-3 d-flex justify-content-end align-items-center gap-2 precio-col">
                  <div class="precio-item">S/{{ (item.precio * item.cantidad).toFixed(2) }}</div>
                  <button 
                    class="btn-eliminar"
                    @click="eliminar(item.id)"
                    title="Eliminar del carrito"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: resumen de pago -->
        <div class="col-lg-4">
          <div class="checkout-summary p-4 rounded shadow-sm">
            <h6 class="mb-3">Resumen de pago</h6>

            <div class="d-flex justify-content-between mb-2">
              <div>Subtotal</div>
              <div>S/{{ carritoStore.subtotal.toFixed(2) }}</div>
            </div>

            <div class="d-flex justify-content-between mb-2">
              <div>Envío</div>
              <div>S/{{ tarifaEnvio.toFixed(2) }}</div>
            </div>

            <div class="d-flex justify-content-between fw-bold fs-5 border-top pt-2">
              <div>Total</div>
              <div>S/{{ (carritoStore.subtotal + tarifaEnvio).toFixed(2) }}</div>
            </div>

            <button class="btn btn-success w-100 mt-4 py-3 btn-pagar" :disabled="carritoStore.items.length === 0" @click="finalizarCompra">PAGAR AHORA</button>
          </div>
        </div>
      </template>

      <template v-else-if="step === 2">
        <!-- Left: formulario Datos -->
        <div class="col-lg-8">
          <div class="checkout-card p-4 rounded shadow-sm">
            <div class="d-flex align-items-start mb-3">
              <div class="step-badge me-3">2</div>
              <div>
                <h5 class="mb-1">Identificación</h5>
                <p class="text-muted small mb-0">Solicitamos únicamente la información esencial para la finalización de la compra.</p>
              </div>
            </div>

            <form class="mt-3" @submit.prevent>
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Correo</label>
                  <input type="email" v-model="datos.correo" class="form-control" placeholder="correo@ejemplo.com" @blur="datosTouched.correo = true" />
                  <div v-if="errors.correo && datosTouched.correo" class="invalid-feedback d-block">{{ errors.correo }}</div>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Nombre</label>
                  <input type="text" v-model="datos.nombre" class="form-control" placeholder="Nombre" @blur="datosTouched.nombre = true" />
                  <div v-if="errors.nombre && datosTouched.nombre" class="invalid-feedback d-block">{{ errors.nombre }}</div>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Apellidos</label>
                  <input type="text" v-model="datos.apellidos" class="form-control" placeholder="Apellidos" @blur="datosTouched.apellidos = true" />
                  <div v-if="errors.apellidos && datosTouched.apellidos" class="invalid-feedback d-block">{{ errors.apellidos }}</div>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Documento de identidad</label>
                  <input type="text" v-model="datos.documento" class="form-control" placeholder="Número de documento" @blur="datosTouched.documento = true" />
                  <div v-if="errors.documento && datosTouched.documento" class="invalid-feedback d-block">{{ errors.documento }}</div>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Teléfono / Móvil</label>
                  <input type="tel" v-model="datos.telefono" class="form-control" placeholder="999 999 999" @blur="datosTouched.telefono = true" @input="onDatosTelefonoInput" />
                </div>
              </div>

              <div class="d-flex gap-2 mt-4">
                <button type="button" class="btn btn-outline-secondary" @click="regresarPaso">Regresar</button>
                <button type="button" class="btn btn-entrega" @click="avanzarPaso" :disabled="!datosValid">IR A DATOS DE ENTREGA</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Right: resumen -->
        <div class="col-lg-4">
          <aside class="order-summary p-4 rounded shadow-sm">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h6 class="summary-title mb-0">PEDIDO</h6>
            </div>

            <div class="summary-items mb-3">
              <div v-for="(item, idx) in carritoStore.items" :key="item.id" class="summary-item d-flex align-items-center py-2">
                <div class="num-circle me-2">{{ idx + 1 }}</div>
                <img :src="item.portadaUrl" alt="" class="thumb me-2" />
                <div class="flex-grow-1">
                  <div class="fw-semibold small text-truncate">{{ item.titulo }}</div>
                  <div class="small text-muted">Cant.: {{ item.cantidad }}</div>
                </div>
                <div class="text-end ms-2 text-primary small">S/{{ (item.precio * item.cantidad).toFixed(2) }}</div>
              </div>
            </div>

            <div class="mt-2">
              <div class="d-flex justify-content-between small text-muted mb-1">
                <div>Subtotal</div>
                <div>S/{{ carritoStore.subtotal.toFixed(2) }}</div>
              </div>
              <div class="d-flex justify-content-between small text-muted mb-2">
                <div>Envío</div>
                <div>S/{{ tarifaEnvio.toFixed(2) }}</div>
              </div>

              <div class="border-top pt-2 mt-2 d-flex justify-content-between align-items-center">
                <div class="fw-bold">Total</div>
                <div class="fw-bold text-primary">S/{{ (carritoStore.subtotal + tarifaEnvio).toFixed(2) }}</div>
              </div>
            </div>

            <div class="mt-3 btn-volver-row">
              <button class="btn btn-outline-primary w-100 btn-volver" @click.prevent="irAlPaso(1)">
                <i class="fas fa-arrow-left me-2" aria-hidden="true"></i>
                Volver al carrito
              </button>
            </div>
          </aside>
        </div>
      </template>

      <template v-else-if="step === 3">
        <!-- Entrega -->
        <div class="col-lg-8">
          <div class="checkout-card p-4 rounded shadow-sm">
            <div class="d-flex align-items-start mb-3">
              <div class="step-badge me-3">3</div>
              <div>
                <h5 class="mb-1">Envío</h5>
                <p class="text-muted small mb-0">Complete su dirección de entrega</p>
              </div>
            </div>

            <!-- Información de Envío limitado a Lima y Callao -->
            <div class="alert alert-info mb-4 border-0 rounded-3">
              <div class="d-flex align-items-start">
                <i class="fas fa-map-marker-alt me-3 mt-1 text-info" style="font-size: 1.2rem;"></i>
                <div class="flex-grow-1">
                  <h6 class="mb-2 text-info fw-bold">📍 Envío solo a Lima y Callao</h6>
                  <div class="small">
                    <p class="mb-1"><strong>🌆 Cobertura:</strong> Actualmente solo realizamos entregas en Lima Metropolitana y Callao</p>
                    <p class="mb-1"><strong>💰 Costo:</strong> S/8.00 (tarifa única para ambos)</p>
                    <p class="mb-0"><strong>⏱️ Tiempo:</strong> 1-2 días hábiles después de confirmado el pago</p>
                  </div>
                </div>
              </div>
            </div>

            <form class="mt-3" @submit.prevent>
              <div class="row g-3">
                <!-- Fila 1: Departamento, Provincia, Distrito -->
                <div class="col-12">
                  <div class="row g-2">
                    <!-- Departamento (solo Lima y Callao) -->
                    <div class="col-12 col-md-4">
                      <label class="form-label">Departamento</label>
                      <select 
                        v-model="entrega.departamento" 
                        class="form-select" 
                        @change="onDepartamentoChange"
                      >
                        <option value="">Seleccione departamento</option>
                        <option v-for="depto in departamentosDisponibles" :key="depto.id" :value="depto.name">
                          {{ depto.name }}
                        </option>
                      </select>
                      <small class="text-muted">Actualmente solo enviamos a Lima y Callao</small>
                    </div>

                    <div class="col-12 col-md-4">
                      <label class="form-label">Provincia</label>
                      <select 
                        v-model="entrega.provincia" 
                        class="form-select" 
                        :disabled="!entrega.departamento" 
                        @change="onProvinciaChange"
                      >
                        <option value="">{{ entrega.departamento ? 'Seleccione provincia' : 'Primero seleccione departamento' }}</option>
                        <option v-for="prov in provinciasDisponibles" :key="prov.id" :value="prov.name">
                          {{ prov.name }}
                        </option>
                      </select>
                    </div>

                    <div class="col-12 col-md-4">
                      <label class="form-label">Distrito</label>
                      <select 
                        v-model="entrega.distrito" 
                        class="form-select" 
                        :disabled="!entrega.provincia"
                      >
                        <option value="">{{ entrega.provincia ? 'Seleccione distrito' : 'Primero seleccione provincia' }}</option>
                        <option v-for="dist in distritosDisponibles" :key="dist.id" :value="dist.name">
                          {{ dist.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Fila 2: Dirección -->
                <div class="col-12">
                  <label class="form-label">Dirección</label>
                  <input type="text" v-model="entrega.direccion" class="form-control" placeholder="Av/Jr/Calle, número, piso, etc." @blur="entregaTouched.direccion = true" />
                  <div v-if="errors.direccion && entregaTouched.direccion" class="invalid-feedback d-block">{{ errors.direccion }}</div>
                </div>

                <!-- Fila 3: Referencia y Código Postal -->
                <div class="col-12">
                  <div class="row g-2">
                    <div class="col-12 col-md-6">
                      <label class="form-label">Referencia</label>
                      <input type="text" v-model="entrega.referencia" class="form-control" placeholder="Ej: Frente al parque, edificio azul" />
                    </div>
                    <div class="col-12 col-md-6">
                      <label class="form-label">Código postal</label>
                      <input type="text" v-model="entrega.codigoPostal" class="form-control" placeholder="15001" @blur="entregaTouched.codigoPostal = true" />
                      <div v-if="errors.codigoPostal && entregaTouched.codigoPostal" class="invalid-feedback d-block">{{ errors.codigoPostal }}</div>
                    </div>
                  </div>
                </div>

                <!-- Fila 4: Nota adicional -->
                <div class="col-12">
                  <label class="form-label">Nota adicional (opcional)</label>
                  <textarea v-model="entrega.nota" class="form-control order-note" rows="2" placeholder="Ej: Llamar antes de entregar, dejar con portería"></textarea>
                </div>
              </div>

              <div class="d-flex gap-2 mt-4">
                <button type="button" class="btn btn-outline-secondary" @click="regresarPaso">Regresar</button>
                <button type="button" class="btn btn-entrega" @click="avanzarPaso" :disabled="!entregaValid">IR A DATOS DE PAGO</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Right: resumen -->
        <div class="col-lg-4">
          <aside class="order-summary p-4 rounded shadow-sm">
            <h6 class="summary-title mb-3">PEDIDO</h6>
            <div class="summary-items mb-3">
              <div v-for="(item, idx) in carritoStore.items" :key="item.id" class="summary-item d-flex align-items-center py-2">
                <div class="num-circle me-2">{{ idx + 1 }}</div>
                <img :src="item.portadaUrl" alt="" class="thumb me-2" />
                <div class="flex-grow-1">
                  <div class="fw-semibold small text-truncate">{{ item.titulo }}</div>
                  <div class="small text-muted">Cant.: {{ item.cantidad }}</div>
                </div>
                <div class="text-end ms-2 text-primary small">S/{{ (item.precio * item.cantidad).toFixed(2) }}</div>
              </div>
            </div>

            <div class="mt-2">
              <div class="d-flex justify-content-between small text-muted mb-1">
                <div>Subtotal</div>
                <div>S/{{ carritoStore.subtotal.toFixed(2) }}</div>
              </div>
              <div class="d-flex justify-content-between small text-muted mb-2">
                <div>Envío</div>
                <div>S/{{ tarifaEnvio.toFixed(2) }}</div>
              </div>

              <div class="border-top pt-2 mt-2 d-flex justify-content-between align-items-center">
                <div class="fw-bold">Total</div>
                <div class="fw-bold text-primary">S/{{ (carritoStore.subtotal + tarifaEnvio).toFixed(2) }}</div>
              </div>
            </div>

            <div class="mt-3 btn-volver-row">
              <button class="btn btn-outline-primary w-100 btn-volver" @click.prevent="irAlPaso(1)">
                <i class="fas fa-arrow-left me-2" aria-hidden="true"></i>
                Volver al carrito
              </button>
            </div>
          </aside>
        </div>
      </template>

      <template v-else-if="step === 4">
        <!-- Pago -->
        <div class="col-lg-8">
          <div class="checkout-card p-4 rounded shadow-sm">
            <div class="d-flex align-items-start mb-3">
              <div class="step-badge me-3">4</div>
              <div>
                <h5 class="mb-1">Pago</h5>
                <p class="text-muted small mb-0">Selecciona tu método de pago y completa los datos.</p>
              </div>
            </div>

            <!-- Métodos de pago: Tarjeta y Código Yape -->
            <div class="d-flex gap-3 mb-3 payment-methods">
              <button :class="['method-card p-3 rounded w-100 text-start position-relative', { active: paymentMethod === 'card' }]" @click="paymentMethod = 'card'">
                <div class="fw-semibold"><i class="bi bi-credit-card me-2" aria-hidden="true"></i>Tarjeta</div>
                <span v-if="paymentMethod === 'card'" class="method-check"><i class="fas fa-check"></i></span>
              </button>

              <button :class="['method-card p-3 rounded w-100 text-start position-relative', { active: paymentMethod === 'yape' }]" @click="paymentMethod = 'yape'">
                <div class="fw-semibold"><img :src="LogoYape" alt="Yape" class="method-yape-img" />Código Yape</div>
                <span v-if="paymentMethod === 'yape'" class="method-check"><i class="fas fa-check"></i></span>
              </button>
            </div>

            <!-- Formulario Tarjeta -->
            <div v-if="paymentMethod === 'card'">
              <div class="mb-3">
                <label class="form-label">Número de tarjeta</label>
                <input class="form-control" placeholder="1234 1234 1234 1234" v-model="card.number" @blur="cardTouched.number = true" @input="onCardNumberInput" inputmode="numeric" maxlength="19" />
                <div v-if="cardErrors.number && cardTouched.number" class="invalid-feedback d-block">{{ cardErrors.number }}</div>
              </div>

              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label">Caducidad</label>
                  <input class="form-control" placeholder="MM/AA" v-model="card.expiry" @blur="cardTouched.expiry = true" @input="onCardExpiryInput" />
                  <div v-if="cardErrors.expiry && cardTouched.expiry" class="invalid-feedback d-block">{{ cardErrors.expiry }}</div>
                </div>
                <div class="col-6">
                  <label class="form-label">CVV</label>
                  <input class="form-control" placeholder="CVV" v-model="card.cvv" @blur="cardTouched.cvv = true" @input="onCvvInput" maxlength="3" inputmode="numeric" pattern="\d{3}" />
                  <div v-if="cardErrors.cvv && cardTouched.cvv" class="invalid-feedback d-block">{{ cardErrors.cvv }}</div>
                </div>
              </div>

              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label">Nombres</label>
                  <input class="form-control" placeholder="Nombres" v-model="card.firstName" @blur="cardTouched.firstName = true" />
                  <div v-if="cardErrors.firstName && cardTouched.firstName" class="invalid-feedback d-block">{{ cardErrors.firstName }}</div>
                </div>
                <div class="col-6">
                  <label class="form-label">Apellidos</label>
                  <input class="form-control" placeholder="Apellidos" v-model="card.lastName" @blur="cardTouched.lastName = true" />
                  <div v-if="cardErrors.lastName && cardTouched.lastName" class="invalid-feedback d-block">{{ cardErrors.lastName }}</div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Correo electrónico</label>
                <input class="form-control" placeholder="Correo electrónico" v-model="card.email" @blur="cardTouched.email = true" />
                <div v-if="cardErrors.email && cardTouched.email" class="invalid-feedback d-block">{{ cardErrors.email }}</div>
              </div>

              <div class="d-grid">
                <button 
                  @click="procesarPago" 
                  :disabled="procesandoPago || !cardValid"
                  class="btn btn-primary py-3">
                  <span v-if="!procesandoPago">Pagar S/{{ (carritoStore.subtotal + tarifaEnvio).toFixed(2) }}</span>
                  <span v-else>
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Procesando...
                  </span>
                </button>
              </div>
            </div>

            <!-- Formulario Yape -->
            <div v-else>
              <div class="yape-info p-4 mb-3 rounded">
                <div class="d-flex align-items-start justify-content-between">
                  <div class="yape-info-left">
                    <div class="small text-muted">Paga con tu</div>
                    <div class="fw-semibold mb-2">Código de aprobación</div>

                    <div class="yape-steps">
                      <div class="yape-step d-flex align-items-start mb-2">
                        <span class="icon-circle icon-menu">
                          <i class="bi bi-list" aria-hidden="true"></i>
                        </span>
                        <div class="step-text small text-muted ms-3">Encuéntralo en el menú de tu app Yape.</div>
                      </div>

                      <div class="yape-step d-flex align-items-start mb-2">
                        <span class="icon-circle icon-copy">
                          <i class="bi bi-copy" aria-hidden="true"></i>
                        </span>
                        <div class="step-text small text-muted ms-3">Cópialo y pégalo abajo.</div>
                      </div>

                      <div class="yape-step d-flex align-items-start">
                        <span class="icon-circle icon-info">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6" fill="currentColor"/><rect x="7.1" y="4.1" width="1.8" height="1.8" rx="0.9" fill="#fff"/><rect x="7" y="7" width="1.8" height="4" rx="0.9" fill="#fff"/></svg>
                        </span>
                        <div class="step-text small text-muted ms-3">El monto límite para pagos a través de Yape es de S/ 2,000.</div>
                      </div>
                    </div>
                  </div>

                  <div class="yape-info-right d-flex align-items-start">
                    <img :src="LogoYape" alt="Yape" style="height:56px;" />
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Ingresa tu celular Yape</label>
                <input class="form-control" placeholder="999 999 999" v-model="yape.phone" @blur="yapeTouched.phone = true" @input="onYapePhoneInput" inputmode="numeric" maxlength="11" pattern="\d{9}" />
                <div v-if="yapeTouched.phone && yapePhoneError" class="invalid-feedback d-block">{{ yapePhoneError }}</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Código de aprobación</label>
                <div class="d-flex gap-2 code-inputs">
                  <input
                    v-for="(d, i) in yape.code"
                    :key="i"
                    ref="codeInputs"
                    type="text"
                    maxlength="1"
                    inputmode="numeric"
                    class="form-control code-digit text-center"
                    v-model="yape.code[i]"
                    @input="onCodeInput($event, i)"
                    @keydown="onCodeKeydown($event, i)"
                    @paste="onCodePaste($event)"
                    @blur="yapeTouched.code = true"
                  />
                </div>
                <div v-if="!yapeCodeValid && yapeTouched.code" class="invalid-feedback d-block">Este campo es obligatorio.</div>
              </div>

              <div class="d-grid">
                <button 
                  @click="procesarPago"
                  :class="['btn py-3', isYapeComplete && !procesandoPago ? 'btn-yape-ready' : 'btn-secondary']" 
                  :disabled="!isYapeComplete || procesandoPago">
                  <span v-if="!procesandoPago">Pagar S/{{ (carritoStore.subtotal + tarifaEnvio).toFixed(2) }}</span>
                  <span v-else>
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Procesando...
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: resumen -->
        <div class="col-lg-4">
          <aside class="order-summary p-4 rounded shadow-sm">
            <h6 class="summary-title mb-3">PEDIDO</h6>
            <div class="summary-items mb-3">
              <div v-for="(item, idx) in carritoStore.items" :key="item.id" class="summary-item d-flex align-items-center py-2">
                <div class="num-circle me-2">{{ idx + 1 }}</div>
                <img :src="item.portadaUrl" alt="" class="thumb me-2" />
                <div class="flex-grow-1">
                  <div class="fw-semibold small text-truncate">{{ item.titulo }}</div>
                  <div class="small text-muted">Cant.: {{ item.cantidad }}</div>
                </div>
                <div class="text-end ms-2 text-primary small">S/{{ (item.precio * item.cantidad).toFixed(2) }}</div>
              </div>
            </div>

            <div class="mt-2">
              <div class="d-flex justify-content-between small text-muted mb-1">
                <div>Subtotal</div>
                <div>S/{{ carritoStore.subtotal.toFixed(2) }}</div>
              </div>
              <div class="d-flex justify-content-between small text-muted mb-2">
                <div>Envío</div>
                <div>S/{{ tarifaEnvio.toFixed(2) }}</div>
              </div>

              <div class="border-top pt-2 mt-2 d-flex justify-content-between align-items-center">
                <div class="fw-bold">Total</div>
                <div class="fw-bold text-primary">S/{{ (carritoStore.subtotal + tarifaEnvio).toFixed(2) }}</div>
              </div>
            </div>

            <div class="mt-3 btn-volver-row">
              <button class="btn btn-outline-primary w-100 btn-volver" @click.prevent="irAlPaso(1)">
                <i class="fas fa-arrow-left me-2" aria-hidden="true"></i>
                Volver al carrito
              </button>
            </div>
          </aside>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCarritoStore } from '@/stores/carrito'
import { useAuthStore } from '@/stores/auth'
import LogoYape from '@/assets/LogoYape.webp'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()
const carritoStore = useCarritoStore()
const authStore = useAuthStore()

// Estado del paso actual
const step = ref(1)

// Datos de envío
const entrega = reactive({ 
  direccion: '', 
  referencia: '', 
  codigoPostal: '', 
  departamento: '', 
  provincia: '', 
  distrito: '', 
  nota: '' 
})

// Datos de pago
const paymentMethod = ref('card')
const card = reactive({ 
  number: '', 
  expiry: '', 
  cvv: '', 
  firstName: '', 
  lastName: '', 
  email: '' 
})
const yape = reactive({ 
  phone: '', 
  code: ['', '', '', '', '', ''] 
})

// Tarifa de envío dinámica
const tarifaEnvio = ref(8.0)

// Datos de ubigeo
const departamentosDisponibles = ref([])
const provinciasDisponibles = ref([])
const distritosDisponibles = ref([])

// Datos del usuario
const datos = reactive({ 
  correo: '', 
  nombre: '', 
  apellidos: '', 
  documento: '', 
  telefono: '' 
})

// Estado de carga
const cargandoUbigeo = ref(false)
const procesandoPago = ref(false)

// Refs para inputs de código
const codeInputs = ref([])

// Errores y validaciones
const errors = reactive({ 
  correo: '', 
  nombre: '', 
  apellidos: '', 
  documento: '', 
  telefono: '', 
  direccion: '', 
  codigoPostal: '' 
})
const cardErrors = reactive({ 
  number: '', 
  expiry: '', 
  cvv: '', 
  firstName: '', 
  lastName: '', 
  email: '' 
})

// Flags 'touched'
const datosTouched = reactive({ 
  correo: false, 
  nombre: false, 
  apellidos: false, 
  documento: false, 
  telefono: false 
})
const entregaTouched = reactive({ 
  departamento: false, 
  provincia: false, 
  distrito: false, 
  direccion: false, 
  codigoPostal: false 
})
const cardTouched = reactive({ 
  number: false, 
  expiry: false, 
  cvv: false, 
  firstName: false, 
  lastName: false, 
  email: false 
})
const yapeTouched = reactive({ 
  phone: false, 
  code: false 
})

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

function validarEmail(email) {
  if (!email) return false
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i
  return re.test(String(email).toLowerCase())
}

function formatPhoneGrouped(value, maxDigits) {
  let digits = String(value || '').replace(/\D+/g, '')
  if (!digits) return ''
  if (typeof maxDigits === 'number' && maxDigits > 0) digits = digits.slice(0, maxDigits)
  return digits.replace(/(.{1,3})/g, '$1 ').trim()
}

// ========================================
// VALIDACIONES COMPUTED
// ========================================

const datosValid = computed(() => {
  errors.correo = ''
  errors.nombre = ''
  errors.apellidos = ''
  errors.documento = ''
  errors.telefono = ''

  let ok = true
  if (!datos.correo) { 
    errors.correo = 'Este campo es obligatorio.'; ok = false 
  } else if (!validarEmail(datos.correo)) { 
    errors.correo = 'Correo inválido'; ok = false 
  }

  if (!datos.nombre || String(datos.nombre).trim().length < 2) { 
    errors.nombre = 'Este campo es obligatorio.'; ok = false 
  }
  if (!datos.apellidos || String(datos.apellidos).trim().length < 2) { 
    errors.apellidos = 'Este campo es obligatorio.'; ok = false 
  }
  
  if (!datos.documento) { 
    errors.documento = 'Este campo es obligatorio.'; ok = false 
  } else {
    const docClean = String(datos.documento || '').replace(/\s+/g, '')
    if (!/^\d{8,20}$/.test(docClean)) {
      errors.documento = 'Documento inválido. Debe tener 8 dígitos.'
      ok = false
    }
  }

  const tel = String(datos.telefono || '').replace(/\D+/g, '')
  if (!tel) { 
    errors.telefono = 'Este campo es obligatorio.'; ok = false 
  } else if (!/^\d{9}$/.test(tel)) { 
    errors.telefono = 'Teléfono inválido'; ok = false 
  }
  return ok
})

const entregaValid = computed(() => {
  errors.direccion = ''
  errors.codigoPostal = ''
  let ok = true
  
  // Validar que sea Lima o Callao
  if (!entrega.departamento || (entrega.departamento !== 'Lima' && entrega.departamento !== 'Callao')) {
    ok = false
  }
  
  if (!entrega.provincia) { 
    ok = false 
  }
  
  if (!entrega.distrito) { 
    ok = false 
  }
  
  if (!entrega.direccion || String(entrega.direccion).trim().length < 5) { 
    errors.direccion = 'Dirección demasiado corta'; ok = false 
  }
  
  const cp = String(entrega.codigoPostal || '').trim()
  if (!cp) { 
    errors.codigoPostal = 'Este campo es obligatorio.'; ok = false 
  } else if (!/^\d{5}$/.test(cp)) { 
    errors.codigoPostal = 'Código postal inválido. Debe tener 5 números.'; ok = false 
  }
  return ok
})

const cardValid = computed(() => {
  cardErrors.number = ''
  cardErrors.expiry = ''
  cardErrors.cvv = ''
  cardErrors.firstName = ''
  cardErrors.lastName = ''
  cardErrors.email = ''

  let ok = true
  const num = String(card.number || '').replace(/\s+/g, '')
  if (!/^[0-9]{13,19}$/.test(num)) { 
    cardErrors.number = 'Número de tarjeta inválido'; ok = false 
  }
  
  if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(String(card.expiry || '').trim())) { 
    cardErrors.expiry = 'Formato MM/AA inválido'; ok = false 
  } else {
    const m = String(card.expiry || '').trim().match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)
    if (m) {
      const mm = parseInt(m[1], 10)
      const yy = 2000 + parseInt(m[2], 10)
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        cardErrors.expiry = 'Ingrese una fecha válida.'
        ok = false
      }
    }
  }
  
  if (!/^[0-9]{3}$/.test(String(card.cvv || '').trim())) { 
    cardErrors.cvv = 'CVV inválido'; ok = false 
  }
  
  if (!card.firstName || String(card.firstName).trim().length < 2) { 
    cardErrors.firstName = 'Nombre inválido'; ok = false 
  }
  
  if (!card.lastName || String(card.lastName).trim().length < 2) { 
    cardErrors.lastName = 'Apellido inválido'; ok = false 
  }
  
  if (!validarEmail(card.email)) { 
    cardErrors.email = 'Email inválido'; ok = false 
  }
  
  return ok
})

const isYapeComplete = computed(() => {
  const phoneStr = String(yape.phone || '').replace(/\s+/g, '')
  const phoneOk = /^9\d{8}$/.test(phoneStr)
  const codeOk = Array.isArray(yape.code) && yape.code.length === 6 && 
                 yape.code.every(c => /^[0-9]$/.test(String(c || '').trim()))
  return phoneOk && codeOk
})

const yapePhoneValid = computed(() => {
  const phoneStr = String(yape.phone || '').replace(/\s+/g, '')
  return /^9\d{8}$/.test(phoneStr)
})

const yapeCodeValid = computed(() => {
  return Array.isArray(yape.code) && yape.code.length === 6 && 
         yape.code.every(c => /^[0-9]$/.test(String(c || '').trim()))
})

const yapePhoneClean = computed(() => String(yape.phone || '').replace(/\D+/g, ''))

const yapePhoneError = computed(() => {
  const s = yapePhoneClean.value
  if (!s) return 'Este campo es obligatorio.'
  if (!/^9/.test(s)) return 'Este no es un número de celular válido.'
  if (!/^\d{9}$/.test(s)) return 'Teléfono Yape inválido. Debe tener 9 dígitos.'
  return ''
})

// ========================================
// FUNCIONES DE FORMATEO DE INPUT
// ========================================

function onDatosTelefonoInput(e) {
  const formatted = formatPhoneGrouped(e.target.value, 9)
  datos.telefono = formatted
}

function onYapePhoneInput(e) {
  const formatted = formatPhoneGrouped(e.target.value, 9)
  yape.phone = formatted
}

function onCardExpiryInput(e) {
  let digits = String(e.target.value || '').replace(/\D+/g, '')
  digits = digits.slice(0, 4)

  if (digits.length === 0) {
    card.expiry = ''
    return
  }

  if (digits.length <= 2) {
    card.expiry = digits
    return
  }

  const mm = digits.slice(0, 2)
  const yy = digits.slice(2)
  card.expiry = `${mm}/${yy}`
}

function onCvvInput(e) {
  const digits = String(e.target.value || '').replace(/\D+/g, '').slice(0, 3)
  card.cvv = digits
}

function formatCardNumber(value) {
  const digits = String(value || '').replace(/\D+/g, '').slice(0, 16)
  if (!digits) return ''
  return digits.replace(/(.{1,4})/g, '$1 ').trim()
}

function onCardNumberInput(e) {
  const formatted = formatCardNumber(e.target.value)
  card.number = formatted
}

function onCodeInput(e, i) {
  const raw = String(e.target.value || '')
  const digit = raw.replace(/\D+/g, '').slice(0, 1)
  yape.code[i] = digit
  e.target.value = digit

  if (digit && codeInputs.value && codeInputs.value[i + 1]) {
    try { 
      codeInputs.value[i + 1].focus(); 
      codeInputs.value[i + 1].select && codeInputs.value[i + 1].select() 
    } catch (err) {}
  }
}

function onCodeKeydown(e, i) {
  if (e.key === 'Backspace') {
    const val = String(yape.code[i] || '')
    if (!val && i > 0) {
      e.preventDefault()
      try {
        const prev = codeInputs.value[i - 1]
        if (prev) {
          prev.focus()
          yape.code[i - 1] = ''
        }
      } catch (err) {}
    }
  }
}

function onCodePaste(e) {
  const paste = (e.clipboardData || window.clipboardData).getData('text') || ''
  const digits = paste.replace(/\D+/g, '').slice(0, 6).split('')
  if (!digits || digits.length === 0) return
  e.preventDefault()
  
  for (let j = 0; j < digits.length; j++) {
    if (j >= yape.code.length) break
    yape.code[j] = digits[j]
    if (codeInputs.value && codeInputs.value[j]) {
      try { codeInputs.value[j].value = digits[j] } catch (err) {}
    }
  }
  
  const nextIndex = Math.min(digits.length, yape.code.length - 1)
  try { codeInputs.value[nextIndex]?.focus() } catch (err) {}
}

// ========================================
// FUNCIONES DE UBIGEO
// ========================================

async function cargarDepartamentos() {
  try {
    const response = await fetch('http://localhost:8080/api/ubigeo/departamentos')
    if (!response.ok) {
      throw new Error('Respuesta no válida al cargar departamentos')
    }

    const todosDepartamentos = await response.json()
    // Filtrar solo Lima y Callao
    departamentosDisponibles.value = todosDepartamentos.filter(
      depto => depto.name === 'Lima' || depto.name === 'Callao'
    )
  } catch (error) {
    console.error('Error cargando departamentos:', error)
    // Si hay error, usar valores por defecto
    departamentosDisponibles.value = [
      { id: 15, name: 'Lima' },
      { id: 7, name: 'Callao' }
    ]
  }
}

async function cargarProvincias(departamentoNombre) {
  try {
    // Si no es Lima o Callao, no cargar nada
    if (departamentoNombre !== 'Lima' && departamentoNombre !== 'Callao') {
      provinciasDisponibles.value = []
      return
    }
    
    const response = await fetch('http://localhost:8080/api/ubigeo/provincias')
    if (!response.ok) {
      throw new Error('Respuesta no válida al cargar provincias')
    }

    const todasProvincias = await response.json()
    
    // Encontrar el departamento seleccionado
    const depto = departamentosDisponibles.value.find(d => d.name === departamentoNombre)
    if (depto) {
      // Filtrar provincias del departamento seleccionado
      provinciasDisponibles.value = todasProvincias.filter(p => p.department_id === depto.id)
    } else {
      provinciasDisponibles.value = []
    }
  } catch (error) {
    console.error('Error cargando provincias:', error)
    provinciasDisponibles.value = []
  }
}

async function cargarDistritos(provinciaNombre) {
  try {
    const response = await fetch('http://localhost:8080/api/ubigeo/distritos')
    if (!response.ok) {
      throw new Error('Respuesta no válida al cargar distritos')
    }

    const todosDistritos = await response.json()
    // Buscar la provincia por nombre
    const prov = provinciasDisponibles.value.find(p => p.name === provinciaNombre)
    if (prov) {
      distritosDisponibles.value = todosDistritos.filter(d => d.province_id === prov.id)
    } else {
      distritosDisponibles.value = []
    }
  } catch (error) {
    console.error('Error cargando distritos:', error)
    distritosDisponibles.value = []
  }
}

async function calcularTarifaEnvio(departamentoNombre) {
  // Tarifa fija para Lima y Callao
  tarifaEnvio.value = 8.0
  
  // Si seleccionan algo que no sea Lima o Callao, mostrar error
  if (departamentoNombre && departamentoNombre !== 'Lima' && departamentoNombre !== 'Callao') {
    Swal.fire({
      icon: 'warning',
      title: 'Ubicación no disponible',
      html: `
        <p>Actualmente solo realizamos entregas en <strong>Lima Metropolitana y Callao</strong>.</p>
        <p class="mb-0">Próximamente ampliaremos nuestra cobertura a más ciudades.</p>
      `,
      confirmButtonText: 'Entendido'
    }).then(() => {
      entrega.departamento = ''
      entrega.provincia = ''
      entrega.distrito = ''
      provinciasDisponibles.value = []
      distritosDisponibles.value = []
    })
  }
}

// ========================================
// MANEJADORES DE CAMBIOS
// ========================================

async function onDepartamentoChange() {
  entrega.provincia = ''
  entrega.distrito = ''
  provinciasDisponibles.value = []
  distritosDisponibles.value = []
  
  if (entrega.departamento) {
    // Validar que sea Lima o Callao
    if (entrega.departamento !== 'Lima' && entrega.departamento !== 'Callao') {
      Swal.fire({
        icon: 'warning',
        title: 'Ubicación no disponible',
        html: `
          <p>Actualmente solo realizamos entregas en <strong>Lima Metropolitana y Callao</strong>.</p>
          <p class="mb-0">Próximamente ampliaremos nuestra cobertura a más ciudades.</p>
        `,
        confirmButtonText: 'Entendido'
      }).then(() => {
        entrega.departamento = ''
        entrega.provincia = ''
        entrega.distrito = ''
      })
      return
    }
    
    await cargarProvincias(entrega.departamento)
    await calcularTarifaEnvio(entrega.departamento)
  }
}

async function onProvinciaChange() {
  entrega.distrito = ''
  distritosDisponibles.value = []
  
  if (entrega.provincia) {
    await cargarDistritos(entrega.provincia)
  }
}

// ========================================
// CICLO DE VIDA
// ========================================

onMounted(async () => {
  console.log('🔍 CheckoutView montado')
  
  // Cargar departamentos (solo Lima y Callao)
  await cargarDepartamentos()
  
  // Tarifa fija inicial
  tarifaEnvio.value = 8.0
  
  // Cargar datos del usuario si está autenticado
  if (authStore.isAuthenticated && authStore.user?.id) {
    try {
      const url = `http://localhost:8080/api/usuarios/${authStore.user.id}`
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      
      if (response.ok) {
        const usuario = await response.json()
        
        // Rellenar datos del formulario
        datos.correo = usuario.email || ''
        datos.nombre = usuario.nombre || ''
        datos.apellidos = usuario.apellido || ''
        datos.telefono = usuario.telefono || ''
        datos.documento = usuario.documento || ''
        
        // Rellenar datos de entrega
        if (usuario.direccion) entrega.direccion = usuario.direccion
        if (usuario.codigoPostal) entrega.codigoPostal = usuario.codigoPostal
        
        // Cargar ubicación si existe y es Lima o Callao
        if (usuario.departamento && (usuario.departamento === 'Lima' || usuario.departamento === 'Callao')) {
          entrega.departamento = usuario.departamento
          await nextTick()
          await cargarProvincias(usuario.departamento)
          await calcularTarifaEnvio(usuario.departamento)
          
          if (usuario.provincia) {
            entrega.provincia = usuario.provincia
            await nextTick()
            await cargarDistritos(usuario.provincia)
            
            if (usuario.distrito) {
              entrega.distrito = usuario.distrito
            }
          }
        }
        
        if (usuario.notas) entrega.referencia = usuario.notas
        
        console.log('✅ Datos del usuario cargados automáticamente')
      }
    } catch (error) {
      console.error('❌ Error al cargar datos del usuario:', error)
    }
  }
  
  // Verificar paso desde query string
  try {
    const qStep = route?.query?.step
    if (qStep) {
      const s = parseInt(String(qStep))
      if (!isNaN(s) && s >= 1 && s <= 4) step.value = s
    }
  } catch (err) {
    /* noop */
  }
})

watch(() => route.query.step, (newStep) => {
  if (!newStep) return
  const s = parseInt(String(newStep))
  if (!isNaN(s) && s >= 1 && s <= 4) step.value = s
})

// ========================================
// NAVEGACIÓN ENTRE PASOS
// ========================================

function finalizarCompra() {
  if (carritoStore.items.length === 0) return
  step.value = 2
}

function avanzarPaso() {
  if (step.value === 1) {
    if (carritoStore.items.length === 0) return
    step.value = 2
    return
  }

  if (step.value === 2) {
    if (!datosValid.value) return
    step.value = 3
    return
  }

  if (step.value === 3) {
    if (!entregaValid.value) return
    step.value = 4
    return
  }

  if (step.value < 4) step.value++
}

function regresarPaso() {
  if (step.value > 1) step.value--
}

function irAlPaso(n) {
  const s = parseInt(String(n))
  if (isNaN(s) || s < 1 || s > 4) return
  
  if (s > step.value) {
    if (s === 2 && carritoStore.items.length === 0) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Carrito vacío', 
        text: 'Agrega al menos un producto antes de continuar.' 
      })
      return
    }
    
    if (s === 3 && !datosValid.value) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Datos incompletos', 
        text: 'Por favor completa tus datos antes de continuar.' 
      })
      Object.keys(datosTouched).forEach(k => datosTouched[k] = true)
      step.value = 2
      return
    }
    
    if (s === 4 && !entregaValid.value) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Datos de envío incompletos', 
        text: 'Por favor completa la dirección de entrega antes de continuar.' 
      })
      Object.keys(entregaTouched).forEach(k => entregaTouched[k] = true)
      step.value = 3
      return
    }
  }

  step.value = s
  try {
    router.replace({ 
      name: router.currentRoute.value.name || 'checkout', 
      query: { ...router.currentRoute.value.query, step: String(s) } 
    })
  } catch (err) {
    // noop
  }
}

// ========================================
// FUNCIONES DEL CARRITO
// ========================================

function aumentarCantidad(id) { 
  carritoStore.aumentarCantidad(id) 
}

function disminuirCantidad(id) { 
  carritoStore.disminuirCantidad(id) 
}

function eliminar(id) { 
  carritoStore.eliminarItem(id) 
}

function obtenerNombreAutor(autor) {
  if (!autor) return 'Autor desconocido'
  if (typeof autor === 'string') return autor
  if (autor && typeof autor === 'object') {
    if (autor.nombre && autor.apellido) return `${autor.nombre} ${autor.apellido}`
    if (autor.nombre) return autor.nombre
  }
  return 'Autor desconocido'
}

// ========================================
// PROCESAR PAGO
// ========================================

async function procesarPago() {
  // Validar que sea Lima o Callao
  if (entrega.departamento !== 'Lima' && entrega.departamento !== 'Callao') {
    Swal.fire({
      icon: 'warning',
      title: 'Ubicación no disponible',
      html: `
        <p>Actualmente solo realizamos entregas en <strong>Lima Metropolitana y Callao</strong>.</p>
        <p class="mb-0">Próximamente ampliaremos nuestra cobertura a más ciudades.</p>
      `,
      confirmButtonText: 'Entendido'
    })
    step.value = 3
    return
  }
  
  // Validaciones básicas
  if (!datos.correo || !datos.nombre || !datos.telefono) {
    Swal.fire({
      icon: 'warning',
      title: 'Datos incompletos',
      text: 'Por favor completa todos los datos de identificación',
      confirmButtonText: 'Entendido'
    })
    step.value = 2
    return
  }

  if (!entrega.provincia || !entrega.distrito || !entrega.direccion) {
    Swal.fire({
      icon: 'warning',
      title: 'Datos de envío incompletos',
      text: 'Por favor completa todos los datos de envío',
      confirmButtonText: 'Entendido'
    })
    step.value = 3
    return
  }

  if (!paymentMethod.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Método de pago no seleccionado',
      text: 'Por favor selecciona un método de pago',
      confirmButtonText: 'Entendido'
    })
    return
  }

  if (paymentMethod.value === 'card' && !cardValid.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Datos de tarjeta incompletos',
      text: 'Por favor revisa los datos de la tarjeta',
      confirmButtonText: 'Entendido'
    })
    return
  }

  if (paymentMethod.value === 'yape' && !isYapeComplete.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Datos de Yape incompletos',
      text: 'Por favor completa el teléfono (9 dígitos) y el código de 6 dígitos de Yape',
      confirmButtonText: 'Entendido'
    })
    return
  }

 procesandoPago.value = true

  try {
    // Preparar items del carrito
    const items = carritoStore.items.map(item => ({
      libroId: item.id,
      cantidad: item.cantidad,
      precioUnitario: item.precio
    }))

    // CALCULAR EL TOTAL (subtotal + envío)
    const totalOrden = carritoStore.subtotal + tarifaEnvio.value

    // Preparar datos de la orden
    const ordenData = {
      items: items,
      metodoPago: paymentMethod.value === 'card' ? 'tarjeta' : 'yape',
      direccionEnvio: entrega.direccion,
      ciudadEnvio: entrega.distrito,
      codigoPostalEnvio: entrega.codigoPostal || '',
      telefonoContacto: datos.telefono,
      notas: entrega.nota || '',
      departamento: entrega.departamento,
      provincia: entrega.provincia,
      distrito: entrega.distrito,
      referencia: entrega.referencia || '',
      tarifaEnvio: tarifaEnvio.value,
      total: totalOrden,  // <--- ¡AGREGA ESTE CAMPO!
      subtotal: carritoStore.subtotal  // <--- También podrías enviar el subtotal si lo necesitas
    }

    console.log('📦 Enviando orden:', ordenData)

    // Enviar al backend
    const response = await fetch('http://localhost:8080/api/ordenes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(ordenData)
    })

    const result = await response.json()

    if (response.ok && result.success) {
      console.log('✅ Orden creada exitosamente:', result)
      
      // Limpiar carrito
      carritoStore.vaciarCarrito()
      
      // Guardar datos en perfil
      guardarDatosEnPerfil().catch(err => {
        console.warn('⚠️ No se pudieron guardar los datos en el perfil:', err)
      })
      
      // Mostrar éxito
      Swal.fire({
        icon: 'success',
        title: '¡Compra exitosa! 🎉',
        html: `<p><strong>Número de orden:</strong> ${result.ordenId}</p><p>Gracias por tu compra. Serás redirigido a tus pedidos.</p>`,
        confirmButtonText: 'Ver mis pedidos',
        timer: 3000,
        timerProgressBar: true
      }).then(() => {
        router.push('/pedidos')
      })
      
    } else {
      console.error('❌ Error al crear orden:', result)
      Swal.fire({
        icon: 'error',
        title: 'Error al procesar el pago',
        text: result.message || 'Intenta nuevamente',
        confirmButtonText: 'Entendido'
      })
    }

  } catch (error) {
    console.error('❌ Error al procesar pago:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'Por favor intenta nuevamente.',
      confirmButtonText: 'Entendido'
    })
  } finally {
    procesandoPago.value = false
  }
}

async function guardarDatosEnPerfil() {
  try {
    const perfilData = {
      telefono: datos.telefono,
      documento: datos.documento || '',
      direccion: entrega.direccion,
      departamento: entrega.departamento,
      provincia: entrega.provincia,
      distrito: entrega.distrito,
      codigoPostal: entrega.codigoPostal || '',
      notas: entrega.referencia || ''
    }

    console.log('💾 Guardando datos en perfil:', perfilData)

    const response = await fetch('http://localhost:8080/api/usuarios/perfil', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(perfilData)
    })

    if (response.ok) {
      console.log('✅ Datos guardados en perfil exitosamente')
      const usuarioActualizado = await response.json()
      authStore.updateUser(usuarioActualizado)
    }
  } catch (error) {
    console.error('❌ Error al guardar datos en perfil:', error)
  }
}
</script>

<style scoped>
.stepper { gap: 0.5rem; }
.step { color: #9aa3ab; }
.step[role="button"] { cursor: pointer; }
.step.active { color: #2db34a; }
.step-circle { width:48px; height:48px; border-radius:50%; background:#fff; display:flex; align-items:center; justify-content:center; border:1px solid #e6edf0; }
.step.active .step-circle { background: #2db34a; color:#fff; border-color: #2db34a; }
.step.completed { color: #2db34a; }
.step.completed .step-circle { background: #2db34a; color:#fff; border-color:#2db34a; }
.step-label { min-width:64px; text-align:center }
.step-line .line-inner { height:6px; background: #f0f4f6; border-radius:6px; }
.step-line .line-inner.filled { background: linear-gradient(90deg,#e6f5ea 0%, #2db34a 100%); }

.checkout-card, .checkout-summary { background: #fff; border: 1px solid #eef2f6; }
.checkout-card { padding: 1rem; }
.checkout-item img { width:72px; height:96px; object-fit:cover; border-radius:6px; }
.item-imagen img { display:block; }
.cantidad-controles .btn-qty {
  background: transparent;
  border: none;
  width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center;
  font-weight:600; cursor:pointer;
}
.cantidad-controles .qty { min-width:20px; text-align:center; }
.btn-eliminar-item {
  background: #f5f6f8; border: none; width:30px; height:30px; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer;
}
.btn-eliminar-item i { color: #374151; font-size:14px; }
.btn-eliminar-item:hover { background: #fff1f1; }
.btn-eliminar-item:hover i { color: #e02424; }

/* Copia de estilos del sidebar para que el control de cantidad luzca igual */
.controles-horizontales { display: flex; align-items: center; gap: 0.75rem; }
.cantidad-controles { display: flex; align-items: center; gap: 0.5rem; background: white; border-radius: 20px; padding: 0.25rem; border: 1px solid #dee2e6; }
.btn-cantidad { width: 28px; height: 28px; border: none; background: #f8f9fa; color: #495057; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; font-size: 0.75rem; }
.btn-cantidad:hover:not(:disabled) { background: #e9ecef; }
.btn-cantidad:disabled { opacity: 0.5; cursor: not-allowed; }
.cantidad { min-width: 30px; text-align: center; font-weight: 600; font-size: 0.9rem; }
.btn-eliminar { background: none; border: none; color: #dc3545; cursor: pointer; padding: 0.4rem; border-radius: 50%; transition: all 0.3s ease; font-size: 0.75rem; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
.btn-eliminar:hover { background: rgba(220, 53, 69, 0.1); transform: scale(1.1); }
.precio-item {
  margin-right: 2px; /* reducir espacio hacia el botón eliminar */
  padding-right: 0.25rem;
}
.btn-pagar { background-color:#2db34a; border-color:#2db34a; font-weight:700; border-radius:10px; }
.btn-pagar:disabled { opacity:0.6 }

/* Ajustes responsivos */
@media (max-width: 767px) {
  .item-acciones { min-width: auto; gap:0.5rem }
  .checkout-header { display:none !important }
  /* Bajar la línea de controles para que no choque con la imagen */
  .controls-line { margin-top: 0.5rem; }
  .cantidad-controles { margin-top: 0.25rem; }
  /* Ajuste fino de la imagen para dar más separación */
  .item-imagen img { width:64px; height:86px; }
  /* Mostrar cantidad y precio en la misma línea debajo de la imagen como en la imagen adjunta */
  /* allow the row to wrap and make the two cols auto-width so they sit side-by-side */
  .checkout-item > .row { flex-wrap: wrap; }
  .cantidad-col, .precio-col {
    flex: 0 0 auto !important;
    width: auto !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .cantidad-col { justify-content: flex-start !important; }
  .precio-col { justify-content: flex-end !important; margin-left: auto !important; }
}

/* Estilos para order-summary tipo tarjeta del mock */
.order-summary { background: #fff; border: 1px solid #e6e6e6; }
.order-summary .summary-title { color: #0b4f87; font-weight:700; }
.order-summary .summary-items { border-top: 1px solid #e9edf2; padding-top: 0.75rem; }
.summary-item { border-bottom: 1px solid #f1f4f7; padding-bottom: 0.5rem; }
.order-summary .thumb { width:36px; height:52px; object-fit:cover; border-radius:4px; }
.num-circle { width:22px; height:22px; border-radius:50%; background:#f6f6f6; color:#c55; display:inline-flex; align-items:center; justify-content:center; margin-right:6px; font-size:12px; }
.order-summary .text-primary { color:#0b6fb2 !important; }
.order-summary .btn-outline-primary { border-color:#0b6fb2; color:#0b6fb2; }
/* Nota en el pedido similar al mock */
.order-note { border: 1px solid #e6e9ed; border-radius:6px; padding:0.5rem; resize: vertical; }
/* Payment UI */
.payment-methods .method-card { border: 1px solid #e8eef3; cursor: pointer; color: inherit; }
.payment-methods .method-card.active { border-color: #0b6fb2; box-shadow: 0 2px 6px rgba(11,111,178,0.08); color: #0b6fb2; }
.payment-methods .method-card.active .fw-semibold { color: #0b6fb2; }
.payment-methods .method-card .bi { color: #0b6fb2; }
.method-check {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #0b6fb2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 10px;
}
.method-card .method-check { box-shadow: 0 1px 4px rgba(11,111,178,0.12); }
.yape-top { background: #f6eefb; }
.code-inputs .code-digit { width: 48px; height: 48px; max-width: 48px; }
.method-yape-img { height:20px; margin-right:8px; vertical-align:middle; }
/* estilos para el boton volver con flecha */
.btn-volver { display:flex; align-items:center; justify-content:center; gap:8px; padding-left:0.5rem; }
.btn-volver i { color: #0b6fb2; font-size:16px; transform: translateX(-4px); }
/* Evitar cambio de color/estilo en hover para que el botón permanezca igual */
.btn-volver:hover, .btn-volver:focus {
  background: transparent !important;
  color: #0b6fb2 !important;
  border-color: #0b6fb2 !important;
  box-shadow: none !important;
}

/* Línea separadora arriba del botón volver para que coincida con otras */
.btn-volver-row { border-top: 1px solid #e9edf2; padding-top: 1rem; margin-top: 0.75rem; }
.btn-volver-row .btn-volver { padding-top: 0.25rem; padding-bottom: 0.25rem; }

/* Yape info visuals */
.yape-info { background: #f8f4fb; border-radius: 10px; border: 1px solid #efe7f4; }
.yape-info .fw-semibold { color: #6a4f78; }
.yape-info .small.text-muted { color: #7d6a87; }
.icon-circle { width:36px; height:36px; border-radius:50%; background:#fff; display:inline-flex; align-items:center; justify-content:center; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
.icon-circle svg { display:block; }
.icon-circle.icon-menu, .icon-circle.icon-copy { color: #720e9e; }
.icon-circle.icon-info { color: #0b6fb2; }
.yape-info-right img { max-height:56px; }
.yape-steps { margin-top: 8px; }
.yape-step .step-text { color: #6f5f78; }
.icon-circle.icon-copy i { color: currentColor; font-size:16px; }
.icon-circle.icon-menu i { color: currentColor; font-size:16px; }
/* Botón Yape listo (morado) */
.btn-yape-ready {
  background: #720e9e !important;
  border-color: #720e9e !important;
  color: #fff !important;
  font-weight: 700;
}
.btn-yape-ready:disabled { opacity: 0.8 }
.btn-yape-ready:focus { box-shadow: 0 0 0 3px rgba(114,14,158,0.12) }
/* Badge circular azul para Identificación / Envío / Pago */
.step-badge {
  width:32px;
  height:32px;
  background: #0b6fb2;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  border-radius:50%;
  color: #fff;
  font-weight:700;
  font-size:13px;
  box-shadow: 0 1px 4px rgba(11,111,178,0.18);
  margin-right:6px;
}
.btn-entrega {
  background: #2db34a;
  border-color: #2db34a;
  color: #fff;
  font-weight: 700;
}
.btn-entrega:hover:not(:disabled) {
  background: #27a93f;
  border-color: #27a93f;
}
.btn-entrega:disabled { opacity: 0.6 }
.btn-entrega:focus { box-shadow: 0 0 0 3px rgba(45,179,74,0.12) }
</style>
