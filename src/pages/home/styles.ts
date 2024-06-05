import { styled } from '@medap-ui/react'

// Section Introduction
export const Introduction = styled('section', {
  padding: '0 $6',
  maxWidth: 1068,
  margin: '0 auto $16 auto',

  display: 'flex',
  justifyContent: 'space-between',

  '@bp4': {
    flexDirection: 'column-reverse',
    margin: '0 auto $12 auto',
  },
})

export const Content = styled('div', {
  display: 'flex',
  flexDirection: 'column',

  '& > strong': {
    textTransform: 'uppercase',
    marginBottom: '$4',
  },

  '& > h1': {
    marginBottom: '$6',
    maxWidth: '20ch',

    '@bp4': {
      maxWidth: '100%',
    },
  },

  '& > p': {
    marginBottom: '$10',
    maxWidth: '58ch',

    '@bp4': {
      maxWidth: '100%',
    },

    '@bp2': {
      marginBottom: '$6',
    },
  },
})

export const Highlight = styled('strong', {
  fontWeight: '$regular',
  color: '$brand_base',
})

export const Figure = styled('div', {
  position: 'relative',
  marginRight: '$4',

  '@bp4': {
    marginRight: '0px',
  },

  '& > img': {
    position: 'relative',
    objectFit: 'cover',
    zIndex: 2,
    objectPosition: 'center center',

    '@bp4': {
      width: '100%',
      height: 120,
      marginBottom: '$6',
    },
  },
})

export const ImageDetail = styled('span', {
  display: 'block',
  width: 268,
  height: 338,
  background: '$brand_200',

  position: 'absolute',
  top: 30,
  left: 30,

  '@bp4': {
    width: '100%',
    height: 120,
    top: 5,
    left: 0,
  },
})

// Section System Created For
export const SystemCreatedFor = styled('section', {
  background: '$brand_800',
})

export const ContainerSystemCreatedFor = styled('div', {
  position: 'relative',
  padding: '$8 $6',
  maxWidth: 1068,
  margin: '0 auto $8 auto',

  display: 'flex',
  flexDirection: 'column',
  gap: '$6',

  '@bp2': {
    margin: '0 auto $4 auto',
  },
})

export const HeaderSystemCreatedFor = styled('header', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
})

export const ListEstablishments = styled('ul', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$4',

  '@bp4': {
    flexDirection: 'column',
  },
})

export const ListItem = styled('li', {
  color: '$gray_100',
  fontSize: '$xlarge',
  fontFamily: '$default',
  fontWeight: '$light',
  marginRight: '$12',

  display: 'flex',
  alignItems: 'center',
  gap: '$2',

  '@bp2': {
    fontSize: '$medium',

    svg: {
      width: 14,
      height: 14,
    },
  },
})

export const Bullet = styled('span', {
  display: 'block',
  width: '$3',
  height: '$3',
  background: '$brand_100',
  borderRadius: '$full',

  '@bp2': {
    width: '$2',
    height: '$2',
  },
})

export const ContainerBulletDetail = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  width: 80,
  gap: '$6',

  position: 'absolute',

  '@bp2': {
    width: 40,
    gap: '$4',
  },

  variants: {
    side: {
      left: {
        left: '-56px',

        '@bp4': {
          top: 'calc(70% - 112px)',
          left: 'calc(100% - 80px)',
        },

        '@bp2': {
          left: 'calc(100% - 50px)',
          top: 'calc(80% - 92px)',
        },
      },
      right: {
        left: '100%',
        top: 'calc(100% - 112px)',

        '@bp4': {
          left: 'calc(100% - 80px)',
        },

        '@bp2': {
          left: 'calc(100% - 50px)',
          top: 'calc(100% - 92px)',
        },
      },
    },
  },

  defaultVariants: {
    side: 'left',
  },
})

export const BulletDetail = styled('span', {
  display: 'block',
  width: '$3',
  height: '$3',
  background: '$brand_700',
  borderRadius: '$full',

  '@bp2': {
    width: '$2',
    height: '$2',
  },

  variants: {
    visibility: {
      visible: { visibility: 'visible' },
      hidden: { visibility: 'hidden' },
    },
  },

  defaultVariants: {
    visibility: 'visible',
  },
})

// Section Advantages
export const Advantages = styled('section', {
  padding: '$8 $6',
  maxWidth: 1068,
  margin: '0 auto $16 auto',

  display: 'flex',
  flexDirection: 'column',
  gap: '$8',

  '& > h2': {
    textAlign: 'center',
  },

  '@bp2': {
    margin: '0 auto $12 auto',
  },
})

export const AdvantagesList = styled('ul', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$16',
  listStyle: 'none',
  justifyContent: 'center',
  alignItems: 'center',

  '@bp2': {
    gap: '$8',
  },
})

export const AdvantageItem = styled('li', {
  display: 'block',
  maxWidth: 420,
  padding: '64px 16px 32px 30px',
  border: '2px solid $brand_400',
  borderLeft: '24px solid $brand_400',

  position: 'relative',

  '@bp2': {
    padding: '40px 16px 32px 24px',
    borderLeft: '16px solid $brand_400',
  },

  '&::after': {
    content: '',
    display: 'block',
    width: 474,
    height: 278,
    border: '2px solid $brand_400',

    position: 'absolute',
    top: 24,
    left: 14,

    '@bp2': {
      display: 'none',
    },
  },
})

export const HeaderAdvantageItem = styled('header', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',

  svg: {
    color: '$brand_800',
  },

  '& > strong': {
    maxWidth: '20ch',
  },

  '@bp2': {
    svg: {
      width: 48,
      height: 48,
    },
  },

  '@bp1': {
    svg: {
      display: 'none',
    },
  },
})

export const SeparatorDetail = styled('span', {
  display: 'block',
  background: '$brand_200',
  height: '6px',
  maxWidth: '100%',

  marginTop: '$3',
  marginBottom: '$6',
})
