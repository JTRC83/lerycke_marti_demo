import { useState } from 'react'
import { useProjects } from '../../../context/ProjectsContext.jsx'
import { generarPresupuesto, presupuestoMock, importePartida, subtotalCapitulo } from '../../../data/presupuesto.js'
import { formatEur } from '../../../data/projects.js'

// PresupuestoTab: editable budget with chapters, items, add/edit/delete.
// No IVA here — IVA and IRPF go on the invoice (factura), not the presupuesto.

function PresupuestoEmpty({ onGenerate }) {
  const [cargando, setCargando] = useState(false)

  async function handleGenerate() {
    setCargando(true)
    await generarPresupuesto()
    setCargando(false)
    onGenerate()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-brand-900">Presupuesto</h3>
        <span className="px-3 py-1 rounded-full bg-surface-base text-surface-muted text-xs font-medium">No generado</span>
      </div>
      <p className="text-sm text-surface-muted">El presupuesto se genera a partir del plan maestro verificado.</p>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={cargando}
        className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 disabled:opacity-60 transition-colors"
      >
        {cargando ? 'Generando presupuesto...' : 'Generar presupuesto'}
      </button>
    </div>
  )
}

function EditablePartida({ partida, onChange, onDelete }) {
  return (
    <tr className="border-b border-brand-50 last:border-0">
      <td className="px-2 py-1.5">
        <input
          type="text"
          value={partida.ref}
          onChange={(e) => onChange({ ...partida, ref: e.target.value })}
          className="w-full px-2 py-1 rounded-lg border border-brand-100 bg-white text-xs text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </td>
      <td className="px-2 py-1.5">
        <input
          type="text"
          value={partida.descripcion}
          onChange={(e) => onChange({ ...partida, descripcion: e.target.value })}
          className="w-full px-2 py-1 rounded-lg border border-brand-100 bg-white text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </td>
      <td className="px-2 py-1.5">
        <input
          type="text"
          value={partida.ud}
          onChange={(e) => onChange({ ...partida, ud: e.target.value })}
          className="w-16 px-2 py-1 rounded-lg border border-brand-100 bg-white text-xs text-surface-muted text-right focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </td>
      <td className="px-2 py-1.5">
        <input
          type="number"
          step="0.01"
          value={partida.cantidad}
          onChange={(e) => onChange({ ...partida, cantidad: parseFloat(e.target.value) || 0 })}
          className="w-20 px-2 py-1 rounded-lg border border-brand-100 bg-white text-sm text-brand-800 text-right focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </td>
      <td className="px-2 py-1.5">
        <input
          type="number"
          step="0.01"
          value={partida.precio}
          onChange={(e) => onChange({ ...partida, precio: parseFloat(e.target.value) || 0 })}
          className="w-24 px-2 py-1 rounded-lg border border-brand-100 bg-white text-sm text-brand-800 text-right focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </td>
      <td className="px-3 py-1.5 text-right font-medium text-brand-900 text-sm whitespace-nowrap">
        {formatEur(importePartida(partida))}
      </td>
      <td className="px-2 py-1.5 text-right">
        <button
          type="button"
          onClick={onDelete}
          className="w-6 h-6 rounded-lg text-surface-muted hover:text-state-danger hover:bg-red-50 flex items-center justify-center transition-colors inline-flex"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </td>
    </tr>
  )
}

