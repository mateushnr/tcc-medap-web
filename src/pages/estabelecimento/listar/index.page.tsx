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
  EstablishmentContactInfo,
  EstablishmentEspecialityContainer,
  EstablishmentNameInfo,
  EstablishmentTypeInfo,
  LabelInfo,
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
import { Hospital, List, Pencil, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import establishmentIcon from '@/assets/images/establishmentIcon.svg'
import {
  resolveEstablishmentStatusValue,
  resolveEstablishmentTargetCustomerValue,
  resolveEstablishmentTypesValue,
} from '@/utils/resolvers/resolveSelectValuesToText'
import { useEffect, useRef, useState } from 'react'
import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import { useRouter } from 'next/router'
import type {
  ResponseEstablishment,
  ResponseEstablishmentWithPagination,
} from '@/@types/responseValues/establishmentResponse'
import Pagination from '@/components/Pagination'
import { SearchBar } from '@/components/SearchBar'

interface DeactivateDialogProps {
  idItemSelected: string
}

interface ListEstablishmentProps {
  establishmentList: ResponseEstablishment[] | null
  totalCount: number
  currentPage: number
}

export default function ListEstablishment({
  establishmentList,
  totalCount: initialTotalCount,
  currentPage: initialCurrentPage,
}: ListEstablishmentProps) {
  const [deactivateDialog, setDeactivateDialog] =
    useState<DeactivateDialogProps | null>(null)

  const [establishmentListData, setEstablishmentListData] = useState<
    ResponseEstablishment[] | null
  >(establishmentList)

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

    const url = new URL(`http://localhost:3000/api/establishments?page=1`)

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
          const establishementCurrentListData = await response.json()

          setEstablishmentListData(establishementCurrentListData?.data || null)

          setTotalCount(establishementCurrentListData?.totalCount)
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
      const url = new URL(`http://localhost:3000/api/establishments`)
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
          const establishmentCurrentListData = await response.json()

          setEstablishmentListData(establishmentCurrentListData?.data || null)

          setTotalCount(establishmentCurrentListData?.totalCount)

          break
        }
      }
    } catch (error) {}
  }

  const handleUpdatePageData = async (page: number, searched?: string) => {
    const { 'medap.token': token } = parseCookies()

    const url = new URL(`http://localhost:3000/api/establishments`)
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

    let establishmentCurrentListData: ResponseEstablishmentWithPagination | null =
      null

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
          establishmentCurrentListData = await response.json()

          setEstablishmentListData(establishmentCurrentListData?.data || null)

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
        'http://localhost:3000/api/establishments/deactivate',
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
            message: 'Estabelecimento desativado!',
          })

          break
        }
        case 404: {
          setDeactivatedEstablishmentFeedbackMessage({
            state: 'error',
            message: 'Erro ao desabilitar o estabelecimento!',
          })

          break
        }
        default: {
          setDeactivatedEstablishmentFeedbackMessage({
            state: 'error',
            message: 'Erro ao desabilitar o estabelecimento!',
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
    <DefaultLayout activePage="ESTABLISHMENT">
      <HeaderUser title="Gerenciar estabelecimento" />
      <ListEstablishmentContainer>
        <Navigation
          LinkList={[
            {
              link: '/estabelecimento/incluir',
              active: false,
              icon: <Plus size={20} strokeWidth={2.5} />,
              text: 'Incluir novo estabelecimento',
            },
            {
              link: '/estabelecimento/listar',
              active: true,
              icon: <List size={20} strokeWidth={2.5} />,
              text: 'Lista de estabelecimentos',
            },
            {
              link: '/estabelecimento/tipo',
              active: false,
              icon: <Hospital size={20} strokeWidth={2} />,
              text: 'Gerenciar tipo de estabelecimento',
            },
          ]}
        />
        <Box width={'full'}>
          <Heading color={'gray_700'} size={'2xlarge'}>
            Lista de estabelecimentos no sistema
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
                      CNPJ
                    </Heading>
                  </ListEstablishmentTH>
                  <ListEstablishmentTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Contato
                    </Heading>
                  </ListEstablishmentTH>
                  <ListEstablishmentTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Tipo
                    </Heading>
                  </ListEstablishmentTH>

                  <ListEstablishmentTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Especialidade
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
                {establishmentListData?.map((establishment, index) => {
                  const isLastItem = index === establishmentListData.length - 1

                  return (
                    <ListEstablishmentTableRow key={establishment.id}>
                      <ListEstablishmentTD>
                        <ListEstablishmentNameContainer>
                          <Image
                            priority
                            src={establishmentIcon}
                            alt="Logo medap"
                            height={48}
                            width={48}
                          />

                          <EstablishmentNameInfo>
                            <Text color={'gray_700'}>{establishment.name}</Text>
                            <Text color={'gray_500'}>
                              {establishment.abbreviation}
                            </Text>
                          </EstablishmentNameInfo>
                        </ListEstablishmentNameContainer>
                      </ListEstablishmentTD>
                      <ListEstablishmentTD>
                        <Text color={'gray_700'} size={'small'}>
                          {establishment.cnpj}
                        </Text>
                      </ListEstablishmentTD>
                      <ListEstablishmentTD>
                        <EstablishmentContactInfo>
                          <Text color={'gray_700'}>{establishment.email}</Text>
                          <Text color={'gray_500'}>
                            {establishment.mainPhone}
                          </Text>
                        </EstablishmentContactInfo>
                      </ListEstablishmentTD>
                      <ListEstablishmentTD>
                        <EstablishmentTypeInfo>
                          <Text color={'gray_700'}>
                            {resolveEstablishmentTypesValue(
                              establishment.establishmentType,
                            )}
                          </Text>
                          <Text color={'gray_600'}>
                            <LabelInfo>Público: </LabelInfo>
                            {resolveEstablishmentTargetCustomerValue(
                              establishment.targetCustomer,
                            )}
                          </Text>
                        </EstablishmentTypeInfo>
                      </ListEstablishmentTD>

                      <ListEstablishmentTD>
                        <EstablishmentEspecialityContainer>
                          <Text color={'gray_700'}>
                            {establishment.especiality}
                          </Text>
                        </EstablishmentEspecialityContainer>
                      </ListEstablishmentTD>
                      <ListEstablishmentTD>
                        <Text color={'gray_700'}>
                          {resolveEstablishmentStatusValue(
                            establishment.status,
                          )}
                        </Text>
                      </ListEstablishmentTD>
                      <ListEstablishmentTD>
                        <EstablishmentActionsContainer>
                          <IconButton
                            onClick={() => {
                              handleEditEstablishment(establishment.id)
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
                                  idItemSelected: establishment.id,
                                })
                              }}
                              size={'medium'}
                              variant={'icon_danger'}
                            >
                              <Trash2 />
                            </IconButton>
                            {deactivateDialog?.idItemSelected ===
                            establishment.id ? (
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
                                      handleDeactivateEstablishment(
                                        establishment.id,
                                      )
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

  const routeQuery = context.query

  let isUserAuthenticated = false

  const user = await recoverUserAuthData(token)
  let establishmentListData: ResponseEstablishmentWithPagination | null = null

  if (user != null) {
    isUserAuthenticated = true

    const response = await fetch(
      `http://localhost:3000/api/establishments?page=${page}&search=${routeQuery.search || ''}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    establishmentListData = await response.json()
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
      establishmentList: establishmentListData?.data,
      totalCount: establishmentListData?.totalCount,
      currentPage: page,
    },
  }
}
