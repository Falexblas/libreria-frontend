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
      {
        id: 1,
        nombre: 'Ficción',
        subcategorias: [
          { id: 2, nombre: 'Ciencia Ficción' },
          { id: 3, nombre: 'Fantasía' },
          { id: 4, nombre: 'Misterio' },
          { id: 5, nombre: 'Romance' },
          { id: 6, nombre: 'Terror' },
          { id: 7, nombre: 'Aventuras' },
          { id: 8, nombre: 'Policial' }
        ]
      },
      {
        id: 9,
        nombre: 'No Ficción',
        subcategorias: [
          { id: 10, nombre: 'Biografía' },
          { id: 11, nombre: 'Autoayuda' },
          { id: 12, nombre: 'Historia' },
          { id: 13, nombre: 'Filosofía' }
        ]
      },
      {
        id: 14,
        nombre: 'Juvenil e Infantil',
        subcategorias: [
          { id: 15, nombre: 'Infantil' },
          { id: 16, nombre: 'Juvenil' }
        ]
      },
      {
        id: 18,
        nombre: 'Cómic/Novela Gráfica',
        subcategorias: []
      },
      {
        id: 17,
        nombre: 'Literatura Latinoamericana',
        subcategorias: []
      }
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
