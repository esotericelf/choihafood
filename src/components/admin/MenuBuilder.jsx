import { Draggable, Droppable } from '@hello-pangea/dnd'
import { GripVertical, X } from 'lucide-react'
import { formatDisplayDate } from '../../utils/date'
import { formatPrice, t } from '../../i18n/zh'

export default function MenuBuilder({ items, onRemove, published }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-stone-800">{t.todaysMenuWorkspace}</h3>
          <p className="text-xs text-stone-400">{formatDisplayDate()}</p>
        </div>
        {published && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            {t.published}
          </span>
        )}
      </div>

      <Droppable droppableId="today-menu">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[300px] space-y-2 rounded-xl border-2 border-dashed p-3 transition ${
              snapshot.isDraggingOver
                ? 'border-brand-400 bg-brand-50'
                : 'border-brand-200 bg-brand-50/30'
            }`}
          >
            {items.length === 0 ? (
              <div className="flex h-full min-h-[260px] items-center justify-center">
                <p className="text-center text-sm text-stone-400">
                  {t.dropItemsHere}
                </p>
              </div>
            ) : (
              items.map((item, index) => (
                <Draggable key={item.menuKey} draggableId={item.menuKey} index={index}>
                  {(dragProvided, dragSnapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 shadow-sm transition ${
                        dragSnapshot.isDragging
                          ? 'border-brand-400 shadow-md ring-2 ring-brand-200'
                          : 'border-stone-200'
                      }`}
                    >
                      <div {...dragProvided.dragHandleProps}>
                        <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-stone-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-stone-800">{item.name}</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-brand-600">
                        {formatPrice(item.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="rounded p-1 text-stone-400 hover:bg-red-50 hover:text-red-500"
                        aria-label={`${t.removeItem} ${item.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
