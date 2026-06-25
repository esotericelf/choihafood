import { X } from 'lucide-react'
import { formatDisplayDate, parseDateId } from '../../utils/date'
import { t } from '../../i18n/zh'
import MenuItemCard from '../public/MenuItemCard'

export default function ArchiveModal({ menu, onClose }) {
  if (!menu) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-stone-900">{t.menuArchive}</h2>
            <p className="text-sm text-stone-500">
              {formatDisplayDate(parseDateId(menu.id))}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100"
            aria-label={t.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!menu.items?.length ? (
            <p className="py-8 text-center text-sm text-stone-400">{t.noItemsOnMenu}</p>
          ) : (
            <div className="grid gap-3">
              {menu.items.map((item, i) => (
                <MenuItemCard key={`${item.id}-${i}`} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-stone-100 px-5 py-3">
          <span className={`text-xs font-medium ${
            menu.published ? 'text-green-600' : 'text-stone-400'
          }`}>
            {menu.published ? t.published : t.draftUnpublished}
          </span>
        </div>
      </div>
    </div>
  )
}
