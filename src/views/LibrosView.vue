<template>
  <div class="libros-view">
    <!-- Título de la categoría -->
    <div class="categoria-header">
      <div class="container">
        <h1 class="page-title">{{ nombreCategoria }}</h1>
        <p class="page-subtitle" v-if="categoriaActual">
          Explora nuestra selección de libros de
          {{ nombreCategoria.toLowerCase() }}
        </p>
        <p class="page-subtitle" v-else>
          Descubre todos nuestros libros disponibles
        </p>
      </div>
    </div>

    <!-- Grid de libros -->
    <div class="libros-content">
      <div class="container">
        <div v-if="cargando" class="loading">
          <div class="spinner"></div>
          <p>Cargando libros...</p>
        </div>

        <div v-else-if="error" class="error">
          <p>❌ Error al cargar los libros: {{ error }}</p>
          <button @click="cargarLibros" class="btn-retry">Reintentar</button>
        </div>

        <div v-else>
          <div class="row">
            <!-- ================== LADO IZQUIERDO: FILTROS ================== -->
            <aside class="col-12 col-md-3 mb-3">
              <div class="p-3 rounded-3 shadow-sm bg-light">
                <!-- PRECIO -->
                <h6 class="fw-bold text-uppercase">Precio</h6>
                <div class="small d-flex justify-content-between">
                  <span>S/ {{ filtro.precioMin }}</span>
                  <span>S/ {{ filtro.precioMax }}</span>
                </div>
                <input
                  type="range"
                  class="form-range"
                  :min="bounds.precioMin"
                  :max="bounds.precioMax"
                  v-model.number="filtro.precioMin"
                />
                <input
                  type="range"
                  class="form-range"
                  :min="bounds.precioMin"
                  :max="bounds.precioMax"
                  v-model.number="filtro.precioMax"
                />

                <hr />
                <!-- AUTOR -->
                <h6 class="fw-bold text-uppercase">Autor</h6>
                <select
                  class="form-select form-select-sm"
                  v-model="filtro.autor"
                >
                  <option value="">Todos</option>
                  <option v-for="a in autoresUnicos" :key="a" :value="a">
                    {{ a }}
                  </option>
                </select>

                <hr />
                <!-- EDITORIAL -->
                <h6 class="fw-bold text-uppercase">Editorial</h6>
                <select
                  class="form-select form-select-sm"
                  v-model="filtro.editorial"
                >
                  <option value="">Todas</option>
                  <option v-for="e in editorialesUnicas" :key="e" :value="e">
                    {{ e }}
                  </option>
                </select>

                <hr />
                <!-- AÑO -->
                <!-- =================== INICIO: AÑO con 2 sliders =================== -->
                <h6 class="fw-bold text-uppercase">Año</h6>
                <div class="small d-flex justify-content-between">
                  <span>{{ filtro.anioMin }}</span>
                  <span>{{ filtro.anioMax }}</span>
                </div>
                <input
                  type="range"
                  class="form-range"
                  :min="boundsAnio.min"
                  :max="boundsAnio.max"
                  v-model.number="filtro.anioMin"
                />
                <input
                  type="range"
                  class="form-range"
                  :min="boundsAnio.min"
                  :max="boundsAnio.max"
                  v-model.number="filtro.anioMax"
                />
                <!-- ==================== FIN: AÑO con 2 sliders ==================== -->

                <hr />
                <!-- STOCK -->
                <h6 class="fw-bold text-uppercase">Stock</h6>
                <select
                  class="form-select form-select-sm"
                  v-model="filtro.stock"
                >
                  <option value="">Todos</option>
                  <option value="disponible">Disponible</option>
                  <option value="sin-stock">Sin stock</option>
                </select>
              </div>
            </aside>
            <!-- ================== FIN FILTROS ================== -->

            <!-- ================== LADO DERECHO: LISTA DE LIBROS ================== -->
            <section class="col-12 col-md-9">
              <div v-if="librosMostrados.length === 0" class="sin-resultados">
                <p>📚 No se encontraron libros con los filtros aplicados</p>
                <router-link to="/libros" class="btn-volver"
                  >Ver todos los libros</router-link
                >
              </div>

              <div v-else class="row g-2 g-lg-3">
                <div
                  v-for="libro in librosMostrados"
                  :key="libro.id"
                  class="col-12 col-sm-6 col-md-4 col-lg-2-4"
                >
                  <LibroCard
                    :libro="libro"
                    @agregar-carrito="agregarAlCarrito"
                    @ver-detalles="verDetalles"
                    @toggle-favorito="toggleFavorito"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import LibroCard from "@/components/libros/LibroCard.vue";
