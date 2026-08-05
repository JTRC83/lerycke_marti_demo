// Mock presupuesto for SON POU (PRD 04). Capítulos, partidas y totales.

export const presupuestoMock = {
  capitulos: [
    {
      id: 'cap-demolicion',
      nombre: 'DEMOLICIÓN',
      partidas: [
        { ref: 'D-01', descripcion: 'Demolición tabiquería existente', ud: 'm2', cantidad: 45.0, precio: 18.0 },
        { ref: 'D-02', descripcion: 'Retirada pavimento existente', ud: 'm2', cantidad: 95.0, precio: 12.0 },
        { ref: 'D-09', descripcion: 'Vaciado y retirada escombros', ud: 'm3', cantidad: 12.0, precio: 28.0 },
      ],
    },
    {
      id: 'cap-albanileria',
      nombre: 'ALBAÑILERÍA',
      partidas: [
        { ref: 'A-01', descripcion: 'Tabique nuevo ladrillo 7cm', ud: 'm2', cantidad: 38.0, precio: 32.0 },
        { ref: 'A-03', descripcion: 'Trasdosado placa yeso + banda', ud: 'm2', cantidad: 120.0, precio: 28.0 },
        { ref: 'A-04', descripcion: 'Solado porcelánico 60x60cm', ud: 'm2', cantidad: 95.0, precio: 25.0 },
      ],
    },
    {
      id: 'cap-carpinteria',
      nombre: 'CARPINTERÍA',
      partidas: [
        { ref: 'C-01', descripcion: 'Puerta lacada blanco mate 80x210cm', ud: 'ud', cantidad: 7.0, precio: 280.0 },
        { ref: 'C-03', descripcion: 'Ropero a medida', ud: 'm', cantidad: 12.0, precio: 450.0 },
        { ref: 'C-04', descripcion: 'Mueble cocina a medida', ud: 'm', cantidad: 8.0, precio: 520.0 },
      ],
    },
    {
      id: 'cap-mobiliario',
      nombre: 'MOBILIARIO',
      partidas: [
        { ref: 'M-01', descripcion: 'Sofá lino color arena', ud: 'ud', cantidad: 1.0, precio: 1200.0 },
        { ref: 'M-07', descripcion: 'Mesa comedor olivo', ud: 'ud', cantidad: 1.0, precio: 850.0 },
      ],
    },
    {
      id: 'cap-honorarios',
      nombre: 'HONORARIOS',
      partidas: [
        { ref: 'H-01', descripcion: 'Proyecto interiorismo', ud: 'lote', cantidad: 1.0, precio: 2500.0 },
        { ref: 'H-02', descripcion: 'Dirección de obra (3 meses)', ud: 'mes', cantidad: 3.0, precio: 800.0 },
      ],
    },
  ],
  iva: 21,
}

// Calculate importe per partida
export function importePartida(p) {
  return p.cantidad * p.precio
}

// Calculate subtotal per capítulo
export function subtotalCapitulo(cap) {
  return cap.partidas.reduce((sum, p) => sum + importePartida(p), 0)
}

// Calculate base imponible (sum of subtotals)
export function baseImponible(presu) {
  return presu.capitulos.reduce((sum, cap) => sum + subtotalCapitulo(cap), 0)
}

// Calculate IVA importe
export function ivaImporte(presu) {
  return baseImponible(presu) * (presu.iva / 100)
}

// Calculate total
export function totalPresupuesto(presu) {
  return baseImponible(presu) + ivaImporte(presu)
}

// Simulates generation. Returns the mock after a delay.
export function generarPresupuesto() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(presupuestoMock), 1200)
  })
}