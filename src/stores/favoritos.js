import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import Swal from 'sweetalert2'

const API_URL = import.meta.env.VITE_API_URL || 'https://libreria-backend-oebo.onrender.com'

export const useFavoritosStore = defineStore('favoritos', () => {
  const favoritos = ref([])
  const authStore = useAuthStore()
  const cargando = ref(false)

  // Computed para obtener IDs de favoritos
  const favoritosIds = computed(() => favoritos.value.map(fav => fav.libro?.id || fav.id))

  // Computed para total de favoritos
  const totalFavoritos = computed(() => favoritos.value.length)

  // Verificar si un libro es favorito
  function esFavorito(libroId) {
    return favoritosIds.value.includes(libroId)
  }

  // Cargar favoritos desde el backend
  async function cargarFavoritos() {
    if (!authStore.isAuthenticated || !authStore.token) {
      favoritos.value = []
      return
    }

    try {
      cargando.value = true
      const response = await fetch(`${API_URL}/api/favoritos`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        favoritos.value = data
        console.log(`✅ ${favoritos.value.length} favoritos cargados desde el backend`)
      } else {
        console.error('Error al cargar favoritos:', response.status)
        favoritos.value = []
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error)
      favoritos.value = []
    } finally {
      cargando.value = false
    }
  }

  // Agregar o quitar favorito
  async function toggleFavorito(libro) {
    // Validar autenticación
    if (!authStore.isAuthenticated) {
      Swal.fire({
        icon: 'warning',
        title: 'Inicia sesión para continuar',
        text: 'Debes iniciar sesión para agregar libros a favoritos',
        confirmButtonText: 'Ir a Iniciar Sesión',
        confirmButtonColor: '#0d6efd',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#6c757d'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login'
        }
      })
      return false
    }

    const yaEsFavorito = esFavorito(libro.id)
    
    try {
      if (yaEsFavorito) {
        // Actualización optimista: eliminar de la UI inmediatamente
        favoritos.value = favoritos.value.filter(fav => (fav.libro?.id || fav.id) !== libro.id)
        
        // Mostrar alerta inmediatamente
        Swal.fire({
          icon: 'info',
          title: 'Eliminado de favoritos',
          text: `"${libro.titulo}" fue eliminado de tu lista de deseos`,
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
        
        // Eliminar en el backend en segundo plano
        const response = await fetch(`${API_URL}/api/favoritos/eliminar-libro/${libro.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok && response.status !== 204) {
          // Si falla, revertir y recargar
          await cargarFavoritos()
          throw new Error('Error al eliminar de favoritos')
        }
        
        return false
      } else {
        // Actualización optimista: agregar a la UI inmediatamente
        const favoritoTemporal = {
          id: Date.now(), // ID temporal
          libro: libro,
          fechaAgregado: new Date().toISOString()
        }
        favoritos.value.push(favoritoTemporal)
        
        // Mostrar alerta inmediatamente
        Swal.fire({
          icon: 'success',
          title: '¡Agregado a favoritos!',
          text: `"${libro.titulo}" fue agregado a tu lista de deseos`,
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
        
        // Agregar a favoritos en el backend
        const response = await fetch(`${API_URL}/api/favoritos/agregar/${libro.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          // Recargar favoritos en segundo plano para obtener el ID real del backend
          cargarFavoritos()
          return true
        } else if (response.status === 400) {
          const error = await response.text()
          if (error.includes('ya está en favoritos')) {
            Swal.fire({
              icon: 'info',
              title: 'Ya está en favoritos',
              text: 'Este libro ya está en tu lista de deseos',
              timer: 2000,
              showConfirmButton: false,
              toast: true,
              position: 'top-end'
            })
          }
          // Recargar para sincronizar y eliminar el temporal
          await cargarFavoritos()
          return false
        } else {
          // Si falla, eliminar el favorito temporal y recargar
          favoritos.value = favoritos.value.filter(fav => fav.id !== favoritoTemporal.id)
          await cargarFavoritos()
          throw new Error('Error al agregar a favoritos')
        }
      }
    } catch (error) {
      console.error('Error en toggleFavorito:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar favoritos. Intenta nuevamente.',
        confirmButtonText: 'OK'
      })
      return false
    }
  }

  // Eliminar favorito
  async function eliminarFavorito(libroId) {
    if (!authStore.isAuthenticated) return

    try {
      const response = await fetch(`${API_URL}/api/favoritos/eliminar-libro/${libroId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok || response.status === 204) {
        await cargarFavoritos()
        
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El libro fue eliminado de favoritos',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
      }
    } catch (error) {
      console.error('Error al eliminar favorito:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el favorito',
        confirmButtonText: 'OK'
      })
    }
  }

  // Limpiar todos los favoritos
  async function limpiarFavoritos() {
    if (!authStore.isAuthenticated) return

    const result = await Swal.fire({
      icon: 'question',
      title: '¿Estás seguro?',
      text: 'Se eliminarán todos los libros de tu lista de deseos',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar todos',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    })

    if (result.isConfirmed) {
      try {
        // Actualización optimista: limpiar la UI inmediatamente
        const favoritosBackup = [...favoritos.value]
        favoritos.value = []
        
        // Mostrar alerta de éxito inmediatamente
        Swal.fire({
          icon: 'success',
          title: 'Lista limpiada',
          text: 'Todos los favoritos fueron eliminados',
          timer: 2000,
          showConfirmButton: false
        })
        
        // Eliminar todos los favoritos en el backend (en segundo plano)
        const promesas = favoritosBackup.map(fav => 
          fetch(`${API_URL}/api/favoritos/eliminar-libro/${fav.libro?.id || fav.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${authStore.token}`,
              'Content-Type': 'application/json'
            }
          })
        )

        await Promise.all(promesas)
        
        // Verificar que todo se eliminó correctamente
        const responses = await Promise.all(promesas)
        const algunoFallo = responses.some(res => !res.ok && res.status !== 204)
        
        if (algunoFallo) {
          // Si algo falló, recargar desde el backend
          await cargarFavoritos()
          throw new Error('Algunos favoritos no se pudieron eliminar')
        }
      } catch (error) {
        console.error('Error al limpiar favoritos:', error)
        // Recargar para sincronizar
        await cargarFavoritos()
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron eliminar todos los favoritos',
          confirmButtonText: 'OK'
        })
      }
    }
  }

  // Inicializar favoritos al crear el store
  if (authStore.isAuthenticated) {
    cargarFavoritos()
  }

  return {
    favoritos,
    favoritosIds,
    totalFavoritos,
    cargando,
    esFavorito,
    toggleFavorito,
    eliminarFavorito,
    limpiarFavoritos,
    cargarFavoritos
  }
})
