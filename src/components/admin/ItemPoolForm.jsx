import { useState } from 'react'
import { Plus } from 'lucide-react'
import { addItemToPool } from '../../services/firestore'
import { CATEGORY_KEYS, t, categoryLabel } from '../../i18n/zh'

export default function ItemPoolForm({ onItemAdded }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Main')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !price) return

    setSubmitting(true)
    setError('')
    try {
      const item = await addItemToPool({ name, price, category, description })
      onItemAdded(item)
      setName('')
      setPrice('')
      setCategory('Main')
      setDescription('')
    } catch (err) {
      console.error(err)
      setError(t.addItemFailed)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-800">
        <Plus className="h-4 w-4 text-brand-600" />
        {t.addNewItem}
      </h3>

      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder={t.itemName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            required
          />
          <input
            type="number"
            placeholder={t.price}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            required
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            {CATEGORY_KEYS.map((key) => (
              <option key={key} value={key}>{categoryLabel(key)}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder={t.descriptionOptional}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-600 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {submitting ? t.adding : t.addToPool}
        </button>
      </div>
    </form>
  )
}
