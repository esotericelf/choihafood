import { t } from '../../i18n/zh'

const TABS = [
  { id: 'pool', label: t.tabManagePool },
  { id: 'menu', label: t.tabTodaysMenu },
  { id: 'archive', label: t.tabArchive },
]

export default function MobileTabBar({ activeTab, onTabChange, menuCount }) {
  return (
    <nav className="sticky top-[57px] z-30 border-b border-stone-200 bg-white md:hidden">
      <div className="flex">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-1 flex-col items-center gap-0.5 px-1 py-2.5 text-center text-xs font-medium transition ${
              activeTab === tab.id
                ? 'border-b-2 border-brand-600 text-brand-700'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <span className="text-base leading-none">{tab.label.split(' ')[0]}</span>
            <span className="leading-tight">{tab.label.slice(tab.label.indexOf(' ') + 1)}</span>
            {tab.id === 'menu' && menuCount > 0 && (
              <span className="absolute right-2 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {menuCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
