// Mock materials catalog with real brands from the studio's projects.
// Each material has a category, brand, model, price per m² (or per unit).

export const CATEGORIAS_MATERIALES = [
  'Pavimentos',
  'Revestimientos',
  'Falsos techos',
  'Carpintería',
  'Sanitarios y grifería',
  'Iluminación',
  'Mecanismos',
  'Pintura',
  'Mobiliario',
]

export const materialesSeed = [
  { id: 'mat-001', nombre: 'Porcelánico arcilla 60x60cm', categoria: 'Pavimentos', marca: 'Keraben', modelo: 'Mixit beige', precio: 25.00, unidad: 'm²', descripcion: 'Alta resistencia, aspecto barro cocido. Absorción <0,5%.' },
  { id: 'mat-002', nombre: 'Microcemento arcilla', categoria: 'Pavimentos', marca: 'Topciment', modelo: 'Maren Arcilla', precio: 45.00, unidad: 'm²', descripcion: 'Revestimiento continuo 3 capas. Sellado poliuretano.' },
  { id: 'mat-003', nombre: 'Pintura Cornforth White', categoria: 'Pintura', marca: 'Farrow & Ball', modelo: 'Cornforth White', precio: 8.50, unidad: 'm²', descripcion: 'Alta calidad, acabado mate. 2 manos. Sin VOC.' },
  { id: 'mat-004', nombre: 'Escayola continua', categoria: 'Falsos techos', marca: 'Placo', modelo: 'Standard', precio: 22.00, unidad: 'm²', descripcion: 'Falso techo continuo. Acabado liso. Iluminación empotrada.' },
  { id: 'mat-005', nombre: 'Puerta lacada blanco mate', categoria: 'Carpintería', marca: 'Mab', modelo: 'Model 4G', precio: 280.00, unidad: 'ud', descripcion: 'Ciegas, lacadas blanco mate. Marco MDF. Bisagra oculta.' },
  { id: 'mat-006', nombre: 'Aluminio COR 70', categoria: 'Carpintería', marca: 'Cortizo', modelo: 'COR 70 PE7012TD', precio: 180.00, unidad: 'm²', descripcion: 'Perfilería aluminio texturizado mate. Persianas pala plana.' },
  { id: 'mat-007', nombre: 'Inodoro suspendido', categoria: 'Sanitarios y grifería', marca: 'Roca', modelo: 'The Gap Square', precio: 320.00, unidad: 'ud', descripcion: 'Cisterna Geberit oculta. Tapa soft-close. Doble descarga.' },
  { id: 'mat-008', nombre: 'Grifería termostática', categoria: 'Sanitarios y grifería', marca: 'TRES', modelo: 'Therm-Box', precio: 150.00, unidad: 'ud', descripcion: '2 vías níquel cepillado. Para ducha.' },
  { id: 'mat-009', nombre: 'Foco empotrable LED', categoria: 'Iluminación', marca: 'Beneito Faure', modelo: '3,5W 3000K', precio: 18.00, unidad: 'ud', descripcion: 'LED integrado. Color 3000K. Empotrable yeso.' },
  { id: 'mat-010', nombre: 'Enchufes e interruptores', categoria: 'Mecanismos', marca: 'JUNG', modelo: 'LS 990', precio: 35.00, unidad: 'ud', descripcion: 'Serie LS 990. Enchufes, interruptores, TV/datos.' },
  { id: 'mat-011', nombre: 'Sofá lino arena 3 plazas', categoria: 'Mobiliario', marca: 'Lerycke Martí', modelo: '3 plazas', precio: 1200.00, unidad: 'ud', descripcion: 'Lino natural. Estructura madera. Cojines plumas.' },
  { id: 'mat-012', nombre: 'Mesa comedor olivo', categoria: 'Mobiliario', marca: 'Lerycke Martí', modelo: 'Natural', precio: 850.00, unidad: 'ud', descripcion: 'Madera maciza olivo. Borde natural. Base metal negro.' },
]