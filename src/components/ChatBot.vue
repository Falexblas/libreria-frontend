<template>
  <div class="chatbot-container">
    <!-- Botón flotante para abrir el chat -->
    <button 
      v-if="!chatStore.chatAbierto" 
      @click="chatStore.toggleChat()"
      class="chat-button"
      aria-label="Abrir chat"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span class="chat-badge" v-if="mensajesNoLeidos > 0">{{ mensajesNoLeidos }}</span>
    </button>

    <!-- Ventana del chat -->
    <div v-if="chatStore.chatAbierto" class="chat-window">
      <!-- Header -->
      <div class="chat-header">
        <div class="chat-header-content">
          <div class="chat-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <div class="chat-title">
            <h3>Asistente de Librería</h3>
            <span class="chat-status">En línea</span>
          </div>
        </div>
        <button @click="chatStore.toggleChat()" class="chat-close" aria-label="Cerrar chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Mensajes -->
      <div class="chat-messages" ref="messagesContainer">
        <div 
          v-for="mensaje in chatStore.mensajes" 
          :key="mensaje.id"
          :class="['mensaje', mensaje.tipo]"
        >
          <div class="mensaje-contenido">
            <p>{{ mensaje.texto }}</p>
            
            <!-- Libros recomendados -->
            <div v-if="mensaje.librosRecomendados && mensaje.librosRecomendados.length > 0" class="libros-recomendados">
              <div 
                v-for="libro in mensaje.librosRecomendados" 
                :key="libro.id"
                class="libro-card-mini"
                @click="verDetalleLibro(libro.id)"
              >
                <img 
                  :src="libro.portadaUrl || '/placeholder-book.jpg'" 
                  :alt="libro.titulo"
                  class="libro-portada"
                />
                <div class="libro-info">
                  <h4>{{ libro.titulo }}</h4>
                  <p class="libro-autor">{{ libro.autor }}</p>
                  <p class="libro-precio">${{ libro.precio?.toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
          <span class="mensaje-hora">{{ formatearHora(mensaje.timestamp) }}</span>
        </div>

        <!-- Indicador de escritura -->
        <div v-if="chatStore.cargando" class="mensaje bot">
          <div class="mensaje-contenido typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="chat-input-container">
        <form @submit.prevent="enviarMensaje" class="chat-form">
          <input 
            v-model="mensajeActual"
            type="text" 
            placeholder="Escribe tu pregunta..."
            class="chat-input"
            :disabled="chatStore.cargando"
          />
          <button 
            type="submit" 
            class="chat-send"
            :disabled="!mensajeActual.trim() || chatStore.cargando"
            aria-label="Enviar mensaje"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        
        <!-- Sugerencias rápidas -->
        <div v-if="chatStore.mensajes.length <= 1" class="sugerencias">
          <button 
            v-for="sugerencia in sugerencias" 
            :key="sugerencia"
            @click="enviarSugerencia(sugerencia)"
            class="sugerencia-btn"
          >
            {{ sugerencia }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'

const router = useRouter()
const chatStore = useChatStore()

const mensajeActual = ref('')
const mensajesNoLeidos = ref(0)
const messagesContainer = ref(null)

const sugerencias = [
  '¿Qué libro de terror me recomiendas?',
  'Busco un libro de ciencia ficción',
  '¿Tienes libros de Stephen King?',
  'Recomiéndame un bestseller'
]

// Enviar mensaje
async function enviarMensaje() {
  if (!mensajeActual.value.trim()) return
  
  const mensaje = mensajeActual.value
  mensajeActual.value = ''
  
  await chatStore.enviarPregunta(mensaje)
  scrollToBottom()
}

// Enviar sugerencia
function enviarSugerencia(sugerencia) {
  mensajeActual.value = sugerencia
  enviarMensaje()
}

// Ver detalle del libro
function verDetalleLibro(libroId) {
  router.push(`/libros/${libroId}`)
  chatStore.toggleChat()
}

// Formatear hora
function formatearHora(timestamp) {
  const fecha = new Date(timestamp)
  return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

// Scroll al final
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Watch para hacer scroll cuando lleguen nuevos mensajes
watch(() => chatStore.mensajes.length, () => {
  scrollToBottom()
})
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

/* Botón flotante */
.chat-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.chat-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.chat-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* Ventana del chat */
.chat-window {
  width: 380px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.chat-status {
  font-size: 12px;
  opacity: 0.9;
}

.chat-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.chat-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Mensajes */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mensaje {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mensaje.usuario {
  align-self: flex-end;
}

.mensaje.bot {
  align-self: flex-start;
}

.mensaje-contenido {
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
}

.mensaje.usuario .mensaje-contenido {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.mensaje.bot .mensaje-contenido {
  background: white;
  color: #1f2937;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.mensaje-contenido p {
  margin: 0;
  line-height: 1.5;
}

.mensaje-hora {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
  align-self: flex-end;
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Libros recomendados */
.libros-recomendados {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.libro-card-mini {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
}

.libro-card-mini:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.libro-portada {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.libro-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.libro-info h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.3;
}

.libro-autor {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.libro-precio {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #667eea;
}

/* Input */
.chat-input-container {
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.chat-form {
  display: flex;
  gap: 8px;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: #667eea;
}

.chat-send {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.chat-send:hover:not(:disabled) {
  transform: scale(1.05);
}

.chat-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sugerencias */
.sugerencias {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.sugerencia-btn {
  padding: 8px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  font-size: 12px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.sugerencia-btn:hover {
  background: #e5e7eb;
  border-color: #667eea;
  color: #667eea;
}

/* Responsive */
@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 40px);
    height: calc(100vh - 40px);
  }
}
</style>
