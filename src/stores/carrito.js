import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCarritoStore = defineStore('carrito', () => {
  // Estado
  const items = ref([])
  const mostrarCarrito = ref(false)
  const cargando = ref(false)

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
  function agregarAlCarrito(libro, cantidad = 1) {
    const itemExistente = items.value.find(item => item.id === libro.id)
    
    if (itemExistente) {
      itemExistente.cantidad += cantidad
    } else {
      const nuevoItem = {
        id: libro.id,
        titulo: libro.titulo,
        autor: libro.autor,
        precio: parseFloat(libro.precio),
        cantidad: cantidad,
        portadaUrl: libro.portadaUrl || libro.portada_url,
        stock: libro.stock,
        activo: libro.activo
      }
      items.value.push(nuevoItem)
    }
    
    // Abrir carrito automáticamente
    abrirCarrito()
    
    // Guardar en localStorage
    guardarEnLocalStorage()
  }

  function eliminarItem(itemId) {
    const index = items.value.findIndex(item => item.id === itemId)
    if (index > -1) {
      items.value.splice(index, 1)
      guardarEnLocalStorage()
    }
  }

  function aumentarCantidad(itemId) {
    const item = items.value.find(item => item.id === itemId)
    if (item) {
      item.cantidad++
      guardarEnLocalStorage()
    }
  }

  function disminuirCantidad(itemId) {
    const item = items.value.find(item => item.id === itemId)
    if (item && item.cantidad > 1) {
      item.cantidad--
      guardarEnLocalStorage()
    }
  }

  function actualizarCantidad(itemId, nuevaCantidad) {
    const item = items.value.find(item => item.id === itemId)
    if (item && nuevaCantidad > 0) {
      item.cantidad = nuevaCantidad
      guardarEnLocalStorage()
    }
  }

  function limpiarCarrito() {
    items.value = []
    guardarEnLocalStorage()
  }

  function vaciarCarrito() {
    items.value = []
    guardarEnLocalStorage()
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

  // Inicializar carrito
  function inicializar() {
    cargarDesdeLocalStorage()
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
    
    // Persistencia
    guardarEnLocalStorage,
    cargarDesdeLocalStorage
  }
})
