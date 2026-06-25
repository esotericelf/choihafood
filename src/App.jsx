import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import PublicView from './components/public/PublicView'
import AdminDashboard from './components/admin/AdminDashboard'
import LoginModal from './components/auth/LoginModal'
import LoadingSpinner from './components/common/LoadingSpinner'
import { t } from './i18n/zh'

function AppContent() {
  const { user, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [previewPublic, setPreviewPublic] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (user && !previewPublic) {
    return (
      <>
        <AdminDashboard onPreviewPublic={() => setPreviewPublic(true)} />
        {showLogin && <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />}
      </>
    )
  }

  return (
    <>
      <PublicView onAdminLogin={() => setShowLogin(true)} />
      {user && previewPublic && (
        <button
          type="button"
          onClick={() => setPreviewPublic(false)}
          className="fixed bottom-4 right-4 z-40 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-brand-700"
        >
          {t.backToAdmin}
        </button>
      )}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  )
}
