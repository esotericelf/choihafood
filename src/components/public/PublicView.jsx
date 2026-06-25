import { useEffect, useState } from 'react'
import { Lock, Soup } from 'lucide-react'
import { formatDateId, formatDisplayDate } from '../../utils/date'
import { fetchPublishedMenu } from '../../services/firestore'
import { t } from '../../i18n/zh'
import AppHeader from '../common/AppHeader'
import MenuItemCard from './MenuItemCard'
import LoadingSpinner from '../common/LoadingSpinner'

export default function PublicView({ onAdminLogin }) {
  const [menu, setMenu] = useState(null)
  const [loading, setLoading] = useState(true)
  const today = formatDisplayDate()
  const dateId = formatDateId()

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const data = await fetchPublishedMenu(dateId)
        if (!cancelled) setMenu(data)
      } catch (err) {
        console.error('Failed to load menu:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [dateId])

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <AppHeader
        maxWidth="2xl"
        subtitle={`${t.todaysMenu} · ${today}`}
      />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-5 md:py-6">
        {loading ? (
          <LoadingSpinner message={t.loadingTodaysMenu} />
        ) : !menu || menu.items?.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
            <Soup className="mx-auto mb-3 h-9 w-9 text-stone-300" />
            <p className="font-medium text-stone-600">{t.noMenuPublished}</p>
            <p className="mt-1 text-sm text-stone-400">{t.checkBackSoon}</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {menu.items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-stone-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-2xl justify-end">
          <button
            type="button"
            onClick={onAdminLogin}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
          >
            <Lock className="h-3.5 w-3.5" />
            {t.adminLogin}
          </button>
        </div>
      </footer>
    </div>
  )
}