import { useCategoriasStore } from "@/stores/categorias";
import { useLibrosStore } from "@/stores/libros";

const route = useRoute();
const router = useRouter();
const categoriasStore = useCategoriasStore();
const librosStore = useLibrosStore();

const cargando = computed(() => librosStore.cargando);
const error = computed(() => librosStore.error);

const categoriaActual = computed(() => {
  return route.params.id ? parseInt(route.params.id) : null;
});

const nombreCategoria = computed(() => {
  if (!categoriaActual.value) return "Todos los Libros";

  // Buscar tanto en categorías principales como en subcategorías
  for (const c of categoriasStore.categorias) {
    if (c && c.id === categoriaActual.value) return c.nombre;
    if (c && Array.isArray(c.subcategorias)) {
      const sub = c.subcategorias.find((s) => s.id === categoriaActual.value);
      if (sub) return sub.nombre;
    }
  }

  return "Categoría no encontrada";
});

const terminoBusqueda = computed(() => {
  return route.query.busqueda
    ? String(route.query.busqueda).trim().toLowerCase()
    : "";
});

const librosFiltrados = computed(() => {
  if (terminoBusqueda.value) {
    const q = terminoBusqueda.value;
    return librosStore.todosLosLibros.filter((libro) => {
      const titulo = (libro.titulo || "").toString().toLowerCase();
      const autor = (
        typeof libro.autor === "string"
          ? libro.autor
          : `${libro.autor?.nombre || ""} ${libro.autor?.apellido || ""}`
      ).toLowerCase();
      const categoria = (libro.categoria?.nombre || "").toLowerCase();
      return titulo.includes(q) || autor.includes(q) || categoria.includes(q);
    });
  }

  if (!categoriaActual.value) {
    return librosStore.todosLosLibros;
  }
  return librosStore.librosPorCategoria(categoriaActual.value);
});

// =============== FILTROS ===============
const bounds = computed(() => {
  const precios = librosStore.todosLosLibros
    .map((l) => Number(l.precio ?? 0))
    .filter((p) => !Number.isNaN(p));
  const minFound = precios.length ? Math.min(...precios) : 10;
  const maxFound = precios.length ? Math.max(...precios) : 200;

  const min = Math.floor(minFound);
  // asegurar que el máximo sea al menos 100
  const max = Math.ceil(Math.max(maxFound, 100));

  return { precioMin: min, precioMax: max };
});

// ===================== INICIO: estado y límites de AÑO =====================
const filtro = ref({
  precioMin: 10,
  precioMax: 200,
  autor: "",
  editorial: "",
  anioMin: 0, // nuevo
  anioMax: 0, // nuevo
  stock: "",
});

/* ya tienes leerAnio(l); lo reutilizamos para calcular los límites */
const boundsAnio = computed(() => {
  const anios = librosStore.todosLosLibros
    .map((l) => Number(leerAnio(l)))
    .filter((n) => !Number.isNaN(n));
  const min = anios.length ? Math.min(...anios) : 1900;
  // asegurar que el máximo sea al menos 2025
  const max = anios.length ? Math.max(...anios, 2025) : 2025;
  return { min, max };
});

/* inicializar y mantener sincronizado al cambiar los datos */
watch(
  () => boundsAnio.value,
  (b) => {
    if (!filtro.value.anioMin && !filtro.value.anioMax) {
      filtro.value.anioMin = b.min;
      filtro.value.anioMax = b.max;
    } else {
      // asegurar que el rango siga dentro de los límites
      filtro.value.anioMin = Math.max(
        b.min,
        Math.min(filtro.value.anioMin, b.max)
      );
      filtro.value.anioMax = Math.min(
        b.max,
        Math.max(filtro.value.anioMax, b.min)
      );
    }
  },
  { immediate: true, deep: true }
);
// ====================== FIN: estado y límites de AÑO ======================

watch(
  bounds,
  (b) => {
    filtro.value.precioMin = b.precioMin;
    filtro.value.precioMax = b.precioMax;
  },
  { immediate: true }
);

