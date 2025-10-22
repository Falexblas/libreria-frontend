import api from './api'

/**
 * Servicio para gestionar usuarios
 * Centraliza todas las llamadas HTTP relacionadas con usuarios
 */
export const usuarioService = {
  /**
   * Obtener usuario por ID
   */
  obtenerPorId: (id) => api.get(`/usuarios/${id}`),

  /**
   * Actualizar perfil del usuario autenticado
   */
  actualizarPerfil: (datos) => api.put('/usuarios/perfil', datos),

  /**
   * Cambiar contraseña del usuario autenticado
   */
  cambiarPassword: (id, passwordData) => api.put(`/usuarios/${id}/cambiar-password`, passwordData)
}
