import { Box, styled } from '@medap-ui/react'

export const CreateProfessionalContainer = styled('article', {
  '& >': {
    [`${Box}`]: {
      display: 'flex',
      flexDirection: 'column',
      gap: '$6',

      minHeight: '69vh',
    },
  },
})

export const CreateProfessionalForm = styled('form', {
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

// UnityData

export const ProfessionalData = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})

export const ProfessionalDataHeader = styled('header', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',

  marginBottom: '$3',
})

export const ProfessionalDataFields = styled('div', {
  display: 'grid',
  gridTemplateColumns: '275px 95px 215px',
  columnGap: '$6',
  rowGap: '$2',

  marginBottom: '$1',

  '& > div:nth-child(1)': {
    gridColumn: '1 / 4',
  },
  '& > div:nth-child(2)': {
    gridColumn: '1 / 4',
  },
  '& > div:nth-child(3)': {
    gridColumn: '1 / 2',
  },
  '& > div:nth-child(4)': {
    gridColumn: '2 / 4',
  },
  '& > div:nth-child(5)': {
    gridColumn: '1 / 4',
  },
  '& > div:nth-child(6)': {
    gridColumn: '1 / 4',
  },

  '@bp4': {
    gridTemplateColumns: '280px 210px',

    '& > div:nth-child(1)': {
      gridColumn: '1 / 3',
    },
    '& > div:nth-child(2)': {
      gridColumn: '1 / 3',
    },
    '& > div:nth-child(3)': {
      gridColumn: '1 / 2',
    },
    '& > div:nth-child(4)': {
      gridColumn: '2 / 3',
    },
    '& > div:nth-child(5)': {
      gridColumn: '1 / 3',
    },
    '& > div:nth-child(6)': {
      gridColumn: '1 / 3',
    },
  },

  '@bp3': {
    gridTemplateColumns: '280px 210px',

    '& > div:nth-child(1)': {
      gridColumn: '1 / 3',
    },
    '& > div:nth-child(2)': {
      gridColumn: '1 / 3',
    },
    '& > div:nth-child(3)': {
      gridColumn: '1 / 3',
    },
    '& > div:nth-child(4)': {
      gridColumn: '1 / 3',
    },
    '& > div:nth-child(5)': {
      gridColumn: '1 / 3',
    },
    '& > div:nth-child(6)': {
      gridColumn: '1 / 3',
    },
  },

  '@bp2': {
    gridTemplateColumns: '300px',

    '& > div:nth-child(1)': {
      gridColumn: '1 / 2',
    },
    '& > div:nth-child(2)': {
      gridColumn: '1 / 2',
    },
    '& > div:nth-child(3)': {
      gridColumn: '1 / 2',
    },
    '& > div:nth-child(4)': {
      gridColumn: '1 / 2',
    },
    '& > div:nth-child(5)': {
      gridColumn: '1 / 2',
    },
    '& > div:nth-child(6)': {
      gridColumn: '1 / 2',
    },
  },

  '@bp1': {
    gridTemplateColumns: '220px',
  },
})

export const ProfessionalBirthDateAndStatusContainer = styled('div', {
  display: 'flex',
  gap: '$4',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
})

export const ProfessionalBirthDateField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  flexGrow: 1,
})

export const ProfessionalStatusField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  flexGrow: 1,
})

export const ProfessionalCredentialsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  flexGrow: 1,
})

export const PatientDocumentsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  flexGrow: 1,
})

export const PatientDocumentsFieldsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  flexGrow: 1,
})

export const ProfessionalEstablishmentField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
})

export const PatientIdentifierDocumentSelected = styled('div', {
  display: 'flex',
  gap: '$3',
  marginBottom: '$3',
})

export const ProfessionalUnityField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
})

export const ProfessionalRoleField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
})

export const BoundToUnityContainer = styled('div', {
  display: 'flex',
  gap: '$6',
  alignItems: 'start',

  '& > div': {
    flexGrow: 1,
  },
})

export const UnityEstablishmentField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',

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

