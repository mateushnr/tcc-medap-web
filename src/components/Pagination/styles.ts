import { styled } from '@medap-ui/react'

export const ContainerPagination = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$1',
})

export const NextPageButton = styled('button', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid $gray_500',
  background: '$white',
  lineHeight: 0,
  borderRadius: '$small',
  width: '$6',
  height: '$6',
  marginLeft: '$1',

  svg: {
    color: '$gray_600',
  },

  '&:disabled': {
    cursor: 'not-allowed',
    border: '1px solid $gray_200',
    svg: {
      color: '$gray_400',
    },
  },
})

export const PreviousPageButton = styled('button', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid $gray_500',
  background: '$white',
  lineHeight: 0,
  borderRadius: '$small',
  width: '$6',
  height: '$6',
  marginRight: '$1',

  svg: {
    color: '$gray_600',
  },

  '&:disabled': {
    cursor: 'not-allowed',
    border: '1px solid $gray_200',
    svg: {
      color: '$gray_400',
    },
  },
})

export const PageItemButton = styled('button', {
  cursor: 'pointer',
  display: 'block',

  fontFamily: '$default',
  fontSize: 12,
  padding: '0 $1',

  background: '$white',
  minWidth: '24px',
  minHeight: '24px',

  borderRadius: '$small',

  '&:disabled': {
    cursor: 'not-allowed',
    border: '1px solid $gray_200',
  },

  variants: {
    isCurrentPage: {
      true: {
        color: '$brand_700',
        fontWeight: 700,
        border: '2px solid $brand_700',
      },
      false: {
        border: '1px solid $gray_400',

        '&:hover': {
          transition: 'background 0.3s, border 0.3s',
          background: '$gray_50',
          border: '1px solid $gray_500',
        },
      },
    },
  },
  defaultVariants: {
    isCurrentPage: false,
  },
})

export const IntervalDetail = styled('span', {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',

  fontFamily: '$default',
  fontSize: 16,
  color: '$gray_600',
  margin: '0 2px',
})

export const ContainerPageItem = styled('div', {
  display: 'flex',
  gap: '$1',
})
