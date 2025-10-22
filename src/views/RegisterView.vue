<template>
  <div class="register-container">
    <!-- Animación de fondo -->
    <div class="blob-container">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- Contenedor del formulario -->
    <div class="form-wrapper">
      <div class="card border-info shadow-lg">
        <div class="card-body p-5 p-md-6">
          <!-- Formulario -->
          <RegisterForm />
        </div>
      </div>

      <!-- Link adicional al home -->
      <div class="text-center mt-4">
        <router-link 
          to="/" 
          class="text-white text-decoration-none small d-flex align-items-center justify-content-center gap-2 hover-link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import RegisterForm from '../components/common/RegisterForm.vue'
</script>

<style scoped>
.register-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #001a4d 0%, #003d7a 50%, #0052a3 100%);
  padding: 1rem;
  overflow: hidden;
}

/* Contenedor de blobs */
.blob-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

/* Estilos de blobs */
.blob {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: multiply;
  filter: blur(80px);
  opacity: 0.2;
  animation: blob 7s infinite;
}

.blob-1 {
  top: 80px;
  left: 80px;
  width: 288px;
  height: 288px;
  background-color: #60a5fa;
}

.blob-2 {
  top: 160px;
  right: 80px;
  width: 288px;
  height: 288px;
  background-color: #3b82f6;
  animation-delay: 2s;
}

.blob-3 {
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 288px;
  height: 288px;
  background-color: #1e40af;
  animation-delay: 4s;
}

/* Animación de los blobs */
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* Wrapper del formulario */
.form-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 550px;
}

/* Card personalizada */
.card {
  border-color: #e0f2ff !important;
  border-radius: 1rem;
}

.card-body {
  padding: 2rem;
}

/* Hover link */
.hover-link {
  transition: text-decoration 0.3s ease;
}

.hover-link:hover {
  text-decoration: underline !important;
}

/* Padding responsivo */
@media (min-width: 768px) {
  .card-body {
    padding: 3rem;
  }
}

/* Responsive de blobs */
@media (max-width: 576px) {
  .blob {
    width: 200px !important;
    height: 200px !important;
    filter: blur(60px);
  }

  .blob-1 {
    top: 40px;
    left: 40px;
  }

  .blob-2 {
    top: 80px;
    right: 40px;
  }

  .blob-3 {
    bottom: 40px;
  }
}
</style>