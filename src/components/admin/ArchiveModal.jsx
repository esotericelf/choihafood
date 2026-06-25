import { X, Pencil, Trash2 } from 'lucide-react'
import { formatDisplayDate, parseDateId } from '../../utils/date'
import { t } from '../../i18n/zh'
import MenuItemCard from '../public/MenuItemCard'

export default function ArchiveModal({
  menu,
  onClose,
  onLoadToWorkspace,
  onDeleteMenu,
  deleting,
}) {
  if (!menu) return null

  const displayDate = formatDisplayDate(parseDateId(menu.id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-stone-900">{t.menuArchive}</h2>
            <p className="text-sm text-stone-500">{displayDate}</p>
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

        <div className="space-y-3 border-t border-stone-100 px-5 py-4">
          <span className={`block text-xs font-medium ${
            menu.published ? 'text-green-600' : 'text-stone-400'
          }`}>
            {menu.published ? t.published : t.draftUnpublished}
          </span>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => onLoadToWorkspace(menu)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <Pencil className="h-4 w-4" />
              {t.loadToWorkspace}
            </button>
            <button
              type="button"
              onClick={() => onDeleteMenu(menu)}
              disabled={deleting}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? t.loading : t.deleteMenu}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
