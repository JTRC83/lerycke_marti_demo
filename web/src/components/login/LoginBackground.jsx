// Full-viewport brand background for the login screen.
export default function LoginBackground({ children }) {
  return (
    <div className="min-h-screen w-full bg-brand-900 flex items-center justify-center px-4 py-10">
      {children}
    </div>
  )
}