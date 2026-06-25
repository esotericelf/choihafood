import { Loader2 } from 'lucide-react'
import { t } from '../../i18n/zh'

export default function LoadingSpinner({ message = t.loading }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-stone-500">
      <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
