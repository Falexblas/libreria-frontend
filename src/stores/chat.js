import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useChatStore = defineStore('chat', () => {
  // Estado
  const mensajes = ref([])
  const cargando = ref(false)
  const error = ref(null)
  const chatAbierto = ref(false)

  // Agregar mensaje del usuario
  function agregarMensajeUsuario(texto) {
    mensajes.value.push({
      id: Date.now(),
      tipo: 'usuario',
      texto: texto,
      timestamp: new Date()
    })
  }

  // Agregar mensaje del bot
  function agregarMensajeBot(texto, librosRecomendados = []) {
    mensajes.value.push({
      id: Date.now(),
      tipo: 'bot',
      texto: texto,
      librosRecomendados: librosRecomendados,
      timestamp: new Date()
    })
  }

  // Enviar pregunta al backend
  async function enviarPregunta(pregunta) {
    if (!pregunta || pregunta.trim() === '') return

    // Agregar mensaje del usuario
    agregarMensajeUsuario(pregunta)
    
    cargando.value = true
    error.value = null

    try {
      const response = await api.post('/chat/preguntar', {
        mensaje: pregunta
      })

      // Agregar respuesta del bot
      agregarMensajeBot(
        response.data.respuesta,
        response.data.librosRecomendados || []
      )

    } catch (err) {
      console.error('Error al enviar pregunta:', err)
      error.value = err.message
      
      // Agregar mensaje de error
      agregarMensajeBot(
        'Lo siento, tuve un problema al procesar tu pregunta. Por favor, intenta de nuevo.'
      )
    } finally {
      cargando.value = false
    }
  }

  // Limpiar chat
  function limpiarChat() {
    mensajes.value = []
    error.value = null
  }

  // Abrir/cerrar chat
  function toggleChat() {
    chatAbierto.value = !chatAbierto.value
    
    // Si es la primera vez que se abre, agregar mensaje de bienvenida
    if (chatAbierto.value && mensajes.value.length === 0) {
      agregarMensajeBot(
        '¡Hola! 👋 Soy tu asistente virtual de la librería. Puedo ayudarte a encontrar el libro perfecto. ¿Qué tipo de libro estás buscando?'
      )
    }
  }

  return {
    mensajes,
    cargando,
    error,
    chatAbierto,
    agregarMensajeUsuario,
    agregarMensajeBot,
    enviarPregunta,
    limpiarChat,
    toggleChat
  }
})
