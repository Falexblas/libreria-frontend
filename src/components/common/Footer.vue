<template>
  <footer class="footer-principal">
    <!-- Sección principal del footer -->
    <div class="footer-contenido">
      <div class="container">
        <div class="footer-grid">
          <!-- Información de la empresa -->
          <div class="footer-seccion">
            <h3 class="footer-titulo">Mundo de Papel</h3>
            <p class="footer-descripcion">
              Tu librería de confianza con la mejor selección de libros. 
              Descubre nuevos mundos a través de la lectura.
            </p>
            <div class="redes-sociales social-list">
              <a href="https://facebook.com/bookify" target="_blank" class="red-social social-icon" title="Facebook" aria-label="Facebook">
                <i class="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com/bookify" target="_blank" class="red-social social-icon" title="Twitter" aria-label="Twitter">
                <i class="bi bi-twitter-x"></i>
              </a>
              <a href="https://instagram.com/bookify" target="_blank" class="red-social social-icon" title="Instagram" aria-label="Instagram">
                <i class="bi bi-instagram"></i>
              </a>
              <a href="https://youtube.com/bookify" target="_blank" class="red-social social-icon" title="YouTube" aria-label="YouTube">
                <i class="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          <!-- Atención al cliente -->
          <div class="footer-seccion">
            <h4 class="footer-subtitulo">Atención al Cliente</h4>
            <ul class="footer-lista">
              <li><router-link to="/contacto" class="footer-enlace">Contacto</router-link></li>
              <li><router-link to="/ayuda" class="footer-enlace">Centro de Ayuda</router-link></li>
              <li><router-link to="/envios" class="footer-enlace">Información de Envíos</router-link></li>
              <li><router-link to="/devoluciones" class="footer-enlace">Devoluciones</router-link></li>
              <li><router-link to="/terminos" class="footer-enlace">Términos y Condiciones</router-link></li>
            </ul>
          </div>

          <!-- Información de contacto -->
          <div class="footer-seccion">
            <h4 class="footer-subtitulo">Contáctanos</h4>
            <div class="contacto-info">
              
              <div class="contacto-item">
                <span class="contacto-icono"><i class="bi bi-telephone"></i></span>
                <span class="contacto-texto">(01) 644-9191</span>
              </div>
              <div class="contacto-item">
                <span class="contacto-icono"><i class="bi bi-envelope-fill"></i></span>
                <span class="contacto-texto">MundoDePapel@hotmail.com</span>
              </div>
              <div class="contacto-item">
                <span class="contacto-icono"><i class="bi bi-whatsapp"></i></span>
                <span class="contacto-texto">+51 955 079 929</span>
              </div>
            </div>
          </div>

         <!-- Métodos de Pago -->
          <div class="footer-seccion">
            <h4 class="footer-subtitulo">Formas de Pago</h4>
            <div class="metodos-pago">
              <!-- Imagen con métodos de pago (archivo en src/assets) -->
              <div class="footer-payment-wrapper mt-2">
                <img src="@/assets/footer-payment-methods.png" alt="Métodos de pago" class="footer-payment-img">
              </div>
            </div>
            <p class="footer-descripcion" style="font-size: 0.9rem; margin-top: 0.5rem;">
              Paga de forma segura.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra inferior -->
    <div class="footer-inferior">
      <div class="container">
        <div class="footer-inferior-contenido">
          <div class="copyright">
            <p>&copy; {{ añoActual }} Mundo de Papel. Todos los derechos reservados.</p>
          </div>
          <div class="enlaces-legales">
            <router-link to="/privacidad" class="enlace-legal">Política de Privacidad</router-link>
            <span class="separador">|</span>
            <router-link to="/cookies" class="enlace-legal">Política de Cookies</router-link>
            <span class="separador">|</span>
            <router-link to="/terminos" class="enlace-legal">Términos de Uso</router-link>
          </div>
         
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategoriasStore } from '@/stores/categorias'

const categoriasStore = useCategoriasStore()

const emailNewsletter = ref('')
const enviandoNewsletter = ref(false)

// Año actual para el copyright
const añoActual = computed(() => new Date().getFullYear())

// Categorías populares (primeras 5)
const categoriasPopulares = computed(() => {
  return categoriasStore.categorias.slice(0, 5)
})

// Cargar categorías si no están cargadas
onMounted(() => {
  if (categoriasStore.categorias.length === 0) {
    categoriasStore.cargarCategorias()
  }
})

