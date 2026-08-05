import { formatFechaEs } from '../../utils/format.js'

// TimelineMedia: vertical chronological history (newest first).
// Each entry shows date/time, type icon + label, content preview, and a remove (X) button.

function IconImage() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconMic() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 19v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconText() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3v18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconEdit() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20h9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const TYPE_META = {
  imagen: { label: 'Imagen', Icon: IconImage, tone: 'text-brand-700 bg-brand-50' },
  nota_voz: { label: 'Nota de voz', Icon: IconMic, tone: 'text-state-danger bg-red-50' },
  texto: { label: 'Texto', Icon: IconText, tone: 'text-state-warning bg-amber-50' },
  datos_editados: { label: 'Datos editados', Icon: IconEdit, tone: 'text-brand-700 bg-brand-50' },
}

function EntryContent({ entry }) {
  if (entry.tipo === 'imagen') {
    return (
      <div className="mt-2 rounded-lg overflow-hidden border border-brand-100 max-w-[160px]">
        <img src={entry.contenido.url} alt={entry.contenido.nombre} className="w-full h-24 object-cover" />
        <p className="px-2 py-1 text-xs text-surface-muted truncate">{entry.contenido.nombre}</p>
      </div>
    )
  }
  if (entry.tipo === 'nota_voz') {
    const dur = entry.contenido?.duracion ?? 0
    const mm = String(Math.floor(dur / 60)).padStart(2, '0')
    const ss = String(dur % 60).padStart(2, '0')
    return (
      <div className="mt-2 rounded-lg bg-surface-base border border-brand-100 px-3 py-2 max-w-[280px]">
        <div className="flex items-center gap-2">
          <IconMic />
          <span className="text-sm text-brand-800">{entry.contenido?.nombre || 'Nota de voz'}</span>
          <span className="ml-auto text-xs font-mono text-surface-muted tabular-nums">{mm}:{ss}</span>
        </div>
        {entry.contenido?.transcripcion ? (
          <p className="mt-1.5 text-xs italic text-surface-muted leading-relaxed">
            {entry.contenido.transcripcion}
          </p>
        ) : null}
      </div>
    )
  }
  if (entry.tipo === 'texto') {
    return (
      <p className="mt-2 text-sm text-brand-800 whitespace-pre-wrap line-clamp-3">
        {entry.contenido?.texto || ''}
      </p>
    )
  }
  if (entry.tipo === 'datos_editados') {
    return (
      <p className="mt-2 text-sm text-brand-800">{entry.contenido?.resumen || ''}</p>
    )
  }
  return null
}

export default function TimelineMedia({ historico = [], onRemove }) {
  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
      <h3 className="text-base font-semibold text-brand-900 mb-4">Histórico</h3>

      {historico.length === 0 ? (
        <p className="text-sm text-surface-muted">
          Aún no se ha añadido multimedia. Las imágenes y notas de voz que subas
          aparecerán aquí en orden cronológico.
        </p>
      ) : null}

      <ol className="space-y-4">
        {historico.map((entry) => {
          const meta = TYPE_META[entry.tipo] || TYPE_META.texto
          const { Icon, label, tone } = meta
          return (
            <li key={entry.id} className="relative pl-6">
              {/* vertical line */}
              <span className="absolute left-2 top-1 bottom-[-1rem] w-px bg-brand-100" aria-hidden />
              {/* node */}
              <span className={`absolute left-0 top-1 w-4 h-4 rounded-full flex items-center justify-center ${tone}`}>
                <Icon />
              </span>

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${tone}`}>{label}</span>
                    <span className="text-xs text-surface-muted">
                      {formatFechaEs(entry.fecha)}
                    </span>
                  </div>
                  <EntryContent entry={entry} />
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(entry.id)}
                  className="shrink-0 w-7 h-7 rounded-lg text-surface-muted hover:bg-red-50 hover:text-state-danger flex items-center justify-center transition-colors"
                  title="Eliminar entrada"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}