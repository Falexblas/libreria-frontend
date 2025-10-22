import api from './api'

/**
 * Servicio para gestionar libros
 * Centraliza todas las llamadas HTTP relacionadas con libros
 */
export const libroService = {
  /**
   * Obtener todos los libros
   */
  obtenerTodos: () => api.get('/libros'),

  /**
   * Obtener libro por ID
   */
  obtenerPorId: (id) => api.get(`/libros/${id}`),

  /**
   * Crear nuevo libro (Solo ADMIN)
   */
  crear: (libro) => api.post('/libros', libro),

  /**
   * Actualizar libro (Solo ADMIN)
   */
  actualizar: (id, libro) => api.put(`/libros/${id}`, libro),

  /**
   * Eliminar libro (Solo ADMIN)
   */
  eliminar: (id) => api.delete(`/libros/${id}`)
}
