import { Heading, styled, Text } from '@medap-ui/react'
import WelcomeBackground from '@/assets/images/test.png'

export const LoginPageContainer = styled('main', {
  display: 'flex',

  '& > a': {
    position: 'absolute',
    top: '2%',
    left: '1%',

    cursor: 'pointer',
    zIndex: 900,
  },

  '@bp4': {
    flexDirection: 'column',
  },

  '@bp2': {
    '& > a > img': {
      width: '24px',
      height: '32px',
    },

    '& > a': {
      top: '2%',
      left: '3%',
    },
  },
})

export const LoginContainer = styled('article', {
  width: '59%',
  height: '100vh',
  boxSizing: 'border-box',

  padding: '15vh $3',

  display: 'flex',
  justifyContent: 'center',

  '@bp4': {
    height: 'fit-content',
    width: '100%',

    padding: '10vh $4',
  },
})

export const LoginForm = styled('form', {
  height: '80%',
})

export const LoginHeader = styled('header', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',

  marginBottom: '$8',

  [`${Heading}`]: {
    textAlign: 'center',
    maxWidth: '45ch',
  },
})

export const LoginFieldsContainer = styled('div', {
  marginBottom: '$8',

  '& > div': {
    marginBottom: '$4',
  },
})

export const LoginFooter = styled('footer', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',

  alignItems: 'center',
})

export const ErrorMessage = styled('span', {
  display: 'block',
  padding: '$3 $4',
  border: '2px solid $danger_200',
  borderRadius: '$small',
  fontSize: '$medium',
  color: '$danger_600',
})

export const WelcomeContainer = styled('article', {
  width: '41%',
  height: '100vh',

  display: 'flex',
  justifyContent: 'center',

  boxSizing: 'border-box',

  padding: '15vh $3',

  backgroundImage: `url(${WelcomeBackground.src})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',

  '@bp4': {
    height: 'fit-content',
    width: '100%',

    padding: '10vh $4',
  },

  '@bp2': {
    height: 'fit-content',
    width: '100%',

    padding: '10vh $3',
  },
})

export const WelcomeContent = styled('article', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
  alignItems: 'center',

  [`${Heading}`]: {
    textAlign: 'center',
  },

  [`${Text}`]: {
    textAlign: 'center',
    maxWidth: '40ch',
    marginTop: '$6',
    marginBottom: '$16',
  },

  '& > a': {
    textDecoration: 'none',
  },
})
