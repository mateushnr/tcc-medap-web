import { styled, Button } from '@medap-ui/react'

export const HeaderContainer = styled('header', {
  maxWidth: 1068,
  padding: '$4 $6',
  margin: '0 auto $16 auto ',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '$3',

  '@bp2': {
    margin: '0 auto $8 auto ',
  },
})

export const Navigation = styled('nav', {
  display: 'flex',
  alignItems: 'center',
  gap: '$8',

  '& > a':{
    textDecoration: 'none',

    [`${Button}`]:{
      padding: '10px $4',

      '@bp2': {
        padding: '8px $3',
      },
    }
  }
})
