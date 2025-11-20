<script setup>
// Importar componentes necesarios para la página principal
import HeroSlider from '@/components/home/HeroSlider.vue'
import SwiperCarouselDestacados from '@/components/SwiperCarouselDestacados.vue';
import SwiperCarouselFiccion from '@/components/SwiperCarouselFiccion.vue';
import SwiperCarouselMisterio from '@/components/SwiperCarouselMisterio.vue';
import SwiperCarouselNovedades from '@/components/SwiperCarouselNovedades.vue';
import SwiperCarouselRomance from '@/components/SwiperCarouselRomance.vue';
</script>

<template>
  <main class="home-main">
    <!-- Hero Slider -->
    <section class="hero-section">
      <HeroSlider />
    </section>

    <!-- Contenido adicional -->
    <section class="content-section">
      <div class="container">
        <div class="welcome-content">
          <h1 class="main-title">📚 Bienvenido a LibreríaOnline</h1>
          <p class="main-description">
            Descubre un mundo infinito de conocimiento y entretenimiento. 
            Tenemos la colección más amplia de libros para todos los gustos y edades.
          </p>
        </div>
      </div>
    </section>

    <!-- CARRUSELES SIN CONTAINERS -->
    <SwiperCarouselDestacados/>
    
    <SwiperCarouselNovedades/>
    
    <SwiperCarouselFiccion/>

    <!-- Banner Romance -->
    <section class="romance-banner-section">
      <div class="romance-banner">
        <img 
          src="https://iberoperu.vtexassets.com/assets/vtex.file-manager-graphql/images/6e857258-ef25-48c3-b3b6-041208d16cf9___a7c9857bf7f3af80395fb89d6a3c4fc3.png" 
          alt="Romance sin pausa - Emily Henry & Ali Hazelwood" 
          class="banner-image"
        />
      </div>
    </section>

    <!-- Carrusel Romance -->
    <SwiperCarouselRomance/>

    <!-- Banner Misterio -->
    <section class="misterio-banner-section">
      <div class="misterio-banner">
        <img 
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5XLHr-23pcnAOyuVyO8N4w9siUoVugu9-XjeAC55D2VzP75wTfvhRlepi4DFMtBd4zhBFU5wb_9j0Tsbrn1VHkzmDg-l7pHOm5Y92skjrP3vvP5YTPcWN--VS2OfcuTF7YpHRaXv3zUjiN3TtPZfDQyznwydnuwdc6W-HivOOHY2HgWXcX9bhFXiOww/w680/coleccion-grandes-novelas-de-crimen-y-misterio-salvat-argentina.png" 
          alt="misterio sin limites - Agatha Christie & Arthur Conan Doyle" 
          class="banner-image"
        />
      </div>
    </section>

    <!-- Carrusel Misterio -->
    <SwiperCarouselMisterio/>

    <!-- Sección de características -->
    <section class="features-section">
      <div class="container">
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3>Envío a todo el Perú</h3>
            <p>Recibimos tus productos a tu casa</p>
          </div>

          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <h3>Compra Segura</h3>
            <p>Tus compras con 100% protegidas</p>
          </div>

          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>Equipo Especializado</h3>
            <p>Te ayudamos en lo que necesitas</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home-main {
  background: var(--color-background);
  min-height: 100vh;
}

.hero-section {
  padding: 0;
  margin: 0;
  width: 100%;
}

.content-section {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.welcome-content {
  text-align: center;
  margin-bottom: 3rem;
}

.main-title {
  color: var(--color-secondary);
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.main-description {
  color: var(--color-text);
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2rem;
  text-align: center;
}

/* ========================================
   BANNER ROMANCE - ANCHO COMPLETO
   ======================================== */
.romance-banner-section {
  width: 100%;
  padding: 2rem 0;
  margin: 0;
}

.romance-banner {
  width: 100%;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}


.romance-banner .banner-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

/* ========================================
   BANNER MISTERIO - ANCHO COMPLETO
   ======================================== */
.misterio-banner-section {
  width: 100%;
  padding: 2rem 0;
  margin: 0;
}

.misterio-banner {
  width: 100%;
  height: 300px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}


.misterio-banner .banner-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

/* ========================================
   SECCIÓN DE CARACTERÍSTICAS
   ======================================== */
.features-section {
  background: #2c3e50;        
  padding: 1.5rem 0;        
  margin-top: 2rem;
  width: 100%;
}

.features-grid {
  display: grid;                         
  grid-template-columns: repeat(3, 1fr); 
  gap: 2rem;                             
}

.feature-item {
  text-align: center;        
  color: white;              
}

.feature-icon {
  width: 45px;                           
  height: 45px;                          
  background: rgba(255, 255, 255, 0.1);  
  border-radius: 50%;                  
  display: flex;                       
  align-items: center;                  
  justify-content: center;              
  margin: 0 auto 0.75rem;                
}

.feature-icon svg {
  color: white;               
  width: 24px;             
  height: 24px;              
}

.feature-item h3 {
  font-size: 1rem;            
  font-weight: bold;       
  margin-bottom: 0.25rem;    
  color: white;               
}

.feature-item p {
  font-size: 0.85rem;             
  color: rgba(255, 255, 255, 0.8); 
  margin: 0;                       
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .hero-section {
    padding: 1rem 0 0 0;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .main-description {
    font-size: 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .romance-banner-section {
    padding: 1rem 0;
  }

  .misterio-banner-section {
    padding: 1rem 0;
  }

  .misterio-banner {
    height: 200px;
  }
}
</style>