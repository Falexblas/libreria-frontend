<script setup>
import { computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Autoplay } from 'swiper/modules'
import { useLibrosStore } from '@/stores/libros'

import 'swiper/css'
import 'swiper/css/navigation'
import './SwiperCarousel.css'

const librosStore = useLibrosStore()

// Filtrar solo libros destacados
const libros = computed(() => {
  return librosStore.todosLosLibros.filter(libro => libro.destacado === true)
})
const cargando = computed(() => librosStore.cargando)
const error = computed(() => librosStore.error)

// Cargar libros solo si no están en caché
onMounted(async () => {
  if (!librosStore.cargaInicial) {
    await librosStore.cargarTodosLosLibros()
  }
})

const modules = [Navigation, Autoplay]
</script>

<template>
  <div class="carousel-section">
    <div class="section-header">
      <div class="header-left">
        <span class="icon-star">★</span>
        <h2 class="section-title">Destacados</h2>
      </div>
      <router-link to="/libros" class="ver-mas-link">
        Ver más ›
      </router-link>
    </div>

    <div v-if="cargando" class="estado-mensaje">
      <div class="spinner"></div>
    </div>
    
   <div v-else-if="error" class="estado-mensaje">
  <p>❌ Error al cargar los libros</p>
  <button @click="librosStore.cargarTodosLosLibros()" class="btn-retry">Reintentar</button>
</div>
    <div v-else-if="libros.length === 0" class="estado-mensaje">
      <p>No hay libros disponibles</p>
    </div>
    
    <div v-else class="carousel-wrapper">
      <swiper
        :modules="modules"
        :slides-per-view="2"
        :space-between="20"
        :navigation="{
          prevEl: '.custom-prev',
          nextEl: '.custom-next',
        }"
         :loop="true"
         :autoplay="{ delay: 3000, disableOnInteraction: false }"
        :breakpoints="{
          640: { slidesPerView: 3, spaceBetween: 20 },
          768: { slidesPerView: 4, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 20 },
          1280: { slidesPerView: 6, spaceBetween: 20 },
        }"
        class="libros-swiper"
      >
        <swiper-slide v-for="libro in libros" :key="libro.id">
          <div class="libro-card">
            <div class="libro-image-wrapper">
              <img :src="libro.portadaUrl" :alt="libro.titulo" class="libro-image" />
              <div v-if="libro.descuento > 0" class="badge-descuento">
                -{{ libro.descuento }}%
              </div>
              <div v-if="libro.nuevo" class="badge-nuevo">
                Novedades
              </div>
            </div>
            
            <div class="libro-info">
              <h3 class="libro-titulo">{{ libro.titulo }}</h3>
              <p class="libro-autor">{{ libro.autor?.nombre }} {{ libro.autor?.apellido }}</p>
              
              <div class="libro-precios">
                <span class="precio-actual">S/ {{ libro.precio.toFixed(2) }}</span>
                <span v-if="libro.descuento > 0" class="precio-original">S/ {{ (libro.precio / (1 - libro.descuento / 100)).toFixed(2) }}</span>
                <span v-if="libro.descuento > 0" class="badge-porcentaje">-{{ libro.descuento }}%</span>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>

      <button class="custom-prev nav-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button class="custom-next nav-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>
