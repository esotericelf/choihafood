import { ChevronRight } from 'lucide-react'
import { t } from '../../i18n/zh'

export default function MobileStagingBar({ count, onViewMenu }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <p className="text-sm font-medium text-stone-700">
          {t.stagedForToday(count)}
        </p>
        <button
          type="button"
          onClick={onViewMenu}
          className="flex shrink-0 items-center gap-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {t.viewAndPublish}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
