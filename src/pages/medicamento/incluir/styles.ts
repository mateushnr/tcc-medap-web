import { Box, styled } from '@medap-ui/react'

export const CreateMedicineContainer = styled('article', {
  '& >': {
    [`${Box}`]: {
      display: 'flex',
      flexDirection: 'column',
      gap: '$6',

      minHeight: '69vh',
    },
  },
})

export const MedicineBoundField = styled('div', {
  display: 'flex',
  gap: '$4',
  flexDirection: 'column',
})

export const MedicineSelectBoundField = styled('div', {
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

export const CreateMedicineForm = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
})

export const FormContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$16',

  '@bp3': {
    gap: '$10',
  },

  '@bp2': {
    gap: '$8',
  },
})

export const LineDetail = styled('span', {
  display: 'block',

  height: 4,
  width: '100%',
  backgroundColor: '$gray_100',
})

// EstablishmentData

export const MedicineDataSection = styled('div', {
  display: 'flex',
  gap: '$12',

  marginBottom: '$3',
  flexWrap: 'wrap',
})

export const MedicineData = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})

export const MedicineDataHeader = styled('header', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',

  marginBottom: '$3',
})

export const MedicineDataFields = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',

  marginBottom: '$1',
})

export const MedicineStatusField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',

  '@bp1': {
    '& > div': {
      width: '220px !important',
    },
  },
})

export const MedicineSelectField = styled('div', {
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

export const EstablishmentTypeField = styled('div', {
  display: 'flex',
  alignItems: 'start',
  gap: '$3',
})

export const AddNewEstablishmentTypeButtonContainer = styled('div', {
  position: 'relative',
})

export const AddNewEstablishmentTypeDialog = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',

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

export const AddNewEstablishmentTypeDialogInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})

export const AddNewEstablishmentTypeDialogActions = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '$3',
})

// AddressData

export const AddressData = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})

export const AddressDataHeader = styled('header', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',

  marginBottom: '$3',
})

export const AddressDataFields = styled('div', {
  display: 'grid',
  gridTemplateColumns: '365px 75px 145px',
  columnGap: '$6',
  rowGap: '$2',
  alignItems: 'start',

  '& > :nth-child(1)': {
    gridColumn: '1 / 2',
  },
  '& > :nth-child(2)': {
    gridColumn: '2 / 4',
  },
  '& > :nth-child(3)': {
    gridColumn: '1 / 3',
  },
  '& > :nth-child(4)': {
    gridColumn: '3 / 4',
  },
  '& > :nth-child(5)': {
    gridColumn: '1 / 4',
  },
  '& > :nth-child(6)': {
    gridColumn: '1 / 2',
  },
  '& > :nth-child(7)': {
    gridColumn: '2 / 4',
  },
  '& > :nth-child(8)': {
    gridColumn: '1 / 4',
  },

  '@bp3': {
    gridTemplateColumns: '310px 180px',

    '& > :nth-child(1)': {
      gridColumn: '1 / 1',
    },
    '& > :nth-child(2)': {
      gridColumn: '2 / 2',
    },
    '& > :nth-child(3)': {
      gridColumn: '1 / 2',
    },
    '& > :nth-child(4)': {
      gridColumn: '2 / 2',
    },
    '& > :nth-child(5)': {
      gridColumn: '1 / 3',
    },
    '& > :nth-child(6)': {
      gridColumn: '1 / 2',
    },
    '& > :nth-child(7)': {
      gridColumn: '2 / 3',
    },
    '& > :nth-child(8)': {
      gridColumn: '1 / 3',
    },
  },

  '@bp2': {
    gridTemplateColumns: '200px 88px',

    '& > :nth-child(1)': {
      gridColumn: '1 / 1',
    },
    '& > :nth-child(2)': {
      gridColumn: '2 / 2',
    },
    '& > :nth-child(3)': {
      gridColumn: '1 / 3',
    },
    '& > :nth-child(4)': {
      gridColumn: '1 / 3',
    },
    '& > :nth-child(5)': {
      gridColumn: '1 / 3',
    },
    '& > :nth-child(6)': {
      gridColumn: '1 / 3',
    },
    '& > :nth-child(7)': {
      gridColumn: '1 / 3',
    },
    '& > :nth-child(8)': {
      gridColumn: '1 / 3',
    },
  },

  '@bp1': {
    gridTemplateColumns: '220px',

    '& > :nth-child(1)': {
      gridColumn: '1 / 2',
    },
    '& > :nth-child(2)': {
      gridColumn: '1 / 2',
      marginBottom: '$8',
    },
    '& > :nth-child(3)': {
      gridColumn: '1 / 2',
    },
    '& > :nth-child(4)': {
      gridColumn: '1 / 2',
    },
    '& > :nth-child(5)': {
      gridColumn: '1 / 2',
    },
    '& > :nth-child(6)': {
      gridColumn: '1 / 2',
    },
    '& > :nth-child(7)': {
      gridColumn: '1 / 2',
    },
    '& > :nth-child(8)': {
      gridColumn: '1 / 2',
    },
  },
})

export const FillWithCepContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
})

export const AddressDataCoordinateFields = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '$6',
  rowGap: '$2',
  alignItems: 'start',

  '@bp2': {
    gridTemplateColumns: '1fr',
  },

  '@bp1': {
    gridTemplateColumns: '220px',
  },
})
