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
import { List, Pencil, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import unityIcon from '@/assets/images/unityIcon.svg'
import establishmentIcon from '@/assets/images/establishmentIcon.svg'
import {
  resolveUnityStatusValue,
  resolveUnityTargetCustomerValue,
  resolveUnityTypesValue,
} from '@/utils/resolvers/resolveSelectValuesToText'
import { useEffect, useRef, useState } from 'react'
import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import { useRouter } from 'next/router'
import type {
  ResponseUnity,
  ResponseUnityWithPagination,
} from '@/@types/responseValues/unityResponse'
import Pagination from '@/components/Pagination'
import { SearchBar } from '@/components/SearchBar'

interface DeactivateDialogProps {
  idItemSelected: string
}

interface ListUnityProps {
  unityList: ResponseUnity[] | null
  totalCount: number
  currentPage: number
}

export default function ListUnity({
  unityList,
  totalCount,
  currentPage,
}: ListUnityProps) {
  const [deactivateDialog, setDeactivateDialog] =
    useState<DeactivateDialogProps | null>(null)

  const [unityListData, setUnityListData] = useState<ResponseUnity[] | null>(
    unityList,
  )

  const [deactivatedUnityFeedbackMessage, setDeactivatedUnityFeedbackMessage] =
    useState<ToastFeedbackMessageType | null>(null)

  const router = useRouter()

  const handleEditUnity = (idUnityToEdit: string) => {
    router.push(`editar/${idUnityToEdit}`)
  }

  const handleUpdatePageData = async (page: number) => {
    const { 'medap.token': token } = parseCookies()

    router.push(`?page=${page}`)

    let unityCurrentListData: ResponseUnityWithPagination | null = null

    try {
      const response = await fetch(
        `http://localhost:3000/api/units?page=${page}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      switch (response.status) {
        case 200: {
          unityCurrentListData = await response.json()

          setUnityListData(unityCurrentListData?.data || null)

          break
        }
      }
    } catch (error) {
      throw new Error('Erro ocorrido: ' + error)
    }
  }

  const handleDeactivateUnity = async (idToDeactivate: string) => {
    const { 'medap.token': token } = parseCookies()
    const dataToSend = { idUnityToDeactivate: idToDeactivate }

    setDeactivatedUnityFeedbackMessage(null)
    setDeactivateDialog(null)
    try {
      const response = await fetch(
        'http://localhost:3000/api/units/deactivate',
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
          setDeactivatedUnityFeedbackMessage({
            state: 'success',
            message: 'Unidade desativada!',
          })

          break
        }
        case 404: {
          setDeactivatedUnityFeedbackMessage({
            state: 'error',
            message: 'Erro ao desabilitar a unidade!',
          })

          break
        }
        default: {
          setDeactivatedUnityFeedbackMessage({
            state: 'error',
            message: 'Erro ao desabilitar a unidade!',
          })
        }
      }
    } catch (error) {
      setDeactivatedUnityFeedbackMessage({
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
    <DefaultLayout activePage="UNITY">
      <HeaderUser title="Gerenciar unidade" />
      <ListUnityContainer>
        <Navigation
          LinkList={[
            {
              link: '/unidade/incluir',
              active: false,
              icon: <Plus size={20} strokeWidth={2.5} />,
              text: 'Incluir nova unidade',
            },
            {
              link: '/unidade/listar',
              active: true,
              icon: <List size={20} strokeWidth={2.5} />,
              text: 'Lista de unidades',
            },
          ]}
        />
        <Box width={'full'}>
          <Heading color={'gray_700'} size={'2xlarge'}>
            Lista de unidades no sistema
          </Heading>
          <SearchBar totalCount={30} placeholder={'Pesquisar...'} />
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
                      Organização vínculada
                    </Heading>
                  </ListUnityTH>
                  <ListUnityTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      CNPJ
                    </Heading>
                  </ListUnityTH>
                  <ListUnityTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Contato
                    </Heading>
                  </ListUnityTH>
                  <ListUnityTH>
                    <Heading size={'medium'} color={'brand_800'}>
                      Tipo
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
                {unityListData?.map((unity, index) => {
                  const isLastItem = index === unityListData.length - 1

                  return (
                    <ListUnityTableRow key={unity.id}>
                      <ListUnityTD>
                        <ListUnityNameContainer>
                          <Image
                            priority
                            src={unityIcon}
                            alt="Ícone unidade"
                            height={48}
                            width={48}
                          />

                          <UnityNameInfo>
                            <Text color={'gray_700'}>{unity.name}</Text>
                            <Text color={'gray_500'}>{unity.abbreviation}</Text>
                          </UnityNameInfo>
                        </ListUnityNameContainer>
                      </ListUnityTD>
                      <ListUnityTD>
                        <ListUnityEstablishmentBoundedContainer>
                          <Image
                            priority
                            src={establishmentIcon}
                            alt="Ícone estabelecimento"
                            height={48}
                            width={48}
                          />

                          <UnityEstablishmentBoundedInfo>
                            <Text color={'gray_700'}>
                              {unity.establishmentBoundedName}
                            </Text>
                            <Text color={'gray_500'}>
                              {unity.establishmentBoundedAbbreviation}
                            </Text>
                          </UnityEstablishmentBoundedInfo>
                        </ListUnityEstablishmentBoundedContainer>
                      </ListUnityTD>
                      <ListUnityTD>
                        <Text color={'gray_700'} size={'small'}>
                          {unity.cnpj}
                        </Text>
                      </ListUnityTD>
                      <ListUnityTD>
                        <UnityContactInfo>
                          <Text color={'gray_700'}>{unity.email}</Text>
                          <Text color={'gray_500'}>{unity.mainPhone}</Text>
                        </UnityContactInfo>
                      </ListUnityTD>
                      <ListUnityTD>
                        <UnityTypeInfo>
                          <Text color={'gray_700'}>
                            {resolveUnityTypesValue(unity.type)}
                          </Text>
                          <Text color={'gray_600'}>
                            <LabelInfo>Público: </LabelInfo>
                            {resolveUnityTargetCustomerValue(
                              unity.targetCustomer,
                            )}
                          </Text>
                        </UnityTypeInfo>
                      </ListUnityTD>
                      <ListUnityTD>
                        <UnityEspecialityContainer>
                          <Text color={'gray_700'}>{unity.especiality}</Text>
                        </UnityEspecialityContainer>
                      </ListUnityTD>
                      <ListUnityTD>
                        <Text color={'gray_700'}>
                          {resolveUnityStatusValue(unity.status)}
                        </Text>
                      </ListUnityTD>
                      <ListUnityTD>
                        <UnityActionsContainer>
                          <IconButton
                            onClick={() => {
                              handleEditUnity(unity.id)
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
                                  idItemSelected: unity.id,
                                })
                              }}
                              size={'medium'}
                              variant={'icon_danger'}
                            >
                              <Trash2 />
                            </IconButton>
                            {deactivateDialog?.idItemSelected === unity.id ? (
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
                                      handleDeactivateUnity(unity.id)
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
      {deactivatedUnityFeedbackMessage ? (
        <Toast
          message={deactivatedUnityFeedbackMessage.message}
          hasTimer={true}
          type={deactivatedUnityFeedbackMessage.state}
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
  let unityListData: ResponseUnityWithPagination | null = null

  if (user != null) {
    isUserAuthenticated = true

    const response = await fetch(
      `http://localhost:3000/api/units?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    unityListData = await response.json()
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
      unityList: unityListData?.data,
      totalCount: unityListData?.totalCount,
      currentPage: page,
    },
  }
}
