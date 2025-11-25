import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const CACHE_KEY = 'recomendaciones_cache'
const CACHE_EXPIRY_KEY = 'recomendaciones_cache_expiry'
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 días en milisegundos

export const useRecomendacionesStore = defineStore('recomendaciones', () => {
  const authStore = useAuthStore()
  const recomendaciones = ref([])
  const cargando = ref(false)
  const error = ref(null)
  const mostrarNotificacion = ref(false)
  const tiempoMostrado = ref(0)
  const nombreUsuario = computed(() => authStore.user?.nombre || 'Usuario')
  const desdeCache = ref(false)
  const indiceActual = ref(0) // Para alternar entre recomendaciones

  // Verificar si el caché es válido
  function esCacheValido() {
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY)
    if (!expiry) return false
    
    const ahora = Date.now()
    const expiryTime = parseInt(expiry)
    const esValido = ahora < expiryTime
    
    if (esValido) {
      console.log('Caché válido - Recomendaciones reutilizadas')
    } else {
      console.log('Caché expirado - Se obtendrán nuevas recomendaciones')
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(CACHE_EXPIRY_KEY)
    }
    
    return esValido
  }

  // Obtener recomendaciones del caché
  function obtenerDelCache() {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        return JSON.parse(cached)
      } catch (err) {
        console.error('Error al parsear caché:', err)
        return null
      }
    }
    return null
  }

  // Guardar recomendaciones en caché
  function guardarEnCache(datos) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(datos))
      localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString())
      console.log('Recomendaciones guardadas en caché por 7 días')
    } catch (err) {
      console.error('Error al guardar en caché:', err)
    }
  }

  // Obtener recomendaciones personalizadas del backend
  async function cargarRecomendacionesPersonalizadas(token, forzarRecarga = false) {
    if (!token) {
      console.log('No hay token, saltando recomendaciones')
      return
    }

    // Si no se fuerza recarga, intentar usar caché
    if (!forzarRecarga && esCacheValido()) {
      const cached = obtenerDelCache()
      if (cached && cached.length > 0) {
        recomendaciones.value = cached
        desdeCache.value = true
        console.log(`📦 ${cached.length} recomendaciones cargadas desde caché`)
        mostrarNotificacionTemporal()
        return
      }
    }

    // Si no hay caché válido o se fuerza recarga, hacer petición al backend
    try {
      cargando.value = true
      error.value = null
      desdeCache.value = false

      console.log('🌐 Obteniendo recomendaciones del backend (Gemini)...')
      const response = await fetch(`${API_URL}/api/chat/recomendaciones/personalizadas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        recomendaciones.value = data.librosRecomendados || []
        console.log(`✅ ${recomendaciones.value.length} recomendaciones obtenidas de Gemini`)
        
        // Guardar en caché
        if (recomendaciones.value.length > 0) {
          guardarEnCache(recomendaciones.value)
        }
        
        // Mostrar notificación si hay recomendaciones
        if (recomendaciones.value.length > 0) {
          mostrarNotificacionTemporal()
        }
      } else {
        console.error('Error al cargar recomendaciones:', response.status)
        recomendaciones.value = []
      }
    } catch (err) {
      console.error('Error al cargar recomendaciones:', err)
      error.value = err.message
      recomendaciones.value = []
    } finally {
      cargando.value = false
    }
  }

  // Limpiar caché (útil para forzar recarga)
  function limpiarCache() {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(CACHE_EXPIRY_KEY)
    desdeCache.value = false
    indiceActual.value = 0
    console.log('🗑️ Caché de recomendaciones limpiado')
  }

  // Obtener el libro actual y rotar al siguiente
  function obtenerLibroActual() {
    if (recomendaciones.value.length === 0) return null
    
    const libroActual = recomendaciones.value[indiceActual.value]
    
    // Rotar al siguiente libro para la próxima vez
    indiceActual.value = (indiceActual.value + 1) % recomendaciones.value.length
    
    return libroActual
  }

  // Obtener los libros adicionales (los que no son el principal)
  function obtenerLibrosAdicionales() {
    if (recomendaciones.value.length <= 1) return []
    
    const librosAdicionales = []
    for (let i = 1; i < recomendaciones.value.length; i++) {
      const indice = (indiceActual.value + i - 1) % recomendaciones.value.length
      if (indice !== indiceActual.value) {
        librosAdicionales.push(recomendaciones.value[indice])
      }
    }
    
    return librosAdicionales
  }

  // Mostrar notificación por 12 segundos
  function mostrarNotificacionTemporal() {
    mostrarNotificacion.value = true
    tiempoMostrado.value = 0

    const intervalo = setInterval(() => {
      tiempoMostrado.value += 1
      if (tiempoMostrado.value >= 12) {
        mostrarNotificacion.value = false
        clearInterval(intervalo)
      }
    }, 1000)
  }

  // Cerrar notificación manualmente
  function cerrarNotificacion() {
    mostrarNotificacion.value = false
  }

  // Limpiar recomendaciones
  function limpiarRecomendaciones() {
    recomendaciones.value = []
    error.value = null
  }

  return {
    recomendaciones,
    cargando,
    error,
    mostrarNotificacion,
    tiempoMostrado,
    nombreUsuario,
    desdeCache,
    indiceActual,
    cargarRecomendacionesPersonalizadas,
    mostrarNotificacionTemporal,
    cerrarNotificacion,
    limpiarRecomendaciones,
    limpiarCache,
    esCacheValido,
    obtenerLibroActual,
    obtenerLibrosAdicionales
  }
})
