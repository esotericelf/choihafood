export default function Toast({ message }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4 md:bottom-8"
      role="status"
      aria-live="polite"
    >
      <div className="animate-toast-in w-full max-w-sm rounded-xl border border-green-200 bg-white px-4 py-3 text-center text-sm font-medium text-stone-800 shadow-lg ring-1 ring-black/5">
        {message}
      </div>
    </div>
  )
}
