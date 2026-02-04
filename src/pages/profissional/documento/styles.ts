import { Box, styled, Text } from '@medap-ui/react'

export const EstablishmentTypeContainer = styled('article', {
  '& >': {
    [`${Box}`]: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '$20',

      minHeight: '69vh',
    },
  },
})

export const EstablishmentTypeDataHeader = styled('header', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',

  marginBottom: '$3',
})

export const LineDetail = styled('span', {
  display: 'block',

  height: 4,
  width: '100%',
  backgroundColor: '$gray_100',
})

// CreateEstablishmentTypeData

export const CreateEstablishmentTypeForm = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
})

export const EstablishmentTypeData = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})

export const EstablishmentTypeDataFields = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
})

export const EstablishmentTypeAvailableForField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',

  '@bp2': {
    '& > div': {
      width: '312px !important',
    },
  },

  '@bp1': {
    '& > div': {
      width: '220px !important',
    },
  },
})

export const EstablishmentTypeStatusField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',

  '@bp1': {
    '& > div': {
      width: '220px !important',
    },
  },
})

export const EstablishmentTypeSubmitButtonContainer = styled('div', {
  marginTop: '$4',
})

export const EstablishmentTypeBoundField = styled('div', {
  display: 'flex',
  gap: '$4',
  flexDirection: 'column',
})

export const EstablishmentTypeSelectBoundField = styled('div', {
  display: 'flex',
  gap: '$4',
  flexDirection: 'column',
  marginTop: '$3',
})

export const RadioContainer = styled('div', {
  display: 'flex',
  gap: '$2',
})

export const RadioOptionContainer = styled('div', {
  display: 'flex',
  gap: '$2',
})

// ListEstablishmentTypeData

export const ListEstablishmentTypeContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',

  overflowX: 'auto',

  [`${Box}`]: {
    background: '$white',
  },
})

export const EstablishmentTypeListTable = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
  maxHeight: 508,
  maxWidth: 900,
})

// ListTable

export const TableContainer = styled('section', {
  overflowX: 'auto',
})

export const ListEstablishmentTable = styled('table', {
  borderCollapse: 'collapse',
  width: '100%',
})

export const ListEstablishmentTableHeader = styled('thead', {
  backgroundColor: '$gray_50',
  position: 'sticky',
  top: '-1px',
  zIndex: 2,
})
export const ListEstablishmentTH = styled('th', {
  padding: '$4 $3',
  textAlign: 'left',
})

export const ListEstablishmentTableBody = styled('tbody', {
  [`${Text}`]: {
    fontSize: '14px !important',
  },
})

export const ListEstablishmentTableRow = styled('tr', {
  borderBottom: '1px solid $gray_200',
  '&:nth-child(2n)': {
    background: '$gray_50',
  },
})

export const ListEstablishmentTD = styled('td', {
  padding: '$4 $3',
})

export const ListEstablishmentNameContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
})

export const EstablishmentTypeRegisteredInfoContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '$1',

  maxWidth: '200px',

  [`${Text}`]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

export const EstablishmentContactInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '$1',
  maxWidth: '200px',

  [`${Text}`]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

export const EstablishmentTypeInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '$1',

  maxWidth: '120px',

  [`${Text}`]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

export const LabelInfo = styled('span', {
  color: '$brand_800',
  fontWeight: '$black',
})

export const EstablishmentResponsibleInfoContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '$3',
})

export const EstablishmentResponsibleInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '$1',

  maxWidth: '120px',

  [`${Text}`]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

export const OpenResponsibleListButton = styled('button', {
  padding: '5px',
  position: 'relative',
  borderRadius: '$full',
  backgroundColor: '#E4EDFF',
  border: 'none',
  lineHeight: 0,
  cursor: 'pointer',

  svg: { color: '#0F0C7E', height: 16, width: 16 },

  '&:hover': {
    transition: 'background 0.3s',
    backgroundColor: '#CEDCF8',
  },

  '&:hover::after': {
    content: 'Exibir todos os responsáveis',
    display: 'block',
    width: 180,
    position: 'absolute',
    top: 0,
    left: '110%',
    zIndex: 200,
    padding: '$3 $1',
    borderRadius: '$small',
    backgroundColor: '$gray_50',
    border: '1px solid $gray_100',
    boxShadow: '0px 0px 5px 2px rgb(0,0,0,0.02)',
  },
})

export const EstablishmentEspecialityContainer = styled('div', {
  display: 'flex',
  maxWidth: '140px',

  [`${Text}`]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

export const EstablishmentActionsContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '$3',
})

export const DeactivateButtonContainer = styled('div', {
  position: 'relative',
})

export const DeactivateDialog = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',

  borderRadius: '$small',
  padding: '$2',
  backgroundColor: '$gray_50',
  boxShadow: '0px 0px 10px 5px rgb(0,0,0,0.02)',
  width: '300px',
  border: '1px solid $gray_200',
  cursor: 'default',

  position: 'absolute',

  left: '100%',

  zIndex: 600,

  variants: {
    isLastItem: {
      true: {
        top: '0',
        transform: 'translate(-100%, -105%)',
      },
      false: {
        top: '115%',
        transform: 'translate(-100%)',
      },
    },
  },
  defaultVariants: {
    isLastItem: 'false',
  },
})

export const DeactivateDialogInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})

export const DeactivateDialogActions = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '$1',
})

// Edit Establishment Type

export const EditEstablishmentTypeHeaderContainer = styled('div', {
  display: 'flex ',
  flexDirection: 'column',
  gap: '$3',

  '& b': {
    color: '$brand_700',
  },
})

export const EditEstablishmentTypeForm = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
})
