import { keyframes, styled } from '@medap-ui/react'

const ToastScreenTimer = keyframes({
  '0%': { left: 0 },
  '100%': { left: '100%' },
})

const ToastDisapearAnimation = keyframes({
  '0%': { display: 'flex' },
  '100%': { display: 'none' },
})

export const ToastContainer = styled('div', {
  position: 'fixed',
  top: '98%',
  left: '98%',
  zIndex: 800,
  transform: 'translate(-100%, -100%)',
  borderRadius: '$small',
  width: 420,
  boxShadow: '0px 0px 10px 5px rgb(0,0,0,0.03)',

  overflow: 'hidden',
  animation: `${ToastDisapearAnimation} 5s linear forwards`,

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'start',
  gap: '2px',

  '@bp3': {
    left: '97%',
    width: 300,

    '& > div': {
      svg: {
        width: 18,
        height: 18,
      },
    },
  },

  variants: {
    type: {
      success: {
        borderLeft: '6px solid $brand_base',
        backgroundColor: '$brand_100',

        '& > div': {
          svg: {
            color: '$brand_base',
          },
        },
      },
      error: {
        borderLeft: '6px solid $danger_400',
        backgroundColor: '#FFE4E4',

        '& > div': {
          svg: {
            color: '$danger_400',
          },
        },
      },
      warning: {
        borderLeft: '6px solid $warning_500',
        backgroundColor: '#FFF2D9',

        '& > div': {
          svg: {
            color: '$warning_500',
          },
        },
      },
    },
    active: {
      true: {
        display: 'flex',
      },
      false: {
        display: 'none',
        animation: 'none !important',
      },
    },
    hasTimer: {
      true: {
        animation: `${ToastDisapearAnimation} 5s linear forwards`,
      },
      false: {
        animation: 'none',
      },
    },
  },

  defaultVariants: {
    type: 'success',
    active: 'true',
    hasTimer: 'false',
  },
})

export const ToastInfoContainer = styled('div', {
  display: 'flex',
  gap: '$3',
  padding: '$3 $5 $3 $3',

  '@bp3': {
    padding: '$2 $3 $2 $1',
  },
})

export const ToastInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})

export const ToastTimer = styled('div', {
  display: 'block',
  position: 'relative',
  width: '100%',
  height: '4px',
  backgroundColor: '$gray_400',

  animation: `${ToastScreenTimer} 5s linear forwards`,
})

export const CloseToastButton = styled('div', {
  display: 'block',
  position: 'absolute',
  top: 5,
  left: '99%',
  transform: 'translate(-100%)',
  cursor: 'pointer',
})
