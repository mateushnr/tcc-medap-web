import { Box, Heading, styled, Text } from '@medap-ui/react'

export const CreatePrescriptionContainer = styled('article', {
  '& >': {
    [`${Box}`]: {
      display: 'flex',
      flexDirection: 'column',
      gap: '$6',

      minHeight: '69vh',
    },
  },
})

export const CreatePrescriptionForm = styled('form', {
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

// Data

export const ContainerHeader = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '$4',
})

export const MultistepFormContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: 490,
  gap: '$8',
})

export const MultistepPrescriptionContainer = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  gap: '$8',
})

export const MultistepItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '$3',
  padding: '$2 $3',
  borderRadius: '$large',

  variants: {
    state: {
      completed: {
        [`${Heading}`]: {
          color: '$brand_600',
        },
      },
      current: {
        background: '$gray_100',
        [`${Heading}`]: {
          color: '$gray_700',
        },

        '& > div': {
          background: '$brand_400',
          color: '$white',
        },
      },
      waiting: {
        [`${Heading}`]: {
          color: '$gray_500',
        },

        '& > div': {
          background: '$gray_500',
          color: '$white',
        },
      },
    },
  },

  defaultVariants: {
    state: 'waiting',
  },
})

export const StepInfoContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '$8',
  height: '$8',
  fontFamily: '$heading',
  fontSize: '$xlarge',
  fontWeight: '$black',
  color: '$gray_100',
  borderRadius: '$full',
  backgroundColor: '$brand_550',
})

export const MultistepFormContent = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '$2',
  gap: '$2',

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

export const EstablishmentPrescriptionSelectContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  maxWidth: 600,
})

export const MultistepActionsContainer = styled('div', {
  display: 'flex',
  gap: '$4',
  maxWidth: 600,
})

export const PrescriptionDataFieldsContainer = styled('section', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$12',
})

export const PrescriptionData = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  width: 600,
})

export const InfoPersonContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
})

export const PrescriptionDateContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$8',
  marginTop: '$4',
})

export const PrescriptionDateField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
})

export const PrescriptionObservationField = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

export const PrescriptionMedicineData = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  width: 800,

  '& > div:nth-child(2)': {
    width: 734,
    height: 328,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '$4',
  },
})

export const PrescriptionMedicineDataHeader = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4',
  justifyContent: 'space-between',
})

export const PrescriptionItemContainer = styled('div', {
  display: 'flex',
  background: '$brand_100',
  borderRadius: '$large',
  flexWrap: 'wrap',
})

export const PrescriptionItemAmount = styled('div', {
  display: 'flex',
  background: '$brand_800',
  flexDirection: 'column',
  padding: '$3',
  borderRadius: '$large 0 0 $large',
  gap: '$4',
  width: 110,
  borderRight: '4px solid $brand_light',
})

export const PrescriptionAmountInfo = styled('div', {
  display: 'flex',
  gap: '$2',

  [`${Text}`]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
})

export const PrescriptionItemInfo = styled('div', {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: '$3',
  gap: '$1',
})

export const PrescriptionNameAndAdministrationInfo = styled('div', {
  display: 'flex',

  justifyContent: 'space-between',

  gap: '$1',
})

export const RemoveMedicineButton = styled('button', {
  lineHeight: 0,
  background: 'none',
  border: 'none',
  cursor: 'pointer',

  svg: {
    color: '$gray_500',
  },

  '&:hover': {
    svg: {
      transition: 'color 0.3s',
      color: '$gray_800',
    },
  },
})

export const PrescriptionItemSelectDataContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$8',
  margin: '$4 0',
})

export const PrescriptionMedicineDosageContainer = styled('div', {
  marginBottom: '$4',
})

export const FeedbackMedicinePrescribedContainer = styled('div', {
  variants: {
    status: {
      empty: {
        [`${Heading}`]: {
          color: '$gray_500',
        },
      },
      warning: {
        [`${Heading}`]: {
          color: '$danger_400',
        },
      },
    },
  },

  defaultVariants: {
    status: 'empty',
  },
})

export const PrescriptionEnvolvedDataContainer = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$8',
  width: 600,
})

export const PrescriptionFinalDataContainer = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$8',

  width: 450,

  '& > div:nth-child(2)': {
    width: 386,
    height: 340,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '$6',
  },
})

export const MedicinePrescribedFinalDataContainer = styled('section', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  width: 1098,
})

export const FinalDataContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
})

export const FinalDataHeader = styled('div', {
  display: 'flex',
  gap: '$4',
  alignItems: 'center',
})

export const FinalData = styled('div', {
  display: 'flex',
  gap: '$4',
  alignItems: 'center',
})

export const FinalDataInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
})

export const Detail = styled('span', {
  display: 'block',
  height: 6,
  flex: 1,
  background: '$brand_200',
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

export const PrescriptionTypeContainer = styled('div', {
  display: 'flex',
  gap: '$4',
  marginBottom: '$8',
})
