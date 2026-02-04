import DefaultLayout from '@/layouts/DefaultLayout'
import { Box, Heading } from '@medap-ui/react'
import HeaderUser from '@/components/PageStructure/HeaderUser'
import {
  BoxInfoAmountElement,
  ContainerAmountElementsInfo,
  ContainerChartItem,
  ContainerCharts,
  ContainerDashboardSections,
  DashboardContainer,
  ElementAmountItemContainer,
} from './styles'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { recoverUserAuthData } from '@/contexts/AuthContext'
import { Clipboard, Hospital, Pill, Stethoscope, User } from 'lucide-react'

import BarChartMedicine from '@/components/Charts/BarChart'
import LineChartPrescriptionPatient from '@/components/Charts/LineChart'

import { useEffect, useState } from 'react'

export interface PatientPrescriptionLineChartData {
  name: string
  pacientes: number
  receitas: number
}

export interface MedicineCount {
  name: string
  quantidade: number
}

export interface DashboardData {
  patientTotalCount: number
  professionalTotalCount: number
  medicineTotalCount: number
  establishmentTotalCount: number
  prescriptionTotalCount: number
  dataLineChart: PatientPrescriptionLineChartData[]
  dataBarChart: MedicineCount[]
}

interface DashboardProps {
  dashboardData: DashboardData
}

export default function Dashboard({ dashboardData }: DashboardProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <DefaultLayout activePage="DASHBOARD">
      <HeaderUser title="Dashboard" />
      <DashboardContainer>
        <Box width={'full'}>
          <ContainerDashboardSections>
            <ContainerAmountElementsInfo>
              <ElementAmountItemContainer>
                <Heading>Total de estabelecimentos</Heading>
                <BoxInfoAmountElement>
                  <Hospital strokeWidth={2.5} />
                  <Heading color="brand_700" fontWeight={'black'}>
                    {dashboardData.establishmentTotalCount}
                  </Heading>
                </BoxInfoAmountElement>
              </ElementAmountItemContainer>
              <ElementAmountItemContainer>
                <Heading>Total de receitas</Heading>
                <BoxInfoAmountElement>
                  <Clipboard strokeWidth={2.5} />
                  <Heading color="brand_700" fontWeight={'black'}>
                    {dashboardData.prescriptionTotalCount}
                  </Heading>
                </BoxInfoAmountElement>
              </ElementAmountItemContainer>
              <ElementAmountItemContainer>
                <Heading>Total de pacientes</Heading>
                <BoxInfoAmountElement>
                  <User strokeWidth={2.5} />
                  <Heading color="brand_700" fontWeight={'black'}>
                    {dashboardData.patientTotalCount}
                  </Heading>
                </BoxInfoAmountElement>
              </ElementAmountItemContainer>
              <ElementAmountItemContainer>
                <Heading>Total de medicamentos</Heading>
                <BoxInfoAmountElement>
                  <Pill strokeWidth={2.5} />
                  <Heading color="brand_700" fontWeight={'black'}>
                    {dashboardData.medicineTotalCount}
                  </Heading>
                </BoxInfoAmountElement>
              </ElementAmountItemContainer>
              <ElementAmountItemContainer>
                <Heading>Total de profissionais</Heading>
                <BoxInfoAmountElement>
                  <Stethoscope strokeWidth={2.5} />
                  <Heading color="brand_700" fontWeight={'black'}>
                    {dashboardData.professionalTotalCount}
                  </Heading>
                </BoxInfoAmountElement>
              </ElementAmountItemContainer>
            </ContainerAmountElementsInfo>
          </ContainerDashboardSections>

          <ContainerCharts>
            <ContainerChartItem>
              <Heading>
                Quantidade de cadastros por mês (Receitas x Pacientes)
              </Heading>
              {isClient && (
                <LineChartPrescriptionPatient
                  dataLineChart={dashboardData.dataLineChart}
                />
              )}
            </ContainerChartItem>
            <ContainerChartItem>
              <Heading>Medicamentos mais receitados</Heading>
              {isClient && (
                <BarChartMedicine dataBarChart={dashboardData.dataBarChart} />
              )}
            </ContainerChartItem>
          </ContainerCharts>
        </Box>
      </DashboardContainer>
    </DefaultLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'medap.token': token } = parseCookies(context)

  let isUserAuthenticated = false

  const user = await recoverUserAuthData(token)
  let dashboardData: DashboardData | null = null

  if (user != null) {
    isUserAuthenticated = true

    const response = await fetch(`http://localhost:3000/api/dashboards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    dashboardData = await response.json()
  }

  if (!isUserAuthenticated) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      dashboardData,
    },
  }
}
