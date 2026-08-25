import ImageDropzone from './ImageDropzone.jsx'
import VoiceRecorder from './VoiceRecorder.jsx'

// MediaUploader: container for image dropzone + voice recorder in the same row.
export default function MediaUploader({ imagenes, onAdd, onRemove }) {
  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
      <h3 className="text-base font-semibold text-brand-900 mb-1">
        Multimedia de la visita
      </h3>
      <p className="text-sm text-surface-muted mb-5">
        Sube imágenes y graba notas de voz. Todo queda en el histórico.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ImageDropzone imagenes={imagenes} onAdd={onAdd} onRemove={onRemove} />
        <div className="flex flex-col">
          <VoiceRecorder onAdd={onAdd} />
        </div>
      </div>
    </div>
  )
}