<template>
  <form
    @submit.prevent="handleSubmit"
    class="container d-flex justify-content-center align-items-center min-vh-100"
  >
    <div class="card shadow-lg border-info" style="max-width: 500px; width: 100%;">
      <div class="card-body p-5">
        <!-- Ícono superior -->
        <div class="text-center mb-4">
          <div class="bg-primary rounded-circle p-3 d-inline-flex mb-3" style="width: 60px; height: 60px; align-items: center; justify-content: center;">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="text-white"
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4h16v13H6.5A2.5 2.5 0 004 19.5V4z"
              />
            </svg>
          </div>
          <h2 class="h3 fw-semibold text-dark">
            Iniciar sesión
          </h2>
          <p class="text-muted small">
            Ingresa tus datos para acceder a tu cuenta
          </p>
        </div>

        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          {{ error }}
        </div>
        <div v-if="success" class="alert alert-success alert-dismissible fade show" role="alert">
          {{ success }}
        </div>

        <div class="mb-3">
          <label for="email" class="form-label fw-medium">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control form-control-lg"
            placeholder="Ingresa tu correo electrónico"
            required
            :disabled="loading"
            @input="convertirEmailAMinusculas"
          />
        </div>

        <div class="mb-4">
          <label for="password" class="form-label fw-medium">
            Contraseña
          </label>
          <div class="position-relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              class="form-control form-control-lg"
              placeholder="Ingresa tu contraseña"
              required
              :disabled="loading"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="btn btn-link position-absolute end-0 top-50 translate-middle-y"
              tabindex="-1"
              style="text-decoration: none; color: #6c757d; border: none; background: none;"
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
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
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
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-lg w-100"
          :disabled="loading"
        >
          <span v-if="!loading">Iniciar sesión</span>
          <span v-else class="d-flex align-items-center justify-content-center gap-2">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Iniciando sesión...
          </span>
        </button>

        <p class="text-center mt-4 text-muted small">
          ¿No tienes una cuenta? 
          <router-link to="/register" class="text-primary fw-semibold text-decoration-none">
            ¡Regístrate aquí!
          </router-link>
        </p>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref("")
const password = ref("")
const showPassword = ref(false)
const error = ref("")
const success = ref("")
const loading = ref(false)

// Función para convertir email a minúsculas mientras se escribe
const convertirEmailAMinusculas = (event) => {
  email.value = event.target.value.toLowerCase()
}

const handleSubmit = async () => {
  error.value = ""
  success.value = ""
  
  // Validación básica
  if (!email.value || !password.value) {
    error.value = "Todos los campos son obligatorios"
    return
  }

  // Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = "Por favor ingresa un correo electrónico válido"
    return
  }

  loading.value = true

  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      }),
    })

    if (response.ok) {
      const data = await response.json()
      
      if (data && data.token && data.user) {
        success.value = "✓ Login exitoso"
        
        // Guardar en el store de Pinia (que también guarda en localStorage)
        authStore.login(data.user, data.token)
        
        // Redirigir según el rol del usuario
        setTimeout(() => {
          const rol = data.user.rol?.nombre || data.user.rol
          const isAdmin = rol === 'ADMIN'
          const isEmpleado = rol === 'EMPLEADO'

          if (isAdmin) {
            router.push('/admin')
          } else if (isEmpleado) {
            router.push('/empleado')
          } else {
            router.push('/')
          }
        }, 1500)
      } else {
        error.value = "Usuario o contraseña incorrectos"
      }
    } else {
      const errorData = await response.json().catch(() => null)
      error.value = errorData?.message || "Usuario o contraseña incorrectos"
    }
  } catch (err) {
    console.error("Error de login:", err)
    error.value = "Error de conexión con el servidor. Por favor, intenta nuevamente."
  } finally {
    loading.value = false
  }
}
</script>