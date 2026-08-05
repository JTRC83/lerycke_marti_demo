// Mock memoria de calidades for SON POU (PRD 06). 8 secciones con fichas reales.

export const memoriaMock = {
  secciones: [
    {
      id: 'sec-04-1',
      numero: '04.1',
      titulo: 'PAVIMENTOS',
      materiales: [
        { id: 'fic-01', nombre: 'Porcelánico arcilla 60x60cm', marca: 'Keraben', modelo: 'Mixit beige', descripcion: 'Alta resistencia, aspecto barro cocido. Absorción <0,5%.', ubicacion: 'Salón, cocina, dormitorios' },
        { id: 'fic-02', nombre: 'Microcemento arcilla', marca: 'Topciment', modelo: 'Maren Arcilla', descripcion: 'Revestimiento continuo 3 capas. Sellado poliuretano.', ubicacion: 'Baños' },
      ],
    },
    {
      id: 'sec-04-2',
      numero: '04.2',
      titulo: 'REVESTIMIENTOS',
      materiales: [
        { id: 'fic-03', nombre: 'Pintura Cornforth White', marca: 'Farrow & Ball', modelo: 'Cornforth White', descripcion: 'Alta calidad, acabado mate. 2 manos. Sin VOC.', ubicacion: 'Todas las paredes' },
      ],
    },
    {
      id: 'sec-04-3',
      numero: '04.3',
      titulo: 'FALSOS TECHOS',
      materiales: [
        { id: 'fic-04', nombre: 'Escayola continua', marca: 'Placo', modelo: 'Standard', descripcion: 'Falso techo continuo. Acabado liso. Iluminación empotrada.', ubicacion: 'Salón, cocina, baños' },
        { id: 'fic-05', nombre: 'Vigas madera vista', marca: 'Madera recuperada', modelo: 'Natural', descripcion: 'Vigas originales tratadas. Anti-xilófagos, aceitado.', ubicacion: 'Salón-comedor' },
      ],
    },
    {
      id: 'sec-04-4',
      numero: '04.4',
      titulo: 'CARPINTERÍA',
      materiales: [
        { id: 'fic-06', nombre: 'Puerta lacada blanco mate', marca: 'Mab', modelo: 'Model 4G', descripcion: 'Ciegas, lacadas blanco mate. Marco MDF. Bisagra oculta.', ubicacion: '7 estancias' },
        { id: 'fic-07', nombre: 'Aluminio COR 70', marca: 'Cortizo', modelo: 'PE7012TD', descripcion: 'Perfilería aluminio texturizado mate. Persianas pala plana.', ubicacion: 'Ventanas exterior' },
      ],
    },
    {
      id: 'sec-04-5',
      numero: '04.5',
      titulo: 'SANITARIOS Y GRIFERÍA',
      materiales: [
        { id: 'fic-08', nombre: 'Inodoro suspendido', marca: 'Roca', modelo: 'The Gap Square', descripcion: 'Cisterna Geberit oculta. Tapa soft-close. Doble descarga.', ubicacion: 'Baños 1 y 2' },
        { id: 'fic-09', nombre: 'Grifería termostática', marca: 'TRES', modelo: 'Therm-Box', descripcion: '2 vías níquel cepillado. Para ducha.', ubicacion: 'Baños' },
      ],
    },
    {
      id: 'sec-04-6',
      numero: '04.6',
      titulo: 'ILUMINACIÓN',
      materiales: [
        { id: 'fic-10', nombre: 'Foco empotrable', marca: 'Beneito Faure', modelo: '3,5W 3000K', descripcion: 'LED integrado. Color 3000K. Empotrable yeso.', ubicacion: 'Salón, pasillo, baños' },
        { id: 'fic-11', nombre: 'Lámpara cerámica', marca: 'Artesanía mallorquina', modelo: 'E27', descripcion: 'Difusor esmaltado. Cable textil. E27. LED 2700K.', ubicacion: 'Salón, comedor' },
      ],
    },
    {
      id: 'sec-04-7',
      numero: '04.7',
      titulo: 'MECANISMOS',
      materiales: [
        { id: 'fic-12', nombre: 'Enchufes e interruptores', marca: 'JUNG', modelo: 'LS 990', descripcion: 'Serie LS 990. Enchufes, interruptores, TV/datos.', ubicacion: 'Toda la vivienda' },
      ],
    },
    {
      id: 'sec-04-8',
      numero: '04.8',
      titulo: 'MOBILIARIO',
      materiales: [
        { id: 'fic-13', nombre: 'Sofá lino arena', marca: 'Lerycke Martí', modelo: '3 plazas', descripcion: 'Lino natural. Estructura madera. Cojines plumas.', ubicacion: 'Salón-comedor' },
        { id: 'fic-14', nombre: 'Mesa comedor olivo', marca: 'Lerycke Martí', modelo: 'Natural', descripcion: 'Madera maciza olivo. Borde natural. Base metal negro.', ubicacion: 'Salón-comedor' },
      ],
    },
  ],
  totalCategorias: 8,
  formato: 'A4 horizontal - Estética Lerycke Martí Design',
}

// Simulates generation. Returns the mock after a delay.
export function generarMemoria() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(memoriaMock), 1200)
  })
}