import { useState } from 'react'
import { useProjects } from '../../../context/ProjectsContext.jsx'
import {
  generarPresupuesto,
  presupuestoMock,
  importePartida,
  subtotalCapitulo,
  baseImponible,
  ivaImporte,
  totalPresupuesto,
} from '../../../data/presupuesto.js'
import { formatEur } from '../../../data/projects.js'

// PresupuestoTab: budget generation with chapters, items, IVA and total (PRD 04).

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

function CapituloTable({ cap }) {
  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl overflow-hidden">
      <div className="px-4 py-2 bg-brand-50">
        <h4 className="text-sm font-semibold text-brand-900">{cap.nombre}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-surface-muted border-b border-brand-100">
              <th className="px-3 py-2 font-medium">REF</th>
              <th className="px-3 py-2 font-medium">Descripción</th>
              <th className="px-3 py-2 font-medium text-right">UD</th>
              <th className="px-3 py-2 font-medium text-right">Cant.</th>
              <th className="px-3 py-2 font-medium text-right">Precio</th>
              <th className="px-3 py-2 font-medium text-right">Importe</th>
            </tr>
          </thead>
          <tbody>
            {cap.partidas.map((p) => (
              <tr key={p.ref} className="border-b border-brand-50 last:border-0">
                <td className="px-3 py-2 text-surface-muted">{p.ref}</td>
                <td className="px-3 py-2 text-brand-900">{p.descripcion}</td>
                <td className="px-3 py-2 text-right text-surface-muted">{p.ud}</td>
                <td className="px-3 py-2 text-right text-brand-800">{p.cantidad.toFixed(2)}</td>
                <td className="px-3 py-2 text-right text-brand-800">{formatEur(p.precio)}</td>
                <td className="px-3 py-2 text-right font-medium text-brand-900">{formatEur(importePartida(p))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-brand-50/50">
              <td colSpan={5} className="px-3 py-2 text-right text-xs font-medium text-surface-muted uppercase tracking-wider">Subtotal {cap.nombre}</td>
              <td className="px-3 py-2 text-right font-semibold text-brand-900">{formatEur(subtotalCapitulo(cap))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

function PresupuestoGenerated({ proyecto, onVerify }) {
  const presu = presupuestoMock
  const verificado = proyecto.docs?.presupuesto === true
  const base = baseImponible(presu)
  const iva = ivaImporte(presu)
  const total = totalPresupuesto(presu)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-brand-900">Presupuesto</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${verificado ? 'bg-state-success/10 text-state-success' : 'bg-state-warning/10 text-state-warning'}`}>
          {verificado ? 'Verificado' : 'Generado, pendiente revisión'}
        </span>
      </div>

      {presu.capitulos.map((cap) => (
        <CapituloTable key={cap.id} cap={cap} />
      ))}

      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Resumen fiscal</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-surface-muted">Base imponible</span>
            <span className="font-medium text-brand-900">{formatEur(base)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-surface-muted">IVA ({presu.iva}%)</span>
            <span className="font-medium text-brand-900">{formatEur(iva)}</span>
          </div>
          <div className="flex justify-between text-base pt-2 border-t border-brand-100">
            <span className="font-semibold text-brand-900">TOTAL</span>
            <span className="font-bold text-brand-900">{formatEur(total)}</span>
          </div>
        </div>
      </div>

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