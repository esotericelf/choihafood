import { Draggable, Droppable } from '@hello-pangea/dnd'
import { useCallback } from 'react'
import { GripVertical, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { useLongPress } from '../../hooks/useLongPress'
import { formatPrice, categoryLabel, t } from '../../i18n/zh'

function PoolItemRow({
  item,
  dragEnabled,
  isMobile,
  onAddToMenu,
  onEditItem,
  onDeleteItem,
  dragProps = {},
}) {
  const { innerRef, draggableProps, dragHandleProps, isDragging } = dragProps

  const handleLongPress = useCallback(() => onEditItem(item), [onEditItem, item])
  const longPressHandlers = useLongPress(handleLongPress, { delay: 500 })

  function stopPropagation(e) {
    e.stopPropagation()
  }

  const rowHandlers = isMobile
    ? {
        onTouchStart: longPressHandlers.onTouchStart,
        onTouchEnd: longPressHandlers.onTouchEnd,
        onTouchMove: longPressHandlers.onTouchMove,
        onTouchCancel: longPressHandlers.onTouchCancel,
      }
    : {}

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...rowHandlers}
      className={`group flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 shadow-sm transition select-none ${
        isDragging
          ? 'border-brand-400 shadow-md ring-2 ring-brand-200'
          : 'border-stone-200'
      } ${isMobile ? 'active:bg-stone-50' : ''}`}
    >
      {dragEnabled && (
        <div {...dragHandleProps}>
          <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-stone-300" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-stone-800">{item.name}</p>
        <p className="text-xs text-stone-400">{categoryLabel(item.category)}</p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-brand-600">
        {formatPrice(item.price)}
      </span>

      <button
        type="button"
        onClick={(e) => {
          stopPropagation(e)
          onAddToMenu(item)
        }}
        onTouchStart={stopPropagation}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700 hover:bg-green-200 active:scale-95"
        aria-label={`${t.addToMenu} ${item.name}`}
      >
        <Plus className="h-4 w-4" />
      </button>

      {isMobile ? (
        <button
          type="button"
          onClick={(e) => {
            stopPropagation(e)
            onEditItem(item)
          }}
          onTouchStart={stopPropagation}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600 active:scale-95"
          aria-label={`${t.edit} ${item.name}`}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      ) : (
        <div className="flex shrink-0 items-center gap-0.5 opacity-100 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              stopPropagation(e)
              onEditItem(item)
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-brand-50 hover:text-brand-600"
            aria-label={`${t.edit} ${item.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              stopPropagation(e)
              onDeleteItem(item)
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500"
            aria-label={`${t.deleteFromPool} ${item.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

function PoolList({ items, dragEnabled, isMobile, onAddToMenu, onEditItem, onDeleteItem }) {
  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-stone-400">
        {t.noItemsInPool}
      </p>
    )
  }

  if (!dragEnabled) {
    return items.map((item) => (
      <PoolItemRow
        key={item.id}
        item={item}
        dragEnabled={false}
        isMobile={isMobile}
        onAddToMenu={onAddToMenu}
        onEditItem={onEditItem}
        onDeleteItem={onDeleteItem}
      />
    ))
  }

  return items.map((item, index) => (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(dragProvided, dragSnapshot) => (
        <PoolItemRow
          item={item}
          dragEnabled
          isMobile={isMobile}
          onAddToMenu={onAddToMenu}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
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

export default function ItemPool({
  items,
  dragEnabled = true,
  isMobile = false,
  onAddToMenu,
  onEditItem,
  onDeleteItem,
}) {
  const hint = dragEnabled
    ? t.dragToMenu
    : `${t.tapToAddHint} · ${t.longPressToEdit}`

  const list = (
    <PoolList
      items={items}
      dragEnabled={dragEnabled}
      isMobile={isMobile}
      onAddToMenu={onAddToMenu}
      onEditItem={onEditItem}
      onDeleteItem={onDeleteItem}
    />
  )

  if (!dragEnabled) {
    return (
      <div className="min-h-[200px] space-y-2 rounded-xl border-2 border-dashed border-stone-200 bg-white p-3">
        <p className="mb-2 text-xs font-medium text-stone-400">{hint}</p>
        {list}
      </div>
    )
  }

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
          <p className="mb-2 text-xs font-medium text-stone-400">{hint}</p>
          {list}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
