import { Draggable, Droppable } from '@hello-pangea/dnd'
import { GripVertical, Plus } from 'lucide-react'
import { formatPrice, categoryLabel, t } from '../../i18n/zh'

function PoolItemRow({ item, index, dragEnabled, onAddToMenu, dragProps = {} }) {
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
        <p className="text-xs text-stone-400">{categoryLabel(item.category)}</p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-brand-600">
        {formatPrice(item.price)}
      </span>
      <button
        type="button"
        onClick={() => onAddToMenu(item)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700 hover:bg-green-200 active:scale-95"
        aria-label={`${t.addToMenu} ${item.name}`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

function PoolList({ items, dragEnabled, onAddToMenu }) {
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
        onAddToMenu={onAddToMenu}
      />
    ))
  }

  return items.map((item, index) => (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(dragProvided, dragSnapshot) => (
        <PoolItemRow
          item={item}
          index={index}
          dragEnabled
          onAddToMenu={onAddToMenu}
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

export default function ItemPool({ items, dragEnabled = true, onAddToMenu }) {
  const hint = dragEnabled ? t.dragToMenu : t.tapToAddHint

  if (!dragEnabled) {
    return (
      <div className="min-h-[200px] space-y-2 rounded-xl border-2 border-dashed border-stone-200 bg-white p-3">
        <p className="mb-2 text-xs font-medium text-stone-400">{hint}</p>
        <PoolList items={items} dragEnabled={false} onAddToMenu={onAddToMenu} />
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
          <PoolList items={items} dragEnabled onAddToMenu={onAddToMenu} />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
