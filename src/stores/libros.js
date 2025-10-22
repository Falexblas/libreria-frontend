import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { libroService } from '@/services/libroService'

export const useLibrosStore = defineStore('libros', () => {
  // Cache de todos los libros
  const todosLosLibros = ref([])
  const cargando = ref(false)
  const error = ref(null)
  const cargaInicial = ref(false)

  // Computed para obtener libros por categoría desde el caché
  const librosPorCategoria = computed(() => {
    return (categoriaId) => {
      if (!categoriaId) return todosLosLibros.value
      return todosLosLibros.value.filter(libro => libro.categoria?.id === categoriaId)
    }
  })

  // Computed para novedades (IDs 1-20)
  const novedades = computed(() => {
    return todosLosLibros.value.filter(libro => libro.id >= 1 && libro.id <= 20)
  })

  // Cargar todos los libros de una sola vez
  async function cargarTodosLosLibros() {
    // Si ya cargamos antes, no volver a cargar
    if (cargaInicial.value && todosLosLibros.value.length > 0) {
      console.log('📚 Usando libros desde caché (ya cargados)')
      return { data: todosLosLibros.value, fromCache: true }
    }

    cargando.value = true
    error.value = null
    
    try {
      console.log('📡 Cargando TODOS los libros desde el backend...')
      const response = await libroService.obtenerTodos()
      
      const data = response.data
      console.log(`✅ ${data.length} libros cargados y almacenados en caché`)
      
      // Filtramos solo elementos válidos
      const librosValidos = data.filter(item => item.titulo)
      
      if (librosValidos.length !== data.length) {
        console.warn(`⚠️ Se filtraron ${data.length - librosValidos.length} elementos inválidos`)
      }
      
      todosLosLibros.value = librosValidos.length > 0 ? librosValidos : data
      cargaInicial.value = true
      
      return { data: todosLosLibros.value, fromCache: false }
      
    } catch (err) {
      console.error('❌ Error al cargar libros:', err)
      error.value = err.message
      throw err
    } finally {
      cargando.value = false
    }
  }

  // Obtener libros por categoría (usa el caché)
  async function obtenerLibrosPorCategoria(categoriaId) {
    // Asegurarse de que los libros estén cargados
    if (!cargaInicial.value) {
      await cargarTodosLosLibros()
    }
    
    return librosPorCategoria.value(categoriaId)
  }

  // Limpiar la caché
  function limpiarCache() {
    todosLosLibros.value = []
    cargaInicial.value = false
    console.log('🗑️ Caché limpiado')
  }

  return {
    todosLosLibros,
    cargando,
    error,
    cargaInicial,
    novedades,
    librosPorCategoria,
    cargarTodosLosLibros,
    obtenerLibrosPorCategoria,
    limpiarCache
  }
})
