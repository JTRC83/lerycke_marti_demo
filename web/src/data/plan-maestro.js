// Mock plan maestro for SON POU (PRD 03a). Simulated IA output.

export const planMaestroMock = {
  estancias: [
    { id: 'est-01', nombre: 'Salón-Comedor', tag: 'living', m2: 27.3, tipoReforma: 'Reforma completa', detalle: 'Apertura cocina-salón, vigas vistas' },
    { id: 'est-02', nombre: 'Cocina', tag: 'kitchen', m2: 14.0, tipoReforma: 'Nueva cocina', detalle: 'Península, encimera cuarzo' },
    { id: 'est-03', nombre: 'Dormitorio Principal', tag: 'bedroom', m2: 12.6, tipoReforma: 'Ropero integrado', detalle: 'Cabecero madera' },
    { id: 'est-04', nombre: 'Baño 1', tag: 'bathroom', m2: 12.0, tipoReforma: 'Reforma completa', detalle: 'Ducha obra, microcemento' },
    { id: 'est-05', nombre: 'Baño 2', tag: 'bathroom', m2: 4.0, tipoReforma: 'Reforma completa', detalle: 'Compacto' },
    { id: 'est-06', nombre: 'Terraza', tag: 'outdoor', m2: 40.6, tipoReforma: 'Mobiliario', detalle: 'Zona chill-out' },
  ],
  trabajos: [
    'Demolición', 'Albañilería', 'Fontanería', 'Electricidad',
    'Carpintería', 'Pintura', 'Microcemento', 'Iluminación', 'Mobiliario',
  ],
  materiales: [
    { id: 'mat-01', categoria: 'Pavimentos', descripcion: 'Porcelánico arcilla 60x60cm', marca: 'Keraben', modelo: 'Mixit', comentarios: '' },
    { id: 'mat-02', categoria: 'Sanitarios', descripcion: 'Inodoro suspendido The Gap Square', marca: 'Roca', modelo: 'The Gap Square', comentarios: '' },
    { id: 'mat-03', categoria: 'Grifería', descripcion: 'Termostático empotrado 2 vías', marca: 'TRES', modelo: 'Therm-Box', comentarios: '' },
    { id: 'mat-04', categoria: 'Aluminio', descripcion: 'COR 70 acabado PE7012TD', marca: 'Cortizo', modelo: 'COR 70', comentarios: '' },
    { id: 'mat-05', categoria: 'Mecanismos', descripcion: 'Enchufes LS 990', marca: 'JUNG', modelo: 'LS 990', comentarios: '' },
    { id: 'mat-06', categoria: 'Pintura', descripcion: 'Cornforth White mate', marca: 'Farrow & Ball', modelo: 'Cornforth White', comentarios: '' },
  ],
  analisisEstilo:
    'Rústico mediterráneo con materiales naturales: porcelánico arcilla, microcemento en baños, madera maciza en mobiliario, vigas vistas. Paleta en tonos terracota, arena y blanco calizo. Iluminación cálida 2700-3000K.',
  presupuestoEstimado: 42000,
  m2Totales: 136.3,
}

// Simulates IA generation. Returns the mock plan after a delay.
export function generarPlan(input) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(planMaestroMock), 1500)
  })
}