import DefaultLayout from '@/layouts/DefaultLayout'
import { Box, Heading, Text } from '@medap-ui/react'
import HeaderUser from '@/components/PageStructure/HeaderUser'
import {
  ContainerHeader,
  Detail,
  DetailTabContent,
  DetailTabIndexContainer,
  DetailTabIndexNavigation,
  DetailData,
  DetailDataContainer,
  DetailDataHeader,
  DetailDataInfo,
  LineDetail,
  PrescriptionDataHeader,
  PrescriptionDetailContainer,
  PrescriptionDetailData,
  TabLink,
  DetailDataListContainer,
  PrescriptionDateInfoContainer,
  PrescriptionDateInfo,
  PrescriptionObservationInfoContainer,
  TableContainer,
  Table,
  TableHead,
  TableRowHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableDataCell,
  PrescriptionDocumentActionsContainer,
  ContainerOptions,
  ShowOptionsButton,
  ContainerOptionsIcon,
  OptionPointIcon,
  ContainerOptionsItems,
  OptionItem,
} from './styles'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { recoverUserAuthData } from '@/contexts/AuthContext'
import type { ResponsePrescription } from '@/@types/responseValues/prescriptionResponse'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import userIcon from '@/assets/images/icon-user.svg'
import petIcon from '@/assets/images/icon-pet.svg'
import healthProfessionalIcon from '@/assets/images/icon-health-professional.svg'
import establishmentIcon from '@/assets/images/establishmentIcon.svg'
import { CalendarCheck2, CalendarX2, Download, File } from 'lucide-react'
import { formatDate } from '@/utils/formatters/date'
import { resolvePrescribedAdministrationWayValue } from '@/utils/resolvers/resolveSelectValuesToText'

interface PrescriptionDetailProps {
  prescriptionData: ResponsePrescription | null
}

