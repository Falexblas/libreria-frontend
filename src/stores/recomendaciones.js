import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const useRecomendacionesStore = defineStore('recomendaciones', () => {
  const authStore = useAuthStore()
  const recomendaciones = ref([])
  const cargando = ref(false)
  const error = ref(null)
  const mostrarNotificacion = ref(false)
  const tiempoMostrado = ref(0)
  const nombreUsuario = computed(() => authStore.user?.nombre || 'Usuario')

  // Obtener recomendaciones personalizadas del backend
  async function cargarRecomendacionesPersonalizadas(token) {
    if (!token) {
      console.log('No hay token, saltando recomendaciones')
      return
    }

    try {
      cargando.value = true
      error.value = null

      const response = await fetch(`${API_URL}/api/chat/recomendaciones/personalizadas`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        recomendaciones.value = data.librosRecomendados || []
        console.log(`✅ ${recomendaciones.value.length} recomendaciones cargadas`)
        
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

  // Mostrar notificación por 8 segundos
  function mostrarNotificacionTemporal() {
    mostrarNotificacion.value = true
    tiempoMostrado.value = 0

    const intervalo = setInterval(() => {
      tiempoMostrado.value += 1
      if (tiempoMostrado.value >= 8) {
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
    cargarRecomendacionesPersonalizadas,
    mostrarNotificacionTemporal,
    cerrarNotificacion,
    limpiarRecomendaciones
  }
})
