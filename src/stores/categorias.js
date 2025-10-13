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
        nombre: 'Ficción',
        subcategorias: [
          { id: 1, nombre: 'Ciencia Ficción' },
          { id: 2, nombre: 'Fantasía' },
          { id: 3, nombre: 'Misterio' },
          { id: 4, nombre: 'Romance' },
          { id: 8, nombre: 'Terror' },
          { id: 13, nombre: 'Aventuras' },
          { id: 12, nombre: 'Policial' }
        ]
      },
      {
        
        nombre: 'No Ficción',
        subcategorias: [
          { id: 5, nombre: 'Biografía' },
          { id: 6, nombre: 'Autoayuda' },
          { id: 7, nombre: 'Historia' },
          { id: 14, nombre: 'Filosofía' }
        ]
      },
      {
      
        nombre: 'Juvenil e Infantil',
        subcategorias: [
          { id: 9, nombre: 'Infantil' },
          { id: 11, nombre: 'Juvenil' }
        ]
      },
      {
        id: 15,
        nombre: 'Cómic/Novela Gráfica',
        subcategorias: []
      },
      {
        id: 11,
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
