import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, restore session
  useEffect(() => {
    async function verifySession() {
      try {
        const stored = localStorage.getItem('ee_session')
        if (stored) {
          const session = JSON.parse(stored)
          if (session && session.token) {
            // Validate token and get fresh user data
            const res = await api.get('/auth/me');
            setUser({ ...res.data, token: session.token })
          }
        }
      } catch (err) {
        console.error('Session restore failed:', err)
        localStorage.removeItem('ee_session')
      } finally {
        setLoading(false)
      }
    }
    verifySession()
  }, [])

  async function signup({ name, email, password }) {
    try {
      const res = await api.post('/auth/register', { name, email, password })
      localStorage.setItem('ee_session', JSON.stringify(res.data))
      setUser(res.data)
      return { user: res.data }
    } catch (err) {
      return { error: err.response?.data?.message || 'Registration failed.' }
    }
  }

  async function login({ email, password }) {
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('ee_session', JSON.stringify(res.data))
      setUser(res.data)
      return { user: res.data }
    } catch (err) {
  console.error('Login error:', err)
  console.log('Full error response:', err.response?.data) 
  
  // Try different possible error response formats
  const errorMessage = err.response?.data?.message 
    || err.response?.data?.error 
    || err.response?.data 
    || 'Incorrect email or password.'
  
  return { error: errorMessage }
}
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
