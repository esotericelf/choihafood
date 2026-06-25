import { useCallback, useEffect, useState } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import { Eye, LogOut, Send, UtensilsCrossed } from 'lucide-react'
import { formatDateId, formatDisplayDate, parseDateId } from '../../utils/date'
import {
  fetchDailyMenu,
  fetchItemPool,
  fetchMenusByMonth,
  publishDailyMenu,
  deleteDailyMenu,
  updateItemInPool,
  deleteItemFromPool,
} from '../../services/firestore'
import { useAuth } from '../../context/AuthContext'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { t } from '../../i18n/zh'
import LoadingSpinner from '../common/LoadingSpinner'
import ItemPoolForm from './ItemPoolForm'
import ItemPool from './ItemPool'
import ItemPoolEditSheet from './ItemPoolEditSheet'
import MenuBuilder from './MenuBuilder'
import DateArchive from './DateArchive'
import ArchiveModal from './ArchiveModal'
import MobileTabBar from './MobileTabBar'
import MobileStagingBar from './MobileStagingBar'

function mapMenuItems(items) {
  return (items || []).map((item) => ({
    ...item,
    menuKey: item.menuKey || crypto.randomUUID(),
  }))
}

function PublishBanner({ message, success }) {
  if (!message) return null
  return (
    <p className={`rounded-lg px-3 py-2 text-sm ${
      success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
    }`}>
      {message}
    </p>
  )
}

