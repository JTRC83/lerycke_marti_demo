// Mock memoria de calidades for SON POU (PRD 06). 8 secciones con fichas reales.
// Cada ficha tiene una foto real (Unsplash) del material correspondiente.

// Foto por seccion: la del primer material de esa seccion (fallback si una
// ficha anadida a mano no trae imagen propia).
const IMAGEN_SECCION = {
  '04.1': 'https://images.unsplash.com/photo-1762633203398-d4432b5269b1?w=200&h=200&fit=crop',
  '04.2': 'https://images.unsplash.com/photo-1633821051688-fc558b716185?w=200&h=200&fit=crop',
  '04.3': 'https://images.unsplash.com/photo-1625826873170-a51613ec8b96?w=200&h=200&fit=crop',
  '04.4': 'https://images.unsplash.com/photo-1513492503952-08111373606b?w=200&h=200&fit=crop',
  '04.5': 'https://images.unsplash.com/photo-1569597967185-cd6120712154?w=200&h=200&fit=crop',
  '04.6': 'https://images.unsplash.com/photo-1705909944158-5325de9bb3a7?w=200&h=200&fit=crop',
  '04.7': 'https://images.unsplash.com/photo-1784853864312-c8f88ab55493?w=200&h=200&fit=crop',
  '04.8': 'https://images.unsplash.com/photo-1778936317684-291cfdbad2b5?w=200&h=200&fit=crop',
}

// Fotos extra por seccion: segunda imagen para secciones con varios materiales.
const IMAGENES_EXTRA = {
  '04.1': ['https://images.unsplash.com/photo-1573345173719-5fbd4783d3c8?w=200&h=200&fit=crop'],
  '04.3': ['https://images.unsplash.com/photo-1780863170555-2b29e6f85ee8?w=200&h=200&fit=crop'],
  '04.4': ['https://images.unsplash.com/photo-1736593319421-250e17bb2f11?w=200&h=200&fit=crop'],
  '04.6': ['https://images.unsplash.com/photo-1667312939978-64cf31718a6e?w=200&h=200&fit=crop'],
  '04.8': ['https://images.unsplash.com/photo-1617638924751-cc232f82ecf9?w=200&h=200&fit=crop'],
}

function imagenDeSeccion(numero, indice) {
  const base = IMAGEN_SECCION[numero]
  const extra = (IMAGENES_EXTRA[numero] || [])[indice]
  return extra || base || IMAGEN_SECCION['04.1']
}

// Devuelve la imagen de una ficha: la suya, o la de su seccion (un material
// sin imagen nunca aparece con una imagen generica repetida de otra seccion).
export function resolveImagenFicha(ficha, seccionNumero, indiceEnSeccion = 0) {
  return ficha.imagen || imagenDeSeccion(seccionNumero, indiceEnSeccion)
}

