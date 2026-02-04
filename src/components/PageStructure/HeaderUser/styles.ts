import { styled } from '@medap-ui/react'

export const HeaderContainer = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$2',
  flexWrap: 'wrap',

  marginBottom: '$8',
})

export const UserInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$4',

  svg: {
    color: '$brand_800',
  },

  '@bp3': {
    svg: {
      width: 20,
      height: 20,
    },
  },
})
