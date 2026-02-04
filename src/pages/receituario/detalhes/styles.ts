import { Box, styled } from '@medap-ui/react'

export const PrescriptionDetailContainer = styled('article', {
  '& >': {
    [`${Box}`]: {
      display: 'flex',
      flexDirection: 'column',
      gap: '$6',

      minHeight: '78vh',
    },
  },
})

export const PrescriptionDetailData = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
})

export const ContainerHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$4',
})

export const LineDetail = styled('span', {
  display: 'block',

  height: 4,
  width: '100%',
  backgroundColor: '$gray_100',
})

export const PrescriptionDataHeader = styled('header', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',

  marginBottom: '$3',
})

// Detail Tab Index

export const DetailTabIndexContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 0,
  gap: '$2',
})

export const DetailTabIndexNavigation = styled('nav', {
  display: 'flex',
  border: '1px solid $gray_200',
  borderRadius: '$small',
  overflow: 'hidden',
  padding: '$2 $3',
  gap: '$4',
})

export const TabLink = styled('div', {
  padding: '$1',

  variants: {
    active: {
      true: {
        backgroundColor: ' $brand_50',
        borderBottom: '2px solid $brand_300',
        cursor: 'default',
        '& > h2': { color: '$gray_800' },
      },
      false: {
        '& > h2': { color: '$gray_500' },
        '&:hover': {
          transition: 'background 0.3s',
          backgroundColor: ' $gray_50',
          borderRadius: '$medium',
          cursor: 'pointer',

          '& > h2': { transition: 'color 0.3s', color: '$gray_600' },
        },
      },
    },
  },

  defaultVariants: {
    active: 'false',
  },
})

export const DetailTabContent = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  padding: '$8',
  border: '1px solid $gray_200',
  borderRadius: '$small',
  minWidth: '500px',
  minHeight: '480px',
  overflow: 'auto',

  variants: {
    active: {
      true: {
        display: 'flex',
      },
      false: {
        display: 'none',
      },
    },
  },

  defaultVariants: {
    active: 'false',
  },
})

// Detail content

export const DetailDataListContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
})

export const DetailDataContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})

export const DetailDataHeader = styled('div', {
  display: 'flex',
  gap: '$4',
  alignItems: 'center',
})

export const DetailData = styled('div', {
  display: 'flex',
  gap: '$4',
  alignItems: 'center',
})

export const DetailDataInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
})

export const Detail = styled('span', {
  display: 'block',
  height: 2,
  width: '100%',
  background: '$gray_100',
  borderRadius: '$small',
})

export const PrescriptionDateInfoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})

export const PrescriptionDateInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$4',
})

export const PrescriptionObservationInfoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})

export const TableContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  width: '100%',
  maxHeight: 313,
  overflowX: 'auto',
  margin: '$2 0',
})

export const Table = styled('table', {
  borderCollapse: 'collapse',
})

export const TableHead = styled('thead', {
  textAlign: 'left',
  position: 'sticky',
  top: 0,
})

export const TableRowHead = styled('tr', {
  background: '$brand_100',
})

export const TableRow = styled('tr', {
  borderBottom: '2px solid $gray_100',
})

export const TableHeaderCell = styled('th', {
  padding: '$3',
  fontWeight: '$medium',
  fontSize: '$medium',
  fontFamily: '$heading',
  color: '$black',
})

export const TableBody = styled('tbody', {
  backgroundColor: '$white',

  '& > tr:nth-child(2n)': {
    backgroundColor: '$brand_light',
  },
})

export const TableDataCell = styled('td', {
  padding: '$3',
  fontSize: '$regular',
  color: '$gray_700',
  borderBottom: '1px solid $gray_100',

  variants: {
    highlight: {
      true: {
        backgroundColor: '$brand_100',
      },
    },
  },
})

// Prescription Document

export const PrescriptionDocumentActionsContainer = styled('section', {
  display: 'flex',
  gap: '$8',
  flexWrap: 'wrap',
})

export const ModalGenerateDocumentContentContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$8',
})

export const PrescriptionDocumentContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$8',
  padding: '$8',
  width: 1001,
})

export const ModalContainer = styled('div', {
  marginTop: '$10',
})

export const ContainerPrescriptionDoc = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
})

export const ContainerMedicinePrescribedItem = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})

export const ContainerMedicinePrescribedListItem = styled('div', {
  minHeight: 700,
})

export const ContainerDatas = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '$16',
})

export const ContainerAssinatura = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$4',
})

export const LineDetailAssinatura = styled('span', {
  display: 'block',
  width: 400,
  height: 2,
  background: '$black',
})

// export const GenerateDocumentButton = styled('button', {
//   padding: '$2 $3',
//   background: '#40579F',
//   borderRadius: '$small',
//   fontSize: '$medium',
//   fontFamily: '$default',
//   color: '$white',
//   border: 'none',

//   cursor: 'pointer',

//   '&:hover': {
//     transition: 'background 0.3s',
//     background: '#3951A1',
//   },
// })

export const ContainerOptions = styled('div', {
  display: 'flex',
  position: 'relative',
  gap: '$1',
  flexDirection: 'column',
  alignItems: 'flex-end',
})

export const ShowOptionsButton = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  width: 'fit-content',
  cursor: 'pointer',

  padding: '$3 $4',
  borderRadius: '$small',
  border: '1px solid $gray_200',
})

export const ContainerOptionsIcon = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$1',
})

export const OptionPointIcon = styled('span', {
  display: 'block',
  width: '$1',
  height: '$1',
  borderRadius: '$full',
  background: '$gray_600',
})

export const ContainerOptionsItems = styled('div', {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  background: '$white',
  borderRadius: '$small',
  top: 33,
  boxShadow: '0px 0px 6px 5px rgba(24, 24, 24, 0.07)',
  padding: '$2',

  '& > div:not(:last-child)': {
    borderBottom: '1px solid $gray_200',
  },
})

export const OptionItem = styled('div', {
  display: 'flex',
  gap: '$2',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: '$2 $3',
  whiteSpace: 'nowrap',
  borderRadius: '2px',
  cursor: 'pointer',

  '&:hover': {
    transition: 'background 0.3s',
    background: '$gray_50',
  },

  svg: {
    color: '$gray_700',
  },
})
