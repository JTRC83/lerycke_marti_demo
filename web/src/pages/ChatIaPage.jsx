// ChatIaPage: asistente de demo orientado a la app LERYCKEMARTI.
// No es un LLM real: implementa un motor de reglas en español que responde
// consultas sobre los datos de la app (proyectos, clientes, materiales,
// presupuestos, memoria de calidades, renders) y ejecuta acciones reales
// sobre los contextos (crear cliente, material o proyecto) en memoria,
// igual que el resto de la demo. Los datos creados desaparecen al recargar.

import { useEffect, useMemo, useRef, useState } from 'react'
import { useProjects } from '../context/ProjectsContext.jsx'
import { useClientes } from '../context/ClientesContext.jsx'
import { useMateriales } from '../context/MaterialesContext.jsx'
import { formatEur } from '../data/projects.js'
import { CATEGORIAS_MATERIALES } from '../data/materiales.js'
import { memoriaMock } from '../data/memoria-calidades.js'
import { rendersMock } from '../data/renders.js'

const SUGERENCIAS = [
  'Crear un nuevo cliente',
  'Añadir un material',
  'Cuéntame los proyectos',
  '¿Cuál es el presupuesto total?',
  'Crear un proyecto',
]

// Diccionario de sinónimos para el parseo clave/valor tolerante.
const ALIAS_CAMPOS = {
  nombre: ['nombre', 'se llama', 'llamado', 'llamada', 'titulo', 'título', 'denominacion', 'denominación'],
  email: ['email', 'correo', 'mail', 'e-mail'],
  telefono: ['telefono', 'teléfono', 'tel', 'movil', 'móvil', 'fono'],
  direccion: ['direccion', 'dirección', 'dir', 'calle', 'domicilio'],
  ciudad: ['ciudad', 'poblacion', 'población', 'municipio', 'localidad', 'pueblo'],
  cif: ['cif', 'nif', 'dni'],
  categoria: ['categoria', 'categoría', 'tipo'],
  marca: ['marca'],
  modelo: ['modelo', 'ref', 'referencia'],
  precio: ['precio', 'importe', 'coste', 'valor'],
  unidad: ['unidad', 'ud', 'medida', 'unidades'],
  m2: ['m2', 'm²', 'metros', 'metros cuadrados', 'superficie'],
  proyecto: ['proyecto', 'obra', 'reforma'],
  cliente: ['cliente', 'para'],
}