// Función para suscribirse al newsletter
async function suscribirseNewsletter() {
  if (!emailNewsletter.value) return
  
  try {
    enviandoNewsletter.value = true
    
    // Aquí harías la llamada a tu API para suscribir al newsletter
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación
    
    alert('¡Gracias por suscribirte! Recibirás nuestras novedades en tu email.')
    emailNewsletter.value = ''
    
  } catch (error) {
    console.error('Error al suscribirse:', error)
    alert('Hubo un error al suscribirte. Inténtalo de nuevo.')
  } finally {
    enviandoNewsletter.value = false
  }
}
</script>

<style scoped>
.footer-principal {
  background: #002e4d;
  color: var(--color-background);
  margin-top: auto;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Contenido principal del footer */
.footer-contenido {
  padding: 3rem 0 2rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-seccion {
  margin-bottom: 1rem;
}

.footer-titulo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--color-accent);
}

.footer-subtitulo {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-background);
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 0.5rem;
}

.footer-descripcion {
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: rgba(245, 240, 230, 0.8);
}

/* Redes sociales profesionales */
.redes-sociales {
  display: flex;
  gap: 1rem;
}

.social-list {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px; /* un poco más de área clicable */
  background: transparent; /* sin fondo */
  border-radius: 0;
  text-decoration: none;
  font-size: 1.4rem; /* mayor tamaño base */
  color: #ffffff; /* icono blanco */
  transition: transform 0.18s ease, color 0.18s ease;
  box-shadow: none;
  border: none;
}

.social-icon i {
  font-size: 1.6rem; /* iconos más grandes */
  line-height: 1;
  color: #fff;
}

.social-icon:hover {
  transform: translateY(-3px) scale(1.08);
  color: #e6e6e6;
}

/* Listas del footer */
.footer-lista {
  list-style: none;
  padding: 0;
}

.footer-lista li {
  margin-bottom: 0.5rem;
}

.footer-enlace {
  color: rgba(245, 240, 230, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-enlace:hover {
  color: var(--color-accent);
  transform: translateX(5px);
}

/* Información de contacto */
.contacto-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contacto-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contacto-icono {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: #ffffff;
  font-size: 1.05rem;
}

.contacto-texto {
  color: rgba(245, 240, 230, 0.8);
  font-size: 0.9rem;
}

/* Newsletter */
.newsletter-descripcion {
  color: rgba(245, 240, 230, 0.8);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.newsletter-form {
  margin-bottom: 1.5rem;
}

.newsletter-input {
  display: flex;
  background: rgba(245, 240, 230, 0.1);
  border-radius: 25px;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 230, 0.2);
}

.input-newsletter {
  flex: 1;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: var(--color-background);
  outline: none;
}

.input-newsletter::placeholder {
  color: rgba(245, 240, 230, 0.6);
}

.btn-newsletter {
  padding: 0.75rem 1rem;
  background: var(--color-primary);
  color: var(--color-background);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
}

.btn-newsletter:hover:not(:disabled) {
  background: var(--color-accent);
  color: var(--color-text);
}

.btn-newsletter:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Métodos de pago */
.metodos-pago {
  margin-top: 1.5rem;
}

.metodos-titulo {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--color-background);
}

.pago-iconos {
  display: flex;
  gap: 0.5rem;
}

.pago-icono {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.pago-icono:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Imagen de métodos de pago en el footer */
.footer-payment-wrapper {
  margin-top: 0.5rem;
}
.footer-payment-img {
  max-width: 160px; /* reducido según petición */
  width: auto;
  height: auto;
  display: block;
}

@media (max-width: 480px) {
  .footer-payment-img {
    max-width: 120px;
  }
}

/* Footer inferior */
.footer-inferior {
  background: rgba(0, 46, 77, 0.8);
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-inferior-contenido {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright p {
  margin: 0;
  color: rgba(245, 240, 230, 0.8);
  font-size: 0.9rem;
}

.enlaces-legales {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.enlace-legal {
  color: rgba(245, 240, 230, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.enlace-legal:hover {
  color: var(--color-accent);
}

.separador {
  color: rgba(245, 240, 230, 0.5);
}


/* Responsive */
@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-inferior-contenido {
    flex-direction: column;
    text-align: center;
  }
  
  .enlaces-legales {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .redes-sociales {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-contenido {
    padding: 2rem 0 1rem;
  }
  
  .newsletter-input {
    flex-direction: column;
  }
  
  .btn-newsletter {
    border-radius: 0 0 25px 25px;
  }
}
</style>
