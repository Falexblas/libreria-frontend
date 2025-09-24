import axios from 'axios'

// Configuración base de la API
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, // Importante para las cookies de sesión de Spring Security
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Usuario no autenticado - redirigir al login
      console.log('Usuario no autenticado')
    }
    return Promise.reject(error)
  }
)

export default api
