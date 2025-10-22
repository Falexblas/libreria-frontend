import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  // Computed para verificar autenticación
  const isAuthenticated = computed(() => !!token.value)
  
  // Computed para obtener el nombre del usuario
  const nombreUsuario = computed(() => {
    if (!user.value) return ''
    return user.value.nombre || user.value.username || user.value.email?.split('@')[0] || 'Usuario'
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
  }

  function logout() {
    user.value = null
    token.value = null
    
    // Limpiar localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    
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
