import { Avatar, Heading, Text } from '@medap-ui/react'
import {
  ApplicationLinksContainer,
  ExpandedMenuButton,
  HeaderContent,
  LogOutButton,
  MainMenuContainer,
  MenuFooter,
  MenuHeader,
  MenuItem,
  MenuItemUser,
  MenuMobile,
  MenuNavigation,
  OpenMenuMobile,
  UserInfoContainer,
  UserLinksContainer,
  UserProfileContainer,
} from './styles'
import Link from 'next/link'
import {
  Activity,
  ChevronLeft,
  CircleUserRound,
  ClipboardPlus,
  Cross,
  HeartPulse,
  Hospital,
  LogOut,
  MenuIcon,
  Pill,
  Stethoscope,
} from 'lucide-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

interface MenuProps {
  activePage: string
}

export default function MainMenu({ activePage }: MenuProps) {
  const [menuExpanded, setMenuExpanded] = useState<boolean>(false)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const expandMenuButtonRef = useRef<HTMLButtonElement>(null)

  const { user, logout } = useContext(AuthContext)

  const translateUserAccessLevelText = () => {
    switch (user?.accessLevel) {
      case 'ADMINISTRATOR': {
        return 'Administrador'
      }
      case 'RESPONSIBLE': {
        return 'Responsável'
      }
      case 'MANAGER': {
        return 'Gerente'
      }
      case 'HEALTH_PROFESSIONAL': {
        return 'Profissional da Saúde'
      }
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const toggleMenuState = () => {
    setMenuExpanded(!menuExpanded)
    if (window.innerWidth < 1024) {
      setMenuOpen(false)
    }
  }

  const handleWindowResize = () => {
    setMenuOpen(window.innerWidth >= 1024)
  }

  const handleMenuOutsideClick = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      expandMenuButtonRef.current &&
      !expandMenuButtonRef.current.contains(event.target as Node)
    ) {
      setMenuExpanded(false)

      if (window.innerWidth < 1024) {
        setMenuOpen(false)
        setMenuExpanded(true)
      }
    }
  }

  useEffect(() => {
    const elementsToToggle = document.querySelectorAll('[data-menu-toggle]')

    elementsToToggle.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.display = menuExpanded ? 'block' : 'none'
      }
    })
  }, [menuExpanded])

  useEffect(() => {
    handleWindowResize()

    window.addEventListener('resize', handleWindowResize)
    document.addEventListener('mousedown', handleMenuOutsideClick)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      document.removeEventListener('mousedown', handleMenuOutsideClick)
    }
  }, [])

  return (
    <>
      {!menuOpen ? (
        <MenuMobile>
          <OpenMenuMobile onClick={toggleMenu}>
            <MenuIcon size={32} />
          </OpenMenuMobile>
        </MenuMobile>
      ) : null}

      <ExpandedMenuButton
        state={menuExpanded ? 'expanded' : 'collapsed'}
        onClick={toggleMenuState}
        menuOpen={!!menuOpen}
        ref={expandMenuButtonRef}
      >
        <ChevronLeft size={24} />
      </ExpandedMenuButton>

      <MainMenuContainer
        ref={menuRef}
        state={menuExpanded ? 'expanded' : 'collapsed'}
        menuOpen={!!menuOpen}
      >
        <div>
          <MenuHeader>
            <HeaderContent>
              <Avatar alt="Avatar do estabelecimento" />
              <Heading
                data-menu-toggle
                as={'strong'}
                fontWeight={'black'}
                size={'xlarge'}
                color={'gray_100'}
              >
                {user?.organization}
              </Heading>
            </HeaderContent>
          </MenuHeader>
          <MenuNavigation>
            <ApplicationLinksContainer>
              <Link href="/dashboard">
                <MenuItem active={activePage === 'DASHBOARD'}>
                  <Activity size={24} />
                  <Heading
                    data-menu-toggle
                    as={'p'}
                    color={'gray_300'}
                    fontWeight={'light'}
                    size={'xlarge'}
                  >
                    Dashboard
                  </Heading>
                </MenuItem>
              </Link>
              <Link href="/profissional/incluir">
                <MenuItem active={activePage === 'PROFESSIONAL'}>
                  <Stethoscope size={24} />
                  <Heading
                    data-menu-toggle
                    as={'p'}
                    color={'gray_300'}
                    fontWeight={'light'}
                    size={'xlarge'}
                  >
                    Profissional
                  </Heading>
                </MenuItem>
              </Link>
              <Link href="/paciente/incluir">
                <MenuItem active={activePage === 'PATIENT'}>
                  <HeartPulse size={24} />
                  <Heading
                    data-menu-toggle
                    as={'p'}
                    color={'gray_300'}
                    fontWeight={'light'}
                    size={'xlarge'}
                  >
                    Paciente
                  </Heading>
                </MenuItem>
              </Link>
              <Link href="/receituario/incluir">
                <MenuItem active={activePage === 'PRESCRIPTION'}>
                  <ClipboardPlus size={24} />
                  <Heading
                    data-menu-toggle
                    as={'p'}
                    color={'gray_300'}
                    fontWeight={'light'}
                    size={'xlarge'}
                  >
                    Receita
                  </Heading>
                </MenuItem>
              </Link>
              <Link href="/unidade/incluir">
                <MenuItem active={activePage === 'UNITY'}>
                  <Cross size={24} />
                  <Heading
                    data-menu-toggle
                    as={'p'}
                    color={'gray_300'}
                    fontWeight={'light'}
                    size={'xlarge'}
                  >
                    Unidade
                  </Heading>
                </MenuItem>
              </Link>
              <Link href="/estabelecimento/incluir">
                <MenuItem active={activePage === 'ESTABLISHMENT'}>
                  <Hospital size={24} />
                  <Heading
                    data-menu-toggle
                    as={'p'}
                    color={'gray_300'}
                    fontWeight={'light'}
                    size={'xlarge'}
                  >
                    Estabelecimento
                  </Heading>
                </MenuItem>
              </Link>
              <Link href="/medicamento/incluir">
                <MenuItem active={activePage === 'MEDICINE'}>
                  <Pill size={24} />
                  <Heading
                    data-menu-toggle
                    as={'p'}
                    color={'gray_300'}
                    fontWeight={'light'}
                    size={'xlarge'}
                  >
                    Medicamento
                  </Heading>
                </MenuItem>
              </Link>
            </ApplicationLinksContainer>
            <UserLinksContainer>
              <LogOutButton onClick={logout}>
                <MenuItemUser>
                  <LogOut size={24} />

                  <Heading
                    data-menu-toggle
                    as={'p'}
                    color={'gray_300'}
                    fontWeight={'light'}
                    size={'xlarge'}
                  >
                    Sair
                  </Heading>
                </MenuItemUser>
              </LogOutButton>
            </UserLinksContainer>
          </MenuNavigation>
        </div>

        <MenuFooter>
          <UserProfileContainer>
            <CircleUserRound size={32} />
            <UserInfoContainer>
              <Heading
                data-menu-toggle
                as={'strong'}
                size={'medium'}
                color={'white'}
              >
                {user?.name}
              </Heading>
              <Text data-menu-toggle size={'small'} color={'brand_100'}>
                {translateUserAccessLevelText()}
              </Text>
            </UserInfoContainer>
          </UserProfileContainer>
        </MenuFooter>
      </MainMenuContainer>
    </>
  )
}
