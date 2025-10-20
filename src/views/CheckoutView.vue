<template>
  <div class="checkout-page container py-4">
    <!-- Stepper -->
    <div class="mb-4">
      <div class="stepper d-flex align-items-center justify-content-between">
    <div class="step d-flex flex-column align-items-center" :class="{ active: step === 1, completed: step > 1 }">
          <div class="step-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.44C8.89 16.37 9.5 18 11 18h8v-2h-7.42c-.14 0-.25-.11-.25-.25l.03-.12L13.1 13h4.45c.75 0 1.41-.41 1.75-1.03L21.82 6H6.21" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="step-label small mt-2 text-muted">Carrito</div>
        </div>

        <div class="step-line flex-grow-1 mx-3">
          <div class="line-inner" :class="{ filled: step > 1 }"></div>
        </div>

  <div class="step d-flex flex-column align-items-center" :class="{ active: step === 2, completed: step > 2 }">
          <div class="step-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM4 20c0-3.31 4.03-6 8-6s8 2.69 8 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="step-label small mt-2 text-muted">Datos</div>
        </div>

        <div class="step-line flex-grow-1 mx-3">
          <div class="line-inner" :class="{ filled: step > 2 }"></div>
        </div>

  <div class="step d-flex flex-column align-items-center" :class="{ active: step === 3, completed: step > 3 }">
          <div class="step-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18v13H3zM16 3l3 4H5l3-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="step-label small mt-2 text-muted">Entrega</div>
        </div>

        <div class="step-line flex-grow-1 mx-3">
          <div class="line-inner" :class="{ filled: step > 3 }"></div>
        </div>

  <div class="step d-flex flex-column align-items-center" :class="{ active: step === 4 }">
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
              <div>S/8.00</div>
            </div>

            <div class="d-flex justify-content-between fw-bold fs-5 border-top pt-2">
              <div>Total</div>
              <div>S/{{ (carritoStore.subtotal + 8).toFixed(2) }}</div>
            </div>

            <button class="btn btn-success w-100 mt-4 py-3 btn-pagar" :disabled="carritoStore.items.length === 0" @click="finalizarCompra">PAGAR AHORA</button>
          </div>
        </div>
      </template>

      <template v-else-if="step === 2">
        <!-- Left: formulario Datos (igual diseño a la primera imagen) -->
        <div class="col-lg-8">
          <div class="checkout-card p-4 rounded shadow-sm">
            <div class="d-flex align-items-start mb-3">
              <div class="step-badge me-3">2</div>
              <div>
                <h5 class="mb-1">Identificación</h5>
                <p class="text-muted small mb-0">Solicitamos únicamente la información esencial para la finalización de la compra.</p>
              </div>
            </div>

            <form class="mt-3">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Correo</label>
                  <input type="email" v-model="datos.correo" class="form-control" placeholder="correo@ejemplo.com" />
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Nombre</label>
                  <input type="text" v-model="datos.nombre" class="form-control" placeholder="Nombre" />
                </div>
 

                <div class="col-12 col-md-6">
                  <label class="form-label">Apellidos</label>
                  <input type="text" v-model="datos.apellidos" class="form-control" placeholder="Apellidos" />
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Documento de identidad</label>
                  <input type="text" v-model="datos.documento" class="form-control" placeholder="Número de documento" />
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label">Teléfono / Móvil</label>
                  <input type="tel" v-model="datos.telefono" class="form-control" placeholder="999 999 999" />
                </div>
              </div>

              <div class="d-flex gap-2 mt-4">
                <button type="button" class="btn btn-outline-secondary" @click="regresarPaso">Regresar</button>
                <button type="button" class="btn btn-entrega" @click="avanzarPaso">IR A DATOS DE ENTREGA</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Right: resumen con estilo 'PEDIDO' similar a la segunda imagen -->
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

            <!-- cupón removido según solicitud -->

            <div class="mt-2">
              <!-- Nota solo en Entrega: se muestra en ese paso -->
              <div class="d-flex justify-content-between small text-muted mb-1">
                <div>Subtotal</div>
                <div>S/{{ carritoStore.subtotal.toFixed(2) }}</div>
              </div>
              <div class="d-flex justify-content-between small text-muted mb-2">
                <div>Envío</div>
                <div>S/8.00</div>
              </div>

              <div class="border-top pt-2 mt-2 d-flex justify-content-between align-items-center">
                <div class="fw-bold">Total</div>
                <div class="fw-bold text-primary">S/{{ (carritoStore.subtotal + 8).toFixed(2) }}</div>
              </div>
            </div>

            <div class="mt-3 btn-volver-row">
              <button class="btn btn-outline-primary w-100 btn-volver" @click.prevent="regresarPaso">
                <i class="fas fa-arrow-left me-2" aria-hidden="true"></i>
                Volver al carrito
              </button>
            </div>
          </aside>
        </div>
      </template>
      <template v-else-if="step === 3">
        <!-- Entrega: formulario con layout similar a la imagen (sin pestañas) y resumen a la derecha -->
        <div class="col-lg-8">
          <div class="checkout-card p-4 rounded shadow-sm">
            <div class="d-flex align-items-start mb-3">
              <div class="step-badge me-3">3</div>
              <div>
                <h5 class="mb-1">Envío</h5>
                <p class="text-muted small mb-0">Complete su dirección de entrega</p>
              </div>
            </div>

            <form class="mt-3">
              <div class="row g-3">
                <div class="col-12">
                  <div class="row g-2">
                    <div class="col-12 col-md-4">
                      <label class="form-label">Departamento</label>
                      <select v-model="entrega.departamento" class="form-select">
                        <option value="">Seleccione</option>
                        <option>Amazonas</option>
                        <option>Áncash</option>
                        <option>Apurímac</option>
                        <option>Arequipa</option>
                        <option>Ayacucho</option>
                        <option>Cajamarca</option>
                        <option>El Callao</option>
                        <option>Cusco</option>
                        <option>Huancavelica</option>
                        <option>Huánuco</option>
                        <option>Ica</option>
                        <option>Junín</option>
                        <option>La Libertad</option>
                        <option>Lambayeque</option>
                        <option>Lima</option>
                        <option>Loreto</option>
                        <option>Madre de Dios</option>
                        <option>Moquegua</option>
                        <option>Pasco</option>
                        <option>Piura</option>
                        <option>Puno</option>
                        <option>San Martín</option>
                        <option>Tacna</option>
                        <option>Tumbes</option>
                        <option>Ucayali</option>
                      </select>
                    </div>

                    <div class="col-12 col-md-4">
                      <label class="form-label">Provincia</label>
                      <input type="text" v-model="entrega.provincia" class="form-control" placeholder="Provincia" />
                    </div>

                    <div class="col-12 col-md-4">
                      <label class="form-label">Distrito</label>
                      <input type="text" v-model="entrega.distrito" class="form-control" placeholder="Distrito" />
                    </div>
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label">Dirección</label>
                  <input type="text" v-model="entrega.direccion" class="form-control" placeholder="Dirección" />
                </div>

                <div class="col-12">
                  <div class="row g-2">
                    <div class="col-12 col-md-6">
                      <label class="form-label">Referencia</label>
                      <input type="text" v-model="entrega.referencia" class="form-control" placeholder="Referencia (ej.: apto. 201)" />
                    </div>
                    <div class="col-12 col-md-6">
                      <label class="form-label">Código postal</label>
                      <input type="text" v-model="entrega.codigoPostal" class="form-control" placeholder="Código postal" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="d-flex gap-2 mt-4">
                <button type="button" class="btn btn-outline-secondary" @click="regresarPaso">Regresar</button>
                <button type="button" class="btn btn-entrega" @click="avanzarPaso">IR A DATOS DE PAGO</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Right: resumen igual que en Datos -->
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
              <div class="mb-3">
                <label class="form-label small text-muted">Agrega una nota a tu pedido</label>
                <textarea v-model="entrega.nota" class="form-control order-note" rows="3" placeholder=""></textarea>
              </div>
              <div class="d-flex justify-content-between small text-muted mb-1">
                <div>Subtotal</div>
                <div>S/{{ carritoStore.subtotal.toFixed(2) }}</div>
              </div>
              <div class="d-flex justify-content-between small text-muted mb-2">
                <div>Envío</div>
                <div>S/8.00</div>
              </div>

              <div class="border-top pt-2 mt-2 d-flex justify-content-between align-items-center">
                <div class="fw-bold">Total</div>
                <div class="fw-bold text-primary">S/{{ (carritoStore.subtotal + 8).toFixed(2) }}</div>
              </div>
            </div>

            <div class="mt-3 btn-volver-row">
              <button class="btn btn-outline-primary w-100 btn-volver" @click.prevent="regresarPaso">
                <i class="fas fa-arrow-left me-2" aria-hidden="true"></i>
                Volver al carrito
              </button>
            </div>
          </aside>
        </div>
      </template>

      <template v-else-if="step === 4">
        <!-- Pago: formulario con selección de método (Tarjeta / Código Yape) -->
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
                <input class="form-control" placeholder="Número de tarjeta" v-model="card.number" />
              </div>

              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label">Caducidad</label>
                  <input class="form-control" placeholder="MM/AA" v-model="card.expiry" />
                </div>
                <div class="col-6">
                  <label class="form-label">CVV</label>
                  <input class="form-control" placeholder="CVV" v-model="card.cvv" />
                </div>
              </div>

              <div class="row g-2 mb-3">
                <div class="col-6">
                  <label class="form-label">Nombres</label>
                  <input class="form-control" placeholder="Nombres" v-model="card.firstName" />
                </div>
                <div class="col-6">
                  <label class="form-label">Apellidos</label>
                  <input class="form-control" placeholder="Apellidos" v-model="card.lastName" />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Correo electrónico</label>
                <input class="form-control" placeholder="Correo electrónico" v-model="card.email" />
              </div>

              <div class="d-grid">
                <button class="btn btn-primary py-3">Pagar S/{{ (carritoStore.subtotal + 8).toFixed(2) }}</button>
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
                          <!-- info icon -->
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
                <input class="form-control" placeholder="999 999 999" v-model="yape.phone" />
              </div>

              <div class="mb-3">
                <label class="form-label">Código de aprobación</label>
                <div class="d-flex gap-2 code-inputs">
                  <input v-for="(d, i) in yape.code" :key="i" type="text" maxlength="1" class="form-control code-digit text-center" v-model="yape.code[i]" />
                </div>
              </div>

              <div class="d-grid">
                <button :class="['btn py-3', isYapeComplete ? 'btn-yape-ready' : 'btn-secondary']" :disabled="!isYapeComplete">Pagar S/{{ (carritoStore.subtotal + 8).toFixed(2) }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: resumen igual que en Entrega -->
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
                <div>S/8.00</div>
              </div>

              <div class="border-top pt-2 mt-2 d-flex justify-content-between align-items-center">
                <div class="fw-bold">Total</div>
                <div class="fw-bold text-primary">S/{{ (carritoStore.subtotal + 8).toFixed(2) }}</div>
              </div>
            </div>

            <div class="mt-3 btn-volver-row">
              <button class="btn btn-outline-primary w-100 btn-volver" @click.prevent="regresarPaso">
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
import { ref, reactive, computed } from 'vue'
import { useCarritoStore } from '@/stores/carrito'
import LogoYape from '@/assets/LogoYape.webp'

const carritoStore = useCarritoStore()

// Estado del paso actual: 1=Carrito,2=Datos,3=Entrega,4=Pago
const step = ref(1)

const entrega = reactive({ direccion: '', referencia: '', codigoPostal: '', pais: 'Perú', departamento: '', provincia: '', distrito: '', nota: '' })

// Payment state
const paymentMethod = ref('card')
const card = reactive({ number: '', expiry: '', cvv: '', firstName: '', lastName: '', email: '' })
const yape = reactive({ phone: '', code: ['', '', '', '', '', ''] })

// Computed: true cuando el teléfono y los 6 dígitos del código están rellenados
const isYapeComplete = computed(() => {
  const phoneOk = yape.phone && String(yape.phone).trim().length > 0
  const codeOk = Array.isArray(yape.code) && yape.code.length === 6 && yape.code.every(c => c && String(c).trim().length === 1)
  return phoneOk && codeOk
})

// Datos del usuario (sin validaciones aquí, el backend los manejará)
const datos = reactive({ correo: '', nombre: '', apellidos: '', documento: '', telefono: '' })

function finalizarCompra() {
  // Avanzar al paso de Datos dentro de la misma vista
  if (carritoStore.items.length === 0) return
  step.value = 2
}

function avanzarPaso() {
  if (step.value < 4) step.value++
}

function regresarPaso() {
  if (step.value > 1) step.value--
}

function aumentarCantidad(id) { carritoStore.aumentarCantidad(id) }
function disminuirCantidad(id) { carritoStore.disminuirCantidad(id) }
function eliminar(id) { carritoStore.eliminarItem(id) }

function obtenerNombreAutor(autor) {
  if (!autor) return 'Autor desconocido'
  if (typeof autor === 'string') return autor
  if (autor && typeof autor === 'object') {
    if (autor.nombre && autor.apellido) return `${autor.nombre} ${autor.apellido}`
    if (autor.nombre) return autor.nombre
  }
  return 'Autor desconocido'
}
</script>

<style scoped>
.stepper { gap: 0.5rem; }
.step { color: #9aa3ab; }
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
