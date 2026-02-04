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
  EstablishmentNameInfo,
  EstablishmentTypeInfo,
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
import userIcon from '@/assets/images/icon-user.svg'
import { resolveEstablishmentStatusValue } from '@/utils/resolvers/resolveSelectValuesToText'
import { useEffect, useRef, useState } from 'react'
import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import { useRouter } from 'next/router'
import type {
  ResponseCustomer,
  ResponseCustomerWithPagination,
} from '@/@types/responseValues/customerResponse'
import { SearchBar } from '@/components/SearchBar'
import Pagination from '@/components/Pagination'

interface DeactivateDialogProps {
  idItemSelected: string
}

interface ListCustomerProps {
  customersList: ResponseCustomer[] | null
  totalCount: number
  currentPage: number
}

export default function ListCustomer({
  customersList,
  totalCount: initialTotalCount,
  currentPage: initialCurrentPage,
}: ListCustomerProps) {
  const [deactivateDialog, setDeactivateDialog] =
    useState<DeactivateDialogProps | null>(null)

  const [establishmentListData, setEstablishmentListData] = useState<
    ResponseCustomer[] | null
  >(customersList)

  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [currentPage, setCurrentPage] = useState(initialCurrentPage)

  const [
    deactivatedEstablishmentFeedbackMessage,
    setDeactivatedEstablishmentFeedbackMessage,
  ] = useState<ToastFeedbackMessageType | null>(null)

  const router = useRouter()

  const handleEditCustomer = (idCustomerToEdit: string) => {
    router.push(`editar/${idCustomerToEdit}`)
  }

  const handleClearSearch = async () => {
    const { 'medap.token': token } = parseCookies()
    router.push('')

    const url = new URL(`http://localhost:3000/api/customers?page=1`)

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
          const customerCurrentListData = await response.json()

          setEstablishmentListData(customerCurrentListData?.data || null)

          setTotalCount(customerCurrentListData?.totalCount)
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
      const url = new URL(`http://localhost:3000/api/customers`)
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
          const customerCurrentListData = await response.json()

          setEstablishmentListData(customerCurrentListData?.data || null)

          setTotalCount(customerCurrentListData?.totalCount)

          break
        }
      }
    } catch (error) {}
  }

  const handleUpdatePageData = async (page: number, searched?: string) => {
    const { 'medap.token': token } = parseCookies()

    const url = new URL(`http://localhost:3000/api/customers`)
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

    let customerCurrentListData: ResponseCustomerWithPagination | null = null

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
          customerCurrentListData = await response.json()

          setEstablishmentListData(customerCurrentListData?.data || null)

          break
        }
      }
    } catch (error) {
      throw new Error('Erro ocorrido: ' + error)
    }
  }

  const handleDeactivateCustomer = async (idToDeactivate: string) => {
    const { 'medap.token': token } = parseCookies()
    const dataToSend = { idCustomerToDeactivate: idToDeactivate }

    setDeactivatedEstablishmentFeedbackMessage(null)
    setDeactivateDialog(null)
    try {
      const response = await fetch(
        'http://localhost:3000/api/customers/deactivate',
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
            message: 'Cliente desativado!',
          })

          break
        }
        case 404: {
          setDeactivatedEstablishmentFeedbackMessage({
            state: 'error',
            message: 'Erro ao desabilitar o cliente!',
          })

          break
        }
        default: {
          setDeactivatedEstablishmentFeedbackMessage({
            state: 'error',
            message: 'Erro ao desabilitar o cliente!',
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
    <DefaultLayout activePage="PATIENT">
      <HeaderUser title="Gerenciar cliente" />
      <ListEstablishmentContainer>
        <Navigation
          LinkList={[
            {
              link: '/paciente/incluir',
              active: false,
              icon: <Plus size={20} strokeWidth={2.5} />,
              text: 'Incluir novo cliente',
            },
            {
              link: '/paciente/listar',
              active: true,
              icon: <List size={20} strokeWidth={2.5} />,
              text: 'Lista de clientes',
            },
            {
              link: '/pet/listar',
              active: false,
              icon: <List size={20} strokeWidth={2.5} />,
              text: 'Lista de pets',
            },
          ]}
        />
        <Box width={'full'}>
          <Heading color={'gray_700'} size={'2xlarge'}>
            Lista de clientes no sistema
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
                      CNS
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
                            src={userIcon}
                            alt="Ícone unidade"
                            height={48}
                            width={48}
                          />

                          <EstablishmentNameInfo>
                            <Text color={'gray_700'}>{establishment.name}</Text>
                            <Text color={'gray_500'}>
                              {establishment.cpf
                                ? establishment.cpf
                                : establishment.otherDocument}
                            </Text>
                          </EstablishmentNameInfo>
                        </ListEstablishmentNameContainer>
                      </ListEstablishmentTD>
                      <ListEstablishmentTD>
                        <Text color={'gray_700'} size={'small'}>
                          {establishment.cns}
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
                            {establishment.isPatient ? 'Paciente' : null}
                          </Text>
                          <Text color={'gray_700'}>
                            {establishment.isResponsible ? 'Responsável' : null}
                          </Text>
                          <Text color={'gray_700'}>
                            {establishment.isTutor ? 'Tutor' : null}
                          </Text>
                        </EstablishmentTypeInfo>
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
                              handleEditCustomer(establishment.id)
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
                                      handleDeactivateCustomer(establishment.id)
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
  let customersListData: ResponseCustomerWithPagination | null = null

  if (user != null) {
    isUserAuthenticated = true

    const response = await fetch(
      `http://localhost:3000/api/customers?page=${page}&search=${routeQuery.search || ''}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    customersListData = await response.json()
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
      customersList: customersListData?.data,
      totalCount: customersListData?.totalCount,
      currentPage: page,
    },
  }
}
