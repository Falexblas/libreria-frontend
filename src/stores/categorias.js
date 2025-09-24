import { ref } from 'vue'
import { defineStore } from 'pinia'
import { categoriaService } from '@/services/categoriaService'

export const useCategoriasStore = defineStore('categorias', () => {
  const categorias = ref([])
  const cargandoCategorias = ref(false)
  const errorCategorias = ref(null)

  // Cargar todas las categorías
  async function cargarCategorias() {
    try {
      cargandoCategorias.value = true
      errorCategorias.value = null
      
      const response = await categoriaService.obtenerTodasLasCategorias()
      categorias.value = response.data
      
    } catch (error) {
      console.error('Error al cargar categorías:', error)
      errorCategorias.value = 'Error al cargar las categorías'
    } finally {
      cargandoCategorias.value = false
    }
  }

  return {
    categorias,
    cargandoCategorias,
    errorCategorias,
    cargarCategorias
  }
})
