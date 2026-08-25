import ImageDropzone from './ImageDropzone.jsx'
import VoiceRecorder from './VoiceRecorder.jsx'

// MediaUploader: image dropzone on top, voice recorder below.
export default function MediaUploader({ imagenes, onAdd, onRemove }) {
  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
      <h3 className="text-base font-semibold text-brand-900 mb-1">
        Multimedia de la visita
      </h3>
      <p className="text-sm text-surface-muted mb-5">
        Sube imágenes y graba notas de voz. Todo queda en el histórico.
      </p>

      <ImageDropzone imagenes={imagenes} onAdd={onAdd} onRemove={onRemove} />

      <div className="mt-5">
        <VoiceRecorder onAdd={onAdd} />
      </div>
    </div>
  )
}