function CapituloEditable({ cap, onChange, onDelete }) {
  function updatePartida(idx, nueva) {
    const partidas = [...cap.partidas]
    partidas[idx] = nueva
    onChange({ ...cap, partidas })
  }

  function deletePartida(idx) {
    onChange({ ...cap, partidas: cap.partidas.filter((_, i) => i !== idx) })
  }

  function addPartida() {
    const ref = `${cap.id.charAt(cap.id.indexOf('-') + 1).toUpperCase()}-${String(cap.partidas.length + 1).padStart(2, '0')}`
    onChange({
      ...cap,
      partidas: [...cap.partidas, { ref, descripcion: '', ud: 'm²', cantidad: 1, precio: 0 }],
    })
  }

  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl overflow-hidden">
      <div className="px-4 py-2 bg-brand-50 flex items-center justify-between">
        <input
          type="text"
          value={cap.nombre}
          onChange={(e) => onChange({ ...cap, nombre: e.target.value })}
          className="bg-transparent text-sm font-semibold text-brand-900 border-b border-transparent focus:border-brand-200 focus:outline-none flex-1"
        />
        <div className="flex items-center gap-2">
          <button type="button" onClick={addPartida} className="text-xs text-brand-700 hover:text-brand-800 font-medium">+ Partida</button>
          <button
            type="button"
            onClick={onDelete}
            className="w-6 h-6 rounded-lg text-surface-muted hover:text-state-danger hover:bg-red-50 flex items-center justify-center transition-colors"
            title="Eliminar capítulo"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-surface-muted border-b border-brand-100">
              <th className="px-2 py-2 font-medium">REF</th>
              <th className="px-2 py-2 font-medium">Descripción</th>
              <th className="px-2 py-2 font-medium text-right">UD</th>
              <th className="px-2 py-2 font-medium text-right">Cant.</th>
              <th className="px-2 py-2 font-medium text-right">Precio</th>
              <th className="px-2 py-2 font-medium text-right">Importe</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>
          <tbody>
            {cap.partidas.map((p, idx) => (
              <EditablePartida
                key={idx}
                partida={p}
                onChange={(nueva) => updatePartida(idx, nueva)}
                onDelete={() => deletePartida(idx)}
              />
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-brand-50/50">
              <td colSpan={5} className="px-3 py-2 text-right text-xs font-medium text-surface-muted uppercase tracking-wider">
                Subtotal {cap.nombre}
              </td>
              <td className="px-3 py-2 text-right font-semibold text-brand-900">{formatEur(subtotalCapitulo(cap))}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

function PresupuestoGenerated({ proyecto, onVerify }) {
  const verificado = proyecto.docs?.presupuesto === true
  const [capitulos, setCapitulos] = useState(() => presupuestoMock.capitulos.map((c) => ({ ...c, partidas: c.partidas.map((p) => ({ ...p })) })))

  function updateCapitulo(idx, nuevo) {
    setCapitulos((prev) => {
      const caps = [...prev]
      caps[idx] = nuevo
      return caps
    })
  }

  function deleteCapitulo(idx) {
    setCapitulos((prev) => prev.filter((_, i) => i !== idx))
  }

  function addCapitulo() {
    const id = `cap-${Date.now()}`
    setCapitulos((prev) => [...prev, { id, nombre: 'NUEVO CAPÍTULO', partidas: [] }])
  }

  // Base imponible = suma de subtotales (sin IVA — el IVA va en la factura)
  const base = capitulos.reduce((sum, cap) => sum + subtotalCapitulo(cap), 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-brand-900">Presupuesto</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${verificado ? 'bg-state-success/10 text-state-success' : 'bg-state-warning/10 text-state-warning'}`}>
          {verificado ? 'Verificado' : 'Generado, pendiente revisión'}
        </span>
      </div>

      <p className="text-xs text-surface-muted">
        Edita cualquier partida o capítulo directamente. Los cambios se guardan en memoria.
      </p>

      {/* Capítulos editables */}
      {capitulos.map((cap, idx) => (
        <CapituloEditable
          key={cap.id}
          cap={cap}
          onChange={(nuevo) => updateCapitulo(idx, nuevo)}
          onDelete={() => deleteCapitulo(idx)}
        />
      ))}

      {/* Añadir capítulo */}
      <button
        type="button"
        onClick={addCapitulo}
        className="w-full py-3 rounded-xl border-2 border-dashed border-brand-200 text-brand-700 text-sm font-medium hover:border-brand-300 hover:bg-brand-50/40 transition-colors"
      >
        + Añadir capítulo
      </button>

      {/* Resumen (sin IVA — solo base imponible) */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Resumen</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-surface-muted">Base imponible</span>
            <span className="font-medium text-brand-900">{formatEur(base)}</span>
          </div>
          <p className="text-xs text-surface-muted italic pt-2 border-t border-brand-100">
            IVA e IRPF se aplican al generar la factura, no en el presupuesto.
          </p>
          <div className="flex justify-between text-base pt-2">
            <span className="font-bold text-brand-900">TOTAL PRESUPUESTO</span>
            <span className="font-bold text-brand-900">{formatEur(base)}</span>
          </div>
        </div>
      </div>

      {/* Verificar */}
      {!verificado ? (
        <button
          type="button"
          onClick={onVerify}
          className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors"
        >
          Verificar presupuesto
        </button>
      ) : null}
    </div>
  )
}

export default function PresupuestoTab({ proyecto }) {
  const { updateProject } = useProjects()
  const [generado, setGenerado] = useState(proyecto.docs?.presupuesto === true)

  function handleVerify() {
    updateProject(proyecto.id, { docs: { ...proyecto.docs, presupuesto: true } })
  }

  if (!generado) {
    return <PresupuestoEmpty onGenerate={() => setGenerado(true)} />
  }
  return <PresupuestoGenerated proyecto={proyecto} onVerify={handleVerify} />
}