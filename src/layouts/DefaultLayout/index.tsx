import { Body, MainContent } from './styles'
import { ReactNode } from 'react'
import MainMenu from '@/components/PageStructure/MainMenu'
import { AuthProvider } from '@/contexts/AuthContext'

interface PageBodyProps {
  activePage: string
  children: ReactNode
}

export default function DefaultLayout({ children, activePage }: PageBodyProps) {
  return (
    <AuthProvider>
      <Body>
        <MainMenu activePage={activePage} />
        <MainContent>{children}</MainContent>
      </Body>{' '}
    </AuthProvider>
  )
}
