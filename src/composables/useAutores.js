/**
 * Composable para manejar autores de libros
 * Compatible con formato antiguo (autor) y nuevo (autores array)
 */
export function useAutores() {
  /**
   * Obtiene el nombre completo de los autores de un libro
   * @param {Object} libro - Objeto libro
   * @returns {String} - Nombres de autores separados por coma
   */
  const obtenerAutores = (libro) => {
    if (!libro) return 'Autor desconocido'
    
    // Nuevo formato: array de autores (N:M)
    if (libro.autores && Array.isArray(libro.autores) && libro.autores.length > 0) {
      return libro.autores
        .map(autor => `${autor.nombre || ''} ${autor.apellido || ''}`.trim())
        .filter(nombre => nombre)
        .join(', ') || 'Autor desconocido'
    }
    
    // Formato antiguo: objeto autor (1:N)
    if (libro.autor) {
      if (typeof libro.autor === 'object') {
        return `${libro.autor.nombre || ''} ${libro.autor.apellido || ''}`.trim() || 'Autor desconocido'
      }
      if (typeof libro.autor === 'string') {
        return libro.autor
      }
    }
    
    return 'Autor desconocido'
  }

  /**
   * Obtiene el primer autor (autor principal)
   * @param {Object} libro - Objeto libro
   * @returns {Object|null} - Objeto autor o null
   */
  const obtenerAutorPrincipal = (libro) => {
    if (!libro) return null
    
    // Nuevo formato: primer autor del array
    if (libro.autores && Array.isArray(libro.autores) && libro.autores.length > 0) {
      return libro.autores[0]
    }
    
    // Formato antiguo: objeto autor
    if (libro.autor && typeof libro.autor === 'object') {
      return libro.autor
    }
    
    return null
  }

  return {
    obtenerAutores,
    obtenerAutorPrincipal
  }
}
