// Project normalization helpers for the project sheet (PRD 03).
// The client field is a string in seed projects but an object in projects
// created by the stepper. These helpers present a single shape to the UI
// without mutating the underlying data.

// Returns the client name as a string regardless of how cliente is stored.
export function getClienteNombre(proyecto) {
  if (!proyecto || proyecto.cliente == null) return ''
  if (typeof proyecto.cliente === 'string') return proyecto.cliente
  return proyecto.cliente.nombre || ''
}

// Returns a client object with the known optional fields, normalizing the
// string-OR-object shape. Missing fields are empty strings.
export function getClienteObj(proyecto) {
  if (!proyecto) {
    return { nombre: '', cif: '', email: '', telefono: '', direccion: '', ciudad: '', codigoPostal: '' }
  }
  if (typeof proyecto.cliente === 'string') {
    return {
      nombre: proyecto.cliente,
      cif: '',
      email: '',
      telefono: '',
      direccion: proyecto.direccion || '',
      ciudad: proyecto.ciudad || '',
      codigoPostal: '',
    }
  }
  const c = proyecto.cliente || {}
  return {
    nombre: c.nombre || '',
    cif: c.cif || '',
    email: c.email || '',
    telefono: c.telefono || '',
    direccion: c.direccion || proyecto.direccion || '',
    ciudad: c.ciudad || proyecto.ciudad || '',
    codigoPostal: c.codigoPostal || '',
  }
}

// Number of rooms. The master plan is the single source of truth per PRD 03,
// so estanciasPlan wins over estancias. Falls back to 0 when neither exists.
export function getEstancias(proyecto) {
  if (!proyecto) return 0
  if (proyecto.estanciasPlan != null) return proyecto.estanciasPlan
  if (proyecto.estancias != null) return proyecto.estancias
  return 0
}

// Per-document state. Returns true/false for boolean docs and a generated
// boolean for renders (generados === total). For the "cliente" doc, truthy
// means the client name is present.
export function getDocEstado(proyecto, docKey) {
  if (!proyecto || !proyecto.docs) {
    if (docKey === 'cliente') return getClienteNombre(proyecto) !== ''
    return false
  }
  if (docKey === 'cliente') return getClienteNombre(proyecto) !== ''
  if (docKey === 'renders') {
    const r = proyecto.docs.renders || { generados: 0, total: 0 }
    return r.total > 0 && r.generados === r.total
  }
  return Boolean(proyecto.docs[docKey])
}

// Completitud of the 5 documents plus an aggregate "completo" flag.
export function getCompletitud(proyecto) {
  const cliente = getDocEstado(proyecto, 'cliente')
  const plan = getDocEstado(proyecto, 'plan')
  const presupuesto = getDocEstado(proyecto, 'presupuesto')
  const renders = getDocEstado(proyecto, 'renders')
  const memoria = getDocEstado(proyecto, 'memoria')
  return {
    cliente,
    plan,
    presupuesto,
    renders,
    memoria,
    completo: cliente && plan && presupuesto && renders && memoria,
  }
}