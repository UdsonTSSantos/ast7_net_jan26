import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/lib/types'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: User | null
  login: (email: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('ast7_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const role = email === 'suporte@ast7.com.br' ? 'admin' : 'user'
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
    }

    setUser(newUser)
    localStorage.setItem('ast7_user', JSON.stringify(newUser))
    navigate('/')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ast7_user')
    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
