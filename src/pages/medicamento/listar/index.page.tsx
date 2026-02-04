import DefaultLayout from '@/layouts/DefaultLayout'
import { Box, Button, Heading, IconButton, Text } from '@medap-ui/react'
import HeaderUser from '@/components/PageStructure/HeaderUser'
import {
  ContainerDataInfo,
  DeactivateButtonContainer,
  DeactivateDialog,
  DeactivateDialogActions,
  DeactivateDialogInfo,
  EstablishmentActionsContainer,
  EstablishmentNameInfo,
  ListEstablishmentContainer,
  ListEstablishmentNameContainer,
  ListEstablishmentTable,
  ListEstablishmentTableBody,
  ListEstablishmentTableHeader,
  ListEstablishmentTableRow,
  ListEstablishmentTD,
  ListEstablishmentTH,
  TableContainer,
} from './styles'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { recoverUserAuthData } from '@/contexts/AuthContext'
import Navigation from '@/components/PageStructure/Navigation'
import { List, Pencil, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import medicineIcon from '@/assets/images/icon-medicine.svg'
import {
  resolveMedicineForUseValue,
  resolveMedicinePharmaceuticalFormValue,
  resolveMedicineRegulatoryCategoryValue,
  resolveMedicineStatusValue,
} from '@/utils/resolvers/resolveSelectValuesToText'
import { useEffect, useRef, useState } from 'react'
import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import { useRouter } from 'next/router'
import { SearchBar } from '@/components/SearchBar'
import Pagination from '@/components/Pagination'
import type {
  ResponseMedicine,
  ResponseMedicineWithPagination,
} from '@/@types/responseValues/medicineResponse'

interface DeactivateDialogProps {
  idItemSelected: string
}

interface ListMedicineProps {
  medicinesList: ResponseMedicine[] | null
  totalCount: number
  currentPage: number
}

export default function ListMedicine({
  medicinesList,
  totalCount: initialTotalCount,
  currentPage: initialCurrentPage,
}: ListMedicineProps) {
  const [deactivateDialog, setDeactivateDialog] =
    useState<DeactivateDialogProps | null>(null)

  const [medicineListData, setMedicineListData] = useState<
    ResponseMedicine[] | null
  >(medicinesList)

  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [currentPage, setCurrentPage] = useState(initialCurrentPage)

  const [
    deactivatedEstablishmentFeedbackMessage,
    setDeactivatedEstablishmentFeedbackMessage,
  ] = useState<ToastFeedbackMessageType | null>(null)

  const router = useRouter()

  const handleEditEstablishment = (idEstablishmentToEdit: string) => {
    router.push(`editar/${idEstablishmentToEdit}`)
  }

  const handleClearSearch = async () => {
    const { 'medap.token': token } = parseCookies()
    router.push('')

    const url = new URL(`http://localhost:3000/api/medicines?page=1`)

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      switch (response.status) {
        case 200: {
          const medicineCurrentListData = await response.json()

          setMedicineListData(medicineCurrentListData?.data || null)

          setTotalCount(medicineCurrentListData?.totalCount)
          setCurrentPage(1)

          break
        }
      }
    } catch (error) {
      throw new Error('Erro ocorrido: ' + error)
    }
  }

  const handleSearch = async (searchedValue: string) => {
    const { 'medap.token': token } = parseCookies()

    try {
      const url = new URL(`http://localhost:3000/api/medicines`)
      url.searchParams.append('page', currentPage.toString())
      url.searchParams.append('search', searchedValue)

      router.push(`?page=${1}&search=${searchedValue}`)
      handleUpdatePageData(1, searchedValue)

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      switch (response.status) {
        case 200: {
          const medicineCurrentListData = await response.json()

          setMedicineListData(medicineCurrentListData?.data || null)

          setTotalCount(medicineCurrentListData?.totalCount)

          break
        }
      }
    } catch (error) {}
  }

  const handleUpdatePageData = async (page: number, searched?: string) => {
    const { 'medap.token': token } = parseCookies()

    const url = new URL(`http://localhost:3000/api/medicines`)
    url.searchParams.append('page', page.toString())

    if (searched) {
      url.searchParams.append('search', searched)
    }

    if (searched) {
      router.push(`?page=${page}&search=${searched}`)
    } else {
      router.push(`?page=${page}`)
    }

    setCurrentPage(page)

    let medicineCurrentListData: ResponseMedicineWithPagination | null = null

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      switch (response.status) {
        case 200: {
          medicineCurrentListData = await response.json()

          setMedicineListData(medicineCurrentListData?.data || null)

          break
        }
      }
    } catch (error) {
      throw new Error('Erro ocorrido: ' + error)
    }
  }

  const handleDeactivateEstablishment = async (idToDeactivate: string) => {
    const { 'medap.token': token } = parseCookies()
    const dataToSend = { idEstablishmentToDeactivate: idToDeactivate }

    setDeactivatedEstablishmentFeedbackMessage(null)
    setDeactivateDialog(null)
    try {
      const response = await fetch(
        'http://localhost:3000/api/medicines/deactivate',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        },
      )

      switch (response.status) {
        case 200: {
          handleUpdatePageData(currentPage)
          setDeactivatedEstablishmentFeedbackMessage({
            state: 'success',
            message: 'Medicamento desativado!',
          })

          break
        }
        case 404: {
          setDeactivatedEstablishmentFeedbackMessage({
            state: 'error',
            message: 'Erro ao desabilitar o medicamento!',
          })

          break
        }
        default: {
          setDeactivatedEstablishmentFeedbackMessage({
            state: 'error',
            message: 'Erro ao desabilitar o medicamento!',
          })
        }
      }
    } catch (error) {
      setDeactivatedEstablishmentFeedbackMessage({
        state: 'error',
        message: 'Erro no servidor!',
      })
    }
  }

  const DeactivateButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!deactivateDialog) return

      if (
        DeactivateButtonRef.current &&
        !DeactivateButtonRef.current.contains(event.target as Node)
      ) {
        setDeactivateDialog(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [deactivateDialog])

  return (
    <DefaultLayout activePage="MEDICINE">
      <HeaderUser title="Gerenciar medicamento" />
      <ListEstablishmentContainer>
        <Navigation
          LinkList={[
            {
              link: '/medicamento/incluir',
              active: false,
              icon: <Plus size={20} strokeWidth={2.5} />,
              text: 'Incluir novo medicamento',
            },
            {
              link: '/medicamento/listar',
              active: true,
              icon: <List size={20} strokeWidth={2.5} />,
              text: 'Lista de medicamento',
            },
          ]}
        />
        <Box width={'full'}>
          <Heading color={'gray_700'} size={'2xlarge'}>
            Lista de medicamentos no sistema
          </Heading>
          <SearchBar
            handleSearch={handleSearch}
            handleClear={handleClearSearch}
            placeholder={'Pesquisar...'}
          />
          <ContainerDataInfo>
            <Text color={'gray_600'}>
              <b>{totalCount} </b>resultados encontrados
            </Text>
            <Pagination
              handleUpdatePageData={handleUpdatePageData}
              totalCount={totalCount}
              currentPage={currentPage}
            />
          </ContainerDataInfo>
          <TableContainer>
            <ListEstablishmentTable>
              <ListEstablishmentTableHeader>
                <tr>
                  <ListEstablishmentTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Nome
                    </Heading>
                  </ListEstablishmentTH>
                  <ListEstablishmentTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Forma farmacêutica
                    </Heading>
                  </ListEstablishmentTH>
                  <ListEstablishmentTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Princípio ativo
                    </Heading>
                  </ListEstablishmentTH>
                  <ListEstablishmentTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Categoria regulatória
                    </Heading>
                  </ListEstablishmentTH>
                  <ListEstablishmentTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Vínculo
                    </Heading>
                  </ListEstablishmentTH>
                  <ListEstablishmentTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Uso
                    </Heading>
                  </ListEstablishmentTH>
                  <ListEstablishmentTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Status
                    </Heading>
                  </ListEstablishmentTH>
                  <ListEstablishmentTH></ListEstablishmentTH>
                </tr>
              </ListEstablishmentTableHeader>
              <ListEstablishmentTableBody>
                {medicineListData?.map((medicine, index) => {
                  const isLastItem = index === medicineListData.length - 1

                  return (
                    <ListEstablishmentTableRow key={medicine.id}>
                      <ListEstablishmentTD>
                        <ListEstablishmentNameContainer>
                          <Image
                            priority
                            src={medicineIcon}
                            alt="Ícone medicamento"
                            height={48}
                            width={48}
                          />

                          <EstablishmentNameInfo>
                            <Text color={'gray_700'}>{medicine.name}</Text>
                          </EstablishmentNameInfo>
                        </ListEstablishmentNameContainer>
                      </ListEstablishmentTD>
                      <ListEstablishmentTD>
                        <Text color={'gray_700'} size={'small'}>
                          {resolveMedicinePharmaceuticalFormValue(
                            medicine.pharmaceuticalForm,
                          )}
                        </Text>
                      </ListEstablishmentTD>
                      <ListEstablishmentTD>
                        <Text color={'gray_700'} size={'small'}>
                          {medicine.activeIngredient}
                        </Text>
                      </ListEstablishmentTD>
                      <ListEstablishmentTD>
                        <Text color={'gray_700'}>
                          {resolveMedicineRegulatoryCategoryValue(
                            medicine.regulatoryCategory,
                          )}
                        </Text>
                      </ListEstablishmentTD>
                      <ListEstablishmentTD>
                        {medicine.establishmentRegistered ? (
                          <ListEstablishmentNameContainer>
                            <EstablishmentNameInfo>
                              <Text color={'brand_600'} fontWeight={'black'}>
                                {medicine.establishmentRegisteredName}
                              </Text>
                              <Text color={'gray_700'}>
                                {medicine.establishmentRegisteredAbbreviation}
                              </Text>
                            </EstablishmentNameInfo>
                          </ListEstablishmentNameContainer>
                        ) : (
                          <Text color={'gray_700'} fontWeight={'black'}>
                            Global
                          </Text>
                        )}
                      </ListEstablishmentTD>
                      <ListEstablishmentTD>
                        <Text color={'gray_700'}>
                          {resolveMedicineForUseValue(medicine.forUse)}
                        </Text>
                      </ListEstablishmentTD>
                      <ListEstablishmentTD>
                        <Text color={'gray_700'}>
                          {resolveMedicineStatusValue(medicine.status)}
                        </Text>
                      </ListEstablishmentTD>
                      <ListEstablishmentTD>
                        <EstablishmentActionsContainer>
                          <IconButton
                            onClick={() => {
                              handleEditEstablishment(medicine.id)
                            }}
                            size={'medium'}
                            variant={'icon_warning'}
                          >
                            <Pencil />
                          </IconButton>
                          <DeactivateButtonContainer>
                            <IconButton
                              onClick={() => {
                                setDeactivateDialog({
                                  idItemSelected: medicine.id,
                                })
                              }}
                              size={'medium'}
                              variant={'icon_danger'}
                            >
                              <Trash2 />
                            </IconButton>
                            {deactivateDialog?.idItemSelected ===
                            medicine.id ? (
                              <DeactivateDialog
                                ref={DeactivateButtonRef}
                                isLastItem={isLastItem}
                              >
                                <DeactivateDialogInfo>
                                  <Text color={'gray_700'}>
                                    Você está preste a desativar o item
                                    selecionado
                                  </Text>
                                  <Text size={'small'} color={'gray_600'}>
                                    Tem certeza disso?
                                  </Text>
                                </DeactivateDialogInfo>

                                <DeactivateDialogActions>
                                  <Button
                                    variant={'danger_primary'}
                                    size={'small'}
                                    onClick={() => {
                                      handleDeactivateEstablishment(medicine.id)
                                    }}
                                  >
                                    Desativar
                                  </Button>
                                  <Button
                                    variant={'danger_secondary'}
                                    size={'small'}
                                    onClick={() => {
                                      setDeactivateDialog(null)
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                </DeactivateDialogActions>
                              </DeactivateDialog>
                            ) : null}
                          </DeactivateButtonContainer>
                        </EstablishmentActionsContainer>
                      </ListEstablishmentTD>
                    </ListEstablishmentTableRow>
                  )
                })}
              </ListEstablishmentTableBody>
            </ListEstablishmentTable>
          </TableContainer>
        </Box>
      </ListEstablishmentContainer>
      {deactivatedEstablishmentFeedbackMessage ? (
        <Toast
          message={deactivatedEstablishmentFeedbackMessage.message}
          hasTimer={true}
          type={deactivatedEstablishmentFeedbackMessage.state}
        />
      ) : null}
    </DefaultLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'medap.token': token } = parseCookies(context)
  const page = parseInt(context.query.page as string) || 1

  let isUserAuthenticated = false

  const user = await recoverUserAuthData(token)
  let medicinesListData: ResponseMedicineWithPagination | null = null

  if (user != null) {
    isUserAuthenticated = true

    const response = await fetch(
      `http://localhost:3000/api/medicines?page=${page}&availableFor=all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    medicinesListData = await response.json()
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
      medicinesList: medicinesListData?.data,
      totalCount: medicinesListData?.totalCount,
      currentPage: page,
    },
  }
}
