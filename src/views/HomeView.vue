<script setup>
// Importar componentes necesarios para la página principal
import HeroSlider from '@/components/home/HeroSlider.vue'
</script>

<template>
  <main class="home-main">
    <!-- Hero Slider -->
    <section class="hero-section">
      <div class="container">
        <HeroSlider />
      </div>
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
        
        <!-- Aquí irán más secciones: libros destacados, categorías, etc. -->
        <div class="coming-soon">
          <h2>🚀 Próximamente</h2>
          <p>Libros destacados, recomendaciones personalizadas y mucho más...</p>
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
  padding: 2rem 0 0 0;
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

.coming-soon {
  background: var(--color-accent);
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.coming-soon h2 {
  color: var(--color-secondary);
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.coming-soon p {
  color: var(--color-text);
  font-size: 1.1rem;
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
  
  .coming-soon {
    padding: 1.5rem;
  }
  
  .coming-soon h2 {
    font-size: 1.5rem;
  }
}
</style>