export default function PrescriptionDetail({
  prescriptionData,
}: PrescriptionDetailProps) {
  const [currentDetailTab, setCurrentDetailTab] = useState<string>('involved')

  const [prescriptionOptionsOpen, setPrescriptionOptionsOpen] =
    useState<boolean>(false)

  const getPrescriptionPdf = async () => {
    const { 'medap.token': token } = parseCookies()

    let pdfUrl: string | null = null

    if (prescriptionData?.id) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/prescriptions/pdf/?id=${prescriptionData.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/pdf',
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.ok) {
          const blob = await response.blob()

          if (blob) {
            pdfUrl = window.URL.createObjectURL(blob)
            return pdfUrl
          }
        } else {
          throw new Error('Falha em recuperar documento da prescrição')
        }
      } catch (error) {
        console.error('Falha em recuperar documento da prescrição:', error)
      }
    }
    return pdfUrl
  }

  const handleOpenPrescriptionDocumentClick = async () => {
    const pdfPrescriptionUrl: string | null = await getPrescriptionPdf()

    if (pdfPrescriptionUrl) {
      window.open(pdfPrescriptionUrl, '_blank')
    }
  }

  const handleDownloadPrescriptionDocumentClick = async () => {
    const pdfPrescriptionUrl: string | null = await getPrescriptionPdf()

    if (pdfPrescriptionUrl) {
      const downloadLink = document.createElement('a')
      downloadLink.href = pdfPrescriptionUrl
      downloadLink.download = `${prescriptionData?.id}.pdf`
      document.body.appendChild(downloadLink)
      downloadLink.click()

      document.body.removeChild(downloadLink)
    }
  }

  const OptionsButtonRef = useRef<HTMLDivElement>(null)
  const OptionsItemContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!prescriptionOptionsOpen) return

      if (
        OptionsItemContainerRef.current &&
        OptionsButtonRef.current &&
        !OptionsItemContainerRef.current.contains(event.target as Node) &&
        !OptionsButtonRef.current.contains(event.target as Node)
      ) {
        setPrescriptionOptionsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [prescriptionOptionsOpen])

  useEffect(() => {}, [])

  return (
    <DefaultLayout activePage="PRESCRIPTION">
      <HeaderUser title="Gerenciar receituário" />
      <PrescriptionDetailContainer>
        <Box width={'full'}>
          <PrescriptionDetailData>
            <PrescriptionDataHeader>
              <ContainerHeader>
                <Heading size={'4xlarge'} color={'gray_700'}>
                  Detalhes do receituário
                </Heading>

                <PrescriptionDocumentActionsContainer>
                  <ContainerOptions>
                    <ShowOptionsButton
                      ref={OptionsButtonRef}
                      onClick={() => {
                        setPrescriptionOptionsOpen((prev) => {
                          return !prev
                        })
                      }}
                    >
                      <ContainerOptionsIcon>
                        <OptionPointIcon />
                        <OptionPointIcon />
                        <OptionPointIcon />
                      </ContainerOptionsIcon>
                    </ShowOptionsButton>

                    {prescriptionOptionsOpen ? (
                      <ContainerOptionsItems ref={OptionsItemContainerRef}>
                        <OptionItem
                          onClick={handleDownloadPrescriptionDocumentClick}
                        >
                          <Download size={20} />{' '}
                          <Text color={'gray_700'}>Baixar prescrição</Text>
                        </OptionItem>
                        <OptionItem
                          onClick={handleOpenPrescriptionDocumentClick}
                        >
                          <File size={20} />{' '}
                          <Text color={'gray_700'}>Visualizar prescrição</Text>
                        </OptionItem>
                      </ContainerOptionsItems>
                    ) : null}
                  </ContainerOptions>
                </PrescriptionDocumentActionsContainer>
              </ContainerHeader>
              <LineDetail />
            </PrescriptionDataHeader>
            <DetailTabIndexContainer>
              <DetailTabIndexNavigation>
                <TabLink
                  onClick={() => {
                    setCurrentDetailTab('involved')
                  }}
                  active={currentDetailTab === 'involved'}
                >
                  <Heading fontWeight={'light'}>Envolvidos</Heading>
                </TabLink>
                <TabLink
                  onClick={() => {
                    setCurrentDetailTab('prescriptionData')
                  }}
                  active={currentDetailTab === 'prescriptionData'}
                >
                  <Heading fontWeight={'light'}>Dados da prescrição</Heading>
                </TabLink>
                <TabLink
                  onClick={() => {
                    setCurrentDetailTab('medicinePrescribed')
                  }}
                  active={currentDetailTab === 'medicinePrescribed'}
                >
                  <Heading fontWeight={'light'}>
                    Medicamentos prescritos
                  </Heading>
                </TabLink>
              </DetailTabIndexNavigation>
              <DetailTabContent active={currentDetailTab === 'involved'}>
                <DetailDataListContainer>
                  <DetailDataContainer>
                    <DetailDataHeader>
                      <Heading color={'gray_700'} size={'xlarge'}>
                        Estabelecimento emitente
                      </Heading>
                    </DetailDataHeader>
                    <DetailData>
                      <Image
                        priority
                        src={establishmentIcon}
                        alt="Ícone estabelecimento"
                        height={48}
                        width={48}
                      />

                      <DetailDataInfo>
                        <Text color={'gray_600'} size={'xlarge'}>
                          {prescriptionData?.establishmentName}
                        </Text>

                        <Text size={'medium'} color={'gray_500'}>
                          {prescriptionData?.establishmentAddress?.street}
                          {prescriptionData?.establishmentAddress?.number &&
                          prescriptionData?.establishmentAddress?.street
                            ? `, ${prescriptionData?.establishmentAddress?.number}`
                            : null}
                          {prescriptionData?.establishmentAddress?.city
                            ? ` - ${prescriptionData?.establishmentAddress?.city}`
                            : null}
                          {prescriptionData?.establishmentAddress?.state
                            ? ` (${prescriptionData?.establishmentAddress?.state})`
                            : null}
                        </Text>
                      </DetailDataInfo>
                    </DetailData>
                    <Detail />
                  </DetailDataContainer>

                  {prescriptionData?.prescriptionType === 'MEDIC' ? (
                    <>
                      <DetailDataContainer>
                        <DetailDataHeader>
                          <Heading color={'gray_700'} size={'xlarge'}>
                            Paciente
                          </Heading>
                        </DetailDataHeader>
                        <DetailData>
                          <Image
                            priority
                            src={userIcon}
                            alt="Ícone usuário"
                            height={48}
                            width={48}
                          />

                          <DetailDataInfo>
                            <Text color={'gray_600'} size={'xlarge'}>
                              {prescriptionData?.patientName}
                            </Text>

                            <Text size={'medium'} color={'gray_500'}>
                              {prescriptionData?.patientCpf
                                ? prescriptionData?.patientCpf
                                : prescriptionData?.patientDocument}
                            </Text>
                          </DetailDataInfo>
                        </DetailData>
                        <Detail />
                      </DetailDataContainer>
                    </>
                  ) : (
                    <>
                      <DetailDataContainer>
                        <DetailDataHeader>
                          <Heading color={'gray_700'} size={'xlarge'}>
                            Tutor
                          </Heading>
                        </DetailDataHeader>
                        <DetailData>
                          <Image
                            priority
                            src={userIcon}
                            alt="Ícone usuário"
                            height={48}
                            width={48}
                          />

                          <DetailDataInfo>
                            <Text color={'gray_600'} size={'xlarge'}>
                              {prescriptionData?.tutorName}
                            </Text>

                            <Text size={'medium'} color={'gray_500'}>
                              {prescriptionData?.tutorCpf
                                ? prescriptionData?.tutorCpf
                                : prescriptionData?.tutorDocument}
                            </Text>
                          </DetailDataInfo>
                        </DetailData>
                        <Detail />
                      </DetailDataContainer>
                      <DetailDataContainer>
                        <DetailDataHeader>
                          <Heading color={'gray_700'} size={'xlarge'}>
                            Pet
                          </Heading>
                        </DetailDataHeader>
                        <DetailData>
                          <Image
                            priority
                            src={petIcon}
                            alt="Ícone pet"
                            height={48}
                            width={48}
                          />

                          <DetailDataInfo>
                            <Text color={'gray_600'} size={'xlarge'}>
                              {prescriptionData?.petName}
                            </Text>

                            <Text size={'medium'} color={'gray_500'}>
                              {prescriptionData?.petSpecie}
                            </Text>
                          </DetailDataInfo>
                        </DetailData>
                        <Detail />
                      </DetailDataContainer>
                    </>
                  )}

                  <DetailDataContainer>
                    <DetailDataHeader>
                      <Heading color={'gray_700'} size={'xlarge'}>
                        Profissional emitente
                      </Heading>
                    </DetailDataHeader>
                    <DetailData>
                      <Image
                        priority
                        src={healthProfessionalIcon}
                        alt="Ícone profissional da saúde"
                        height={48}
                        width={48}
                      />

                      <DetailDataInfo>
                        <Text color={'gray_600'} size={'xlarge'}>
                          {prescriptionData?.professionalName}
                        </Text>

                        <Text size={'medium'} color={'gray_500'}>
                          {prescriptionData?.professionalCpf}
                        </Text>
                      </DetailDataInfo>
                    </DetailData>
                    <Detail />
                  </DetailDataContainer>
                </DetailDataListContainer>
              </DetailTabContent>
              <DetailTabContent
                active={currentDetailTab === 'prescriptionData'}
              >
                <PrescriptionDateInfoContainer>
                  <Text size={'xlarge'} color={'gray_700'}>
                    Tipo da prescrição
                  </Text>
                  <PrescriptionDateInfo>
                    <Text
                      size={'xlarge'}
                      color={'brand_700'}
                      fontWeight={'black'}
                    >
                      {prescriptionData?.prescriptionType === 'MEDIC'
                        ? 'Médica'
                        : 'Veterinária'}
                    </Text>
                  </PrescriptionDateInfo>
                </PrescriptionDateInfoContainer>
                <DetailDataListContainer>
                  <PrescriptionDateInfoContainer>
                    <Text size={'xlarge'} color={'gray_700'}>
                      Data de emissão
                    </Text>
                    <PrescriptionDateInfo>
                      <CalendarCheck2 color={'#2A844C'} />
                      <Text
                        size={'medium'}
                        color={'gray_700'}
                        fontWeight={'black'}
                      >
                        {formatDate(prescriptionData?.emissionDate)}
                      </Text>
                    </PrescriptionDateInfo>
                  </PrescriptionDateInfoContainer>
                  <PrescriptionDateInfoContainer>
                    <Text size={'xlarge'} color={'gray_700'}>
                      Data de vencimento
                    </Text>
                    <PrescriptionDateInfo>
                      <CalendarX2 color={'#B81D1D'} />
                      <Text
                        size={'medium'}
                        color={'gray_700'}
                        fontWeight={'black'}
                      >
                        {formatDate(prescriptionData?.expirationDate)}
                      </Text>
                    </PrescriptionDateInfo>
                  </PrescriptionDateInfoContainer>
                  <PrescriptionObservationInfoContainer>
                    <Text size={'xlarge'} color={'gray_700'}>
                      Observação
                    </Text>
                    <Text size={'medium'} color={'gray_800'}>
                      {prescriptionData?.observation}
                    </Text>
                  </PrescriptionObservationInfoContainer>
                </DetailDataListContainer>
              </DetailTabContent>
              <DetailTabContent
                active={currentDetailTab === 'medicinePrescribed'}
              >
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRowHead>
                        <TableHeaderCell>Medicamento</TableHeaderCell>
                        <TableHeaderCell>Via de administração</TableHeaderCell>
                        <TableHeaderCell>Quantidade total</TableHeaderCell>
                        <TableHeaderCell>Posologia</TableHeaderCell>
                      </TableRowHead>
                    </TableHead>
                    <TableBody>
                      {prescriptionData?.medicinePrescribedList
                        ? prescriptionData?.medicinePrescribedList.map(
                            (medicinePrescribed) => {
                              return (
                                <TableRow key={medicinePrescribed.medicineId}>
                                  <TableDataCell>
                                    {medicinePrescribed.medicineName}
                                  </TableDataCell>
                                  <TableDataCell>
                                    {resolvePrescribedAdministrationWayValue(
                                      medicinePrescribed.administrationWay,
                                    )}
                                  </TableDataCell>
                                  <TableDataCell>
                                    {medicinePrescribed.totalAmount}
                                  </TableDataCell>
                                  <TableDataCell>
                                    {medicinePrescribed.dosage}
                                  </TableDataCell>
                                </TableRow>
                              )
                            },
                          )
                        : null}
                    </TableBody>
                  </Table>
                </TableContainer>
              </DetailTabContent>
            </DetailTabIndexContainer>
          </PrescriptionDetailData>
        </Box>
      </PrescriptionDetailContainer>
    </DefaultLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'medap.token': token } = parseCookies(context)

  let isUserAuthenticated = false

  const user = await recoverUserAuthData(token)

  let prescriptionData: ResponsePrescription | null = null

  const routeParams = context.params

  if (routeParams) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/prescriptions/?id=${routeParams.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        prescriptionData = await response.json()
      } else {
        throw new Error('Falha em recuperar dados da prescrição')
      }
    } catch (error) {
      console.error('Falha em recuperar dados da prescrição: ', error)
    }
  }

  if (user != null) {
    isUserAuthenticated = true
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
      prescriptionData,
    },
  }
}
