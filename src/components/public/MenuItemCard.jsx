import { formatPrice, categoryLabel } from '../../i18n/zh'

export default function MenuItemCard({ item, showCategory = false }) {
  const poolItem = item.description !== undefined

  return (
    <article className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-stone-900">{item.name}</h3>
          {poolItem && item.description && (
            <p className="mt-1 text-sm text-stone-500 line-clamp-2">{item.description}</p>
          )}
          {showCategory && item.category && (
            <span className="mt-2 inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
              {categoryLabel(item.category)}
            </span>
          )}
        </div>
        <span className="shrink-0 rounded-lg bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">
          {formatPrice(item.price)}
        </span>
      </div>
    </article>
  )
}
