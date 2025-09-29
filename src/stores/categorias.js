import { ref } from 'vue'
import { defineStore } from 'pinia'
import { categoriaService } from '@/services/categoriaService'

export const useCategoriasStore = defineStore('categorias', () => {
  const categorias = ref([])
  const cargandoCategorias = ref(false)
  const errorCategorias = ref(null)

  // Cargar todas las categorías (estáticas para mejor UX)
  function cargarCategorias() {
    // Categorías estáticas basadas en tu BD
    categorias.value = [
      { id: 1, nombre: 'Ciencia Ficción' },
      { id: 2, nombre: 'Fantasía' },
      { id: 3, nombre: 'Misterio' },
      { id: 4, nombre: 'Romance' },
      { id: 5, nombre: 'Biografía' },
      { id: 6, nombre: 'Autoayuda' },
      { id: 7, nombre: 'Historia' },
      { id: 8, nombre: 'Terror' },
      { id: 9, nombre: 'Infantil' },
      { id: 10, nombre: 'Juvenil' },
      { id: 11, nombre: 'Literatura Latinoamericana' },
      { id: 12, nombre: 'Policial' },
      { id: 13, nombre: 'Aventuras' },
      { id: 14, nombre: 'Filosofía' },
      { id: 15, nombre: 'Cómic/Novela Gráfica' }
    ]
    
    console.log('📚 Categorías cargadas:', categorias.value.length)
  }

  return {
    categorias,
    cargandoCategorias,
    errorCategorias,
    cargarCategorias
  }
})
