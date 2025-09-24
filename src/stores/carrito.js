import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCarritoStore = defineStore('carrito', () => {
  const itemsCarrito = ref([])
  const cargandoCarrito = ref(false)

  // Contador total de items en el carrito
  const contadorItems = computed(() => {
    return itemsCarrito.value.reduce((total, item) => total + item.cantidad, 0)
  })

  // Total del carrito
  const totalCarrito = computed(() => {
    return itemsCarrito.value.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  })

  // Agregar item al carrito
  function agregarAlCarrito(libro, cantidad = 1) {
    const itemExistente = itemsCarrito.value.find(item => item.id === libro.id)
    
    if (itemExistente) {
      itemExistente.cantidad += cantidad
    } else {
      itemsCarrito.value.push({
        id: libro.id,
        titulo: libro.titulo,
        precio: libro.precio,
        cantidad: cantidad,
        imagen: libro.imagen
      })
    }
  }

  // Remover item del carrito
  function removerDelCarrito(libroId) {
    const index = itemsCarrito.value.findIndex(item => item.id === libroId)
    if (index > -1) {
      itemsCarrito.value.splice(index, 1)
    }
  }

  // Limpiar carrito
  function limpiarCarrito() {
    itemsCarrito.value = []
  }

  return {
    itemsCarrito,
    cargandoCarrito,
    contadorItems,
    totalCarrito,
    agregarAlCarrito,
    removerDelCarrito,
    limpiarCarrito
  }
})
