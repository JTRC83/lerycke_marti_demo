import { useCallback, useRef, useState } from 'react'

// ImageDropzone: functional drag & drop + click image upload.
// Uses URL.createObjectURL for local preview. Calls onAdd(entry) per image.
function IconImage() {
  return (
    <svg className="w-7 h-7 text-surface-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ImageDropzone({ imagenes = [], onAdd, onRemove }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const addFiles = useCallback(
    (files) => {
      const imgs = files.filter((f) => f.type.startsWith('image/'))
      imgs.forEach((file) => {
        const url = URL.createObjectURL(file)
        onAdd({
          tipo: 'imagen',
          contenido: { url, nombre: file.name, size: file.size },
        })
      })
    },
    [onAdd],
  )

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    addFiles(Array.from(e.dataTransfer.files))
  }

  function onPick(e) {
    addFiles(Array.from(e.target.files || []))
    // reset so picking the same file again still fires
    e.target.value = ''
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={[
          'cursor-pointer rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-colors',
          dragging
            ? 'border-brand-500 bg-brand-50'
            : 'border-brand-200 bg-surface-base hover:border-brand-300 hover:bg-brand-50/40',
        ].join(' ')}
      >
        <IconImage />
        <p className="mt-2 text-sm font-medium text-brand-800">
          Arrastra imágenes aquí o haz clic para seleccionar
        </p>
        <p className="mt-1 text-xs text-surface-muted">JPG, PNG, WEBP</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onPick}
        />
      </div>

      {imagenes.length > 0 ? (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
          {imagenes.map((img, idx) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden border border-brand-100">
              <img
                src={img.contenido.url}
                alt={img.contenido.nombre}
                className="w-full h-24 object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(img.id)
                }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-state-danger"
                title="Eliminar imagen"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] px-1 py-0.5 truncate">
                {img.contenido.nombre}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}