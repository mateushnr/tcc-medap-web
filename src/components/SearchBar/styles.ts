import { styled } from '@medap-ui/react'

export const ContainerSearchBar = styled('div', {
  display: 'flex',
  width: 'fit-content',

  borderRadius: '$small',
  overflow: 'hidden',

  variants: {
    isFocused: {
      true: {
        boxShadow: '0 0 0px 1px #2A844C',
        border: '1px solid #2A844C',
      },
      false: {
        border: '1px solid $gray_400',
      },
    },
  },
  defaultVariants: {
    isFocused: false,
  },
})

export const SearchButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  background: 'none',
  padding: '$2 $3',
  border: 'none',
  cursor: 'pointer',

  svg: {
    color: '$gray_600',
  },

  '&:hover': {
    transition: 'background 0.3s',
    background: '$brand_100',
    svg: {
      color: '$brand_700',
    },
  },
})

export const InputSearchBar = styled('input', {
  display: 'flex',
  minWidth: '300px',
  padding: '$2',
  border: 'none',
  fontFamily: '$default',
  fontSize: '$medium',

  '&::placeholder': {
    color: '$gray_500',
  },

  '&:focus': {
    outline: 'none',
  },
})

export const ClearButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  background: '$gray_50',
  cursor: 'pointer',
  border: 'none',
  borderLeft: '1px solid $gray_400',
  padding: '$2',

  svg: {
    color: '$gray_600',
  },

  '&:hover': {
    transition: 'background 0.3s',
    background: '$gray_100',
    svg: {
      color: '$danger_400',
    },
  },
})
