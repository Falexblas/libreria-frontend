import axios from 'axios'

// Configuración base de la API (usa variable de entorno VITE_API_URL o fallback a producción)
const BASE = (import.meta.env.VITE_API_URL ?? 'https://libreria-backend-oebo.onrender.com') + '/api'

const api = axios.create({
  baseURL: BASE,
  withCredentials: true, // Importante para las cookies de sesión de Spring Security
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar el token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

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
