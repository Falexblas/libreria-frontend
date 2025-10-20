<template>
  <form @submit.prevent="handleSubmit" class="px-3">
    <!-- Encabezado -->
    <div class="text-center mb-5">
      <div class="d-inline-flex align-items-center justify-content-center bg-primary text-white p-3 rounded-circle mb-3" style="width: 60px; height: 60px;">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      </div>

      <h2 class="h3 fw-semibold text-primary">
        ¡Regístrate!
      </h2>
      <p class="text-muted small mt-2">
        Completa el formulario para crear tu cuenta
      </p>
    </div>

    <!-- Mensajes -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
    </div>
    <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
      {{ success }}
    </div>

    <!-- Nombre y Apellido -->
    <div class="row mb-3">
      <div class="col-12 col-md-6">
        <label class="form-label fw-medium">
          Nombre <span class="text-danger">*</span>
        </label>
        <input
          v-model="form.nombre"
          placeholder="Tu nombre"
          type="text"
          required
          :disabled="loading"
          class="form-control form-control-lg"
        />
      </div>

      <div class="col-12 col-md-6">
        <label class="form-label fw-medium">
          Apellido <span class="text-danger">*</span>
        </label>
        <input
          v-model="form.apellido"
          placeholder="Tu apellido"
          type="text"
          required
          :disabled="loading"
          class="form-control form-control-lg"
        />
      </div>
    </div>

    <!-- Correo -->
    <div class="mb-3">
      <label class="form-label fw-medium">
        Correo electrónico <span class="text-danger">*</span>
      </label>
      <input
        v-model="form.email"
        placeholder="correo@ejemplo.com"
        type="email"
        required
        :disabled="loading"
        class="form-control form-control-lg"
      />
    </div>

    <!-- Contraseña con visualización -->
    <div class="mb-3">
      <label class="form-label fw-medium">
        Contraseña <span class="text-danger">*</span>
      </label>
      <div class="position-relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="form.password"
          placeholder="Mínimo 6 caracteres"
          required
          :disabled="loading"
          class="form-control form-control-lg"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="btn position-absolute end-0 top-50 translate-middle-y"
          tabindex="-1"
          :disabled="loading"
          style="background: none; border: none; color: #6c757d; padding: 0.375rem 0.75rem;"
        >
          <svg
            v-if="!showPassword"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        </button>
      </div>
      <small class="d-block text-muted mt-1">La contraseña debe tener al menos 6 caracteres</small>
    </div>

    <!-- Teléfono y Ciudad -->
    <div class="row mb-3">
      <div class="col-12 col-md-6">
        <label class="form-label fw-medium">
          Teléfono
        </label>
        <input
          v-model="form.telefono"
          placeholder="999 999 999"
          type="tel"
          :disabled="loading"
          class="form-control form-control-lg"
        />
      </div>

      <div class="col-12 col-md-6">
        <label class="form-label fw-medium">
          Ciudad
        </label>
        <input
          v-model="form.ciudad"
          placeholder="Tu ciudad"
          type="text"
          :disabled="loading"
          class="form-control form-control-lg"
        />
      </div>
    </div>

    <!-- Dirección -->
    <div class="mb-3">
      <label class="form-label fw-medium">
        Dirección
      </label>
      <input
        v-model="form.direccion"
        placeholder="Calle, número, distrito"
        type="text"
        :disabled="loading"
        class="form-control form-control-lg"
      />
    </div>

    <!-- Código Postal -->
    <div class="mb-3">
      <label class="form-label fw-medium">
        Código Postal
      </label>
      <input
        v-model="form.codigoPostal"
        placeholder="15001"
        type="text"
        :disabled="loading"
        class="form-control form-control-lg"
      />
    </div>

    <!-- Botón de envío -->
    <button
      type="submit"
      class="w-100 btn btn-primary btn-lg mt-3"
      :disabled="loading"
    >
      <span v-if="!loading">Crear cuenta</span>
      <span v-else class="d-flex align-items-center justify-content-center gap-2">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Creando cuenta...
      </span>
    </button>

    <!-- Enlace al login -->
    <p class="text-center text-dark small mt-4 pt-3 border-top">
      ¿Ya tienes una cuenta? 
      <router-link to="/login" class="text-primary fw-semibold text-decoration-none">
        Inicia sesión aquí
      </router-link>
    </p>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  telefono: "",
  direccion: "",
  ciudad: "",
  codigoPostal: "",
  rol: { id: 1, nombre: "USER" }
})

const showPassword = ref(false)
const error = ref("")
const success = ref("")
const loading = ref(false)

const validateForm = () => {
  if (!form.nombre || !form.apellido || !form.email || !form.password) {
    error.value = "Por favor completa todos los campos obligatorios"
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    error.value = "Por favor ingresa un correo electrónico válido"
    return false
  }

  if (form.password.length < 6) {
    error.value = "La contraseña debe tener al menos 6 caracteres"
    return false
  }

  return true
}

const handleSubmit = async () => {
  error.value = ""
  success.value = ""

  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const response = await fetch(
      "http://localhost:8080/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    )

    if (response.ok) {
      const data = await response.json()
      if (data && data.token) {
        success.value = "✓ Registro exitoso. Redirigiendo al login..."
        
        // IMPORTANTE: En producción, NO uses localStorage en Claude.ai
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem("token", data.token)
        }
        
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        error.value = "Error en el registro. Por favor intenta nuevamente."
      }
    } else {
      const errorData = await response.json().catch(() => null)
      error.value = errorData?.message || "Error en el servidor. Por favor intenta nuevamente."
    }
  } catch (err) {
    console.error("Error de registro:", err)
    error.value = "Error de conexión con el servidor. Verifica tu conexión."
  } finally {
    loading.value = false
  }
}
</script>