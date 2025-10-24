<template>
  <div class="hero-slider-container">
    <swiper
      :slidesPerView="1"
      :spaceBetween="0"
      :loop="true"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      :pagination="{
        clickable: true,
      }"
      :navigation="true"
      :modules="modules"
      class="hero-swiper"
    >
      <!-- Slide 1: Ficción -->
      <swiper-slide>
        <div class="slide-content slide-ficcion">
          <img src="@/assets/sliderficcion.avif" alt="Libros de Ficción" class="slide-image">
          <div class="slide-overlay"></div>
          <div class="slide-text">
            <h1 class="slide-title"> Ficción</h1>
            <p class="slide-description">
              Sumérgete en mundos imaginarios llenos de aventuras, 
              romance y misterio. Descubre las mejores historias de ficción.
            </p>
            <router-link to="/libros/categoria/ficcion" class="slide-btn">
              Explorar Ficción
            </router-link>
          </div>
        </div>
      </swiper-slide>

      <!-- Slide 2: Romance -->
      <swiper-slide>
        <div class="slide-content slide-romance">
          <img src="@/assets/sliderRomance.webp" alt="Libros de Romance" class="slide-image">
          <div class="slide-overlay"></div>
          <div class="slide-text">
            <h1 class="slide-title">Romance</h1>
            <p class="slide-description">
              Historias de amor que te harán suspirar. 
              Encuentra tu próxima lectura romántica favorita.
            </p>
            <router-link to="/libros/categoria/romance" class="slide-btn">
              Ver Romance
            </router-link>
          </div>
        </div>
      </swiper-slide>

      <!-- Slide 3: Misterio -->
      <swiper-slide>
        <div class="slide-content slide-misterio">
          <img src="@/assets/sliderMisterio.jpg" alt="Libros de Misterio" class="slide-image">
          <div class="slide-overlay"></div>
          <div class="slide-text">
            <h1 class="slide-title">Misterio</h1>
            <p class="slide-description">
              Resuelve enigmas y descubre secretos ocultos. 
              Los mejores thrillers y novelas de misterio te esperan.
            </p>
            <router-link to="/libros/categoria/misterio" class="slide-btn">
              Descubrir Misterios
            </router-link>
          </div>
        </div>
      </swiper-slide>

      <!-- Slide 4: Fantasía -->
      <swiper-slide>
        <div class="slide-content slide-fantasia">
          <img src="@/assets/SliderFantasia.webp" alt="Libros de Fantasía" class="slide-image">
          <div class="slide-overlay"></div>
          <div class="slide-text">
            <h1 class="slide-title">Fantasía</h1>
            <p class="slide-description">
              Mundos mágicos, criaturas fantásticas y aventuras épicas. 
              Deja volar tu imaginación con nuestros libros de fantasía.
            </p>
            <router-link to="/libros/categoria/fantasia" class="slide-btn">
              Entrar al Reino
            </router-link>
          </div>
        </div>
      </swiper-slide>

      <!-- Slide 5: No Ficción -->
      <swiper-slide>
        <div class="slide-content slide-no-ficcion">
          <img src="@/assets/sliderNoFiccion.avif" alt="Libros de No Ficción" class="slide-image">
          <div class="slide-overlay"></div>
          <div class="slide-text">
            <h1 class="slide-title">No Ficción</h1>
            <p class="slide-description">
              Aprende algo nuevo cada día. Biografías, historia, ciencia 
              y desarrollo personal te esperan.
            </p>
            <router-link to="/libros/categoria/no-ficcion" class="slide-btn">
              Aprender Más
            </router-link>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// Import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules'

// Setup modules
const modules = [Pagination, Navigation, Autoplay]
</script>

<style scoped>
.hero-slider-container {
  width: 100%;
  height: 500px; /* ALTURA REDUCIDA - Cambia este valor según necesites */
  margin: 0;
  padding: 0;
  position: relative;
}

/* 
OPCIONES DE ALTURA:
- 400px: Muy compacto
- 500px: Moderado (recomendado)
- 600px: Equilibrado
- 70vh: 70% de la altura de la pantalla
*/

.hero-swiper {
  width: 100%;
  height: 100%;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
}

.slide-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  overflow: hidden;
}

.slide-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.slide-text {
  position: relative;
  z-index: 2;
  max-width: 600px;
  padding: 2rem;
}

.slide-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--color-background);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.slide-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
  color: var(--color-background);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.slide-btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--color-primary);
  color: var(--color-background);
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(139, 111, 71, 0.3);
}

.slide-btn:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 111, 71, 0.4);
  color: var(--color-background);
  text-decoration: none;
}

/* Estilos personalizados para Swiper */
:deep(.swiper-pagination-bullet) {
  background: var(--color-accent);
  opacity: 0.7;
  width: 12px;
  height: 12px;
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--color-background);
  opacity: 1;
  transform: scale(1.2);
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: var(--color-background);
  background: rgba(245, 240, 230, 0.2);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-top: -25px;
  transition: all 0.3s ease;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: var(--color-accent);
  color: var(--color-text);
}

:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  font-size: 20px;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-slider-container {
    height: 350px; /* Altura reducida en tablets */
  }
  
  .slide-title {
    font-size: 2rem;
  }
  
  .slide-description {
    font-size: 1rem;
  }
  
  .slide-text {
    padding: 1rem;
  }
  
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    width: 40px;
    height: 40px;
    margin-top: -20px;
  }
}

@media (max-width: 480px) {
  .hero-slider-container {
    height: 300px; /* Altura reducida en móviles */
  }
  
  .slide-title {
    font-size: 1.5rem;
  }
  
  .slide-btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>