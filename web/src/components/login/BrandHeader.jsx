// Brand header inside the login card: LM monogram + tagline only.
export default function BrandHeader() {
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src="/brand/LOGOpinche-INSTA_LM.jpg"
        alt="Monograma LM"
        className="w-24 h-24 rounded-full object-cover ring-1 ring-brand-100"
      />
      <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-surface-muted">
        designstudio
      </p>
    </div>
  )
}