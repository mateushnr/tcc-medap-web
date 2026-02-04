import { Box, styled, Text } from '@medap-ui/react'

export const NavigationContainer = styled('nav', {
  overflow: 'auto',

  [`${Box}`]: {
    padding: '$3 $6',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '$12',
    borderRadius: '$large',

    marginBottom: '$6',

    '& > a': {
      textDecoration: 'none',
    },
  },

  '@bp4': {
    [`${Box}`]: {
      gap: '$4',
    },
  },
})

export const LinkContainer = styled('article', {
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  lineHeight: 0,

  padding: '6px $4',
  borderRadius: '$large',

  '& >': {
    [`${Text}`]: {
      lineHeight: 0,
    },
  },

  variants: {
    active: {
      true: {
        cursor: 'text',
        backgroundColor: '$brand_550',

        svg: {
          color: '$white',
        },
        '& >': {
          [`${Text}`]: {
            color: '$white',
          },
        },
      },
      false: {
        cursor: 'pointer',

        svg: {
          color: '$gray_500',
        },
        '& >': {
          [`${Text}`]: {
            color: '$gray_500',
          },
        },

        '&:hover': {
          transition: 'background 0.3s',
          backgroundColor: '$gray_100',

          svg: {
            transition: 'color 0.3s',
            color: '$gray_700',
          },
          '& >': {
            [`${Text}`]: {
              transition: 'color 0.3s',
              color: '$gray_700',
            },
          },
        },
      },
    },
  },

  defaultVariants: {
    active: 'false',
  },
})
