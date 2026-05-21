// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { subscribeToAuthChanges, logOut } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true) // true until Firebase resolves

  useEffect(() => {
    // Subscribe once; onAuthStateChanged fires immediately with the cached user
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe // cleanup on unmount
  }, [])

  const logout = async () => {
    await logOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/** Convenience hook — throws if used outside <AuthProvider> */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
