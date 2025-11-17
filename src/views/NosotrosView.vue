<template>
	
		<!-- HERO / BANNER -->
		<div class="hero-wrapper">
			<div class="container hero-content">
				<div class="hero-text">
					<h1>Sobre Nosotros</h1>
					<p class="hero-subtitle">
						Mundo de Papel es una librería creada para acercar la lectura a más personas,
						ofreciendo una experiencia de compra cercana, segura y confiable.
					</p>
					<button class="hero-cta" type="button" @click="goToLibros">Conoce todos nuestros libros</button>
				</div>
				<div class="hero-image">
					<img :src="heroImage" alt="Mundo de Papel - Sobre nosotros" />
				</div>
			</div>
		</div>

		<!-- TARJETAS: DESCRIPCIÓN / MISIÓN / VISIÓN (tipo “services”) -->
		<section class="cards-section">
			<div class="container">
				<div class="cards-header">
					<h2>Nuestro Propósito</h2>
					<p>
						Conectamos lectores con libros que inspiran, enseñan y entretienen, impulsando la cultura
						lectora en nuestra comunidad.
					</p>
				</div>

				<div class="cards-grid">
					<div class="info-card" :class="{ 'card-valores': card.title === 'Valores', 'card-mision': card.title === 'Misión', 'card-vision': card.title === 'Visión' }" v-for="(card, idx) in cards" :key="idx">
							<div class="icon-circle">
								<img v-if="card.icon" :src="card.icon" alt="" />
								<span v-else>📚</span>
							</div>
						<h3>{{ card.title }}</h3>
						<div v-if="card.items">
							<ul class="card-values mb-0">
								<li v-for="(it, j) in card.items" :key="j">{{ it }}</li>
							</ul>
						</div>
						<div v-else>
							<p>{{ card.text }}</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- QUIÉNES SOMOS + IMAGEN -->
		<section class="who-section">
			<div class="container who-grid">
				<div class="who-image">
					<div class="who-image-inner">
						<img :src="heroImage2" alt="Lectores en Mundo de Papel" />
					</div>
				</div>
				<div class="who-text">
					<h2>Quiénes Somos</h2>
					<p>
						Mundo de Papel es una librería independiente dedicada a conectar lectores con historias
						que marcan la diferencia. Creemos que cada libro puede abrir puertas, despertar ideas y
						acompañar en los momentos importantes.
					</p>
					<ul class="check-list">
						<li v-for="(item, i) in whoItems" :key="i">
							<span class="check-icon">✔</span>
							<span>{{ item }}</span>
						</li>
					</ul>
				</div>
			</div>
		</section>

		<!-- EQUIPO / TEAM + CONTADORES -->
		<section class="team-section">
			<div class="container team-wrapper">
				<div class="team-header">
					<h2>Nuestro Equipo</h2>
					<p>
						Detrás de Mundo de Papel hay un equipo comprometido en
						brindar la mejor experiencia a nuestros lectores.
					</p>
				</div>

				<div class="team-grid">
					<div v-for="(member, i) in teamMembers" :key="i" class="team-card">
						<div class="team-image">
							<img :src="teamImage" :alt="member.name" />
						</div>
						<h4>{{ member.name }}</h4>
						<p class="role">{{ member.role }}</p>
					</div>
				</div>

				<div class="stats-row">
					<div v-for="(stat, i) in stats" :key="i" class="stat-card">
						<div class="stat-number">{{ stat.number }}</div>
						<div class="stat-label">{{ stat.label }}</div>
					</div>
				</div>
			</div>
		</section>


	
</template>

<script setup>
// Ajusta las rutas según tu estructura (por ejemplo '@/assets/...' si usas alias @)
const heroImage = new URL('../assets/bannerSobreNosotros.jpg', import.meta.url).href
const heroImage2 = new URL('../assets/banner3SobreNosotros.jpg', import.meta.url).href
const teamImage = new URL('../assets/foto2.jpg', import.meta.url).href
const misionIcon = new URL('../assets/mision.png', import.meta.url).href
const visionIcon = new URL('../assets/vision.png', import.meta.url).href
const valoresIcon = new URL('../assets/valores.png', import.meta.url).href

import { useRouter } from 'vue-router'

const router = useRouter()
function goToLibros() {
	router.push({ name: 'libros' })
}

