import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, restore session
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ee_session')
      if (stored) setUser(JSON.parse(stored))
    } catch {}
    setLoading(false)
  }, [])

  function signup({ name, email, password }) {
    // Check if email already registered
    const users = JSON.parse(localStorage.getItem('ee_users') || '[]')
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'An account with this email already exists.' }
    }
    const newUser = { id: `usr_${Date.now()}`, name, email, createdAt: new Date().toISOString() }
    users.push({ ...newUser, password })
    localStorage.setItem('ee_users', JSON.stringify(users))
    localStorage.setItem('ee_session', JSON.stringify(newUser))
    setUser(newUser)
    return { user: newUser }
  }

  function login({ email, password }) {
    const users = JSON.parse(localStorage.getItem('ee_users') || '[]')
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) return { error: 'Incorrect email or password.' }
    const sessionUser = { id: found.id, name: found.name, email: found.email }
    localStorage.setItem('ee_session', JSON.stringify(sessionUser))
    setUser(sessionUser)
    return { user: sessionUser }
  }

  function logout() {
    localStorage.removeItem('ee_session')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
