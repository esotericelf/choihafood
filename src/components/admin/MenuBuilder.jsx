import { Draggable, Droppable } from '@hello-pangea/dnd'
import { GripVertical, Trash2, RotateCcw } from 'lucide-react'
import { formatDisplayDate, parseDateId } from '../../utils/date'
import { formatPrice, t } from '../../i18n/zh'

function MenuItemRow({ item, index, dragEnabled, onRemove, dragProps = {} }) {
  const { innerRef, draggableProps, dragHandleProps, isDragging } = dragProps

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 shadow-sm transition ${
        isDragging
          ? 'border-brand-400 shadow-md ring-2 ring-brand-200'
          : 'border-stone-200'
      }`}
    >
      {dragEnabled && (
        <div {...dragHandleProps}>
          <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-stone-300" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-stone-800">{item.name}</p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-brand-600">
        {formatPrice(item.price)}
      </span>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 active:scale-95"
        aria-label={`${t.removeItem} ${item.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

function MenuList({ items, dragEnabled, onRemove }) {
  if (items.length === 0) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center md:min-h-[260px]">
        <p className="text-center text-sm text-stone-400">
          {dragEnabled ? t.dropItemsHere : t.tapToAddFromPool}
        </p>
      </div>
    )
  }

  if (!dragEnabled) {
    return items.map((item, index) => (
      <MenuItemRow
        key={item.menuKey}
        item={item}
        index={index}
        dragEnabled={false}
        onRemove={onRemove}
      />
    ))
  }

  return items.map((item, index) => (
    <Draggable key={item.menuKey} draggableId={item.menuKey} index={index}>
      {(dragProvided, dragSnapshot) => (
        <MenuItemRow
          item={item}
          index={index}
          dragEnabled
          onRemove={onRemove}
          dragProps={{
            innerRef: dragProvided.innerRef,
            draggableProps: dragProvided.draggableProps,
            dragHandleProps: dragProvided.dragHandleProps,
            isDragging: dragSnapshot.isDragging,
          }}
        />
      )}
    </Draggable>
  ))
}

export default function MenuBuilder({
  items,
  activeDateId,
  todayDateId,
  onRemove,
  onClearAll,
  onBackToToday,
  published,
  dragEnabled = true,
  hideTitle = false,
}) {
  const displayDate = formatDisplayDate(parseDateId(activeDateId))
  const isEditingPast = activeDateId !== todayDateId

  const workspace = (
    <div
      className={`space-y-2 rounded-xl border-2 border-dashed p-3 transition ${
        dragEnabled ? 'min-h-[300px] border-brand-200 bg-brand-50/30' : 'min-h-[200px] border-brand-200 bg-brand-50/30'
      }`}
    >
      {dragEnabled ? (
        <Droppable droppableId="today-menu">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-2 transition ${
                snapshot.isDraggingOver ? 'rounded-lg bg-brand-50' : ''
              }`}
            >
              <MenuList items={items} dragEnabled onRemove={onRemove} />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ) : (
        <MenuList items={items} dragEnabled={false} onRemove={onRemove} />
      )}
    </div>
  )

  if (hideTitle) {
    return workspace
  }

  return (
    <div>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-stone-800">{t.todaysMenuWorkspace}</h3>
          <p className="text-xs text-stone-400">{displayDate}</p>
          {isEditingPast && (
            <p className="mt-1 text-xs font-medium text-amber-600">{t.editingMenuFor} {displayDate}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {published && (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              {t.published}
            </span>
          )}
          {isEditingPast && (
            <button
              type="button"
              onClick={onBackToToday}
              className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-50"
            >
              {t.backToToday}
            </button>
          )}
          {items.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1 text-xs text-stone-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t.clearAll}
            </button>
          )}
        </div>
      </div>
      {workspace}
    </div>
  )
}
