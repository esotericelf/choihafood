import { useState } from 'react'
import { Lock, X, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { t } from '../../i18n/zh'

export default function LoginModal({ isOpen, onClose }) {
  const { login, error, clearError } = useAuth()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!password.trim()) return
    setSubmitting(true)
    const success = await login(password)
    setSubmitting(false)
    if (success) {
      setPassword('')
      onClose()
    }
  }

  function handleClose() {
    setPassword('')
    clearError()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
              <Lock className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">{t.adminLoginTitle}</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            aria-label={t.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="master-password" className="mb-1.5 block text-sm font-medium text-stone-700">
              {t.masterPassword}
            </label>
            <div className="relative">
              <input
                id="master-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  clearError()
                }}
                placeholder={t.enterMasterPassword}
                className="w-full rounded-xl border border-stone-200 px-4 py-2.5 pr-10 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label={showPassword ? t.hidePassword : t.showPassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || !password.trim()}
            className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? t.signingIn : t.signIn}
          </button>
        </form>
      </div>
    </div>
  )
}
