import { useState, useMemo } from 'react'
import { useMateriales } from '../context/MaterialesContext.jsx'
import { CATEGORIAS_MATERIALES } from '../data/materiales.js'
import { formatEur } from '../data/projects.js'

// MaterialesPage: CRUD of materials catalog categorized with price per m².

const EMPTY_FORM = {
  nombre: '',
  categoria: '',
  marca: '',
  modelo: '',
  precio: '',
  unidad: 'm²',
  descripcion: '',
}

const UNIDADES = ['m²', 'ud', 'm', 'lote', 'mes']

function MaterialRow({ material, onEdit, onDelete }) {
  return (
    <tr className="border-b border-brand-50 last:border-0 hover:bg-brand-50/30 transition-colors">
      <td className="px-3 py-2.5 text-sm font-medium text-brand-900">{material.nombre}</td>
      <td className="px-3 py-2.5">
        <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-medium">{material.categoria}</span>
      </td>
      <td className="px-3 py-2.5 text-sm text-brand-800">{material.marca}</td>
      <td className="px-3 py-2.5 text-sm text-surface-muted">{material.modelo}</td>
      <td className="px-3 py-2.5 text-sm font-semibold text-brand-900 text-right">{formatEur(material.precio)}</td>
      <td className="px-3 py-2.5 text-xs text-surface-muted text-center">{material.unidad}</td>
      <td className="px-3 py-2.5 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(material)}
            className="w-7 h-7 rounded-lg text-brand-700 hover:bg-brand-50 flex items-center justify-center transition-colors"
            title="Editar"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9" strokeLinecap="round" strokeLinejoin="round" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(material)}
            className="w-7 h-7 rounded-lg text-surface-muted hover:text-state-danger hover:bg-red-50 flex items-center justify-center transition-colors"
            title="Eliminar"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </td>
    </tr>
  )
}

