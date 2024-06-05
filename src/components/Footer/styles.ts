import { styled } from '@medap-ui/react'

export const FooterContainer = styled('footer', {})

export const BrandSlogan = styled('section', {
  background: '$brand_800',
})

export const BrandSloganContainer = styled('div', {
  maxWidth: 1068,
  padding: '$6',
  margin: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: '$4',

  '& > img': {
    marginRight: '$16',
  },

  '& > strong': {
    maxWidth: '50ch',
  },

  '@bp4': {
    justifyContent: 'center',

    '& > img': {
      marginRight: '$10',
    },
  },

  '@bp3': {
    '& > img': {
      marginRight: '$8',
      height: 48,
    },
  },

  '@bp2': {
    '& > img': {
      marginRight: '$4',
    },
  },

  '@bp1': {
    flexWrap: 'wrap',
    gap: '$6',
    justifyContent: 'center',

    '& > img': {
      marginRight: '0',
    },

    '& > strong': {
      textAlign: 'center',
    },
  },
})

export const DetailSeparator = styled('span', {
  display: 'block',
  width: 3,
  height: 64,
  background: '$brand_600',
  marginRight: '$12',

  '@bp4': {
    marginRight: '$8',
  },

  '@bp3': {
    marginRight: '$4',
  },

  '@bp2': {
    marginRight: '$2',
  },

  '@bp1': {
    display: 'none',
  },
})

export const Contact = styled('address', {
  maxWidth: 1068,
  padding: '$10 $6',
  margin: 'auto',
  display: 'flex',
  flexWrap: 'wrap',

  '& > h3': {
    marginRight: '$40',
    fontStyle: 'normal',
  },

  '@bp4': {
    justifyContent: 'center',

    '& > h3': {
      marginRight: '$16',
    },
  },

  '@bp3': {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '$4',
    padding: '$6 $6',

    '& > h3': {
      marginRight: '0',
    },
  },
})

export const Info = styled('address', {
  display: 'flex',
  gap: '$20',
  alignItems: 'center',

  '& > p': {
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
    fontStyle: 'normal',
  },

  '@bp4': {
    gap: '$12',
  },

  '@bp3': {
    flexDirection: 'column',
    gap: '$4',
  },
})

export const Attributions = styled('section', {
  background: '$brand_800',
})

export const AttributionsContainer = styled('div', {
  maxWidth: 1068,
  padding: '$6',
  margin: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$16',

  '& > p': {
    strong: {
      color: '$brand_300',
      fontWeight: '$regular',
    },
  },
})
