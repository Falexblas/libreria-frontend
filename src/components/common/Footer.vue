<template>
  <footer class="footer-principal">
    <!-- Sección principal del footer -->
    <div class="footer-contenido">
      <div class="container">
        <div class="footer-grid">
          <!-- Información de la empresa -->
          <div class="footer-seccion">
            <h3 class="footer-titulo">📚 LibreríaOnline</h3>
            <p class="footer-descripcion">
              Tu librería de confianza con la mejor selección de libros. 
              Descubre nuevos mundos a través de la lectura.
            </p>
            <div class="redes-sociales">
              <a href="#" class="red-social" title="Facebook">📘</a>
              <a href="#" class="red-social" title="Twitter">🐦</a>
              <a href="#" class="red-social" title="Instagram">📷</a>
              <a href="#" class="red-social" title="YouTube">📺</a>
            </div>
          </div>

          <!-- Enlaces rápidos -->
          <div class="footer-seccion">
            <h4 class="footer-subtitulo">Enlaces Rápidos</h4>
            <ul class="footer-lista">
              <li><router-link to="/" class="footer-enlace">Inicio</router-link></li>
              <li><router-link to="/libros" class="footer-enlace">Catálogo</router-link></li>
              <li><router-link to="/ofertas" class="footer-enlace">Ofertas</router-link></li>
              <li><router-link to="/novedades" class="footer-enlace">Novedades</router-link></li>
              <li><router-link to="/bestsellers" class="footer-enlace">Más Vendidos</router-link></li>
            </ul>
          </div>

          <!-- Categorías populares -->
          <div class="footer-seccion">
            <h4 class="footer-subtitulo">Categorías Populares</h4>
            <ul class="footer-lista">
              <li v-for="categoria in categoriasPopulares" :key="categoria.id">
                <router-link 
                  :to="`/libros/categoria/${categoria.id}`" 
                  class="footer-enlace"
                >
                  {{ categoria.nombre }}
                </router-link>
              </li>
              <li v-if="categoriasStore.cargandoCategorias">
                <span class="footer-enlace">Cargando...</span>
              </li>
            </ul>
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
                <span class="contacto-icono">📍</span>
                <span class="contacto-texto">Av. Principal 123, Ciudad</span>
              </div>
              <div class="contacto-item">
                <span class="contacto-icono">📞</span>
                <span class="contacto-texto">+1 234 567 8900</span>
              </div>
              <div class="contacto-item">
                <span class="contacto-icono">✉️</span>
                <span class="contacto-texto">info@libreriaonline.com</span>
              </div>
              <div class="contacto-item">
                <span class="contacto-icono">🕒</span>
                <span class="contacto-texto">Lun - Vie: 9:00 - 18:00</span>
              </div>
            </div>
          </div>

          <!-- Newsletter -->
          <div class="footer-seccion">
            <h4 class="footer-subtitulo">Mantente Informado</h4>
            <p class="newsletter-descripcion">
              Suscríbete para recibir ofertas especiales y novedades
            </p>
            <form @submit.prevent="suscribirseNewsletter" class="newsletter-form">
              <div class="newsletter-input">
                <input 
                  type="email" 
                  v-model="emailNewsletter"
                  placeholder="Tu email aquí..."
                  class="input-newsletter"
                  required
                >
                <button type="submit" class="btn-newsletter" :disabled="enviandoNewsletter">
                  {{ enviandoNewsletter ? '📤' : '✉️' }}
                </button>
              </div>
            </form>
            <div class="metodos-pago">
              <h5 class="metodos-titulo">Métodos de Pago</h5>
              <div class="pago-iconos">
                <span class="pago-icono">💳</span>
                <span class="pago-icono">🏦</span>
                <span class="pago-icono">📱</span>
                <span class="pago-icono">💰</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra inferior -->
    <div class="footer-inferior">
      <div class="container">
        <div class="footer-inferior-contenido">
          <div class="copyright">
            <p>&copy; {{ añoActual }} LibreríaOnline. Todos los derechos reservados.</p>
          </div>
          <div class="enlaces-legales">
            <router-link to="/privacidad" class="enlace-legal">Política de Privacidad</router-link>
            <span class="separador">|</span>
            <router-link to="/cookies" class="enlace-legal">Política de Cookies</router-link>
            <span class="separador">|</span>
            <router-link to="/terminos" class="enlace-legal">Términos de Uso</router-link>
          </div>
          <div class="tecnologia">
            <span class="tech-info">Desarrollado con ❤️ usando Vue.js</span>
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
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  margin-top: auto;
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
  color: #3498db;
}

.footer-subtitulo {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ecf0f1;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.footer-descripcion {
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: #bdc3c7;
}

/* Redes sociales */
.redes-sociales {
  display: flex;
  gap: 1rem;
}

.red-social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.red-social:hover {
  background: #3498db;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
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
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-enlace:hover {
  color: #3498db;
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
  font-size: 1.1rem;
  width: 20px;
}

.contacto-texto {
  color: #bdc3c7;
  font-size: 0.9rem;
}

/* Newsletter */
.newsletter-descripcion {
  color: #bdc3c7;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.newsletter-form {
  margin-bottom: 1.5rem;
}

.newsletter-input {
  display: flex;
  background: rgba(255,255,255,0.1);
  border-radius: 25px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.2);
}

.input-newsletter {
  flex: 1;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: white;
  outline: none;
}

.input-newsletter::placeholder {
  color: rgba(255,255,255,0.6);
}

.btn-newsletter {
  padding: 0.75rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-newsletter:hover:not(:disabled) {
  background: #2980b9;
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
  color: #ecf0f1;
}

.pago-iconos {
  display: flex;
  gap: 0.5rem;
}

.pago-icono {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 25px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.pago-icono:hover {
  background: rgba(255,255,255,0.2);
  transform: scale(1.1);
}

/* Footer inferior */
.footer-inferior {
  background: rgba(0,0,0,0.2);
  padding: 1rem 0;
  border-top: 1px solid rgba(255,255,255,0.1);
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
  color: #bdc3c7;
  font-size: 0.9rem;
}

.enlaces-legales {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.enlace-legal {
  color: #bdc3c7;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.enlace-legal:hover {
  color: #3498db;
}

.separador {
  color: #7f8c8d;
}

.tech-info {
  color: #bdc3c7;
  font-size: 0.8rem;
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
