import { useEffect, useState } from 'react'
import { AuthContext } from './authContext.js'
import { api } from '../api.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadUser() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const data = await api('/auth/me', { token })
        if (active) setUser(data.user)
      } catch {
        localStorage.removeItem('token')
        if (active) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadUser()
    return () => {
      active = false
    }
  }, [token])

  function persistAuth(data) {
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  async function login(email, password) {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } })
    persistAuth(data)
    return data.user
  }

  async function register(name, email, password) {
    const data = await api('/auth/register', { method: 'POST', body: { name, email, password } })
    persistAuth(data)
    return data.user
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}