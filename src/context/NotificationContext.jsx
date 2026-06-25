import { createContext, useCallback, useContext, useRef, useState } from 'react'
import Toast from '../components/common/Toast'
import SuccessOverlay from '../components/common/SuccessOverlay'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [toast, setToast] = useState(null)
  const [overlay, setOverlay] = useState(null)
  const toastTimerRef = useRef(null)
  const overlayTimerRef = useRef(null)

  const clearToastTimer = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
  }, [])

  const clearOverlayTimer = useCallback(() => {
    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current)
      overlayTimerRef.current = null
    }
  }, [])

  const showToast = useCallback((message, duration = 1800) => {
    clearToastTimer()
    setToast({ message, key: Date.now() })
    toastTimerRef.current = setTimeout(() => {
      setToast(null)
      toastTimerRef.current = null
    }, duration)
  }, [clearToastTimer])

  const showSuccessOverlay = useCallback((message, { duration = 1500, onComplete } = {}) => {
    clearOverlayTimer()
    setOverlay({ message, key: Date.now(), onComplete })
    overlayTimerRef.current = setTimeout(() => {
      setOverlay(null)
      overlayTimerRef.current = null
      onComplete?.()
    }, duration)
  }, [clearOverlayTimer])

  return (
    <NotificationContext.Provider value={{ showToast, showSuccessOverlay }}>
      {children}
      {toast && <Toast key={toast.key} message={toast.message} />}
      {overlay && (
        <SuccessOverlay
          key={overlay.key}
          message={overlay.message}
        />
      )}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotification 必须在 NotificationProvider 内使用')
  return context
}
