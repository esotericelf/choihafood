import { useCallback, useRef } from 'react'

export function useLongPress(callback, { delay = 500 } = {}) {
  const timerRef = useRef(null)
  const movedRef = useRef(false)

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    movedRef.current = false
    clear()
    timerRef.current = setTimeout(() => {
      if (!movedRef.current) callback()
    }, delay)
  }, [callback, delay, clear])

  const move = useCallback(() => {
    movedRef.current = true
    clear()
  }, [clear])

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: move,
    onTouchCancel: clear,
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
  }
}