// helpers
function leerAutor(l) {
  return (
    (typeof l.autor === "string"
      ? l.autor
      : `${l.autor?.nombre || ""} ${l.autor?.apellido || ""}`) || ""
  ).trim();
}
function leerEditorial(l) {
  return (
    (l.editorial?.nombre ?? l.editorialNombre ?? l.editorial ?? "") ||
    ""
  ).trim();
}
function leerAnio(l) {
  const src = (l.fechaPublicacion ?? l.publicadoEn ?? l.anio ?? "").toString();
  if (!src) return "";
  return /^\d{4}/.test(src) ? src.slice(0, 4) : "";
}
function leerStockEstado(l) {
  const cantidad = Number(l.stock ?? l.cantidad ?? l.inventario ?? 0);
  const disponible = l.disponible === true || cantidad > 0;
  return disponible ? "disponible" : "sin-stock";
}

// listas únicas
const autoresUnicos = computed(() => {
  const set = new Set();
  librosStore.todosLosLibros.forEach((l) => {
    const a = leerAutor(l);
    if (a) set.add(a);
  });
  return Array.from(set).sort();
});
const editorialesUnicas = computed(() => {
  const set = new Set();
  librosStore.todosLosLibros.forEach((l) => {
    const e = leerEditorial(l);
    if (e) set.add(e);
  });
  return Array.from(set).sort();
});
const aniosUnicos = computed(() => {
  const set = new Set();
  librosStore.todosLosLibros.forEach((l) => {
    const y = leerAnio(l);
    if (y) set.add(y);
  });
  return Array.from(set).sort();
});

// aplicar filtro
const librosMostrados = computed(() => {
  const min = Number(filtro.value.precioMin);
  const max = Number(filtro.value.precioMax);
  const autorFiltro = (filtro.value.autor || "").toLowerCase().trim();
  const editorialFiltro = (filtro.value.editorial || "").toLowerCase().trim();
  const stockFiltro = (filtro.value.stock || "").trim();

  return librosFiltrados.value.filter((l) => {
    const precio = Number(l.precio ?? 0);
    if (Number.isNaN(precio)) return false;
    if (precio < min || precio > max) return false;

    if (autorFiltro && !leerAutor(l).toLowerCase().includes(autorFiltro))
      return false;
    if (editorialFiltro && leerEditorial(l).toLowerCase() !== editorialFiltro)
      return false;
    if (stockFiltro && leerStockEstado(l) !== stockFiltro) return false;

    // ===================== INICIO: filtro por rango de AÑO =====================
    const yMin = Number(filtro.value.anioMin);
    const yMax = Number(filtro.value.anioMax);
    const yStr = leerAnio(l);
    if (yStr) {
      const y = Number(yStr);
      if (!Number.isNaN(y) && (y < yMin || y > yMax)) return false;
    } else {
      // excluir libros sin año. Si prefieres incluirlos, comentar la siguiente línea.
      return false;
    }
    // ====================== FIN: filtro por rango de AÑO ======================

    return true;
  });
});

// =============== CARGA INICIAL ===============
watch(
  () => route.query.busqueda,
  async (nuevo) => {
    if (nuevo && !librosStore.cargaInicial) {
      await librosStore.cargarTodosLosLibros();
    }
  }
);

async function cargarLibros() {
  try {
    if (!librosStore.cargaInicial) {
      await librosStore.cargarTodosLosLibros();
    }
  } catch (err) {
    console.error("Error al cargar libros:", err);
  }
}


function verDetalles(libro) {
  // Navegar a la página de detalles del libro
  router.push(`/libro/${libro.id}`)
}

function toggleFavorito(data) {
  // La funcionalidad de favoritos ya está manejada en LibroCard
  // No se necesita alert aquí
}

watch(
  () => route.params.id,
  () => cargarLibros()
);

onMounted(() => {
  categoriasStore.cargarCategorias();
  cargarLibros();
});
</script>

<style scoped>
.libros-view {
  min-height: 100vh;
  background: #eeebe7;
}
.categoria-header {
  background: #d4af37;
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
}
.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
  color: white;
}
.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
}
.libros-content {
  padding-bottom: 3rem;
  background: #eeebe7;
}
@media (min-width: 992px) {
  .col-lg-2-4 {
    flex: 0 0 auto;
    width: 20%;
  }
}
.form-range::-webkit-slider-thumb {
  background-color: #f4b000;
}
.form-range::-moz-range-thumb {
  background-color: #f4b000;
}
.sin-resultados {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}
.btn-volver {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #002e4d;
  color: white;
  text-decoration: none;
  border-radius: 25px;
}
.btn-volver:hover {
  background: #134464;
  transform: translateY(-2px);
}
</style>
