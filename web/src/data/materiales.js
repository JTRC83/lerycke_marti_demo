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
  { id: 'mat-001', nombre: 'Porcelánico arcilla 60x60cm', categoria: 'Pavimentos', marca: 'Keraben', modelo: 'Mixit beige', precio: 25.00, unidad: 'm²', descripcion: 'Alta resistencia, aspecto barro cocido. Absorción <0,5%.', imagen: 'https://images.unsplash.com/photo-1762633203398-d4432b5269b1?w=300&h=300&fit=crop' },
  { id: 'mat-002', nombre: 'Microcemento arcilla', categoria: 'Pavimentos', marca: 'Topciment', modelo: 'Maren Arcilla', precio: 45.00, unidad: 'm²', descripcion: 'Revestimiento continuo 3 capas. Sellado poliuretano.', imagen: 'https://images.unsplash.com/photo-1573345173719-5fbd4783d3c8?w=300&h=300&fit=crop' },
  { id: 'mat-003', nombre: 'Pintura Cornforth White', categoria: 'Pintura', marca: 'Farrow & Ball', modelo: 'Cornforth White', precio: 8.50, unidad: 'm²', descripcion: 'Alta calidad, acabado mate. 2 manos. Sin VOC.', imagen: 'https://images.unsplash.com/photo-1633821051688-fc558b716185?w=300&h=300&fit=crop' },
  { id: 'mat-004', nombre: 'Escayola continua', categoria: 'Falsos techos', marca: 'Placo', modelo: 'Standard', precio: 22.00, unidad: 'm²', descripcion: 'Falso techo continuo. Acabado liso. Iluminación empotrada.', imagen: 'https://images.unsplash.com/photo-1625826873170-a51613ec8b96?w=300&h=300&fit=crop' },
  { id: 'mat-005', nombre: 'Puerta lacada blanco mate', categoria: 'Carpintería', marca: 'Mab', modelo: 'Model 4G', precio: 280.00, unidad: 'ud', descripcion: 'Ciegas, lacadas blanco mate. Marco MDF. Bisagra oculta.', imagen: 'https://images.unsplash.com/photo-1513492503952-08111373606b?w=300&h=300&fit=crop' },
  { id: 'mat-006', nombre: 'Aluminio COR 70', categoria: 'Carpintería', marca: 'Cortizo', modelo: 'COR 70 PE7012TD', precio: 180.00, unidad: 'm²', descripcion: 'Perfilería aluminio texturizado mate. Persianas pala plana.', imagen: 'https://images.unsplash.com/photo-1736593319421-250e17bb2f11?w=300&h=300&fit=crop' },
  { id: 'mat-007', nombre: 'Inodoro suspendido', categoria: 'Sanitarios y grifería', marca: 'Roca', modelo: 'The Gap Square', precio: 320.00, unidad: 'ud', descripcion: 'Cisterna Geberit oculta. Tapa soft-close. Doble descarga.', imagen: 'https://images.unsplash.com/photo-1569597967185-cd6120712154?w=300&h=300&fit=crop' },
  { id: 'mat-008', nombre: 'Grifería termostática', categoria: 'Sanitarios y grifería', marca: 'TRES', modelo: 'Therm-Box', precio: 150.00, unidad: 'ud', descripcion: '2 vías níquel cepillado. Para ducha.', imagen: 'https://images.unsplash.com/photo-1552143232-454554411763?w=300&h=300&fit=crop' },
  { id: 'mat-009', nombre: 'Foco empotrable LED', categoria: 'Iluminación', marca: 'Beneito Faure', modelo: '3,5W 3000K', precio: 18.00, unidad: 'ud', descripcion: 'LED integrado. Color 3000K. Empotrable yeso.', imagen: 'https://images.unsplash.com/photo-1705909944158-5325de9bb3a7?w=300&h=300&fit=crop' },
  { id: 'mat-010', nombre: 'Enchufes e interruptores', categoria: 'Mecanismos', marca: 'JUNG', modelo: 'LS 990', precio: 35.00, unidad: 'ud', descripcion: 'Serie LS 990. Enchufes, interruptores, TV/datos.', imagen: 'https://images.unsplash.com/photo-1784853864312-c8f88ab55493?w=300&h=300&fit=crop' },
  { id: 'mat-011', nombre: 'Sofá lino arena 3 plazas', categoria: 'Mobiliario', marca: 'Lerycke Martí', modelo: '3 plazas', precio: 1200.00, unidad: 'ud', descripcion: 'Lino natural. Estructura madera. Cojines plumas.', imagen: 'https://images.unsplash.com/photo-1778936317684-291cfdbad2b5?w=300&h=300&fit=crop' },
  { id: 'mat-012', nombre: 'Mesa comedor olivo', categoria: 'Mobiliario', marca: 'Lerycke Martí', modelo: 'Natural', precio: 850.00, unidad: 'ud', descripcion: 'Madera maciza olivo. Borde natural. Base metal negro.', imagen: 'https://images.unsplash.com/photo-1617638924751-cc232f82ecf9?w=300&h=300&fit=crop' },
]