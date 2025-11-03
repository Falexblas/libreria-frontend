import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'
import { useAuthStore } from './auth'

export const useCarritoStore = defineStore('carrito', () => {
  // Estado
  const items = ref([])
  const mostrarCarrito = ref(false)
  const cargando = ref(false)
  const carritoId = ref(null)

  // Computeds
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.cantidad, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  })

  const envio = computed(() => {
    return 0 // Envío gratis por ahora
  })

  const total = computed(() => {
    return subtotal.value + envio.value
  })

  const estaVacio = computed(() => {
    return items.value.length === 0
  })

  // Acciones
  async function agregarAlCarrito(libro, cantidad = 1) {
    // Verificar token directamente desde localStorage
    const token = localStorage.getItem('token')

    // ACTUALIZACIÓN OPTIMISTA: Agregar a UI inmediatamente
    agregarAlCarritoLocal(libro, cantidad)
    abrirCarrito()

    // Si no está autenticado, solo localStorage
    if (!token) {
      return
    }

    // Usuario autenticado: sincronizar con backend en segundo plano
    try {
      // No usar await para no bloquear la UI
      api.post('/carrito/items', {
        libroId: libro.id,
        cantidad: cantidad
      }).then(response => {
        if (response.data.success && response.data.item) {
          // Actualizar el itemId del backend para futuras operaciones
          const item = items.value.find(i => i.id === libro.id)
          if (item && response.data.item.id) {
            item.itemId = response.data.item.id
          }
        }
      }).catch(error => {
        console.error('Error al sincronizar con backend:', error)
        // El item ya está en la UI, no hacer nada más
      })
    } catch (error) {
      console.error('Error al agregar al carrito:', error)
      // El item ya está en la UI gracias a la actualización optimista
    }
  }

  // Agregar al carrito local (fallback)
  function agregarAlCarritoLocal(libro, cantidad = 1) {
    const itemExistente = items.value.find(item => item.id === libro.id)
    
    if (itemExistente) {
      itemExistente.cantidad += cantidad
    } else {
      const nuevoItem = {
        id: libro.id,
        titulo: libro.titulo,
        autor: libro.autor,
        autores: libro.autores,
        precio: parseFloat(libro.precio),
        cantidad: cantidad,
        portadaUrl: libro.portadaUrl || libro.portada_url,
        stock: libro.stock,
        activo: libro.activo
      }
      items.value.push(nuevoItem)
    }
    
    guardarEnLocalStorage()
  }

  async function eliminarItem(itemId) {
    const token = localStorage.getItem('token')
    const item = items.value.find(i => i.id === itemId)
    const index = items.value.findIndex(i => i.id === itemId)
    
    if (index === -1) return

    // Guardar item por si necesitamos revertir
    const itemEliminado = { ...item }

    // ACTUALIZACIÓN OPTIMISTA: Eliminar de UI inmediatamente
    items.value.splice(index, 1)

    // Si no está autenticado, solo guardar en localStorage
    if (!token) {
      guardarEnLocalStorage()
      return
    }

    // Usuario autenticado: sincronizar con backend en segundo plano
    try {
      if (itemEliminado.itemId) {
        // No usar await para no bloquear la UI
        api.delete(`/carrito/items/${itemEliminado.itemId}`).catch(error => {
          // Si falla, revertir el cambio
          console.error('Error al eliminar item:', error)
          items.value.splice(index, 0, itemEliminado)
        })
      }
    } catch (error) {
      // Revertir si hay error
      items.value.splice(index, 0, itemEliminado)
      guardarEnLocalStorage()
    }
  }

  async function aumentarCantidad(itemId) {
    const item = items.value.find(i => i.id === itemId)
    if (!item) return

    const token = localStorage.getItem('token')
    const cantidadAnterior = item.cantidad

    // ACTUALIZACIÓN OPTIMISTA: Actualizar UI inmediatamente
    item.cantidad++

    // Si no está autenticado, solo guardar en localStorage
    if (!token) {
      guardarEnLocalStorage()
      return
    }

    // Usuario autenticado: sincronizar con backend en segundo plano
    try {
      if (item.itemId) {
        // No usar await para no bloquear la UI
        api.put(`/carrito/items/${item.itemId}`, {
          cantidad: item.cantidad
        }).catch(error => {
          // Si falla, revertir el cambio
          console.error('Error al aumentar cantidad:', error)
          item.cantidad = cantidadAnterior
        })
      }
    } catch (error) {
      // Revertir si hay error
      item.cantidad = cantidadAnterior
      guardarEnLocalStorage()
    }
  }

  async function disminuirCantidad(itemId) {
    const item = items.value.find(i => i.id === itemId)
    if (!item || item.cantidad <= 1) return

    const token = localStorage.getItem('token')
    const cantidadAnterior = item.cantidad

    // ACTUALIZACIÓN OPTIMISTA: Actualizar UI inmediatamente
    item.cantidad--

    // Si no está autenticado, solo guardar en localStorage
    if (!token) {
      guardarEnLocalStorage()
      return
    }

    // Usuario autenticado: sincronizar con backend en segundo plano
    try {
      if (item.itemId) {
        // No usar await para no bloquear la UI
        api.put(`/carrito/items/${item.itemId}`, {
          cantidad: item.cantidad
        }).catch(error => {
          // Si falla, revertir el cambio
          console.error('Error al disminuir cantidad:', error)
          item.cantidad = cantidadAnterior
        })
      }
    } catch (error) {
      // Revertir si hay error
      item.cantidad = cantidadAnterior
      guardarEnLocalStorage()
    }
  }

  async function actualizarCantidad(itemId, nuevaCantidad) {
    const item = items.value.find(i => i.id === itemId)
    if (!item || nuevaCantidad <= 0) return

    const token = localStorage.getItem('token')

    // Si no está autenticado, usar localStorage
    if (!token) {
      item.cantidad = nuevaCantidad
      guardarEnLocalStorage()
      return
    }

    // Usuario autenticado: usar backend
    try {
      if (item.itemId) {
        await api.put(`/carrito/items/${item.itemId}`, {
          cantidad: nuevaCantidad
        })
        await cargarCarrito()
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error)
      // Fallback a localStorage
      item.cantidad = nuevaCantidad
      guardarEnLocalStorage()
    }
  }

  function limpiarCarrito() {
    items.value = []
    guardarEnLocalStorage()
  }

  async function vaciarCarrito() {
    const token = localStorage.getItem('token')

    // Si no está autenticado, usar localStorage
    if (!token) {
      items.value = []
      guardarEnLocalStorage()
      return
    }

    // Usuario autenticado: usar backend
    try {
      await api.delete('/carrito')
      items.value = []
    } catch (error) {
      console.error('Error al vaciar carrito:', error)
      // Fallback a localStorage
      items.value = []
      guardarEnLocalStorage()
    }
  }

  function abrirCarrito() {
    mostrarCarrito.value = true
  }

  function cerrarCarrito() {
    mostrarCarrito.value = false
  }

  function toggleCarrito() {
    mostrarCarrito.value = !mostrarCarrito.value
  }

  // Persistencia en localStorage
  function guardarEnLocalStorage() {
    try {
      localStorage.setItem('carrito', JSON.stringify(items.value))
    } catch (error) {
      console.error('Error guardando carrito:', error)
    }
  }

  function cargarDesdeLocalStorage() {
    try {
      const carritoGuardado = localStorage.getItem('carrito')
      if (carritoGuardado) {
        items.value = JSON.parse(carritoGuardado)
      }
    } catch (error) {
      console.error('Error cargando carrito:', error)
      items.value = []
    }
  }

  // Verificar si un libro está en el carrito
  function estaEnCarrito(libroId) {
    return items.value.some(item => item.id === libroId)
  }

  // Obtener cantidad de un libro específico
  function obtenerCantidad(libroId) {
    const item = items.value.find(item => item.id === libroId)
    return item ? item.cantidad : 0
  }

  // Cargar carrito desde backend o localStorage
  async function cargarCarrito() {
    // Verificar token directamente desde localStorage para evitar problemas de inicialización
    const token = localStorage.getItem('token')

    // Si no hay token, cargar desde localStorage
    if (!token) {
      cargarDesdeLocalStorage()
      return
    }

    // Usuario autenticado: cargar desde backend
    try {
      cargando.value = true
      const response = await api.get('/carrito')
      
      if (response.data) {
        carritoId.value = response.data.id
        // Convertir items del backend al formato del frontend
        // Validar que items existe y es un array
        if (response.data.items && Array.isArray(response.data.items)) {
          items.value = response.data.items.map(item => ({
            id: item.libro.id,
            itemId: item.id, // ID del item en la tabla items_carrito
            titulo: item.libro.titulo,
            autor: item.libro.autor,
            autores: item.libro.autores,
            precio: parseFloat(item.precioUnitario),
            cantidad: item.cantidad,
            portadaUrl: item.libro.portadaUrl,
            stock: item.libro.stock,
            activo: item.libro.activo
          }))
        } else {
          // Carrito vacío
          items.value = []
        }
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error)
      // Fallback a localStorage
      cargarDesdeLocalStorage()
    } finally {
      cargando.value = false
    }
  }

  // Sincronizar carrito local con backend al hacer login
  async function sincronizarCarritoAlLogin() {
    const carritoLocal = JSON.parse(localStorage.getItem('carrito')) || []
    
    if (carritoLocal.length === 0) {
      await cargarCarrito()
      return
    }

    try {
      // Enviar items locales al backend
      for (const item of carritoLocal) {
        await api.post('/carrito/items', {
          libroId: item.id,
          cantidad: item.cantidad
        })
      }
      
      // Limpiar localStorage
      localStorage.removeItem('carrito')
      
      // Cargar carrito desde backend
      await cargarCarrito()
    } catch (error) {
      console.error('Error al sincronizar carrito:', error)
    }
  }

  // Inicializar carrito
  async function inicializar() {
    // Verificar token directamente desde localStorage
    const token = localStorage.getItem('token')
    
    if (token) {
      await cargarCarrito()
    } else {
      cargarDesdeLocalStorage()
    }
  }

  return {
    // Estado
    items,
    mostrarCarrito,
    cargando,
    
    // Computeds
    totalItems,
    subtotal,
    envio,
    total,
    estaVacio,
    
    // Acciones
    agregarAlCarrito,
    eliminarItem,
    aumentarCantidad,
    disminuirCantidad,
    actualizarCantidad,
    limpiarCarrito,
    vaciarCarrito,
    abrirCarrito,
    cerrarCarrito,
    toggleCarrito,
    estaEnCarrito,
    obtenerCantidad,
    inicializar,
    cargarCarrito,
    sincronizarCarritoAlLogin,
    
    // Persistencia
    guardarEnLocalStorage,
    cargarDesdeLocalStorage
  }
})
