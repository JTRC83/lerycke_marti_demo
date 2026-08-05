import { useEffect, useRef, useState } from 'react'

// VoiceRecorder: SIMULATED recording (no MediaRecorder).
// Shows a pulse animation + timer while "recording"; on stop, emits a nota_voz
// history entry with the elapsed duration.
function pad2(n) {
  return String(n).padStart(2, '0')
}

function formatDuracion(segundos) {
  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return `${pad2(m)}:${pad2(s)}`
}

const TRANSCRIPCIONES_MOCK = [
  'El cliente quiere más luz natural en el salón, abrir la cocina y usar materiales cálidos.',
  'Baño principal con ducha de obra, microcemento en paredes y mueble a medida en madera.',
  'Cocina en península con encimera de cuarzo, muebles lacados en crema y campana vista.',
  'Dormitorio con ropero integrado, cabecero de madera natural y luz cálida.',
]

export default function VoiceRecorder({ onAdd }) {
  const [grabando, setGrabando] = useState(false)
  const [segundos, setSegundos] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  function iniciar() {
    setGrabando(true)
    setSegundos(0)
    intervalRef.current = setInterval(() => {
      setSegundos((s) => s + 1)
    }, 1000)
  }

  function detener() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    const duracion = segundos
    setGrabando(false)
    setSegundos(0)
    onAdd({
      tipo: 'nota_voz',
      contenido: {
        duracion,
        nombre: `Nota de voz ${formatDuracion(duracion)}`,
        transcripcion:
          TRANSCRIPCIONES_MOCK[
            Math.floor(Math.random() * TRANSCRIPCIONES_MOCK.length)
          ],
      },
    })
  }

  return (
    <div className="rounded-xl border border-brand-100 bg-surface-base p-4">
      {grabando ? (
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-state-danger opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-state-danger" />
            </span>
            <span className="text-sm font-medium text-state-danger">Grabando</span>
          </span>

          {/* Wave bars animation */}
          <div className="flex items-end gap-0.5 h-6">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <span
                key={i}
                className="w-1 bg-brand-500 rounded-full animate-pulse"
                style={{
                  height: `${10 + ((i * 7) % 14)}px`,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>

          <span className="ml-auto text-sm font-mono text-brand-800 tabular-nums">
            {formatDuracion(segundos)}
          </span>

          <button
            type="button"
            onClick={detener}
            className="px-3 py-1.5 rounded-lg bg-state-danger text-white text-sm font-medium hover:bg-state-danger/90 transition-colors"
          >
            Detener
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={iniciar}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-200 bg-white text-brand-800 text-sm font-medium hover:bg-brand-50 transition-colors"
        >
          <span className="w-3 h-3 rounded-full bg-state-danger" />
          Grabar nota de voz
        </button>
      )}
    </div>
  )
}