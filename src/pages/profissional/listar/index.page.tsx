import DefaultLayout from '@/layouts/DefaultLayout'
import { Box, Button, Heading, IconButton, Text } from '@medap-ui/react'
import HeaderUser from '@/components/PageStructure/HeaderUser'
import {
  DeactivateButtonContainer,
  DeactivateDialog,
  DeactivateDialogActions,
  DeactivateDialogInfo,
  UnityActionsContainer,
  UnityContactInfo,
  UnityEspecialityContainer,
  UnityNameInfo,
  UnityEstablishmentBoundedInfo,
  UnityTypeInfo,
  LabelInfo,
  ListUnityContainer,
  ListUnityNameContainer,
  ListUnityEstablishmentBoundedContainer,
  ListUnityTable,
  ListUnityTableBody,
  ListUnityTableHeader,
  ListUnityTableRow,
  ListUnityTD,
  ListUnityTH,
  TableContainer,
  ContainerDataInfo,
} from './styles'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { recoverUserAuthData } from '@/contexts/AuthContext'
import Navigation from '@/components/PageStructure/Navigation'
import { File, List, Pencil, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import userIcon from '@/assets/images/icon-user.svg'
import establishmentIcon from '@/assets/images/establishmentIcon.svg'
import {
  resolveProfessionalRolesValue,
  resolveUnityStatusValue,
} from '@/utils/resolvers/resolveSelectValuesToText'
import { useEffect, useRef, useState } from 'react'
import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import { useRouter } from 'next/router'
import type {
  ResponseProfessional,
  ResponseProfessionalWithPagination,
} from '@/@types/responseValues/professionalResponse'
import Pagination from '@/components/Pagination'
import { SearchBar } from '@/components/SearchBar'

interface DeactivateDialogProps {
  idItemSelected: string
}

interface ListProfessionalProps {
  professionalList: ResponseProfessional[] | null
  totalCount: number
  currentPage: number
}

export default function ListProfessional({
  professionalList,
  totalCount: initialTotalCount,
  currentPage: initialCurrentPage,
}: ListProfessionalProps) {
  const [deactivateDialog, setDeactivateDialog] =
    useState<DeactivateDialogProps | null>(null)

  const [professionalListData, setProfessionalListData] = useState<
    ResponseProfessional[] | null
  >(professionalList)

  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [currentPage, setCurrentPage] = useState(initialCurrentPage)

  const [
    deactivatedProfessionalFeedbackMessage,
    setDeactivatedProfessionalFeedbackMessage,
  ] = useState<ToastFeedbackMessageType | null>(null)

  const router = useRouter()

  const handleEditUnity = (idProfessionalToEdit: string) => {
    router.push(`editar/${idProfessionalToEdit}`)
  }

  const handleClearSearch = async () => {
    const { 'medap.token': token } = parseCookies()
    router.push('')

    const url = new URL(`http://localhost:3000/api/professionals?page=1`)

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
          const professionalCurrentListData = await response.json()

          setProfessionalListData(professionalCurrentListData?.data || null)

          setTotalCount(professionalCurrentListData?.totalCount)
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
      const url = new URL(`http://localhost:3000/api/professionals`)
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
          const professionalCurrentListData = await response.json()

          setProfessionalListData(professionalCurrentListData?.data || null)

          setTotalCount(professionalCurrentListData?.totalCount)

          break
        }
      }
    } catch (error) {}
  }

  const handleUpdatePageData = async (page: number, searched?: string) => {
    const { 'medap.token': token } = parseCookies()

    const url = new URL(`http://localhost:3000/api/professionals`)
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

    let professionalCurrentListData: ResponseProfessionalWithPagination | null =
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
          professionalCurrentListData = await response.json()

          setProfessionalListData(professionalCurrentListData?.data || null)

          break
        }
      }
    } catch (error) {
      throw new Error('Erro ocorrido: ' + error)
    }
  }

  const handleDeactivateUnity = async (idToDeactivate: string) => {
    const { 'medap.token': token } = parseCookies()
    const dataToSend = { idProfessionalToDeactivate: idToDeactivate }

    setDeactivatedProfessionalFeedbackMessage(null)
    setDeactivateDialog(null)
    try {
      const response = await fetch(
        'http://localhost:3000/api/professionals/deactivate',
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
          setDeactivatedProfessionalFeedbackMessage({
            state: 'success',
            message: 'Profissional desativado!',
          })

          break
        }
        case 404: {
          setDeactivatedProfessionalFeedbackMessage({
            state: 'error',
            message: 'Erro ao desabilitar o profissional!',
          })

          break
        }
        default: {
          setDeactivatedProfessionalFeedbackMessage({
            state: 'error',
            message: 'Erro ao desabilitar o profissional!',
          })
        }
      }
    } catch (error) {
      setDeactivatedProfessionalFeedbackMessage({
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
    <DefaultLayout activePage="PROFESSIONAL">
      <HeaderUser title="Gerenciar profissional" />
      <ListUnityContainer>
        <Navigation
          LinkList={[
            {
              link: '/profissional/incluir',
              active: false,
              icon: <Plus size={20} strokeWidth={2.5} />,
              text: 'Incluir novo profissional',
            },
            {
              link: '/profissional/listar',
              active: true,
              icon: <List size={20} strokeWidth={2.5} />,
              text: 'Lista de profissionais',
            },
            {
              link: '/profissional/documento',
              active: false,
              icon: <File size={20} strokeWidth={2.5} />,
              text: 'Gerenciar documento regional',
            },
          ]}
        />
        <Box width={'full'}>
          <Heading color={'gray_700'} size={'2xlarge'}>
            Lista de profissionais no sistema
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
            <ListUnityTable>
              <ListUnityTableHeader>
                <tr>
                  <ListUnityTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Nome
                    </Heading>
                  </ListUnityTH>
                  <ListUnityTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Organização pertencente
                    </Heading>
                  </ListUnityTH>
                  <ListUnityTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Função
                    </Heading>
                  </ListUnityTH>
                  <ListUnityTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Contato
                    </Heading>
                  </ListUnityTH>
                  <ListUnityTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Documento Regional
                    </Heading>
                  </ListUnityTH>
                  <ListUnityTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Especialidade
                    </Heading>
                  </ListUnityTH>
                  <ListUnityTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Status
                    </Heading>
                  </ListUnityTH>
                  <ListUnityTH></ListUnityTH>
                </tr>
              </ListUnityTableHeader>
              <ListUnityTableBody>
                {professionalListData?.map((professional, index) => {
                  const isLastItem = index === professionalListData.length - 1

                  return (
                    <ListUnityTableRow key={professional.id}>
                      <ListUnityTD>
                        <ListUnityNameContainer>
                          <Image
                            priority
                            src={userIcon}
                            alt="Ícone usuário"
                            height={48}
                            width={48}
                          />

                          <UnityNameInfo>
                            <Text color={'gray_700'}>{professional.name}</Text>
                            <Text color={'gray_500'}>{professional.cpf}</Text>
                          </UnityNameInfo>
                        </ListUnityNameContainer>
                      </ListUnityTD>
                      <ListUnityTD>
                        <ListUnityEstablishmentBoundedContainer>
                          <Image
                            priority
                            src={establishmentIcon}
                            alt="Ícone profissional"
                            height={48}
                            width={48}
                          />

                          <UnityEstablishmentBoundedInfo>
                            <Text color={'gray_700'}>
                              {professional.establishmentBoundedName}
                            </Text>
                            <Text color={'gray_500'}>
                              {professional.establishmentBoundedAbbreviation}
                            </Text>
                          </UnityEstablishmentBoundedInfo>
                        </ListUnityEstablishmentBoundedContainer>
                      </ListUnityTD>
                      <ListUnityTD>
                        <Text color={'gray_700'} size={'small'}>
                          {resolveProfessionalRolesValue(professional.role)}
                        </Text>
                      </ListUnityTD>
                      <ListUnityTD>
                        <UnityContactInfo>
                          <Text color={'gray_700'}>{professional.email}</Text>
                          <Text color={'gray_500'}>{professional.phone}</Text>
                        </UnityContactInfo>
                      </ListUnityTD>
                      <ListUnityTD>
                        <UnityTypeInfo>
                          <Text color={'gray_700'}>
                            {professional.regionalDocument}
                          </Text>
                          <Text color={'gray_600'}>
                            <LabelInfo>UF: </LabelInfo>
                            {professional.stateDocumentIssued}
                          </Text>
                        </UnityTypeInfo>
                      </ListUnityTD>
                      <ListUnityTD>
                        <UnityEspecialityContainer>
                          <Text color={'gray_700'}>
                            {professional.especiality}
                          </Text>
                        </UnityEspecialityContainer>
                      </ListUnityTD>
                      <ListUnityTD>
                        <Text color={'gray_700'}>
                          {resolveUnityStatusValue(professional.status)}
                        </Text>
                      </ListUnityTD>
                      <ListUnityTD>
                        <UnityActionsContainer>
                          <IconButton
                            onClick={() => {
                              handleEditUnity(professional.id)
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
                                  idItemSelected: professional.id,
                                })
                              }}
                              size={'medium'}
                              variant={'icon_danger'}
                            >
                              <Trash2 />
                            </IconButton>
                            {deactivateDialog?.idItemSelected ===
                            professional.id ? (
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
                                      handleDeactivateUnity(professional.id)
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
                        </UnityActionsContainer>
                      </ListUnityTD>
                    </ListUnityTableRow>
                  )
                })}
              </ListUnityTableBody>
            </ListUnityTable>
          </TableContainer>
        </Box>
      </ListUnityContainer>
      {deactivatedProfessionalFeedbackMessage ? (
        <Toast
          message={deactivatedProfessionalFeedbackMessage.message}
          hasTimer={true}
          type={deactivatedProfessionalFeedbackMessage.state}
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
  let professionalListData: ResponseProfessionalWithPagination | null = null

  if (user != null) {
    isUserAuthenticated = true

    const response = await fetch(
      `http://localhost:3000/api/professionals?page=${page}&search=${routeQuery.search || ''}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    professionalListData = await response.json()
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
      professionalList: professionalListData?.data,
      totalCount: professionalListData?.totalCount,
      currentPage: page,
    },
  }
}
