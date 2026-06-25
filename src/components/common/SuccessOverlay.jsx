import { Check } from 'lucide-react'

export default function SuccessOverlay({ message }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]"
      role="alertdialog"
      aria-live="assertive"
      aria-label={message}
    >
      <div className="animate-overlay-in w-full max-w-xs rounded-2xl bg-white px-6 py-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 animate-check-pop">
          <Check className="h-8 w-8 text-green-600" strokeWidth={2.5} />
        </div>
        <p className="text-base font-semibold leading-snug text-stone-900">{message}</p>
      </div>
    </div>
  )
}
