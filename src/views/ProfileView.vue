<template>
  <div class="profile-view py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <!-- Header -->
          <div class="d-flex align-items-center mb-4">
            <div class="icon-circle bg-primary text-white me-3">
              <i class="fas fa-user"></i>
            </div>
            <div>
              <h1 class="h3 mb-0">Mi Perfil</h1>
              <p class="text-muted mb-0">Administra tu información personal</p>
            </div>
          </div>

          <!-- Mensajes -->
          <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>{{ success }}
            <button type="button" class="btn-close" @click="success = ''" aria-label="Close"></button>
          </div>
          <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
            <button type="button" class="btn-close" @click="error = ''" aria-label="Close"></button>
          </div>

          <!-- Formulario -->
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <form @submit.prevent="guardarCambios">
                
                <!-- Sección: Datos de Cuenta -->
                <div class="mb-4">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="fas fa-user-circle me-2 text-primary"></i>
                    Datos de Cuenta
                  </h5>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Nombre <span class="text-danger">*</span></label>
                      <input v-model="perfil.nombre" type="text" class="form-control" required :disabled="loading" />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Apellido</label>
                      <input v-model="perfil.apellido" type="text" class="form-control" :disabled="loading" />
                    </div>
                    <div class="col-md-12">
                      <label class="form-label fw-medium">Email <span class="text-danger">*</span></label>
                      <input v-model="perfil.email" type="email" class="form-control" required disabled />
                      <small class="text-muted">El email no se puede cambiar</small>
                    </div>
                  </div>
                </div>

                <!-- Sección: Información de Contacto -->
                <div class="mb-4">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="fas fa-phone me-2 text-primary"></i>
                    Información de Contacto
                  </h5>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Teléfono</label>
                      <input v-model="perfil.telefono" type="tel" class="form-control" placeholder="999 999 999" :disabled="loading" />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Documento de Identidad</label>
                      <input v-model="perfil.documento" type="text" class="form-control" placeholder="DNI, CE, Pasaporte" :disabled="loading" />
                    </div>
                  </div>
                </div>

                <!-- Sección: Dirección de Envío -->
                <div class="mb-4">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="fas fa-map-marker-alt me-2 text-primary"></i>
                    Dirección de Envío
                  </h5>
                  <div class="row g-3">
                    <div class="col-md-4">
                      <label class="form-label fw-medium">Departamento</label>
                      <select v-model="perfil.departamento" class="form-select" :disabled="loading">
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
                    <div class="col-md-4">
                      <label class="form-label fw-medium">Provincia</label>
                      <input v-model="perfil.provincia" type="text" class="form-control" placeholder="Provincia" :disabled="loading" />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-medium">Distrito</label>
                      <input v-model="perfil.distrito" type="text" class="form-control" placeholder="Distrito" :disabled="loading" />
                    </div>
                    <div class="col-md-8">
                      <label class="form-label fw-medium">Dirección</label>
                      <input v-model="perfil.direccion" type="text" class="form-control" placeholder="Av/Jr/Calle, número, piso, etc." :disabled="loading" />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-medium">Código Postal</label>
                      <input v-model="perfil.codigoPostal" type="text" class="form-control" placeholder="15001" :disabled="loading" />
                    </div>
                    <div class="col-12">
                      <label class="form-label fw-medium">Referencia</label>
                      <input v-model="perfil.referenciaDireccion" type="text" class="form-control" placeholder="Ej: Frente al parque, edificio azul" :disabled="loading" />
                    </div>
                  </div>
                </div>

                <!-- Sección: Notas Adicionales -->
                <div class="mb-4">
                  <h5 class="border-bottom pb-2 mb-3">
                    <i class="fas fa-sticky-note me-2 text-primary"></i>
                    Notas Adicionales
                  </h5>
                  <div class="row g-3">
                    <div class="col-12">
                      <label class="form-label fw-medium">Preferencias de entrega u otras notas</label>
                      <textarea v-model="perfil.notas" class="form-control" rows="3" placeholder="Ej: Llamar antes de entregar, dejar con portería, etc." :disabled="loading"></textarea>
                    </div>
                  </div>
                </div>

                <!-- Botones -->
                <div class="d-flex gap-2 justify-content-end">
                  <button type="button" class="btn btn-outline-secondary" @click="cargarDatos" :disabled="loading">
                    <i class="fas fa-undo me-2"></i>Descartar cambios
                  </button>
                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span v-if="!loading">
                      <i class="fas fa-save me-2"></i>Guardar cambios
                    </span>
                    <span v-else>
                      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Guardando...
                    </span>
                  </button>
                </div>

              </form>
            </div>
          </div>

          <!-- Sección: Cambiar Contraseña -->
          <div class="card shadow-sm mt-4">
            <div class="card-body p-4">
              <h5 class="mb-3">
                <i class="fas fa-lock me-2 text-primary"></i>
                Cambiar Contraseña
              </h5>
              <form @submit.prevent="cambiarPassword">
                <div class="row g-3">
                  <div class="col-md-4">
                    <label class="form-label fw-medium">Contraseña Actual</label>
                    <input v-model="passwordForm.actual" type="password" class="form-control" :disabled="loadingPassword" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-medium">Nueva Contraseña</label>
                    <input v-model="passwordForm.nueva" type="password" class="form-control" :disabled="loadingPassword" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label fw-medium">Confirmar Nueva</label>
                    <input v-model="passwordForm.confirmar" type="password" class="form-control" :disabled="loadingPassword" />
                  </div>
                  <div class="col-12">
                    <button type="submit" class="btn btn-warning" :disabled="loadingPassword">
                      <span v-if="!loadingPassword">
                        <i class="fas fa-key me-2"></i>Cambiar Contraseña
                      </span>
                      <span v-else>
                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Cambiando...
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const perfil = reactive({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  documento: '',
  direccion: '',
  referenciaDireccion: '',
  departamento: '',
  provincia: '',
  distrito: '',
  codigoPostal: '',
  notas: ''
})

