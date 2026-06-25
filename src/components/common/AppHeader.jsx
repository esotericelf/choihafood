import {
  Soup,
  CupSoda,
  Flame,
  UtensilsCrossed,
  Store,
} from 'lucide-react'
import { BRAND_NAME } from '../../i18n/zh'

const SNACK_ICONS = [
  { Icon: Soup, className: 'text-amber-500' },
  { Icon: CupSoda, className: 'text-orange-500' },
  { Icon: Flame, className: 'text-orange-500' },
  { Icon: UtensilsCrossed, className: 'text-amber-600' },
  { Icon: Store, className: 'text-amber-500' },
]

export default function AppHeader({
  subtitle,
  sticky = false,
  maxWidth = '7xl',
  children,
}) {
  const maxWidthClass = maxWidth === '2xl' ? 'max-w-2xl' : 'max-w-7xl'

  return (
    <header
      className={`border-b border-stone-200 bg-white px-4 py-3 md:py-4 ${
        sticky ? 'sticky top-0 z-40 shadow-sm' : ''
      }`}
    >
      <div className={`mx-auto ${maxWidthClass}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 md:gap-x-3">
              <h1 className="font-bold text-2xl text-slate-800 md:text-3xl">
                {BRAND_NAME}
              </h1>
              <div
                className="flex items-center gap-1.5 md:hidden"
                aria-hidden="true"
              >
                {SNACK_ICONS.map(({ Icon, className }, index) => (
                  <Icon
                    key={`mobile-icon-${index}`}
                    className={`h-6 w-6 stroke-[1.75] ${className}`}
                  />
                ))}
              </div>
            </div>

            <div
              className="mt-1.5 hidden items-center gap-2.5 md:flex"
              aria-hidden="true"
            >
              {SNACK_ICONS.map(({ Icon, className }, index) => (
                <Icon
                  key={`desktop-icon-${index}`}
                  className={`h-8 w-8 stroke-[1.75] ${className}`}
                />
              ))}
            </div>

            {subtitle && (
              <p className="mt-1 text-sm text-stone-500 md:mt-1.5">{subtitle}</p>
            )}
          </div>

          {children && (
            <div className="flex shrink-0 items-center gap-2">{children}</div>
          )}
        </div>
      </div>
    </header>
  )
}
