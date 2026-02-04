import { destroyCookie, parseCookies } from 'nookies'
import { createContext, ReactNode, useEffect, useState } from 'react'
import Router from 'next/router'
import { User } from '@/@types/user'
import { AuthContextType } from '@/@types/auth'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

const BASE_URL = 'http://localhost:3000'

export const recoverUserAuthData = async (token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/sessions/recover-user-data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const userData: User = await response.json()
      return userData
    } else {
      throw new Error('Falha na recuperação dos dados do usuário')
    }
  } catch (error) {
    console.error('Falha na recuperação dos dados do usuário: ', error)
  }

  return null
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = !!user

  useEffect(() => {
    const { 'medap.token': tokenUser } = parseCookies()

    if (tokenUser) {
      const authenticateUser = async (token: string) => {
        const userData = await recoverUserAuthData(token)

        setUser(userData)
      }
      authenticateUser(tokenUser)
    }
  }, [])

  function logout() {
    destroyCookie(undefined, 'medap.token', { path: '/' })

    setUser(null)
    Router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
