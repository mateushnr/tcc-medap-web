import { Box, Heading, styled } from '@medap-ui/react'

export const DashboardContainer = styled('article', {
  '& >': {
    [`${Box}`]: {
      minHeight: '76vh',
    },
  },
})

export const ContainerDashboardSections = styled('section', {
  display: 'flex',
  gap: '$8',
  flexDirection: 'column',
})

export const ContainerAmountElementsInfo = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$16',
  paddingBottom: '$6',

  borderBottom: '2px solid $gray_100',
  marginBottom: '$12',
})

export const ElementAmountItemContainer = styled('div', {
  display: 'flex',
  gap: '$4',
  flexDirection: 'column',
})

export const BoxInfoAmountElement = styled('div', {
  display: 'flex',
  gap: '$6',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid $gray_200',
  borderRadius: '$large',
  padding: '$4',

  svg: {
    color: '$brand_700',
  },
})

export const ContainerCharts = styled('div', {
  display: 'flex',
  gap: '$12',
  flexWrap: 'wrap',
})

export const ContainerChartItem = styled('div', {
  display: 'flex',
  gap: '$6',
  justifyContent: 'center',
  flexDirection: 'column',

  '& > ': {
    [`${Heading}`]: {
      marginLeft: 55,
    },
  },
})