const cards = [
	
	{
		title: 'Misión',
		icon: misionIcon,
		text:
			'Acercar la lectura a más personas, ofreciendo acceso a libros de calidad, apoyo a autores locales y una experiencia de compra humana y confiable.'
	},
	{
		title: 'Visión',
		icon: visionIcon,
		text:
			'Ser la librería de referencia en nuestra comunidad, reconocida por su selección, servicio y compromiso con la cultura lectora.'
	},
	{
		title: 'Valores',
		icon: valoresIcon,
		items: [
			'Pasión por la lectura',
			'Calidad y selección',
			'Servicio humano'
		]
	}
	
]
const whoItems = [
	'Selección de libros pensada para distintos gustos y edades.',
	'Acompañamiento al lector con recomendaciones personalizadas.',
	'Compromiso con la cultura y proyectos locales.',
	'Experiencia de compra sencilla, segura y cercana.'
]

const teamMembers = [
	{ name: 'Persona 1', role: 'CEO' },
	{ name: 'Perso 2', role: 'Jefa de Marketing' },
	{ name: 'persona 3', role: 'Gerente de Ventas' },
	{ name: 'Persona 4', role: 'Jefe de Categoríae' }
]

const stats = [
	{ number: '500+', label: 'Títulos en catálogo' },
	{ number: '100+', label: 'Lectores frecuentes' },
	{ number: '50+', label: 'Autores locales apoyados' }
]

// valores removed — content now represented in cards and whoItems
</script>

<style scoped>
.sobre-nosotros-page {
	background: #f4f7f2;
	color: #122112;
	font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* HERO */
.hero-wrapper {
	background: radial-gradient(circle at top left, #186293 0, #134c73, #0f3a57 100%);
	padding: 3.5rem 0;
	color: #ffffff;
}

.hero-content {
	display: grid;
	grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
	align-items: center;
	gap: 2.5rem;
}

.hero-text h1 {
	font-size: 2.5rem;
	font-weight: 700;
	line-height: 1.2;
	margin-bottom: 1rem;
}

.hero-subtitle {
	font-size: 1rem;
	max-width: 520px;
	opacity: 0.9;
	margin-bottom: 1.5rem;
}

.hero-cta {
	border: none;
	outline: none;
	padding: 0.8rem 1.8rem;
	border-radius: 999px;
	background: #002E4D;
	color: #ffffff;
	font-weight: 600;
	cursor: pointer;
	font-size: 0.95rem;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
	transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.hero-cta:hover {
	transform: translateY(-1px);
	box-shadow: 0 14px 30px rgba(0, 0, 0, 0.3);
	background: #36526e;
}

.hero-image img {
	width: 100%;
	max-height: 340px;
	object-fit: cover;
	border-radius: 32px;
	box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
	background: #0d1f14;
}

/* TARJETAS / PROPÓSITO */
.cards-section {
	background: #EEEBE7;
	color: #000000;
	padding: 3rem 0 3.5rem;
}

.cards-header {
	text-align: center;
	max-width: 640px;
	margin: 0 auto 2rem;
}

.cards-header h2 {
	font-size: 1.8rem;
	margin-bottom: 0.5rem;
}

.cards-header p {
	opacity: 0.8;
	font-size: 0.95rem;
}

.cards-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1.5rem;
}

.info-card {
	background: #ffffff;
	border-radius: 18px;
	padding: 1.6rem 1.4rem;
	box-shadow: 0 14px 28px rgba(0, 0, 0, 0.35);
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
	align-items: center;
	text-align: center;
}

.info-card h3 {
	font-size: 1.1rem;
	font-weight: 600;
}

.info-card p {
	font-size: 0.9rem;
	opacity: 0.85;
}

/* estilos para la lista de valores (punto grueso/guiones) */
.card-values {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
	align-items: center;
}
.card-values li {
	color: rgba(255,255,255,0.95);
	font-weight: 400;
	font-size: 0.95rem; /* mismo tamaño que párrafo de Misión */
	line-height: 1.6;
	display: inline-flex;
	align-items: center;
	gap: 0.6rem;
	padding: 0;
}
.card-values li::before {
	content: '';
	display: inline-block;
	width: 9px;
	height: 9px;
	background: #4f7caa; /* color del punto grueso */
	border-radius: 50%;
}

.icon-circle {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #002E4D;
	color: #07140c;
	font-size: 1.5rem;
	margin-bottom: 0.4rem;
}

.icon-circle img {
	width: 32px;
	height: 32px;
	object-fit: contain;
}

/* Estilos específicos para la tarjeta 'Valores' */
.card-valores {
	background: #ffffff;
	color: #07140c;
}
.card-valores h3 {
	color: #07140c;
}
.card-valores .card-values li {
	color: #07140c;
}
.card-valores .icon-circle {
	background: #186293; /* volver a mostrar fondo visible para el icono */
	color: #07140c;
}
.card-valores .icon-circle img {
	filter: none;
}
.card-valores .icon-circle span {
	color: #07140c;
}

/* Misión y Visión: fondo de icono solicitado */
.card-mision .icon-circle,
.card-vision .icon-circle {
	background: #186293;
}
.card-mision .icon-circle span,
.card-vision .icon-circle span {
	color: #ffffff;
}

/* QUIÉNES SOMOS */
.who-section {
	padding: 3.5rem 0;
}

.who-grid {
	display: grid;
	grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
	gap: 2.5rem;
	align-items: center;
}

.who-image-inner {
	position: relative;
	border-radius: 30px;
	padding: 0; /* quitar espacio/borde visible */
	background: transparent; /* sin fondo para que no se vea borde */
}

.who-image-inner::before {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: 30px;
	/* borde eliminado a petición del usuario */
	display: none;
}

.who-image-inner img {
	width: 100%;
	max-height: 320px;
	object-fit: cover;
	border-radius: 24px;
	display: block;
	position: relative;
	z-index: 1;
}

/* Sombra sutil para la imagen de "Quiénes Somos" */


.who-text h2 {
	font-size: 1.8rem;
	margin-bottom: 0.75rem;
	color: #102416;
}

.who-text p {
	font-size: 0.95rem;
	color: #495b4d;
	margin-bottom: 1.1rem;
}

.check-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.6rem 1.3rem;
}

.check-list li {
	display: flex;
	align-items: flex-start;
	gap: 0.4rem;
	font-size: 0.9rem;
	color: #1d3422;
}

.check-icon {
	color: #34c759;
	font-weight: 700;
	margin-top: 1px;
}

/* TEAM */
.team-section {
	background: #b1c2d3;
	padding: 3.5rem 0;
}

.team-wrapper {
	max-width: 1100px;
}

.team-header {
	text-align: center;
	max-width: 620px;
	margin: 0 auto 2rem;
}

.team-header h2 {
	font-size: 1.7rem;
	margin-bottom: 0.5rem;
	color: #102416;
}

.team-header p {
	font-size: 0.95rem;
	color: #425345;
}

.team-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1.5rem;
	margin-bottom: 2rem;
}

