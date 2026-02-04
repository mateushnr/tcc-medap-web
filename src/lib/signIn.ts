import { LoginFormData } from '@/pages/login/index.page'
import { setCookie } from 'nookies'

const BASE_URL = 'http://localhost:3000'

interface SignInResponseData {
  accessToken: string
}

export const signIn = async ({
  organization,
  email,
  password,
}: LoginFormData) => {
  try {
    const response = await fetch(`${BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organization, email, password }),
    })

    switch (response.status) {
      case 201: {
        const { accessToken }: SignInResponseData = await response.json()

        setCookie(undefined, 'medap.token', accessToken, {
          maxAge: 60 * 60 * 12, // 12 hours
          path: '/',
        })

        return null
      }
      case 401: {
        return 'O login falhou! Por favor confira os seus dados'
      }
      default: {
        return 'Falha na autenticação'
      }
    }
  } catch (error) {
    throw new Error('Falha na autenticação: ' + error)
  }
}
