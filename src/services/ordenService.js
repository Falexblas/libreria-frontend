import api from './api'

/**
 * Servicio para gestionar órdenes/pedidos
 * Centraliza todas las llamadas HTTP relacionadas con órdenes
 */
export const ordenService = {
  /**
   * Obtener todas las órdenes del usuario autenticado
   */
  obtenerMisOrdenes: () => api.get('/ordenes'),

  /**
   * Obtener detalles de una orden específica
   */
  obtenerDetalles: (id) => api.get(`/ordenes/${id}/detalles`),

  /**
   * Crear nueva orden
   */
  crear: (ordenData) => api.post('/ordenes', ordenData)
}