export const memoriaMock = {
  secciones: [
    {
      id: 'sec-04-1',
      numero: '04.1',
      titulo: 'PAVIMENTOS',
      materiales: [
        {
          id: 'fic-01',
          nombre: 'Porcelánico arcilla 60x60cm',
          marca: 'Keraben',
          modelo: 'Mixit beige',
          descripcion: 'Alta resistencia, aspecto barro cocido. Absorción <0,5%.',
          ubicacion: 'Salón, cocina, dormitorios',
          imagen: 'https://images.unsplash.com/photo-1762633203398-d4432b5269b1?w=200&h=200&fit=crop',
        },
        {
          id: 'fic-02',
          nombre: 'Microcemento arcilla',
          marca: 'Topciment',
          modelo: 'Maren Arcilla',
          descripcion: 'Revestimiento continuo 3 capas. Sellado poliuretano.',
          ubicacion: 'Baños',
          imagen: 'https://images.unsplash.com/photo-1573345173719-5fbd4783d3c8?w=200&h=200&fit=crop',
        },
      ],
    },
    {
      id: 'sec-04-2',
      numero: '04.2',
      titulo: 'REVESTIMIENTOS',
      materiales: [
        {
          id: 'fic-03',
          nombre: 'Pintura Cornforth White',
          marca: 'Farrow & Ball',
          modelo: 'Cornforth White',
          descripcion: 'Alta calidad, acabado mate. 2 manos. Sin VOC.',
          ubicacion: 'Todas las paredes',
          imagen: 'https://images.unsplash.com/photo-1633821051688-fc558b716185?w=200&h=200&fit=crop',
        },
      ],
    },
    {
      id: 'sec-04-3',
      numero: '04.3',
      titulo: 'FALSOS TECHOS',
      materiales: [
        {
          id: 'fic-04',
          nombre: 'Escayola continua',
          marca: 'Placo',
          modelo: 'Standard',
          descripcion: 'Falso techo continuo. Acabado liso. Iluminación empotrada.',
          ubicacion: 'Salón, cocina, baños',
          imagen: 'https://images.unsplash.com/photo-1625826873170-a51613ec8b96?w=200&h=200&fit=crop',
        },
        {
          id: 'fic-05',
          nombre: 'Vigas madera vista',
          marca: 'Madera recuperada',
          modelo: 'Natural',
          descripcion: 'Vigas originales tratadas. Anti-xilófagos, aceitado.',
          ubicacion: 'Salón-comedor',
          imagen: 'https://images.unsplash.com/photo-1780863170555-2b29e6f85ee8?w=200&h=200&fit=crop',
        },
      ],
    },
    {
      id: 'sec-04-4',
      numero: '04.4',
      titulo: 'CARPINTERÍA',
      materiales: [
        {
          id: 'fic-06',
          nombre: 'Puerta lacada blanco mate',
          marca: 'Mab',
          modelo: 'Model 4G',
          descripcion: 'Ciegas, lacadas blanco mate. Marco MDF. Bisagra oculta.',
          ubicacion: '7 estancias',
          imagen: 'https://images.unsplash.com/photo-1513492503952-08111373606b?w=200&h=200&fit=crop',
        },
        {
          id: 'fic-07',
          nombre: 'Aluminio COR 70',
          marca: 'Cortizo',
          modelo: 'PE7012TD',
          descripcion: 'Perfilería aluminio texturizado mate. Persianas pala plana.',
          ubicacion: 'Ventanas exterior',
          imagen: 'https://images.unsplash.com/photo-1736593319421-250e17bb2f11?w=200&h=200&fit=crop',
        },
      ],
    },
    {
      id: 'sec-04-5',
      numero: '04.5',
      titulo: 'SANITARIOS Y GRIFERÍA',
      materiales: [
        {
          id: 'fic-08',
          nombre: 'Inodoro suspendido',
          marca: 'Roca',
          modelo: 'The Gap Square',
          descripcion: 'Cisterna Geberit oculta. Tapa soft-close. Doble descarga.',
          ubicacion: 'Baños 1 y 2',
          imagen: 'https://images.unsplash.com/photo-1569597967185-cd6120712154?w=200&h=200&fit=crop',
        },
        {
          id: 'fic-09',
          nombre: 'Grifería termostática',
          marca: 'TRES',
          modelo: 'Therm-Box',
          descripcion: '2 vías níquel cepillado. Para ducha.',
          ubicacion: 'Baños',
          imagen: 'https://images.unsplash.com/photo-1552143232-454554411763?w=200&h=200&fit=crop',
        },
      ],
    },
    {
      id: 'sec-04-6',
      numero: '04.6',
      titulo: 'ILUMINACIÓN',
      materiales: [
        {
          id: 'fic-10',
          nombre: 'Foco empotrable',
          marca: 'Beneito Faure',
          modelo: '3,5W 3000K',
          descripcion: 'LED integrado. Color 3000K. Empotrable yeso.',
          ubicacion: 'Salón, pasillo, baños',
          imagen: 'https://images.unsplash.com/photo-1705909944158-5325de9bb3a7?w=200&h=200&fit=crop',
        },
        {
          id: 'fic-11',
          nombre: 'Lámpara cerámica',
          marca: 'Artesanía mallorquina',
          modelo: 'E27',
          descripcion: 'Difusor esmaltado. Cable textil. E27. LED 2700K.',
          ubicacion: 'Salón, comedor',
          imagen: 'https://images.unsplash.com/photo-1667312939978-64cf31718a6e?w=200&h=200&fit=crop',
        },
      ],
    },
    {
      id: 'sec-04-7',
      numero: '04.7',
      titulo: 'MECANISMOS',
      materiales: [
        {
          id: 'fic-12',
          nombre: 'Enchufes e interruptores',
          marca: 'JUNG',
          modelo: 'LS 990',
          descripcion: 'Serie LS 990. Enchufes, interruptores, TV/datos.',
          ubicacion: 'Toda la vivienda',
          imagen: 'https://images.unsplash.com/photo-1784853864312-c8f88ab55493?w=200&h=200&fit=crop',
        },
      ],
    },
    {
      id: 'sec-04-8',
      numero: '04.8',
      titulo: 'MOBILIARIO',
      materiales: [
        {
          id: 'fic-13',
          nombre: 'Sofá lino arena',
          marca: 'Lerycke Martí',
          modelo: '3 plazas',
          descripcion: 'Lino natural. Estructura madera. Cojines plumas.',
          ubicacion: 'Salón-comedor',
          imagen: 'https://images.unsplash.com/photo-1778936317684-291cfdbad2b5?w=200&h=200&fit=crop',
        },
        {
          id: 'fic-14',
          nombre: 'Mesa comedor olivo',
          marca: 'Lerycke Martí',
          modelo: 'Natural',
          descripcion: 'Madera maciza olivo. Borde natural. Base metal negro.',
          ubicacion: 'Salón-comedor',
          imagen: 'https://images.unsplash.com/photo-1617638924751-cc232f82ecf9?w=200&h=200&fit=crop',
        },
      ],
    },
  ],
  totalCategorias: 8,
  formato: 'A4 horizontal · Estética Lerycke Martí Design',
}

// Simulates generation. Returns the mock after a delay.
export function generarMemoria() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(memoriaMock), 1200)
  })
}