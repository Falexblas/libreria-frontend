<template>
  <div class="login-container">
    <!-- Animación de fondo -->
    <div class="blob-container">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- Contenedor del formulario -->
    <div class="form-wrapper">
      <LoginForm />
    </div>
  </div>
</template>

<script setup>
import LoginForm from '../components/common/LoginForm.vue'
</script>

<style scoped>
.login-container {
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
  max-width: 500px;
}

/* Responsive */
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