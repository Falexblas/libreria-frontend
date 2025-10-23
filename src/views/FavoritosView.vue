<template>
  <div class="favoritos-view">
    <div class="container py-5">
      <!-- Header -->
      <div class="page-header mb-4">
        <h1 class="h3 fw-bold mb-2">
          <i class="fas fa-heart me-2 text-danger"></i>
          Mi Lista de Deseos
        </h1>
        <p class="text-muted">Tus libros favoritos guardados</p>
      </div>

      <!-- Sin favoritos -->
      <div v-if="favoritosStore.totalFavoritos === 0" class="empty-state text-center py-5">
        <div class="empty-icon mb-3">
          <i class="fas fa-heart fa-4x text-muted"></i>
        </div>
        <h3 class="h5 mb-2">No tienes favoritos aún</h3>
        <p class="text-muted mb-4">Explora nuestra colección y guarda tus libros favoritos</p>
        <router-link to="/libros" class="btn btn-primary">
          <i class="fas fa-book me-2"></i>
          Explorar libros
        </router-link>
      </div>

      <!-- Lista de favoritos -->
      <div v-else>
        <!-- Acciones -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div class="text-muted">
            <i class="fas fa-heart me-2"></i>
            {{ favoritosStore.totalFavoritos }} {{ favoritosStore.totalFavoritos === 1 ? 'libro' : 'libros' }}
          </div>
          <button @click="favoritosStore.limpiarFavoritos()" class="btn btn-outline-danger btn-sm">
            <i class="fas fa-trash me-2"></i>
            Limpiar lista
          </button>
        </div>

        <!-- Grid de libros favoritos -->
        <div class="row g-4">
          <div v-for="favorito in favoritosStore.favoritos" :key="favorito.id" class="col-6 col-md-4 col-lg-3">
            <LibroCard :libro="favorito.libro" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFavoritosStore } from '@/stores/favoritos'
import LibroCard from '@/components/libros/LibroCard.vue'

const favoritosStore = useFavoritosStore()
</script>

<style scoped>
.favoritos-view {
  min-height: 80vh;
  background-color: #f8f9fa;
}

.page-header {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.empty-state {
  background: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.empty-icon {
  opacity: 0.3;
}

@media (max-width: 768px) {
  .page-header {
    padding: 1.5rem;
  }
}
</style>
