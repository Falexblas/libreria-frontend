import api from './api'

/**
 * Servicio para gestionar el chat con IA
 * Centraliza las llamadas al chatbot
 */
export const chatService = {
  /**
   * Enviar pregunta al chatbot
   */
  enviarPregunta: (mensaje) => api.post('/chat/preguntar', { mensaje }),

  /**
   * Verificar estado del servicio de chat
   */
  verificarEstado: () => api.get('/chat/health')
}
