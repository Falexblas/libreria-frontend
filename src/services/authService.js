import api from './api'

/**
 * Servicio para gestionar autenticación
 * Centraliza todas las llamadas HTTP relacionadas con auth
 */
export const authService = {
  /**
   * Registrar nuevo usuario
   */
  register: (userData) => api.post('/auth/register', userData),

  /**
   * Iniciar sesión
   */
  login: (credentials) => api.post('/auth/login', credentials),

  /**
   * Refrescar token (si implementas refresh token)
   */
  refreshToken: (token) => api.post('/auth/refresh', { token })
}
