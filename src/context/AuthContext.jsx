import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth, ADMIN_EMAIL } from '../firebase/config'
import { t } from '../i18n/zh'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function login(password) {
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password)
      return true
    } catch (err) {
      setError(t.invalidPassword)
      return false
    }
  }

  async function logout() {
    setError(null)
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, clearError: () => setError(null) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth 必须在 AuthProvider 内使用')
  return context
}
