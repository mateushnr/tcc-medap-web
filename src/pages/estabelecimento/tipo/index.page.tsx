import DefaultLayout from '@/layouts/DefaultLayout'
import {
  Box,
  Button,
  Heading,
  IconButton,
  Modal,
  RadioInput,
  SelectInput,
  Text,
  TextInput,
} from '@medap-ui/react'
import HeaderUser from '@/components/PageStructure/HeaderUser'
import {
  LineDetail,
  CreateEstablishmentTypeForm,
  EstablishmentTypeData,
  EstablishmentTypeDataFields,
  EstablishmentTypeContainer,
  ListEstablishmentTypeContainer,
  EstablishmentTypeDataHeader,
  EstablishmentTypeAvailableForField,
  EstablishmentTypeStatusField,
  EstablishmentTypeSubmitButtonContainer,
  EstablishmentTypeBoundField,
  RadioContainer,
  EstablishmentTypeSelectBoundField,
  EstablishmentTypeListTable,
  TableContainer,
  ListEstablishmentTable,
  ListEstablishmentTableHeader,
  ListEstablishmentTH,
  ListEstablishmentTableBody,
  ListEstablishmentTableRow,
  ListEstablishmentTD,
  ListEstablishmentNameContainer,
  EstablishmentActionsContainer,
  DeactivateButtonContainer,
  DeactivateDialogInfo,
  DeactivateDialogActions,
  DeactivateDialog,
  EstablishmentTypeRegisteredInfoContainer,
  EditEstablishmentTypeHeaderContainer,
  EditEstablishmentTypeForm,
} from './styles'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { recoverUserAuthData } from '@/contexts/AuthContext'
import Navigation from '@/components/PageStructure/Navigation'
import { List, Plus, Hospital, Pencil, Trash2 } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  establishmentTypeAvailableForOptions,
  establishmentTypeStatus,
} from '@/utils/constants/selectInputData'
import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import type { selectData } from '@/@types/selectData'
import type { ResponseEstablishment } from '@/@types/responseValues/establishmentResponse'
import {
  resolveEstablishmentTypeAvailableForValue,
  resolveEstablishmentTypeStatusValue,
} from '@/utils/resolvers/resolveSelectValuesToText'

const CreateEstablishmentTypeSchema = z.object({
  name: z.string().min(1, 'Informe o nome do tipo de estabelecimento'),
  availableFor: z.string().refine(
    (value) => {
      return establishmentTypeAvailableForOptions.find((option) => {
        return option.value === value
      })
    },
    {
      message: 'Informe para quem o tipo de estabelecimento será disponível',
    },
  ),
  status: z.string().refine(
    (value) => {
      return establishmentTypeStatus.find((option) => {
        return option.value === value
      })
    },
    {
      message: 'Informe a situação do tipo do estabelecimento',
    },
  ),
  boundedTo: z.enum(['ALL', 'ESTABLISHMENT']),
  establishmentRegistered: z
    .string()
    .refine(
      (establishmentRegistered) =>
        establishmentRegistered === '' || establishmentRegistered.length > 1,
    )
    .optional(),
})

const EditEstablishmentTypeSchema = z.object({
  name: z.string().min(1, 'Informe o nome do tipo de estabelecimento'),
  availableFor: z.string().refine(
    (value) => {
      return establishmentTypeAvailableForOptions.find((option) => {
        return option.value === value
      })
    },
    {
      message: 'Informe para quem o tipo de estabelecimento será disponível',
    },
  ),
  status: z.string().refine(
    (value) => {
      return establishmentTypeStatus.find((option) => {
        return option.value === value
      })
    },
    {
      message: 'Informe a situação do tipo do estabelecimento',
    },
  ),
  boundedTo: z.enum(['ALL', 'ESTABLISHMENT']),
  establishmentRegistered: z
    .string()
    .refine(
      (establishmentRegistered) =>
        establishmentRegistered === '' || establishmentRegistered.length > 1,
    )
    .optional(),
})

export type CreateEstablishmentTypeData = z.infer<
  typeof CreateEstablishmentTypeSchema
