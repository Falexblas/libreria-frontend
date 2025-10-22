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
            <div class="libro-card h-100">
              <!-- Imagen -->
              <div class="libro-imagen position-relative">
                <router-link :to="`/libro/${favorito.libro.id}`">
                  <img 
                    :src="favorito.libro.portadaUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop'" 
                    :alt="favorito.libro.titulo"
                    class="w-100"
                  >
                </router-link>
                
                <!-- Botón eliminar favorito -->
                <button 
                  @click="favoritosStore.eliminarFavorito(favorito.libro.id)"
                  class="btn-favorito-eliminar"
                  title="Eliminar de favoritos"
                >
                  <i class="fas fa-heart"></i>
                </button>
              </div>

              <!-- Información -->
              <div class="libro-info p-3">
                <router-link :to="`/libro/${favorito.libro.id}`" class="text-decoration-none">
                  <h5 class="libro-titulo mb-2">{{ favorito.libro.titulo }}</h5>
                </router-link>
                <p class="libro-autor text-muted small mb-2">
                  {{ obtenerNombreAutor(favorito.libro.autor) }}
                </p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="libro-precio fw-bold text-primary">
                    S/{{ favorito.libro.precio.toFixed(2) }}
                  </span>
                  <button 
                    @click="agregarAlCarrito(favorito.libro)"
                    class="btn btn-sm btn-primary"
                    title="Agregar al carrito"
                  >
                    <i class="fas fa-shopping-cart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFavoritosStore } from '@/stores/favoritos'
import { useCarritoStore } from '@/stores/carrito'
import Swal from 'sweetalert2'

const favoritosStore = useFavoritosStore()
const carritoStore = useCarritoStore()

function obtenerNombreAutor(autor) {
  if (typeof autor === 'string') return autor
  if (autor && typeof autor === 'object') {
    if (autor.nombre && autor.apellido) return `${autor.nombre} ${autor.apellido}`
    if (autor.nombre) return autor.nombre
  }
  return 'Autor desconocido'
}

function agregarAlCarrito(libro) {
  carritoStore.agregarAlCarrito(libro)
  
  Swal.fire({
    icon: 'success',
    title: '¡Agregado al carrito!',
    text: `"${libro.titulo}" fue agregado al carrito`,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  })
}
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

.libro-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.libro-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.libro-imagen {
  overflow: hidden;
  aspect-ratio: 3/4;
}

.libro-imagen img {
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.libro-card:hover .libro-imagen img {
  transform: scale(1.05);
}

.btn-favorito-eliminar {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: #dc3545;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.btn-favorito-eliminar:hover {
  background: #dc3545;
  color: white;
  transform: scale(1.1);
}

.libro-titulo {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c3e50;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.libro-autor {
  font-size: 0.85rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.libro-precio {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .page-header {
    padding: 1.5rem;
  }
  
  .libro-titulo {
    font-size: 0.9rem;
  }
}
</style>
