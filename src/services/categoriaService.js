import api from './api'

export const categoriaService = {
  // Obtener todas las categorías
  obtenerTodasLasCategorias: () => api.get('/categorias'),
  
  // Obtener categoría por ID
  obtenerCategoriaPorId: (id) => api.get(`/categorias/${id}`),
  
  // Crear nueva categoría (solo admin)
  crearCategoria: (categoria) => api.post('/categorias', categoria),
  
  // Actualizar categoría (solo admin)
  actualizarCategoria: (id, categoria) => api.put(`/categorias/${id}`, categoria),
  
  // Eliminar categoría (solo admin)
  eliminarCategoria: (id) => api.delete(`/categorias/${id}`)
}