>

export type EditEstablishmentTypeData = z.infer<
  typeof EditEstablishmentTypeSchema
>

export interface EstablishmentType {
  id: string
  name: string
  availableFor: string
  status: string
  establishmentRegistered?: string
  establishmentRegisteredName?: string
  establishmentRegisteredAbbreviation?: string
}

export interface EstablishmentTypeEditDataType {
  id?: string
  name: string
  availableFor: string
  status: string
  establishmentRegistered?: string
  boundedTo?: string
}

interface CreateEstablishmentTypeProps {
  establishmentTypes: EstablishmentType[]
  establishmentList: selectData[] | null
}

interface DeactivateDialogProps {
  idItemSelected: string
}

export default function CreateEstablishmentType({
  establishmentTypes,
  establishmentList,
}: CreateEstablishmentTypeProps) {
  const { register, handleSubmit, formState, watch, setValue, setError } =
    useForm<CreateEstablishmentTypeData>({
      mode: 'onSubmit',
      resolver: zodResolver(CreateEstablishmentTypeSchema),
      defaultValues: {
        boundedTo: 'ALL',
      },
    })

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: formStateEdit,
    watch: watchEdit,
    setValue: setValueEdit,
    setError: setErrorEdit,
  } = useForm<EditEstablishmentTypeData>({
    mode: 'onSubmit',
    resolver: zodResolver(EditEstablishmentTypeSchema),
    defaultValues: {
      boundedTo: 'ALL',
    },
  })

  const [
    statusEstablishmentTypeEditSelectData,
    setStatusEstablishmentTypeEditSelectData,
  ] = useState<selectData[]>(establishmentTypeStatus)

  const [
    establishmentListEstablishmentTypeEditSelectData,
    setEstablishmentListEstablishmentTypeEditSelectData,
  ] = useState<selectData[] | null>(establishmentList)

  const [
    availableForEstablishmentTypeEditSelectData,
    setAvailableForEstablishmentTypeEditSelectData,
  ] = useState<selectData[]>(establishmentTypeAvailableForOptions)

  const [establishmentTypeEditSelectData, setEstablishmentTypeEditSelectData] =
    useState<EstablishmentType | null>(null)

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const checkIfAnyDataChanged = (
    oldEstablishmentTypeData: EstablishmentTypeEditDataType,
    editedEstablishmentTypeData: EstablishmentTypeEditDataType,
  ) => {
    if (!oldEstablishmentTypeData) return false

    const OldEstablishmentTypeDataWithoutUnnecessaryData: EstablishmentTypeEditDataType =
      {
        ...oldEstablishmentTypeData,
      }
    delete OldEstablishmentTypeDataWithoutUnnecessaryData.id

    const NewEstablishmentTypeDataWithoutUnnecessaryData: EstablishmentTypeEditDataType =
      {
        ...editedEstablishmentTypeData,
      }
    delete NewEstablishmentTypeDataWithoutUnnecessaryData.boundedTo

    const establishmentTypeEditOldData = Object.entries(
      OldEstablishmentTypeDataWithoutUnnecessaryData,
    )

    const establishmentTypeEditNewData = Object.entries(
      NewEstablishmentTypeDataWithoutUnnecessaryData,
    )

    const hasChanges = establishmentTypeEditNewData.some(([key, newValue]) => {
      const oldValue = establishmentTypeEditOldData.find(([newKey]) => {
        return newKey === key
      })?.[1]

      if (!oldValue && !newValue) {
        return false
      }

      return oldValue !== newValue
    })

    return hasChanges
  }

  const handleCloseModalEditEstablishmentType = () => {
    setModalOpen(false)

    setEstablishmentTypeEditSelectData(null)

    setBoundEditSelected('ALL')

    setValueEdit('name', '')

    setAvailableForEstablishmentTypeEditSelectData(
      establishmentTypeAvailableForOptions,
    )

    setValueEdit('availableFor', 'ESTABLISHMENT')

    setStatusEstablishmentTypeEditSelectData(establishmentTypeStatus)
    setValueEdit('status', 'ACTIVE')

    setEstablishmentListEstablishmentTypeEditSelectData(establishmentList)

    setValueEdit('establishmentRegistered', undefined)
    setValueEdit('boundedTo', 'ALL')
  }

  const handleOpenModalEditEstablishmentType = (
    establishmentTypeToEditCurrentData: EstablishmentType,
  ) => {
    setEstablishmentTypeEditSelectData(establishmentTypeToEditCurrentData)

    setValueEdit('name', establishmentTypeToEditCurrentData.name)

    setAvailableForEstablishmentTypeEditSelectData((prev) => {
      return prev.map((option) => {
        return option.value === establishmentTypeToEditCurrentData.availableFor
          ? { text: option.text, value: option.value, selected: true }
          : option
      })
    })
    setValueEdit(
      'availableFor',
      establishmentTypeToEditCurrentData.availableFor,
    )

    setStatusEstablishmentTypeEditSelectData((prev) => {
      return prev.map((option) => {
        return option.value === establishmentTypeToEditCurrentData.status
          ? { text: option.text, value: option.value, selected: true }
          : option
      })
    })
    setValueEdit('status', establishmentTypeToEditCurrentData.status)

    setEstablishmentListEstablishmentTypeEditSelectData((prev) => {
      if (prev) {
        return prev.map((option) => {
          return option.value ===
            establishmentTypeToEditCurrentData.establishmentRegistered
            ? { text: option.text, value: option.value, selected: true }
            : option
        })
      }
      return null
    })

    setValueEdit(
      'establishmentRegistered',
      establishmentTypeToEditCurrentData.establishmentRegistered || undefined,
    )

    if (establishmentTypeToEditCurrentData.establishmentRegistered) {
      setValueEdit('boundedTo', 'ESTABLISHMENT')
      setBoundEditSelected('ESTABLISHMENT')
    } else {
      setValueEdit('boundedTo', 'ALL')
      setBoundEditSelected('ALL')
    }

    setModalOpen(true)
  }

  const [
    createdEstablishmentTypeFeedbackMessage,
    setCreatedEstablishmentTypeFeedbackMessage,
  ] = useState<ToastFeedbackMessageType | null>(null)

  const [selectInputKey, setSelectInputKey] = useState(0)

  const [boundSelected, setBoundSelected] = useState<string>('ALL')
  const [boundEditSelected, setBoundEditSelected] = useState<string>('ALL')

  const handleRadioOptionClick = (e: MouseEvent<HTMLInputElement>) => {
    const radioOption = e.target as HTMLInputElement
    setBoundSelected(radioOption.value)
  }

  const handleRadioOptionEditClick = (e: MouseEvent<HTMLInputElement>) => {
    const radioOption = e.target as HTMLInputElement
    setBoundEditSelected(radioOption.value)
  }

  const [deactivateDialog, setDeactivateDialog] =
    useState<DeactivateDialogProps | null>(null)

  const [establishmentTypeListData, setEstablishmentTypeListData] = useState<
    EstablishmentType[] | null
  >(establishmentTypes)

  const [
    deactivatedEstablishmentTypeFeedbackMessage,
    setDeactivatedEstablishmentTypeFeedbackMessage,
  ] = useState<ToastFeedbackMessageType | null>(null)

  const updateEstablishmentTypeListData = async (token: string) => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/establishments/types',
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
          const establishmentTypeListDataUpdated = await response.json()
          setEstablishmentTypeListData(establishmentTypeListDataUpdated)

          break
        }
      }
    } catch (error) {
      throw new Error('Erro ocorrido: ' + error)
    }
  }

  const handleDeactivateEstablishmentType = async (idToDeactivate: string) => {
    const { 'medap.token': token } = parseCookies()
    const dataToSend = { idEstablishmentTypeToDeactivate: idToDeactivate }

    setDeactivatedEstablishmentTypeFeedbackMessage(null)
    setDeactivateDialog(null)
    try {
      const response = await fetch(
        'http://localhost:3000/api/establishments/types/deactivate',
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
          updateEstablishmentTypeListData(token)
          setDeactivatedEstablishmentTypeFeedbackMessage({
            state: 'success',
            message: 'Tipo de estabelecimento desativado!',
          })

          break
        }
        case 404: {
          setDeactivatedEstablishmentTypeFeedbackMessage({
            state: 'error',
            message: 'Erro ao desabilitar o tipo de estabelecimento!',
          })

          break
        }
        default: {
          setDeactivatedEstablishmentTypeFeedbackMessage({
            state: 'error',
            message: 'Erro ao desabilitar o tipo de estabelecimento!',
          })
        }
      }
    } catch (error) {
      setDeactivatedEstablishmentTypeFeedbackMessage({
        state: 'error',
        message: 'Erro no servidor!',
      })
    }
  }

  const DeactivateButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
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

  const clearAllFields = () => {
    setValue('name', '')
    setValue('availableFor', '')
    setValue('status', '')
    setValue('boundedTo', 'ALL')
    setValue('establishmentRegistered', undefined)
    setBoundSelected('ALL')

    setSelectInputKey((prevKey) => prevKey + 1)
  }

  const handleCreateEstablishmentType = async (
    data: CreateEstablishmentTypeData,
  ) => {
    const { 'medap.token': token } = parseCookies()
    setCreatedEstablishmentTypeFeedbackMessage(null)

    let establishmentRegistered

    if (data.boundedTo === 'ESTABLISHMENT') {
      if (!data.establishmentRegistered) {
        setError(
          'establishmentRegistered',
          { message: 'Selecione um estabelecimento' },
          { shouldFocus: true },
        )

        return
      }

      establishmentRegistered = data.establishmentRegistered
    }

    const dataToSend = {
      name: data.name,
      availableFor: data.availableFor,
      status: data.status,
      establishmentRegistered,
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/establishments/types`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        },
      )
      switch (response.status) {
        case 201: {
          setCreatedEstablishmentTypeFeedbackMessage({
            state: 'success',
            message: 'Estabelecimento cadastrado com sucesso!',
          })
          clearAllFields()
          updateEstablishmentTypeListData(token)
          break
        }
        case 409: {
          const errorData = await response.json()
          const errorMessage = errorData.message
          setCreatedEstablishmentTypeFeedbackMessage({
            state: 'warning',
            message: 'Houve um conflito com os dados cadastrados.',
          })
          switch (errorMessage) {
            case 'Establishment type with same name already exists': {
              setError(
                'name',
                { message: 'Nome já cadastrado' },
                { shouldFocus: true },
              )
              break
            }
            default: {
              setCreatedEstablishmentTypeFeedbackMessage({
                state: 'error',
                message: 'Houve um conflito inesperado',
              })
              break
            }
          }
          break
        }
        default: {
          setCreatedEstablishmentTypeFeedbackMessage({
            state: 'error',
            message: 'Ocorreu um erro inesperado, tente novamente.',
          })
        }
      }
    } catch (error) {
      setCreatedEstablishmentTypeFeedbackMessage({
        state: 'error',
        message: 'Ocorreu um erro no servidor',
      })
    }
  }

  const handleEditEstablishmentType = async (
    data: EditEstablishmentTypeData,
  ) => {
    const { 'medap.token': token } = parseCookies()
    setCreatedEstablishmentTypeFeedbackMessage(null)

    let establishmentRegistered

    if (data.boundedTo === 'ESTABLISHMENT') {
      if (!data.establishmentRegistered) {
        setErrorEdit(
          'establishmentRegistered',
          { message: 'Selecione um estabelecimento' },
          { shouldFocus: true },
        )

        return
      }

      establishmentRegistered = data.establishmentRegistered
    }

    const dataToSend = {
      name: data.name,
      availableFor: data.availableFor,
      status: data.status,
      establishmentRegistered,
    }

    if (establishmentTypeEditSelectData) {
      if (!checkIfAnyDataChanged(establishmentTypeEditSelectData, dataToSend)) {
        setTimeout(() => {
          setCreatedEstablishmentTypeFeedbackMessage({
            state: 'warning',
            message: 'Nada foi modificado para ser atualizado',
          })
        }, 1)

        return
      }
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/establishments/types/?id=${establishmentTypeEditSelectData?.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        },
      )
      switch (response.status) {
        case 200: {
          setCreatedEstablishmentTypeFeedbackMessage({
            state: 'success',
            message: 'Tipo de estabelecimento editado com sucesso!',
          })
          clearAllFields()
          updateEstablishmentTypeListData(token)

          handleCloseModalEditEstablishmentType()
          break
        }
        case 409: {
          const errorData = await response.json()
          const errorMessage = errorData.message

          setCreatedEstablishmentTypeFeedbackMessage({
            state: 'warning',
            message: 'Houve um conflito com os dados cadastrados.',
          })

          switch (errorMessage) {
            case 'Establishment type with same name already exists': {
              setErrorEdit(
                'name',
                { message: 'Nome já cadastrado' },
                { shouldFocus: true },
              )
              break
            }
            default: {
              setCreatedEstablishmentTypeFeedbackMessage({
                state: 'error',
                message: 'Houve um conflito inesperado',
              })
              break
            }
          }
          break
        }
        default: {
          setCreatedEstablishmentTypeFeedbackMessage({
            state: 'error',
            message: 'Ocorreu um erro inesperado, tente novamente.',
          })
        }
      }
    } catch (error) {
      setCreatedEstablishmentTypeFeedbackMessage({
        state: 'error',
        message: 'Ocorreu um erro no servidor',
      })
    }
  }

  return (
    <DefaultLayout activePage="ESTABLISHMENT">
      <HeaderUser title="Gerenciar estabelecimento" />
      <EstablishmentTypeContainer>
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
              active: false,
              icon: <List size={20} strokeWidth={2.5} />,
              text: 'Lista de estabelecimentos',
            },
            {
              link: '/estabelecimento/tipo',
              active: true,
              icon: <Hospital size={20} strokeWidth={2} />,
              text: 'Gerenciar tipo de estabelecimento',
            },
          ]}
        />
        <Box width={'full'}>
          <CreateEstablishmentTypeForm
            onSubmit={handleSubmit(handleCreateEstablishmentType)}
          >
            <EstablishmentTypeData>
              <EstablishmentTypeDataHeader>
                <Heading size={'4xlarge'} color={'gray_600'}>
                  Incluir tipo de estabelecimento
                </Heading>
                <LineDetail />
              </EstablishmentTypeDataHeader>
              <EstablishmentTypeDataFields>
                <TextInput
                  inputPlaceholder="Nome"
                  inputWidth="full"
                  isRequired={true}
                  {...register('name')}
                  controlledPlaceholderState={!watch('name')}
                  errorMessage={formState.errors.name?.message}
                />
              </EstablishmentTypeDataFields>
              <EstablishmentTypeAvailableForField>
                <Text size={'xlarge'} color={'gray_600'}>
                  O tipo do estabelecimento estará disponível no cadastro de:
                </Text>
                <SelectInput
                  key={selectInputKey}
                  optionsList={establishmentTypeAvailableForOptions}
                  inputWidth="full"
                  {...register('availableFor')}
                  controlledPlaceholderState={!watch('availableFor')}
                  errorMessage={formState.errors.availableFor?.message}
                  handleSelectedInputChange={(selectedValue: string) => {
                    setValue('availableFor', selectedValue)
                    setError('availableFor', { message: '' })
                  }}
                />
              </EstablishmentTypeAvailableForField>
              <EstablishmentTypeStatusField>
                <Text size={'xlarge'} color={'gray_600'}>
                  Status do tipo de estabelecimento
                </Text>

                <SelectInput
                  key={selectInputKey}
                  optionsList={establishmentTypeStatus}
                  isRequired
                  {...register('status')}
                  controlledPlaceholderState={!watch('status')}
                  errorMessage={formState.errors.status?.message}
                  handleSelectedInputChange={(selectedValue: string) => {
                    setValue('status', selectedValue)
                  }}
                />
              </EstablishmentTypeStatusField>
              <EstablishmentTypeBoundField>
                <Text size={'xlarge'} color={'gray_600'}>
                  Vinculo do tipo de estabelecimento:
                </Text>
                <RadioContainer>
                  <RadioInput
                    radioId="boundAll"
                    labelText="Disponível para todos"
                    variant="box"
                    radioSize={'small'}
                    {...register('boundedTo')}
                    value="ALL"
                    onClick={handleRadioOptionClick}
                  />
                  <RadioInput
                    radioId="boundEstablishment"
                    labelText="Vincular a um estabelecimento específico"
                    variant="box"
                    radioSize={'small'}
                    {...register('boundedTo')}
                    value="ESTABLISHMENT"
                    onClick={handleRadioOptionClick}
                  />
                </RadioContainer>
                {boundSelected === 'ESTABLISHMENT' ? (
                  <EstablishmentTypeSelectBoundField>
                    <Text size={'xlarge'} color={'gray_600'}>
                      Selecione o estabelecimento:
                    </Text>
                    <SelectInput
                      key={selectInputKey}
                      optionsList={establishmentList || undefined}
                      isRequired
                      inputPlaceholder="Selecione o estabelecimento"
                      inputWidth="full"
                      hasSearch={true}
                      {...register('establishmentRegistered')}
                      controlledPlaceholderState={
                        !watch('establishmentRegistered')
                      }
                      errorMessage={
                        formState.errors.establishmentRegistered?.message
                      }
                      handleSelectedInputChange={(selectedValue: string) => {
                        setValue('establishmentRegistered', selectedValue)
                        setError('establishmentRegistered', { message: '' })
                      }}
                    />
                  </EstablishmentTypeSelectBoundField>
                ) : null}
              </EstablishmentTypeBoundField>
              <EstablishmentTypeSubmitButtonContainer>
                <Button>Cadastrar tipo de estabelecimento</Button>
              </EstablishmentTypeSubmitButtonContainer>
            </EstablishmentTypeData>
          </CreateEstablishmentTypeForm>
          <ListEstablishmentTypeContainer>
            <EstablishmentTypeDataHeader>
              <Heading size={'4xlarge'} color={'gray_600'}>
                Lista tipos de estabelecimento
              </Heading>
              <LineDetail />
            </EstablishmentTypeDataHeader>
            <Box variant={'box_secondary'}>
              <EstablishmentTypeListTable>
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
                            Cadastro disponível
                          </Heading>
                        </ListEstablishmentTH>
                        <ListEstablishmentTH>
                          <Heading size={'medium'} color={'brand_800'}>
                            Vinculo
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
                      {establishmentTypeListData?.map(
                        (establishmentType, index) => {
                          const isLastItem =
                            index === establishmentTypes.length - 1

                          return (
                            <ListEstablishmentTableRow
                              key={establishmentType.id}
                            >
                              <ListEstablishmentTD>
                                <ListEstablishmentNameContainer>
                                  <Text color={'gray_700'}>
                                    {establishmentType.name}
                                  </Text>
                                </ListEstablishmentNameContainer>
                              </ListEstablishmentTD>
                              <ListEstablishmentTD>
                                <Text color={'gray_700'} size={'small'}>
                                  {resolveEstablishmentTypeAvailableForValue(
                                    establishmentType.availableFor,
                                  )}
                                </Text>
                              </ListEstablishmentTD>
                              <ListEstablishmentTD>
                                {establishmentType.establishmentRegistered ? (
                                  <EstablishmentTypeRegisteredInfoContainer>
                                    <Text color={'brand_700'}>
                                      {
                                        establishmentType.establishmentRegisteredName
                                      }
                                    </Text>
                                    <Text color={'brand_550'}>
                                      {
                                        establishmentType.establishmentRegisteredAbbreviation
                                      }
                                    </Text>
                                  </EstablishmentTypeRegisteredInfoContainer>
                                ) : (
                                  <Text
                                    fontWeight={'black'}
                                    color={'brand_600'}
                                  >
                                    Global
                                  </Text>
                                )}
                              </ListEstablishmentTD>
                              <ListEstablishmentTD>
                                <Text color={'gray_700'}>
                                  {resolveEstablishmentTypeStatusValue(
                                    establishmentType.status,
                                  )}
                                </Text>
                              </ListEstablishmentTD>
                              <ListEstablishmentTD>
                                <EstablishmentActionsContainer>
                                  <IconButton
                                    onClick={() => {
                                      handleOpenModalEditEstablishmentType({
                                        id: establishmentType.id,
                                        name: establishmentType.name,
                                        availableFor:
                                          establishmentType.availableFor,
                                        status: establishmentType.status,
                                        establishmentRegistered:
                                          establishmentType.establishmentRegistered,
                                      })
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
                                          idItemSelected: establishmentType.id,
                                        })
                                      }}
                                      size={'medium'}
                                      variant={'icon_danger'}
                                    >
                                      <Trash2 />
                                    </IconButton>
                                    {deactivateDialog?.idItemSelected ===
                                    establishmentType.id ? (
                                      <DeactivateDialog
                                        ref={DeactivateButtonRef}
                                        isLastItem={isLastItem}
                                      >
                                        <DeactivateDialogInfo>
                                          <Text color={'gray_700'}>
                                            Você está preste a desativar o item
                                            selecionado
                                          </Text>
                                          <Text
                                            size={'small'}
                                            color={'gray_600'}
                                          >
                                            Tem certeza disso?
                                          </Text>
                                        </DeactivateDialogInfo>

                                        <DeactivateDialogActions>
                                          <Button
                                            variant={'danger_primary'}
                                            size={'small'}
                                            onClick={() => {
                                              handleDeactivateEstablishmentType(
                                                establishmentType.id,
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
                        },
                      )}
                    </ListEstablishmentTableBody>
                  </ListEstablishmentTable>
                </TableContainer>
              </EstablishmentTypeListTable>
            </Box>
          </ListEstablishmentTypeContainer>
        </Box>
      </EstablishmentTypeContainer>
      {deactivatedEstablishmentTypeFeedbackMessage ? (
        <Toast
          message={deactivatedEstablishmentTypeFeedbackMessage.message}
          hasTimer={true}
          type={deactivatedEstablishmentTypeFeedbackMessage.state}
        />
      ) : null}
      {createdEstablishmentTypeFeedbackMessage ? (
        <Toast
          message={createdEstablishmentTypeFeedbackMessage.message}
          hasTimer={true}
          type={createdEstablishmentTypeFeedbackMessage.state}
        />
      ) : null}
      <Modal
        variant={'withHeader'}
        childrenHeader={
          <EditEstablishmentTypeHeaderContainer>
            <Heading size={'4xlarge'} color={'gray_600'}>
              Editar tipo de estabelecimento
            </Heading>
            <Text>
              <b>Editando:</b> {establishmentTypeEditSelectData?.name}
            </Text>
          </EditEstablishmentTypeHeaderContainer>
        }
        modalOpen={modalOpen}
        closeModal={handleCloseModalEditEstablishmentType}
      >
        <EditEstablishmentTypeForm
          onSubmit={handleSubmitEdit(handleEditEstablishmentType)}
        >
          <EstablishmentTypeData>
            <EstablishmentTypeDataFields>
              <TextInput
                inputPlaceholder="Nome"
                inputWidth="full"
                isRequired={true}
                {...registerEdit('name')}
                controlledPlaceholderState={!watchEdit('name')}
                errorMessage={formStateEdit.errors.name?.message}
              />
            </EstablishmentTypeDataFields>
            <EstablishmentTypeAvailableForField>
              <Text size={'xlarge'} color={'gray_600'}>
                O tipo do estabelecimento estará disponível no cadastro de:
              </Text>
              <SelectInput
                key={selectInputKey}
                optionsList={availableForEstablishmentTypeEditSelectData}
                inputWidth="full"
                {...registerEdit('availableFor')}
                controlledPlaceholderState={!watchEdit('availableFor')}
                errorMessage={formStateEdit.errors.availableFor?.message}
                handleSelectedInputChange={(selectedValue: string) => {
                  setValueEdit('availableFor', selectedValue)
                  setErrorEdit('availableFor', { message: '' })
                }}
              />
            </EstablishmentTypeAvailableForField>
            <EstablishmentTypeStatusField>
              <Text size={'xlarge'} color={'gray_600'}>
                Status do tipo de estabelecimento
              </Text>

              <SelectInput
                key={selectInputKey}
                optionsList={statusEstablishmentTypeEditSelectData}
                isRequired
                {...registerEdit('status')}
                controlledPlaceholderState={!watchEdit('status')}
                errorMessage={formStateEdit.errors.status?.message}
                handleSelectedInputChange={(selectedValue: string) => {
                  setValueEdit('status', selectedValue)
                }}
              />
            </EstablishmentTypeStatusField>
            <EstablishmentTypeBoundField>
              <Text size={'xlarge'} color={'gray_600'}>
                Vinculo do tipo de estabelecimento:
              </Text>
              <RadioContainer>
                <RadioInput
                  radioId="boundAllEdit"
                  labelText="Disponível para todos"
                  variant="box"
                  radioSize={'small'}
                  {...registerEdit('boundedTo')}
                  value="ALL"
                  onClick={handleRadioOptionEditClick}
                />
                <RadioInput
                  radioId="boundEstablishmentEdit"
                  labelText="Vincular a um estabelecimento específico"
                  variant="box"
                  radioSize={'small'}
                  {...registerEdit('boundedTo')}
                  value="ESTABLISHMENT"
                  onClick={handleRadioOptionEditClick}
                />
              </RadioContainer>
              {boundEditSelected === 'ESTABLISHMENT' ? (
                <EstablishmentTypeSelectBoundField>
                  <Text size={'xlarge'} color={'gray_600'}>
                    Selecione o estabelecimento:
                  </Text>
                  <SelectInput
                    key={selectInputKey}
                    optionsList={
                      establishmentListEstablishmentTypeEditSelectData ||
                      undefined
                    }
                    isRequired
                    inputPlaceholder="Selecione o estabelecimento"
                    inputWidth="full"
                    hasSearch={true}
                    {...registerEdit('establishmentRegistered')}
                    controlledPlaceholderState={
                      !watchEdit('establishmentRegistered')
                    }
                    errorMessage={
                      formStateEdit.errors.establishmentRegistered?.message
                    }
                    handleSelectedInputChange={(selectedValue: string) => {
                      setValueEdit('establishmentRegistered', selectedValue)
                      setErrorEdit('establishmentRegistered', { message: '' })
                    }}
                  />
                </EstablishmentTypeSelectBoundField>
              ) : null}
            </EstablishmentTypeBoundField>
            <EstablishmentTypeSubmitButtonContainer>
              <Button>Confirmar e editar</Button>
            </EstablishmentTypeSubmitButtonContainer>
          </EstablishmentTypeData>
        </EditEstablishmentTypeForm>
      </Modal>
    </DefaultLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'medap.token': token } = parseCookies(context)

  let isUserAuthenticated = false

  const user = await recoverUserAuthData(token)

  let establishmentTypes: EstablishmentType | null = null
  let establishments: ResponseEstablishment[] | null = null
  let establishmentList: selectData[] | null = null

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

  try {
    const response = await fetch('http://localhost:3000/api/establishments', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      establishments = await response.json()
    } else {
      throw new Error('Falha em recuperar dados dos estabelecimento')
    }
  } catch (error) {
    console.error('Falha em recuperar dados do estabelecimento: ', error)
  }

  if (establishments) {
    establishmentList = establishments.map((establishment) => {
      return { text: establishment.name, value: establishment.id }
    })
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/establishments/types/?availableFor=all`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (response.ok) {
      establishmentTypes = await response.json()
    } else {
      throw new Error('Falha em recuperar dados dos tipos de estabelecimento')
    }
  } catch (error) {
    console.error('Falha em recuperar dados do estabelecimento: ', error)
  }

  return {
    props: { establishmentTypes, establishmentList },
  }
}
