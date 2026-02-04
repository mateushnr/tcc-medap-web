import { styled } from '@medap-ui/react'

export const Body = styled('div', {
  height: '100vh',
  overflow: 'auto',
})

export const MainContent = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  padding: '28px $8 $8 $8',
  marginLeft: 107,
  backgroundColor: '$brand_light',

  '@bp4': {
    marginLeft: 0,
    padding: '$8',
  },

  '@bp3': {
    padding: '$8 $6 $8 $6',
  },

  '@bp2': {
    padding: '$6 $4 $6 $4',
  },
})
