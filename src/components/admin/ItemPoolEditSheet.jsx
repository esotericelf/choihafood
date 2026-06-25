import { useEffect, useState } from 'react'
import { Check, Trash2, X } from 'lucide-react'
import { t } from '../../i18n/zh'

export default function ItemPoolEditSheet({
  item,
  onClose,
  onSave,
  onDelete,
}) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (item) {
      setName(item.name)
      setPrice(String(item.price))
      setError('')
    }
  }, [item])

  if (!item) return null

  async function handleSave(e) {
    e.preventDefault()
    if (!name.trim() || !price) return

    setSaving(true)
    setError('')
    try {
      await onSave(item.id, { name: name.trim(), price })
    } catch (err) {
      console.error(err)
      setError(t.updateItemFailed)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(t.confirmDeleteFromPool)) return

    setDeleting(true)
    setError('')
    try {
      await onDelete(item)
    } catch (err) {
      console.error(err)
      setError(t.deleteItemFailed)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center md:p-4">
      <div
        className="w-full max-w-lg rounded-t-2xl bg-white shadow-xl md:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-pool-item-title"
      >
        <div className="flex justify-center pt-3 md:hidden">
          <div className="h-1 w-10 rounded-full bg-stone-200" />
        </div>

        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <h2 id="edit-pool-item-title" className="font-semibold text-stone-900">
            {t.editItem}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100"
            aria-label={t.cancel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 px-5 py-4">
          <div>
            <label htmlFor="edit-item-name" className="mb-1.5 block text-sm font-medium text-stone-700">
              {t.itemName}
            </label>
            <input
              id="edit-item-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              required
            />
          </div>

          <div>
            <label htmlFor="edit-item-price" className="mb-1.5 block text-sm font-medium text-stone-700">
              {t.price}
            </label>
            <input
              id="edit-item-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving || deleting || !name.trim() || !price}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {saving ? t.saving : t.save}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving || deleting}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              {t.cancel}
            </button>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? t.deleting : t.deleteFromPool}
          </button>
        </form>

        <div className="h-[env(safe-area-inset-bottom)] md:hidden" />
      </div>
    </div>
  )
}
