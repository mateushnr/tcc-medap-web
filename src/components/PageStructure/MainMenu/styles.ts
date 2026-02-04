import { keyframes, styled } from '@medap-ui/react'

const expandMenu = keyframes({
  '0%': { width: 105 },
  '100%': { width: 277 },
})

const expandButton = keyframes({
  '0%': { left: '88px' },
  '100%': { left: '260px' },
})

const rotateExpandButton = keyframes({
  '0%': { transform: 'rotate(180deg)' },
  '100%': { transform: 'rotate(0deg)' },
})

export const MainMenuContainer = styled('aside', {
  height: '100vh',

  backgroundColor: '$brand_dark',
  overflowY: 'auto',
  overflowX: 'hidden',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',

  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 10,

  borderRight: '3px solid $gray_300',

  '&::-webkit-scrollbar': {
    width: 0,
  },

  '@bp4': {
    display: 'none',
  },

  variants: {
    state: {
      collapsed: {
        width: 96,

        '& > div > nav > section > a > div': {
          justifyContent: 'center',
        },
      },
      expanded: {
        animation: `${expandMenu} 0.2s linear`,
      },
    },
    menuOpen: {
      true: {
        display: 'flex',
      },
      false: {
        display: 'none',
      },
    },
  },

  defaultVariants: {
    state: 'expanded',
    menuOpen: 'true',
  },
})

export const MenuHeader = styled('header', {
  padding: '$6',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  borderBottom: '1px solid $gray_600',
})

export const HeaderContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$4',

  position: 'relative',

  '& > strong': {
    width: '160px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
})

export const ExpandedMenuButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$1',
  backgroundColor: 'rgb(22, 67, 63, 90)',
  borderRadius: '$full',

  border: 'none',
  position: 'absolute',

  zIndex: 999,
  top: '30px',

  cursor: 'pointer',

  '&:hover': {
    backgroundColor: 'rgb(42, 91, 87, 90)',
    transition: 'background 0.5s',
  },

  svg: {
    color: '$gray_100',
  },

  '@bp4': {
    display: 'none',
  },

  variants: {
    state: {
      collapsed: {
        left: '82px',
        transform: 'rotate(180deg)',
      },
      expanded: {
        left: '260px',
        animation: `${expandButton} 0.2s linear, ${rotateExpandButton} 0.3s linear`,
      },
    },
    menuOpen: {
      true: {
        display: 'flex',
      },
      false: {
        display: 'none',
      },
    },
  },

  defaultVariants: {
    state: 'collapsed',
    menuOpen: 'true',
  },
})

export const MenuNavigation = styled('nav', {
  padding: '$6 $8 $12 $8',

  display: 'flex',
  flexDirection: 'column',
  gap: '$16',

  '& a': {
    textDecoration: 'none',
  },
})

export const ApplicationLinksContainer = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
})

export const MenuItem = styled('div', {
  padding: '$2 $1 $4 $1',
  position: 'relative',

  display: 'flex',
  alignItems: 'center',
  gap: '$4',

  maxWidth: '200px',

  borderBottom: '1px solid $gray_700',

  '&:hover': {
    transition: 'border 0.4s',
    borderBottom: '1px solid $gray_600',

    svg: {
      transition: 'color 0.4s',
      color: '$white',
    },
    '& > p': {
      transition: 'color 0.4s',
      color: '$white',
    },
  },

  '& > p': {
    width: '160px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },

  svg: {
    color: '$gray_300',
  },

  variants: {
    active: {
      true: {
        '& > p': {
          color: '$brand_100',
        },

        svg: {
          color: '$brand_100',
        },

        '&::after': {
          content: '',
          position: 'absolute',
          left: -32,

          display: 'block',
          height: '42px',
          width: '6px',
          borderRadius: '$large',
          backgroundColor: '$brand_100',
        },
      },
      false: {},
    },
  },

  defaultVariants: {
    active: 'false',
  },
})

export const UserLinksContainer = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})

export const MenuItemUser = styled('div', {
  padding: '$2 $1 $4 $1',

  position: 'relative',

  display: 'flex',
  alignItems: 'center',
  gap: '$4',

  '&:hover': {
    svg: {
      transition: 'color 0.4s',
      color: '$white',
    },
    '& > p': {
      transition: 'color 0.4s',
      color: '$white',
    },
  },

  '& > p': {
    width: '165px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },

  svg: {
    color: '$gray_300',
  },

  variants: {
    active: {
      true: {
        '& > p': {
          color: '$brand_100',
        },

        svg: {
          color: '$brand_100',
        },

        '&::after': {
          content: '',
          position: 'absolute',
          left: -32,

          display: 'block',
          height: '42px',
          width: '6px',
          borderRadius: '$large',
          backgroundColor: '$brand_100',
        },
      },
      false: {},
    },
  },

  defaultVariants: {
    active: 'false',
  },
})

export const LogOutButton = styled('button', {
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
})

export const MenuFooter = styled('footer', {
  borderTop: '1px solid $gray_600',
  padding: '$8',
})

export const UserProfileContainer = styled('footer', {
  display: 'flex',
  gap: '$2',
  alignItems: 'center',

  svg: {
    color: 'white',
  },
})

export const UserInfoContainer = styled('footer', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',

  maxWidth: '200px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',

  '& > strong, & > p': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

// Menu mobile

export const MenuMobile = styled('nav', {
  backgroundColor: '$brand_800',
  padding: '$2',
  position: 'sticky',
  top: 0,
  zIndex: 700,

  display: 'none',

  '@bp4': {
    display: 'block',
  },
})

export const OpenMenuMobile = styled('button', {
  padding: '$1',
  lineHeight: 0,
  cursor: 'pointer',
  background: 'none',
  border: 'none',

  svg: {
    color: '$brand_100',
  },

  '&:hover': {
    svg: {
      transition: 'color 0.3s',
      color: '$brand_200',
    },
  },
})