function MaterialModal({ material, onClose, onGuardar, categorias }) {
  const esEdicion = !!material?.id
  const [form, setForm] = useState(material || EMPTY_FORM)
  const [errors, setErrors] = useState({})

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit() {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio.'
    if (!form.categoria) e.categoria = 'Selecciona una categoría.'
    if (!form.precio || isNaN(parseFloat(form.precio))) e.precio = 'Introduce un precio válido.'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    onGuardar({
      ...form,
      precio: parseFloat(form.precio),
      id: esEdicion ? material.id : undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-brand-100 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-lg font-semibold text-brand-900">{esEdicion ? 'Editar material' : 'Nuevo material'}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-base text-surface-muted flex items-center justify-center hover:bg-brand-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-800 mb-1">Nombre <span className="text-state-danger">*</span></label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => updateField('nombre', e.target.value)}
              placeholder="Ej: Porcelánico arcilla 60x60cm"
              className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition"
            />
            {errors.nombre ? <p className="mt-1 text-xs text-state-danger">{errors.nombre}</p> : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-800 mb-1">Categoría <span className="text-state-danger">*</span></label>
              <select
                value={form.categoria}
                onChange={(e) => updateField('categoria', e.target.value)}
                className="w-full appearance-none px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition"
              >
                <option value="">Seleccionar...</option>
                {categorias.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.categoria ? <p className="mt-1 text-xs text-state-danger">{errors.categoria}</p> : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-800 mb-1">Unidad</label>
              <select
                value={form.unidad}
                onChange={(e) => updateField('unidad', e.target.value)}
                className="w-full appearance-none px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition"
              >
                {UNIDADES.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-800 mb-1">Marca</label>
              <input
                type="text"
                value={form.marca}
                onChange={(e) => updateField('marca', e.target.value)}
                placeholder="Ej: Keraben"
                className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-800 mb-1">Modelo</label>
              <input
                type="text"
                value={form.modelo}
                onChange={(e) => updateField('modelo', e.target.value)}
                placeholder="Ej: Mixit beige"
                className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-800 mb-1">Precio <span className="text-state-danger">*</span></label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={form.precio}
                onChange={(e) => updateField('precio', e.target.value)}
                placeholder="0,00"
                className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-surface-muted">€/{form.unidad}</span>
            </div>
            {errors.precio ? <p className="mt-1 text-xs text-state-danger">{errors.precio}</p> : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-800 mb-1">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => updateField('descripcion', e.target.value)}
              placeholder="Descripción técnica del material..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition resize-y"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-brand-100 px-6 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-brand-200 text-brand-800 text-sm font-medium hover:bg-surface-base transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors"
          >
            {esEdicion ? 'Guardar cambios' : 'Añadir material'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ material, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-brand-900 mb-2">Eliminar material</h3>
        <p className="text-sm text-surface-muted mb-5">
          ¿Seguro que quieres eliminar <span className="font-medium text-brand-900">{material.nombre}</span>?
          Esta acción no se puede deshacer.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-brand-200 text-brand-800 text-sm font-medium hover:bg-surface-base transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-state-danger text-white text-sm font-medium hover:opacity-90 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MaterialesPage() {
  const { materiales, addMaterial, updateMaterial, deleteMaterial } = useMateriales()
  const [query, setQuery] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [modalAbierto, setModalAbierto] = useState(null) // null | 'nuevo' | material
  const [materialEliminar, setMaterialEliminar] = useState(null)

  // Filtered materials
  const filtrados = useMemo(() => {
    const hay = query.trim().toLowerCase()
    return materiales.filter((m) => {
      const matchQuery = !hay ||
        m.nombre.toLowerCase().includes(hay) ||
        m.marca.toLowerCase().includes(hay) ||
        m.modelo.toLowerCase().includes(hay)
      const matchCategoria = !filtroCategoria || m.categoria === filtroCategoria
      return matchQuery && matchCategoria
    })
  }, [materiales, query, filtroCategoria])

  // Count per category
  const countsPorCategoria = useMemo(() => {
    const counts = {}
    CATEGORIAS_MATERIALES.forEach((c) => {
      counts[c] = materiales.filter((m) => m.categoria === c).length
    })
    return counts
  }, [materiales])

  function handleGuardar(material) {
    if (material.id) {
      updateMaterial(material.id, material)
    } else {
      addMaterial(material)
    }
    setModalAbierto(null)
  }

  function handleEliminar(material) {
    setMaterialEliminar(material)
  }

  function confirmarEliminar() {
    if (materialEliminar) {
      deleteMaterial(materialEliminar.id)
      setMaterialEliminar(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-brand-900">Materiales</h2>
          <p className="mt-1 text-sm text-surface-muted">
            Catálogo de materiales categorizado con precios. {materiales.length} materiales registrados.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalAbierto('nuevo')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Nuevo material
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <svg className="w-4 h-4 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, marca o modelo..."
            className="w-full pl-10 pr-4 py-2 text-sm text-brand-900 placeholder:text-surface-muted bg-surface-base border border-brand-100 rounded-lg focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFiltroCategoria('')}
            className={filtroCategoria === ''
              ? 'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border bg-brand-700 text-white border-brand-700 transition-colors'
              : 'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border bg-surface-card text-brand-800 border-brand-100 hover:border-brand-300 transition-colors'}
          >
            Todos
            <span className={`text-xs ${filtroCategoria === '' ? 'text-white/70' : 'text-surface-muted'}`}>{materiales.length}</span>
          </button>
          {CATEGORIAS_MATERIALES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFiltroCategoria(c)}
              className={filtroCategoria === c
                ? 'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border bg-brand-700 text-white border-brand-700 transition-colors'
                : 'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border bg-surface-card text-brand-800 border-brand-100 hover:border-brand-300 transition-colors'}
            >
              {c}
              <span className={`text-xs ${filtroCategoria === c ? 'text-white/70' : 'text-surface-muted'}`}>{countsPorCategoria[c] || 0}</span>
            </button>
          ))}
        </div>

        {/* Counter */}
        <p className="text-xs text-surface-muted">
          Mostrando {filtrados.length} de {materiales.length} materiales
        </p>
      </div>

      {/* Table */}
      {filtrados.length === 0 ? (
        <div className="text-center py-12 text-sm text-surface-muted">
          No hay materiales que coincidan con los filtros.
        </div>
      ) : (
        <div className="bg-surface-card border border-brand-100 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-surface-muted border-b border-brand-100 bg-brand-50">
                <th className="px-3 py-3 font-medium">Nombre</th>
                <th className="px-3 py-3 font-medium">Categoría</th>
                <th className="px-3 py-3 font-medium">Marca</th>
                <th className="px-3 py-3 font-medium">Modelo</th>
                <th className="px-3 py-3 font-medium text-right">Precio</th>
                <th className="px-3 py-3 font-medium text-center">Unidad</th>
                <th className="px-3 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((m) => (
                <MaterialRow key={m.id} material={m} onEdit={setModalAbierto} onDelete={handleEliminar} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {modalAbierto ? (
        <MaterialModal
          material={modalAbierto === 'nuevo' ? null : modalAbierto}
          onClose={() => setModalAbierto(null)}
          onGuardar={handleGuardar}
          categorias={CATEGORIAS_MATERIALES}
        />
      ) : null}
      {materialEliminar ? (
        <DeleteConfirmModal
          material={materialEliminar}
          onClose={() => setMaterialEliminar(null)}
          onConfirm={confirmarEliminar}
        />
      ) : null}
    </div>
  )
}