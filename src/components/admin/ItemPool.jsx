import { Draggable, Droppable } from '@hello-pangea/dnd'
import { GripVertical } from 'lucide-react'
import { formatPrice, categoryLabel, t } from '../../i18n/zh'

export default function ItemPool({ items }) {
  return (
    <Droppable droppableId="item-pool" isDropDisabled>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-[200px] space-y-2 rounded-xl border-2 border-dashed p-3 transition ${
            snapshot.isDraggingOver
              ? 'border-brand-300 bg-brand-50'
              : 'border-stone-200 bg-white'
          }`}
        >
          <p className="mb-2 text-xs font-medium text-stone-400">
            {t.dragToMenu}
          </p>

          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-stone-400">
              {t.noItemsInPool}
            </p>
          ) : (
            items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 shadow-sm transition ${
                      dragSnapshot.isDragging
                        ? 'border-brand-400 shadow-md ring-2 ring-brand-200'
                        : 'border-stone-200'
                    }`}
                  >
                    <GripVertical className="h-4 w-4 shrink-0 text-stone-300" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-800">{item.name}</p>
                      <p className="text-xs text-stone-400">{categoryLabel(item.category)}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-brand-600">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                )}
              </Draggable>
            ))
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
