import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useFavoritosStore } from './favoritos'

// Función para capitalizar texto (Primera letra mayúscula, resto minúscula)
function capitalizar(texto) {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  // Computed para verificar autenticación
  const isAuthenticated = computed(() => !!token.value)
  
  // Computed para obtener el nombre completo del usuario
  const nombreUsuario = computed(() => {
    if (!user.value) return ''
    
    // Construir nombre completo con nombre y apellido capitalizados
    const nombre = capitalizar(user.value.nombre || '')
    const apellido = capitalizar(user.value.apellido || '')
    
    if (nombre && apellido) {
      return `${nombre} ${apellido}`
    } else if (nombre) {
      return nombre
    } else if (user.value.username) {
      return capitalizar(user.value.username)
    } else if (user.value.email) {
      return capitalizar(user.value.email.split('@')[0])
    }
    
    return 'Usuario'
  })

  // Inicializar desde localStorage al cargar
  function inicializar() {
    const tokenGuardado = localStorage.getItem('token')
    const usuarioGuardado = localStorage.getItem('usuario')
    
    if (tokenGuardado && usuarioGuardado) {
      try {
        token.value = tokenGuardado
        user.value = JSON.parse(usuarioGuardado)
        console.log('✅ Sesión restaurada:', user.value)
      } catch (error) {
        console.error('Error al restaurar sesión:', error)
        logout()
      }
    }
  }

  function login(userData, authToken) {
    user.value = userData
    token.value = authToken
    
    // Guardar en localStorage
    localStorage.setItem('token', authToken)
    localStorage.setItem('usuario', JSON.stringify(userData))
    
    console.log('✅ Usuario autenticado:', userData)
    
    // Cargar favoritos después del login
    const favoritosStore = useFavoritosStore()
    favoritosStore.cargarFavoritos()
  }

  function logout() {
    user.value = null
    token.value = null
    
    // Limpiar localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    
    // Limpiar favoritos
    const favoritosStore = useFavoritosStore()
    favoritosStore.favoritos = []
    
    console.log('🚪 Sesión cerrada')
  }

  function updateUser(userData) {
    user.value = userData
    
    // Actualizar en localStorage
    localStorage.setItem('usuario', JSON.stringify(userData))
    
    console.log('✅ Usuario actualizado:', userData)
  }

  // Inicializar al crear el store
  inicializar()

  return { 
    user, 
    token,
    isAuthenticated, 
    nombreUsuario,
    login, 
    logout,
    updateUser,
    inicializar
  }
})