.team-card {
	background: #ffffff;
	border-radius: 18px;
	padding: 1.2rem 1rem 1.4rem;
	text-align: center;
	box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
}

.team-image img {
	width: 96px;
	height: 96px;
	border-radius: 50%;
	object-fit: cover;
	margin-bottom: 0.8rem;
}

.team-card h4 {
	font-size: 1rem;
	font-weight: 600;
	margin-bottom: 0.25rem;
	color: #102416;
}

.team-card .role {
	font-size: 0.85rem;
	color: #6a7b6d;
}

/* STATS */
.stats-row {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1rem;
}

.stat-card {
	background: #186293;
	color: #ffffff;
	border-radius: 12px;
	padding: 0.9rem 1rem;
	text-align: center;
	font-weight: 600;
}

.stat-number {
	font-size: 1.4rem;
	margin-bottom: 0.15rem;
}

.stat-label {
	font-size: 0.85rem;
}

/* VALORES */
.values-section {
	padding: 3.5rem 0 4rem;
}

.values-section h2 {
	text-align: center;
	font-size: 1.7rem;
	margin-bottom: 2rem;
	color: #102416;
}

.values-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1.4rem;
}

.value-card {
	background: #ffffff;
	border-radius: 16px;
	padding: 1.3rem 1.2rem;
	box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.value-card h3 {
	font-size: 1rem;
	margin-bottom: 0.4rem;
	color: #12351f;
}

.value-card p {
	font-size: 0.9rem;
	color: #56685a;
}

/* RESPONSIVE */
@media (max-width: 992px) {
	.hero-content {
		grid-template-columns: minmax(0, 1fr);
	}

	.hero-image {
		order: -1;
	}

	.cards-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.who-grid {
		grid-template-columns: minmax(0, 1fr);
	}

	.check-list {
		grid-template-columns: minmax(0, 1fr);
	}

	.team-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.values-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 576px) {
	.hero-wrapper {
		padding: 2.5rem 0 2.8rem;
	}

	.hero-text h1 {
		font-size: 1.9rem;
	}

	.cards-grid,
	.team-grid,
	.stats-row,
	.values-grid {
		grid-template-columns: minmax(0, 1fr);
	}

	.hero-image img {
		max-height: 260px;
	}

	.who-section,
	.team-section,
	.values-section {
		padding-inline: 0;
	}
}
</style>