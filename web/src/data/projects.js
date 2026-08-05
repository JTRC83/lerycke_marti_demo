// Mock projects data per PRD 01. Three demo projects with full card metadata.

export const projects = [
  {
    id: 'prj-son-pou',
    nombre: 'SON POU',
    cliente: 'Xisca i Llorenc',
    direccion: 'C/ Son Pou, 12',
    ciudad: 'Sòller, Mallorca',
    m2: 136.3,
    estancias: 9,
    presupuestoTotal: 46898.39,
    fecha: '2025-12',
    estilo: 'Rústico mediterráneo',
    estado: 'borrador',
    docs: {
      presupuesto: true,
      plan: false,
      memoria: false,
      renders: { generados: 3, total: 4 },
    },
  },
  {
    id: 'prj-cafe-bou',
    nombre: 'Cafe BOU',
    cliente: 'Cafe BOU',
    direccion: 'Av. Sagrada Familia, 8',
    ciudad: 'Palma, Mallorca',
    m2: 85.0,
    estancias: 4,
    presupuestoTotal: 32450.0,
    fecha: '2025-10',
    estilo: 'Reforma integral comercial',
    estado: 'activo',
    docs: {
      presupuesto: true,
      plan: true,
      memoria: true,
      renders: { generados: 4, total: 4 },
    },
  },
  {
    id: 'prj-magdalena-pere',
    nombre: 'Magdalena i Pere',
    cliente: 'Magdalena i Pere',
    direccion: 'C/ Sant Miquel, 45',
    ciudad: 'Sòller, Mallorca',
    m2: 72.0,
    estancias: 4,
    presupuestoTotal: 18750.0,
    fecha: '2025-11',
    estilo: 'Diseño de interiores',
    estado: 'borrador',
    docs: {
      presupuesto: true,
      plan: false,
      memoria: false,
      renders: { generados: 1, total: 4 },
    },
  },
]

// Spanish currency formatting helper (es-ES, EUR).
const euroFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatEur(value) {
  return euroFormatter.format(value)
}