export const ContainerOptionsBoundToUnity = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
})

export const RadioOptionContainer = styled('div', {
  display: 'flex',
  gap: '$2',
})

export const RadioOption = styled('input', {
  cursor: 'pointer',
})

export const LabelRadioOption = styled('label', {
  cursor: 'pointer',
})

export const DocumentTypeField = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'start',
  gap: '$3',

  '& > div:first-child': {
    flexGrow: 1,
  },
})

export const AddNewDocumentTypeButtonContainer = styled('div', {
  position: 'relative',
})

export const AddNewDocumentTypeDialog = styled('div', {
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

export const AddNewDocumentTypeDialogInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})

export const AddNewDocumentTypeDialogActions = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '$3',
})

export const CustomerTypeOptions = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '$3',
  marginBottom: '$3',
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

// Form Tab Menu

export const FormTabMenuContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 0,
  gap: '$2',
})

export const FormTabMenuNavigation = styled('nav', {
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

export const FormTabContent = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  padding: '$8',
  border: '1px solid $gray_200',
  borderRadius: '$small',
  minWidth: '640px',
  minHeight: '515px',
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

export const Detail = styled('span', {
  display: 'block',
  height: '$1',
  width: '100%',
  backgroundColor: '$gray_100',

  marginBottom: '$3',
})

export const ProfessionalDocumentFields = styled('div', {
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
    gridColumn: '1 / 4',
  },
})

// Patient Responsible

export const AddPatientResponsibleContainer = styled('div', {
  display: 'flex',
  alignItems: 'start',
  gap: '$3',

  '& > div:first-child': {
    flexGrow: 1,
  },
})

export const PatientsSelectedContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  gap: '$3',
})

export const PatientsSelectedOptionContainer = styled('div', {
  display: 'flex',
  gap: '$4',
})

export const CheckboxContainer = styled('div', {
  display: 'flex',
  gap: '$4',
  marginBottom: '$2',
})

export const Checkbox = styled('input', {
  width: '$5',
  height: '$5',
  appearance: 'none',
  position: 'relative',

  '&::after': {
    boxSizing: 'border-box',
    position: 'absolute',
    borderBottom: '2.5px solid #FFFFFF',
    borderRight: '2.5px solid #FFFFFF',
    content: '',
    height: '55%',
    width: '35%',
    left: '50%',
    top: '50%',
    transform: 'scale(0.1) translate(-50%, -50%)',
    transition: 'transform 0.1s',
  },

  '&::before': {
    boxSizing: 'border-box',
    position: 'absolute',
    border: '2px solid $brand_550',
    borderRadius: '0.25em',
    content: '',
    height: '100%',
    transition: 'background 0.1s',
    width: '100%',
  },

  '&:checked::after': {
    transform: 'rotate(35deg) scale(1) translate(-100%, -30%)',
  },

  '&:checked::before': {
    backgroundColor: '$brand_550',
  },
})

export const Label = styled('label', {
  fontSize: '$medium',
  color: '$gray_800',
})

export const IncludePetForm = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
})

export const PetsListHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$2',
})

export const PetsListContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  height: 460,
  overflow: 'auto',
})

export const PetItemContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  padding: '$4',
  border: '1px solid $gray_200',
  borderRadius: '$small',
})

export const PetItemHeader = styled('div', {
  display: 'flex',
  gap: '$4',
  justifyContent: 'space-between',

  '& > button': {
    height: 'fit-content',
  },
})

export const PetItemHeaderInfoContainer = styled('div', {
  display: 'flex',
  gap: '$3',
  alignItems: 'start',
})

export const PetItemHeaderInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
})

export const PetItemContentContainer = styled('div', {
  display: 'flex',
  marginTop: '$2',
  flexDirection: 'column',
  gap: '$1',
})

export const PetInputContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  maxWidth: 600,
  marginBottom: '$4',
})

export const PetRadioContainer = styled('div', {
  display: 'flex',
  gap: '$16',
})

export const PetRadioItem = styled('div', {
  display: 'flex',
})
