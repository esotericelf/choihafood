import { Calendar, Search } from 'lucide-react'
import { formatDisplayDate, parseDateId } from '../../utils/date'
import { MONTHS_ZH, t } from '../../i18n/zh'

export default function DateArchive({
  year,
  month,
  onYearChange,
  onMonthChange,
  menus,
  loading,
  onSelectMenu,
}) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <aside className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-brand-600" />
        <h3 className="font-semibold text-stone-800">{t.dateArchive}</h3>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500">{t.year}</label>
          <select
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="w-full rounded-lg border border-stone-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}年</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500">{t.month}</label>
          <select
            value={month}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="w-full rounded-lg border border-stone-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
          >
            {MONTHS_ZH.map((name, i) => (
              <option key={name} value={i + 1}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="py-4 text-center text-sm text-stone-400">{t.loadingArchive}</p>
      ) : menus.length === 0 ? (
        <div className="flex flex-col items-center py-6 text-stone-400">
          <Search className="mb-2 h-5 w-5" />
          <p className="text-sm">{t.noMenusFound}</p>
        </div>
      ) : (
        <ul className="max-h-64 space-y-1 overflow-y-auto">
          {menus.map((menu) => (
            <li key={menu.id}>
              <button
                type="button"
                onClick={() => onSelectMenu(menu)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-stone-50"
              >
                <span className="font-medium text-stone-700">
                  {formatDisplayDate(parseDateId(menu.id))}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  menu.published
                    ? 'bg-green-100 text-green-700'
                    : 'bg-stone-100 text-stone-500'
                }`}>
                  {t.itemCount(menu.items?.length || 0)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