export default function AdminDashboard({ onPreviewPublic }) {
  const { logout } = useAuth()
  const todayDateId = formatDateId()
  const isMobile = useMediaQuery('(max-width: 767px)')

  const [itemPool, setItemPool] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [workspaceDateId, setWorkspaceDateId] = useState(todayDateId)
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [publishMessage, setPublishMessage] = useState('')
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [mobileTab, setMobileTab] = useState('pool')

  const [archiveYear, setArchiveYear] = useState(new Date().getFullYear())
  const [archiveMonth, setArchiveMonth] = useState(new Date().getMonth() + 1)
  const [archiveMenus, setArchiveMenus] = useState([])
  const [archiveLoading, setArchiveLoading] = useState(false)
  const [selectedArchive, setSelectedArchive] = useState(null)
  const [editingPoolItem, setEditingPoolItem] = useState(null)

  const showStagingBar = isMobile && mobileTab === 'pool' && menuItems.length > 0

  const refreshArchive = useCallback(async () => {
    try {
      const menus = await fetchMenusByMonth(archiveYear, archiveMonth)
      setArchiveMenus(menus)
    } catch (err) {
      console.error('Failed to load archive:', err)
    }
  }, [archiveYear, archiveMonth])

  const loadTodayWorkspace = useCallback(async () => {
    const todayMenu = await fetchDailyMenu(todayDateId)
    setWorkspaceDateId(todayDateId)
    if (todayMenu?.items) {
      setMenuItems(mapMenuItems(todayMenu.items))
      setPublished(!!todayMenu.published)
    } else {
      setMenuItems([])
      setPublished(false)
    }
  }, [todayDateId])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [pool, todayMenu] = await Promise.all([
        fetchItemPool(),
        fetchDailyMenu(todayDateId),
      ])
      setItemPool(pool)
      setWorkspaceDateId(todayDateId)
      if (todayMenu?.items) {
        setMenuItems(mapMenuItems(todayMenu.items))
        setPublished(!!todayMenu.published)
      } else {
        setMenuItems([])
        setPublished(false)
      }
    } catch (err) {
      console.error('Failed to load admin data:', err)
    } finally {
      setLoading(false)
    }
  }, [todayDateId])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    let cancelled = false
    async function loadArchive() {
      setArchiveLoading(true)
      try {
        const menus = await fetchMenusByMonth(archiveYear, archiveMonth)
        if (!cancelled) setArchiveMenus(menus)
      } catch (err) {
        console.error('Failed to load archive:', err)
      } finally {
        if (!cancelled) setArchiveLoading(false)
      }
    }
    loadArchive()
    return () => { cancelled = true }
  }, [archiveYear, archiveMonth])

  function handleAddToMenu(item, atIndex) {
    const newItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      menuKey: crypto.randomUUID(),
    }
    setMenuItems((prev) => {
      if (atIndex === undefined) return [...prev, newItem]
      const updated = [...prev]
      updated.splice(atIndex, 0, newItem)
      return updated
    })
    setPublished(false)
  }

  function onDragEnd(result) {
    const { source, destination, draggableId } = result
    if (!destination) return

    if (source.droppableId === 'item-pool' && destination.droppableId === 'today-menu') {
      const item = itemPool.find((i) => i.id === draggableId)
      if (!item) return
      handleAddToMenu(item, destination.index)
      return
    }

    if (source.droppableId === 'today-menu' && destination.droppableId === 'today-menu') {
      const updated = [...menuItems]
      const [removed] = updated.splice(source.index, 1)
      updated.splice(destination.index, 0, removed)
      setMenuItems(updated)
      setPublished(false)
    }
  }

  function handleRemove(index) {
    setMenuItems((prev) => prev.filter((_, i) => i !== index))
    setPublished(false)
  }

  function handleClearAll() {
    setMenuItems([])
    setPublished(false)
  }

  async function handleBackToToday() {
    await loadTodayWorkspace()
    setPublishMessage('')
  }

  function handleLoadToWorkspace(menu) {
    setWorkspaceDateId(menu.id)
    setMenuItems(mapMenuItems(menu.items))
    setPublished(!!menu.published)
    setSelectedArchive(null)
    setMobileTab('menu')
    setPublishMessage(t.loadToWorkspaceSuccess)
    setPublishSuccess(true)
    setTimeout(() => setPublishMessage(''), 3000)
  }

  async function handleDeleteMenu(menu) {
    if (!window.confirm(t.confirmDeleteMenu(formatDisplayDate(parseDateId(menu.id))))) return

    setDeleting(true)
    setPublishMessage('')
    try {
      await deleteDailyMenu(menu.id)
      setArchiveMenus((prev) => prev.filter((m) => m.id !== menu.id))
      if (workspaceDateId === menu.id) {
        setMenuItems([])
        setPublished(false)
      }
      setSelectedArchive(null)
      setPublishSuccess(true)
      setPublishMessage(t.deleteMenuSuccess)
      setTimeout(() => setPublishMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setPublishSuccess(false)
      setPublishMessage(t.deleteMenuFailed)
    } finally {
      setDeleting(false)
    }
  }

  async function handlePublish() {
    if (menuItems.length === 0) return
    setPublishing(true)
    setPublishMessage('')
    setPublishSuccess(false)
    try {
      const itemsToSave = menuItems.map(({ id, name, price, menuKey }) => ({
        id,
        name,
        price,
        menuKey,
      }))
      await publishDailyMenu(workspaceDateId, itemsToSave)
      setPublished(true)
      setPublishSuccess(true)
      setPublishMessage(t.publishSuccess)
      setTimeout(() => setPublishMessage(''), 3000)

      const [year, month] = workspaceDateId.split('-').map(Number)
      if (year === archiveYear && month === archiveMonth) {
        await refreshArchive()
      }
    } catch (err) {
      console.error(err)
      setPublishSuccess(false)
      setPublishMessage(t.publishFailed)
    } finally {
      setPublishing(false)
    }
  }

  function handleItemAdded(item) {
    setItemPool((prev) => [...prev, item].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')))
  }

  function syncMenuItemsAfterPoolUpdate(itemId, updates) {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    )
    setPublished(false)
  }

  function removeFromMenuByPoolId(itemId) {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId))
    setPublished(false)
  }

  async function handleUpdatePoolItem(id, { name, price }) {
    await updateItemInPool(id, { name, price })
    const numericPrice = Number(price)
    setItemPool((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, name: name.trim(), price: numericPrice } : item
        )
        .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    )
    syncMenuItemsAfterPoolUpdate(id, { name: name.trim(), price: numericPrice })
    setEditingPoolItem(null)
  }

  async function handleDeletePoolItem(item) {
    await deleteItemFromPool(item.id)
    setItemPool((prev) => prev.filter((i) => i.id !== item.id))
    removeFromMenuByPoolId(item.id)
    setEditingPoolItem(null)
  }

  function handleQuickDeletePoolItem(item) {
    if (!window.confirm(t.confirmDeleteFromPool)) return
    handleDeletePoolItem(item).catch((err) => {
      console.error(err)
      window.alert(t.deleteItemFailed)
    })
  }

  const menuBuilderProps = {
    items: menuItems,
    activeDateId: workspaceDateId,
    todayDateId,
    onRemove: handleRemove,
    onClearAll: handleClearAll,
    onBackToToday: handleBackToToday,
    published,
    dragEnabled: !isMobile,
  }

  const poolSection = (
    <section className="space-y-4">
      <h2 className="hidden text-base font-semibold text-stone-800 md:block">{t.itemPool}</h2>
      <ItemPoolForm onItemAdded={handleItemAdded} />
      <ItemPool
        items={itemPool}
        dragEnabled={!isMobile}
        isMobile={isMobile}
        onAddToMenu={handleAddToMenu}
        onEditItem={setEditingPoolItem}
        onDeleteItem={handleQuickDeletePoolItem}
      />
    </section>
  )

  const menuSection = (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="hidden text-base font-semibold text-stone-800 md:block">{t.menuBuilder}</h2>
        <button
          type="button"
          onClick={handlePublish}
          disabled={publishing || menuItems.length === 0}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {publishing ? t.publishing : t.publishMenu}
        </button>
      </div>
      <PublishBanner message={publishMessage} success={publishSuccess} />
      <MenuBuilder {...menuBuilderProps} />
    </section>
  )

  const archiveSection = (
    <DateArchive
      year={archiveYear}
      month={archiveMonth}
      onYearChange={setArchiveYear}
      onMonthChange={setArchiveMonth}
      menus={archiveMenus}
      loading={archiveLoading}
      onSelectMenu={setSelectedArchive}
    />
  )

  if (loading) {
    return <LoadingSpinner message={t.loadingDashboard} />
  }

  const mainContent = isMobile ? (
    <>
      <MobileTabBar
        activeTab={mobileTab}
        onTabChange={setMobileTab}
        menuCount={menuItems.length}
      />
      <main className={`mx-auto max-w-7xl px-4 py-4 ${showStagingBar ? 'pb-28' : 'pb-6'}`}>
        {mobileTab === 'pool' && poolSection}
        {mobileTab === 'menu' && menuSection}
        {mobileTab === 'archive' && archiveSection}
      </main>
      {showStagingBar && (
        <MobileStagingBar
          count={menuItems.length}
          onViewMenu={() => setMobileTab('menu')}
        />
      )}
    </>
  ) : (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="grid gap-6 md:grid-cols-2">
            {poolSection}
            {menuSection}
          </div>
          {archiveSection}
        </div>
      </DragDropContext>
    </main>
  )

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-stone-900">{t.adminDashboard}</h1>
              <p className="text-xs text-stone-400">{t.menuManager}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPreviewPublic}
              className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition hover:bg-stone-50"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">{t.previewPublic}</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-stone-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </div>
      </header>

      {mainContent}

      <ArchiveModal
        menu={selectedArchive}
        onClose={() => setSelectedArchive(null)}
        onLoadToWorkspace={handleLoadToWorkspace}
        onDeleteMenu={handleDeleteMenu}
        deleting={deleting}
      />

      <ItemPoolEditSheet
        item={editingPoolItem}
        onClose={() => setEditingPoolItem(null)}
        onSave={handleUpdatePoolItem}
        onDelete={handleDeletePoolItem}
      />
    </div>
  )
}
