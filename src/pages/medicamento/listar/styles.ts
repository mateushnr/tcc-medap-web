import { Box, styled, Text } from '@medap-ui/react'

export const ListEstablishmentContainer = styled('article', {
  '& >': {
    [`${Box}`]: {
      display: 'flex',
      flexDirection: 'column',
      gap: '$6',

      minHeight: '69vh',
    },
  },
})

// ListTable
export const TableContainer = styled('section', {
  overflowX: 'auto',
})

export const ListEstablishmentTable = styled('table', {
  borderCollapse: 'collapse',
  width: '100%',
  borderBottom: '4px solid $gray_200',
})

export const ListEstablishmentTableHeader = styled('thead', {
  backgroundColor: '$gray_50',
  border: '1px solid $gray_100',
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
  backgroundImage:
    'linear-gradient(to right, rgb(215, 215, 215) 50%, rgba(255, 255, 255, 0) 10%)',
  backgroundPosition: 'bottom',
  backgroundSize: '20px 2px',
  backgroundRepeat: 'repeat-x',
})

export const ListEstablishmentTD = styled('td', {
  padding: '$4 $3',
})

export const ListEstablishmentNameContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
})

export const EstablishmentNameInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '$1',

  maxWidth: '150px',

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

export const ContainerDataInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$4',
})