const passwordForm = reactive({
  actual: '',
  nueva: '',
  confirmar: ''
})

const loading = ref(false)
const loadingPassword = ref(false)
const error = ref('')
const success = ref('')

// Cargar datos del usuario
const cargarDatos = async () => {
  if (!authStore.isAuthenticated || !authStore.user?.id) {
    error.value = 'No estás autenticado'
    return
  }

  try {
    const response = await fetch(`http://localhost:8080/api/usuarios/${authStore.user.id}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.ok) {
      const usuario = await response.json()
      
      console.log('📋 Usuario recibido del backend:', usuario)
      console.log('📄 Documento:', usuario.documento)
      
      // Rellenar formulario
      perfil.nombre = usuario.nombre || ''
      perfil.apellido = usuario.apellido || ''
      perfil.email = usuario.email || ''
      perfil.telefono = usuario.telefono || ''
      perfil.documento = usuario.documento || ''
      perfil.direccion = usuario.direccion || ''
      perfil.referenciaDireccion = usuario.referenciaDireccion || ''
      perfil.departamento = usuario.departamento || ''
      perfil.provincia = usuario.provincia || ''
      perfil.distrito = usuario.distrito || ''
      perfil.codigoPostal = usuario.codigoPostal || ''
      perfil.notas = usuario.notas || ''
      
      console.log('✅ Datos del perfil cargados')
      console.log('📄 Documento en perfil:', perfil.documento)
    } else {
      error.value = 'Error al cargar los datos del perfil'
    }
  } catch (err) {
    console.error('Error al cargar perfil:', err)
    error.value = 'Error de conexión al cargar el perfil'
  }
}

// Guardar cambios
const guardarCambios = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    // Usar el endpoint de perfil que acepta todos los campos
    const response = await fetch(`http://localhost:8080/api/usuarios/perfil`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        telefono: perfil.telefono,
        documento: perfil.documento,
        direccion: perfil.direccion,
        departamento: perfil.departamento,
        provincia: perfil.provincia,
        distrito: perfil.distrito,
        codigoPostal: perfil.codigoPostal,
        notas: perfil.notas
      })
    })

    if (response.ok) {
      success.value = 'Perfil actualizado correctamente'
      
      // Actualizar el usuario en el store
      const usuarioActualizado = await response.json()
      authStore.updateUser(usuarioActualizado)
      
      // Recargar datos para reflejar cambios
      await cargarDatos()
      
      // Scroll al top para ver el mensaje
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const errorData = await response.json().catch(() => null)
      error.value = errorData?.message || 'Error al actualizar el perfil'
    }
  } catch (err) {
    console.error('Error al guardar:', err)
    error.value = 'Error de conexión al guardar los cambios'
  } finally {
    loading.value = false
  }
}

// Cambiar contraseña
const cambiarPassword = async () => {
  error.value = ''
  success.value = ''

  if (!passwordForm.actual || !passwordForm.nueva || !passwordForm.confirmar) {
    error.value = 'Completa todos los campos de contraseña'
    return
  }

  if (passwordForm.nueva !== passwordForm.confirmar) {
    error.value = 'Las contraseñas nuevas no coinciden'
    return
  }

  if (passwordForm.nueva.length < 6) {
    error.value = 'La nueva contraseña debe tener al menos 6 caracteres'
    return
  }

  loadingPassword.value = true

  try {
    const response = await fetch(`http://localhost:8080/api/usuarios/${authStore.user.id}/cambiar-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        passwordActual: passwordForm.actual,
        passwordNueva: passwordForm.nueva
      })
    })

    if (response.ok) {
      success.value = '✅ Contraseña cambiada correctamente'
      
      // Limpiar formulario
      passwordForm.actual = ''
      passwordForm.nueva = ''
      passwordForm.confirmar = ''
      
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const errorData = await response.json().catch(() => null)
      error.value = errorData?.message || 'Error al cambiar la contraseña. Verifica tu contraseña actual.'
    }
  } catch (err) {
    console.error('Error al cambiar contraseña:', err)
    error.value = 'Error de conexión al cambiar la contraseña'
  } finally {
    loadingPassword.value = false
  }
}

// Cargar datos al montar
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.profile-view {
  min-height: 80vh;
  background: #f8f9fa;
}

.icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.card {
  border: none;
  border-radius: 12px;
}

.form-label {
  font-size: 0.9rem;
  color: #495057;
}

.form-control:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

h5 {
  color: #2c3e50;
  font-weight: 600;
}

.btn {
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
}

.alert {
  border-radius: 8px;
  border: none;
}
</style>