// Quita tildes/diacríticos y normaliza espacios para comparaciones.
function normalizar(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

// Parseo ligero clave/valor. Acepta: "nombre X, email Y, precio 25, unidad ud"
// con comas, puntos y coma o saltos de línea como separadores y con o sin
// separador explícito (=, :, "es"). Devuelve un objeto plano.
function extraerCampos(textoOriginal) {
  const campos = {}
  if (!textoOriginal) return campos
  // Construye los alias ordenados por longitud (primero los más largos) para
  // que "teléfono" gane a "tel".
  const alias = []
  for (const [campo, variantes] of Object.entries(ALIAS_CAMPOS)) {
    for (const variante of variantes) {
      alias.push({ campo, token: normalizar(variante) })
    }
  }
  alias.sort((a, b) => b.token.length - a.token.length)

  const texto = normalizar(textoOriginal)
  // Detecta todos los alias presentes con su posición.
  const hits = []
  for (const { campo, token } of alias) {
    let desde = 0
    while (desde < texto.length) {
      const idx = texto.indexOf(token, desde)
      if (idx === -1) break
      const fin = idx + token.length
      // El alias termina si va seguido de separador o espacio.
      const siguiente = texto[fin]
      if (siguiente == null || /[\s:=]/.test(siguiente)) {
        hits.push({ campo, inicio: idx, fin, longitud: token.length })
        break
      }
      desde = fin
    }
  }
  if (hits.length === 0) return campos
  // Ordena por posición y resuelve solapamientos quedándose con el más largo.
  hits.sort((a, b) => a.inicio - b.inicio || b.longitud - a.longitud)
  const elegidos = []
  let finAnterior = -1
  for (const hit of hits) {
    if (hit.inicio >= finAnterior) {
      elegidos.push(hit)
      finAnterior = hit.fin
    }
  }
  // El valor de cada campo es el tramo original hasta el siguiente campo.
  for (let i = 0; i < elegidos.length; i++) {
    const actual = elegidos[i]
    const limite = i + 1 < elegidos.length ? elegidos[i + 1].inicio : textoOriginal.length
    let valor = textoOriginal.slice(actual.fin, limite)
    // Limpia el separador inicial y terminaciones por coma / punto y coma.
    valor = valor.replace(/^\s*(es|de nombre|:|=|se llama)?\s*/i, '')
    valor = valor.replace(/[,;\n\r]+/g, ' ').replace(/\s+/g, ' ').trim()
    if (valor && campos[actual.campo] == null) {
      campos[actual.campo] = valor
    }
  }
  return campos
}

function aNumero(str) {
  if (str == null) return null
  const normalizado = String(str).replace(/\./g, (m, i, s) =>
    // Admite "1.234,56" es-ES y "1234.56" en-US de forma tolerante.
    s.includes(',') ? '' : m,
  ).replace(',', '.').replace(/[^\d.-]/g, '')
  const n = Number(normalizado)
  return Number.isFinite(n) ? n : null
}

function primeraLetraMayus(str) {
  const s = String(str || '').trim()
  if (!s) return s
  return s
    .split(/\s+/)
    .map((p) => (p.length > 1 ? p.charAt(0).toUpperCase() + p.slice(1) : p))
    .join(' ')
}

// Renderiza el marcado simple de la IA: **negrita** y saltos de línea en <p>.
function renderMensaje(texto) {
  const parrafos = String(texto).split(/\n{2,}|\n/)
  return parrafos.map((parrafo, i) => {
    if (!parrafo.trim()) return null
    const partes = parrafo.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
    return (
      <p key={i} className="text-sm leading-relaxed text-brand-900">
        {partes.map((parte, j) =>
          parte.startsWith('**') && parte.endsWith('**') ? (
            <strong key={j}>{parte.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{parte}</span>
          ),
        )}
      </p>
    )
  })
}

export default function ChatIaPage() {
  const { projects, addProject } = useProjects()
  const { clientes, addCliente } = useClientes()
  const { materiales, addMaterial } = useMateriales()

  const [mensajes, setMensajes] = useState([
    {
      id: 'm-0',
      autor: 'ia',
      texto:
        'Hola, soy el asistente de LERYCKEMARTI.\nPuedo responderte sobre **proyectos**, **clientes**, **materiales**, **presupuestos**, **renders** y la **memoria de calidades**. También puedo crear clientes, materiales y proyectos nuevos en esta sesión.',
    },
  ])
  const [entrada, setEntrada] = useState('')
  const [escribiendo, setEscribiendo] = useState(false)
  const listaRef = useRef(null)

  useEffect(() => {
    // Autoscroll al último mensaje, pero solo si ya estás cerca del final
    // (para no arrastrarte hacia abajo si has hecho scroll hacia arriba).
    const el = listaRef.current
    if (!el) return
    const distanciaAlFinal = el.scrollHeight - el.scrollTop - el.clientHeight
    if (distanciaAlFinal < 120) {
      el.scrollTop = el.scrollHeight
    }
  }, [mensajes, escribiendo])

  const totalPresupuesto = useMemo(
    () => projects.reduce((acc, p) => acc + (Number(p.presupuestoTotal) || 0), 0),
    [projects],
  )

  function buscarCliente(nombre) {
    const objetivo = normalizar(nombre)
    if (!objetivo) return null
    return (
      clientes.find((c) => normalizar(c.nombre) === objetivo) ||
      clientes.find((c) => normalizar(c.nombre).includes(objetivo)) ||
      null
    )
  }

  // --- Consultas -----------------------------------------------------------

  function respuestaProyectos() {
    if (projects.length === 0) return 'Aún no hay proyectos en el estudio.'
    const lineas = projects.map((p) => {
      const r = p.docs?.renders || { generados: 0, total: 0 }
      return `• **${p.nombre}** — ${p.cliente || 'sin cliente'} · ${p.ciudad || 'sin ciudad'} · ${p.m2 ?? '?'} m² · ${formatEur(p.presupuestoTotal || 0)} · renders ${r.generados}/${r.total}`
    })
    return `Tienes **${projects.length}** proyecto${projects.length === 1 ? '' : 's'} en cargados:\n${lineas.join('\n')}`
  }

  function respuestaClientes() {
    if (clientes.length === 0) return 'Aún no hay clientes dados de alta.'
    const lineas = clientes.map((c) => {
      const proyecto = projects.find((p) => normalizar(p.cliente) === normalizar(c.nombre))
      return `• **${c.nombre}** — ${c.ciudad || 'sin ciudad'}${c.email ? ` · ${c.email}` : ''}${proyecto ? ` · Proyecto: ${proyecto.nombre}` : ''}`
    })
    return `Tienes **${clientes.length}** cliente${clientes.length === 1 ? '' : 's'}:\n${lineas.join('\n')}`
  }

  function respuestaMateriales() {
    if (materiales.length === 0) return 'El catálogo de materiales está vacío.'
    const lineas = materiales
      .slice(0, 8)
      .map((m) => `• **${m.nombre}** (${m.categoria}) — ${m.marca} ${m.modelo} · ${formatEur(m.precio)}/${m.unidad}`)
    const extra = materiales.length > 8 ? `\n…y ${materiales.length - 8} más.` : ''
    return `El catálogo tiene **${materiales.length}** materiales:\n${lineas.join('\n')}${extra}`
  }

  function respuestaPresupuesto() {
    const lineas = projects
      .map((p) => `• **${p.nombre}**: ${formatEur(p.presupuestoTotal || 0)}`)
      .join('\n')
    return `El **presupuesto total** del estudio es **${formatEur(totalPresupuesto)}**.\nDesglose por proyecto:\n${lineas}`
  }

  function respuestaMemoria() {
    const secciones = memoriaMock?.secciones || []
    const nMateriales = secciones.reduce((acc, s) => acc + (s.materiales?.length || 0), 0)
    const ejemplo = secciones[0]?.materiales?.[0]
    const textoEjemplo = ejemplo
      ? `Por ejemplo, en la sección ${secciones[0].numero} (${secciones[0].titulo}): **${ejemplo.nombre}** de ${ejemplo.marca} ${ejemplo.modelo}, ${ejemplo.descripcion}`
      : ''
    return `La **memoria de calidades** de ejemplo (proyecto SON POU) tiene **${secciones.length}** secciones y **${nMateriales}** fichas de material.\n${textoEjemplo}`
  }

  function respuestaRenders() {
    const generados = projects.reduce((acc, p) => acc + (p.docs?.renders?.generados || 0), 0)
    const previstos = projects.reduce((acc, p) => acc + (p.docs?.renders?.total || 0), 0)
    return `Entre todos los proyectos hay **${generados} renders generados** de ${previstos} previstos. La galería de ejemplo contiene **${rendersMock.length}** imágenes.`
  }

  function respuestaAyuda() {
    return [
      'Puedo hacer dos cosas: **consultar** los datos del estudio y **ejecutar acciones**.',
      '**Consultar:**',
      '• "Cuéntame los proyectos", "¿Cuántos clientes hay?", "Catálogo de materiales"',
      '• "¿Cuál es el presupuesto total?"',
      '• "¿Qué tienes de la memoria de calidades?"',
      '• "¿Cuántos renders hay?"',
      '**Acciones:**',
      '• **crea un cliente** llamado Casa Miramar, email ana@example.com, ciudad Palma',
      '• **añade un material** nombre Pintura plástica, categoría Pintura, marca Valentine, precio 6.5, unidad m²',
      '• **crea un proyecto** Villa Sa Pedrissa, cliente Casa Miramar, ciudad Palma, m2 180',
    ].join('\n')
  }

  // --- Acciones ------------------------------------------------------------

  function accionCrearCliente(campos) {
    const nombre = campos.nombre ? primeraLetraMayus(campos.nombre) : null
    if (!nombre) {
      return {
        respuesta:
          'Encantado de dar de alta un **cliente**.\nNecesito al menos el **nombre**. Puedes decírmelo así:\n"crea un cliente llamado Casa Miramar, email ana@example.com, ciudad Palma"',
      }
    }
    const existente = buscarCliente(nombre)
    if (existente) {
      return {
        respuesta: `Ya existe un cliente llamado **${existente.nombre}**${existente.email ? ` (${existente.email})` : ''}.`,
      }
    }
    const nuevo = {
      nombre,
      cif: campos.cif || '',
      email: campos.email || '',
      telefono: campos.telefono || '',
      direccion: campos.direccion || '',
      ciudad: campos.ciudad ? primeraLetraMayus(campos.ciudad) : '',
      codigoPostal: campos.codigoPostal || '',
    }
    addCliente(nuevo)
    return {
      respuesta: `He creado el cliente **${nuevo.nombre}**.\n${[
        nuevo.email && `Email: ${nuevo.email}`,
        nuevo.telefono && `Teléfono: ${nuevo.telefono}`,
        nuevo.direccion && `Dirección: ${nuevo.direccion}`,
        nuevo.ciudad && `Ciudad: ${nuevo.ciudad}`,
      ]
        .filter(Boolean)
        .join(' · ')}\nYa está disponible en la sección **Clientes**. Recuerda que todo lo que creas aquí se guarda **solo en memoria**, como el resto de la demo.`,
    }
  }

  function accionCrearMaterial(campos) {
    const nombre = campos.nombre ? primeraLetraMayus(campos.nombre) : null
    if (!nombre) {
      return {
        respuesta:
          'Perfecto, añadimos un **material** al catálogo.\nDime al menos el **nombre**. Ejemplo:\n"añade un material nombre Pavimento hidráulico, categoría Pavimentos, marca Huguet, precio 38, unidad m², modelo Verdi"',
      }
    }
    const categoriaOK = CATEGORIAS_MATERIALES.find(
      (c) => normalizar(c) === normalizar(campos.categoria),
    )
    const precio = aNumero(campos.precio)
    const unidad = campos.unidad || 'ud'
    const nuevo = {
      nombre,
      categoria: categoriaOK || (campos.categoria ? primeraLetraMayus(campos.categoria) : 'Mobiliario'),
      marca: campos.marca || 'Genérica',
      modelo: campos.modelo || '',
      precio: precio != null ? precio : 0,
      unidad,
      descripcion: '',
      imagen: '',
    }
    addMaterial(nuevo)
    return {
      respuesta: `He añadido el material **${nuevo.nombre}**.\nCategoría: ${nuevo.categoria} · Marca: ${nuevo.marca}${nuevo.modelo ? ` ${nuevo.modelo}` : ''} · Precio: ${formatEur(nuevo.precio)}/${nuevo.unidad}\nYa está en la sección **Materiales**. Guardado solo en memoria, como el resto de la demo.`,
    }
  }

  function accionCrearProyecto(campos) {
    const nombreProyecto = campos.nombre || campos.proyecto
      ? primeraLetraMayus(campos.nombre || campos.proyecto)
      : null
    if (!nombreProyecto) {
      return {
        respuesta:
          'Vamos a crear un **proyecto** nuevo.\nDime al menos el **nombre del proyecto** y opcionalmente el cliente, la ciudad y los m². Ejemplo:\n"crea un proyecto nombre Villa Sa Pedrissa, cliente Casa Miramar, ciudad Palma, m2 180"',
      }
    }
    const nombreCliente = campos.cliente ? primeraLetraMayus(campos.cliente) : null
    let cliente = nombreCliente ? buscarCliente(nombreCliente) : null
    let clienteCreado = false
    if (nombreCliente && !cliente) {
      const nuevoCliente = {
        nombre: nombreCliente,
        cif: '',
        email: campos.email || '',
        telefono: campos.telefono || '',
        direccion: campos.direccion || '',
        ciudad: campos.ciudad ? primeraLetraMayus(campos.ciudad) : '',
        codigoPostal: '',
      }
      addCliente(nuevoCliente)
      cliente = nuevoCliente
      clienteCreado = true
    }
    const nombreClienteFinal = cliente?.nombre || nombreCliente || 'Cliente por definir'
    const m2 = aNumero(campos.m2)
    const proyecto = {
      nombre: nombreProyecto,
      cliente: nombreClienteFinal,
      direccion: campos.direccion || '',
      ciudad: campos.ciudad ? primeraLetraMayus(campos.ciudad) : '',
      m2: m2 != null ? m2 : null,
      estancias: 0,
      presupuestoTotal: 0,
      fecha: new Date().toISOString().slice(0, 7),
      estilo: 'Pendiente de definir',
      estado: 'borrador',
      docs: {
        presupuesto: false,
        plan: false,
        memoria: false,
        renders: { generados: 0, total: 4 },
      },
    }
    const id = addProject(proyecto)
    return {
      respuesta: `He creado el proyecto **${nombreProyecto}**.\nCliente: **${nombreClienteFinal}**${clienteCreado ? ' (creado ahora mismo)' : ''} · Ciudad: ${proyecto.ciudad || 'por definir'} · m²: ${proyecto.m2 ?? 'por medir'}\nDocumentos: presupuesto · plan · memoria · renders — todos **pendientes**.\nYa lo ves en la sección **Proyectos** (id ${id}). Guardado solo en memoria, como el resto de la demo.`,
    }
  }

  // --- Motor principal -----------------------------------------------------

  function procesarMensaje(texto) {
    const limpio = normalizar(texto)

    // SALUDO
    if (/^(hola|buenas|hey|hi|buenos dias|buenas tardes|buenas noches)\b/.test(limpio)) {
      return {
        respuesta:
          '¡Hola! Soy el asistente de LERYCKEMARTI.\nPregúntame por **proyectos**, **clientes**, **materiales**, **presupuestos** o pídeme **crear** un cliente, un material o un proyecto.',
      }
    }

    // AYUDA
    if (/(ayuda|que puedes hacer|qué puedes hacer|opciones|capacidades|funcionalidades)/.test(limpio)) {
      return { respuesta: respuestaAyuda() }
    }

    // NOMBRE / QUIÉN ERES
    if (/(como te llamas|cómo te llamas|tu nombre|quien eres|quién eres)/.test(limpio)) {
      return {
        respuesta: 'Soy el **asistente de LERYCKEMARTI**, una demo que conoce los datos del estudio y puede dar de alta clientes, materiales y proyectos en esta sesión.',
      }
    }

    // ACCIONES
    const quiereAccion = /(crea|crear|anade|añade|añadir|nuevo|nueva|alta|dame de alta|registra|agrega|agregar)/.test(limpio)
    if (quiereAccion) {
      const campos = extraerCampos(texto)
      if (/cliente/.test(limpio) && !/proyecto/.test(limpio)) {
        return accionCrearCliente(campos)
      }
      if (/material/.test(limpio) && !/proyecto/.test(limpio)) {
        return accionCrearMaterial(campos)
      }
      if (/proyecto/.test(limpio)) {
        return accionCrearProyecto(campos)
      }
      return {
        respuesta: '¿Qué quieres crear? Puedo crear un **cliente**, un **material** o un **proyecto**. Dímelo con una frase como "crea un cliente llamado X".',
      }
    }

    // CONSULTAS — presupuesto antes que proyecto para que "cuál es el presupuesto
    // del proyecto X" sea cubierto por el desglose.
    if (/(presupuesto|total|cuanto|cuánto|importe|factura|dinero)/.test(limpio)) {
      return { respuesta: respuestaPresupuesto() }
    }
    if (/(proyecto|cuentame|cuéntame|lista|cuantos|cuántos)/.test(limpio) && /proyecto/.test(limpio)) {
      return { respuesta: respuestaProyectos() }
    }
    if (/cliente/.test(limpio)) {
      return { respuesta: respuestaClientes() }
    }
    if (/material/.test(limpio)) {
      return { respuesta: respuestaMateriales() }
    }
    if (/(memoria|calidades)/.test(limpio)) {
      return { respuesta: respuestaMemoria() }
    }
    if (/render/.test(limpio)) {
      return { respuesta: respuestaRenders() }
    }

    // FALLBACK
    return {
      respuesta:
        'No te he entendido del todo. Prueba con una de estas:\n• "Cuéntame los proyectos"\n• "¿Cuántos clientes hay?"\n• "¿Cuál es el presupuesto total?"\n• "Crea un cliente llamado Casa Miramar"\nO escribe **ayuda** para ver todo lo que puedo hacer.',
    }
  }

  function enviar(textoCrudo) {
    const texto = String(textoCrudo || '').trim()
    if (!texto || escribiendo) return
    const idUsuario = `m-${Date.now()}-u`
    setMensajes((prev) => [...prev, { id: idUsuario, autor: 'usuario', texto }])
    setEntrada('')
    setEscribiendo(true)
    const retardo = 600 + Math.floor(Math.random() * 300)
    setTimeout(() => {
      const { respuesta } = procesarMensaje(texto)
      setMensajes((prev) => [
        ...prev,
        { id: `m-${Date.now()}-ia`, autor: 'ia', texto: respuesta },
      ])
      setEscribiendo(false)
    }, retardo)
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviar(entrada)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-brand-800">Asistente IA</h1>
        <p className="mt-1 text-sm text-surface-muted">
          Consulta los datos del estudio y crea clientes, materiales y proyectos desde el chat.
          Demo en memoria: nada se persiste.
        </p>
      </header>

      {/* Chat card — altura ampliada para ver la conversación sin scroll */}
      <div className="flex h-[calc(100vh-200px)] min-h-[520px] max-h-[1100px] flex-col rounded-xl border border-brand-100 bg-surface-card shadow-sm">
        {/* Lista de mensajes */}
        <div ref={listaRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {mensajes.map((m) => (
            <div key={m.id} className={m.autor === 'usuario' ? 'flex justify-end' : 'flex justify-start'}>
              <div
                className={
                  m.autor === 'usuario'
                    ? 'max-w-[75%] rounded-2xl rounded-br-sm bg-brand-800 px-4 py-3 text-sm text-white'
                    : 'max-w-[75%] rounded-2xl rounded-bl-sm border border-brand-100 bg-brand-50 px-4 py-3'
                }
              >
                {m.autor === 'ia' ? renderMensaje(m.texto) : <p className="whitespace-pre-line">{m.texto}</p>}
              </div>
            </div>
          ))}
          {escribiendo ? (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-2xl rounded-bl-sm border border-brand-100 bg-brand-50 px-4 py-3">
                <p className="text-sm text-brand-700 italic">Escribiendo...</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Sugerencias */}
        <div className="border-t border-brand-100 px-6 pt-3">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-surface-muted">
            Sugerencias
          </p>
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGERENCIAS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => enviar(s)}
                className="rounded-full border border-brand-200 bg-white px-3 py-1 text-xs text-brand-800 transition-colors hover:bg-brand-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-brand-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Pregunta por proyectos, o pido que cree algo: «crea un cliente llamado Casa Miramar, email ana@example.com»"
              className="flex-1 rounded-lg border border-brand-200 bg-white px-4 py-2.5 text-sm text-brand-900 placeholder:text-surface-muted focus:border-brand-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => enviar(entrada)}
              disabled={!entrada.trim() || escribiendo}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Enviar
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
