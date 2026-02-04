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
import { List, Plus, Pencil, Trash2, File } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { establishmentTypeStatus } from '@/utils/constants/selectInputData'
import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import type { selectData } from '@/@types/selectData'
import { resolveEstablishmentTypeStatusValue } from '@/utils/resolvers/resolveSelectValuesToText'
import type { ResponseEstablishment } from '@/@types/responseValues/establishmentResponse'

const CreateDocumentTypeSchema = z.object({
  name: z.string().min(1, 'Informe o nome do tipo de documento'),
  abbreviation: z.string().min(1, 'Informe a abreviação do documento'),
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

const EditDocumentTypeSchema = z.object({
  name: z.string().min(1, 'Informe o nome do tipo de documento'),
  abbreviation: z.string().min(1, 'Informe a abreviação do documento'),
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

export type CreateDocumentTypeData = z.infer<typeof CreateDocumentTypeSchema>

export type EditDocumentTypeData = z.infer<typeof EditDocumentTypeSchema>

export interface DocumentType {
  id: string
  name: string
  abbreviation: string
  status: string
  establishmentRegistered?: string
  establishmentRegisteredName?: string
  establishmentRegisteredAbbreviation?: string
}

export interface DocumentTypeEditDataType {
  id?: string
  name: string
  abbreviation: string
  status: string
  establishmentRegistered?: string
  boundedTo?: string
}

interface CreateDocumentTypeProps {
  documentTypes: DocumentType[]
  establishmentList: selectData[] | null
}

interface DeactivateDialogProps {
  idItemSelected: string
}

export default function CreateDocumentType({
  documentTypes,
  establishmentList,
}: CreateDocumentTypeProps) {
  const { register, handleSubmit, formState, watch, setValue, setError } =
    useForm<CreateDocumentTypeData>({
      mode: 'onSubmit',
      resolver: zodResolver(CreateDocumentTypeSchema),
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
  } = useForm<EditDocumentTypeData>({
    mode: 'onSubmit',
    resolver: zodResolver(EditDocumentTypeSchema),
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

  const [establishmentTypeEditSelectData, setEstablishmentTypeEditSelectData] =
    useState<DocumentType | null>(null)

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const checkIfAnyDataChanged = (
    oldDocumentTypeData: DocumentTypeEditDataType,
    editedDocumentTypeData: DocumentTypeEditDataType,
  ) => {
    if (!oldDocumentTypeData) return false

    const OldDocumentTypeDataWithoutUnnecessaryData: DocumentTypeEditDataType =
      {
        ...oldDocumentTypeData,
      }
    delete OldDocumentTypeDataWithoutUnnecessaryData.id

    const NewDocumentTypeDataWithoutUnnecessaryData: DocumentTypeEditDataType =
      {
        ...editedDocumentTypeData,
      }
    delete NewDocumentTypeDataWithoutUnnecessaryData.boundedTo

    const documentTypeEditOldData = Object.entries(
      OldDocumentTypeDataWithoutUnnecessaryData,
    )

    const documentTypeEditNewData = Object.entries(
      NewDocumentTypeDataWithoutUnnecessaryData,
    )

    const hasChanges = documentTypeEditNewData.some(([key, newValue]) => {
      const oldValue = documentTypeEditOldData.find(([newKey]) => {
        return newKey === key
      })?.[1]

      if (!oldValue && !newValue) {
        return false
      }

      return oldValue !== newValue
    })

    return hasChanges
  }

  const handleCloseModalEditDocumentType = () => {
    setModalOpen(false)

    setEstablishmentTypeEditSelectData(null)

    setBoundEditSelected('ALL')

    setValueEdit('name', '')
    setValueEdit('abbreviation', '')

    setStatusEstablishmentTypeEditSelectData(establishmentTypeStatus)
    setValueEdit('status', 'ACTIVE')

    setEstablishmentListEstablishmentTypeEditSelectData(establishmentList)

    setValueEdit('establishmentRegistered', undefined)
    setValueEdit('boundedTo', 'ALL')
  }

  const handleOpenModalEditDocumentType = (
    establishmentTypeToEditCurrentData: DocumentType,
  ) => {
    setEstablishmentTypeEditSelectData(establishmentTypeToEditCurrentData)

    setValueEdit('name', establishmentTypeToEditCurrentData.name)
    setValueEdit(
      'abbreviation',
      establishmentTypeToEditCurrentData.abbreviation,
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

  const [regionalDocumentTypeListData, setRegionalDocumentTypeListData] =
    useState<DocumentType[] | null>(documentTypes)

  const [
    deactivatedEstablishmentTypeFeedbackMessage,
    setDeactivatedEstablishmentTypeFeedbackMessage,
  ] = useState<ToastFeedbackMessageType | null>(null)

  const updateRegionalDocumentTypeListData = async (token: string) => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/professionals/documents',
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
          const regionalDocumentTypeListDataUpdated = await response.json()
          setRegionalDocumentTypeListData(regionalDocumentTypeListDataUpdated)

          break
        }
      }
    } catch (error) {
      throw new Error('Erro ocorrido: ' + error)
    }
  }

  const handleDeactivateDocumentType = async (idToDeactivate: string) => {
    const { 'medap.token': token } = parseCookies()
    const dataToSend = { idRegionalDocumentTypeToDeactivate: idToDeactivate }

    setDeactivatedEstablishmentTypeFeedbackMessage(null)
    setDeactivateDialog(null)
    try {
      const response = await fetch(
        'http://localhost:3000/api/professionals/documents/deactivate',
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
          updateRegionalDocumentTypeListData(token)
          setDeactivatedEstablishmentTypeFeedbackMessage({
            state: 'success',
            message: 'Tipo de documento desativado!',
          })

          break
        }
        case 404: {
          setDeactivatedEstablishmentTypeFeedbackMessage({
            state: 'error',
            message: 'Erro ao desabilitar o tipo de documento!',
          })

          break
        }
        default: {
          setDeactivatedEstablishmentTypeFeedbackMessage({
            state: 'error',
            message: 'Erro ao desabilitar o tipo de documento!',
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
    setValue('abbreviation', '')
    setValue('status', '')
    setValue('boundedTo', 'ALL')
    setValue('establishmentRegistered', undefined)
    setBoundSelected('ALL')

    setSelectInputKey((prevKey) => prevKey + 1)
  }

  const handleCreateDocumentType = async (data: CreateDocumentTypeData) => {
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
      abbreviation: data.abbreviation,
      status: data.status,
      establishmentRegistered,
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/professionals/documents`,
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
            message: 'Documento cadastrado com sucesso!',
          })
          clearAllFields()
          updateRegionalDocumentTypeListData(token)
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
            case 'Regional document type with same name already exists': {
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

  const handleEditDocumentType = async (data: EditDocumentTypeData) => {
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
      abbreviation: data.abbreviation,
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
        `http://localhost:3000/api/professionals/documents/?id=${establishmentTypeEditSelectData?.id}`,
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
          updateRegionalDocumentTypeListData(token)

          handleCloseModalEditDocumentType()
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
    <DefaultLayout activePage="PROFESSIONAL">
      <HeaderUser title="Gerenciar documento regional" />
      <EstablishmentTypeContainer>
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
              active: false,
              icon: <List size={20} strokeWidth={2.5} />,
              text: 'Lista de profissionais',
            },
            {
              link: '/profissional/documento',
              active: true,
              icon: <File size={20} strokeWidth={2.5} />,
              text: 'Gerenciar documento regional',
            },
          ]}
        />
        <Box width={'full'}>
          <CreateEstablishmentTypeForm
            onSubmit={handleSubmit(handleCreateDocumentType)}
          >
            <EstablishmentTypeData>
              <EstablishmentTypeDataHeader>
                <Heading size={'4xlarge'} color={'gray_600'}>
                  Incluir tipo de documento
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
                <TextInput
                  inputPlaceholder="Abreviação"
                  inputWidth="full"
                  isRequired={true}
                  {...register('abbreviation')}
                  controlledPlaceholderState={!watch('abbreviation')}
                  errorMessage={formState.errors.abbreviation?.message}
                />
              </EstablishmentTypeDataFields>
              <EstablishmentTypeStatusField>
                <Text size={'xlarge'} color={'gray_600'}>
                  Status do tipo de documento
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
                  Vinculo do tipo de documento:
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
                <Button>Cadastrar tipo de documento</Button>
              </EstablishmentTypeSubmitButtonContainer>
            </EstablishmentTypeData>
          </CreateEstablishmentTypeForm>
          <ListEstablishmentTypeContainer>
            <EstablishmentTypeDataHeader>
              <Heading size={'4xlarge'} color={'gray_600'}>
                Lista tipos de documento
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
                            Abreviação
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
                      {regionalDocumentTypeListData?.map(
                        (documentType, index) => {
                          const isLastItem = index === documentTypes.length - 1

                          return (
                            <ListEstablishmentTableRow key={documentType.id}>
                              <ListEstablishmentTD>
                                <ListEstablishmentNameContainer>
                                  <Text color={'gray_700'}>
                                    {documentType.name}
                                  </Text>
                                </ListEstablishmentNameContainer>
                              </ListEstablishmentTD>
                              <ListEstablishmentTD>
                                <Text color={'gray_700'} size={'small'}>
                                  {documentType.abbreviation}
                                </Text>
                              </ListEstablishmentTD>
                              <ListEstablishmentTD>
                                {documentType.establishmentRegistered ? (
                                  <EstablishmentTypeRegisteredInfoContainer>
                                    <Text color={'brand_700'}>
                                      {documentType.establishmentRegisteredName}
                                    </Text>
                                    <Text color={'brand_550'}>
                                      {
                                        documentType.establishmentRegisteredAbbreviation
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
                                    documentType.status,
                                  )}
                                </Text>
                              </ListEstablishmentTD>
                              <ListEstablishmentTD>
                                <EstablishmentActionsContainer>
                                  <IconButton
                                    onClick={() => {
                                      handleOpenModalEditDocumentType({
                                        id: documentType.id,
                                        name: documentType.name,
                                        abbreviation: documentType.abbreviation,
                                        status: documentType.status,
                                        establishmentRegistered:
                                          documentType.establishmentRegistered,
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
                                          idItemSelected: documentType.id,
                                        })
                                      }}
                                      size={'medium'}
                                      variant={'icon_danger'}
                                    >
                                      <Trash2 />
                                    </IconButton>
                                    {deactivateDialog?.idItemSelected ===
                                    documentType.id ? (
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
                                              handleDeactivateDocumentType(
                                                documentType.id,
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
              Editar tipo de documento
            </Heading>
            <Text>
              <b>Editando:</b> {establishmentTypeEditSelectData?.name}
            </Text>
          </EditEstablishmentTypeHeaderContainer>
        }
        modalOpen={modalOpen}
        closeModal={handleCloseModalEditDocumentType}
      >
        <EditEstablishmentTypeForm
          onSubmit={handleSubmitEdit(handleEditDocumentType)}
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
              <TextInput
                inputPlaceholder="Abreviação"
                inputWidth="full"
                isRequired={true}
                {...registerEdit('abbreviation')}
                controlledPlaceholderState={!watchEdit('abbreviation')}
                errorMessage={formStateEdit.errors.abbreviation?.message}
              />
            </EstablishmentTypeDataFields>
            <EstablishmentTypeStatusField>
              <Text size={'xlarge'} color={'gray_600'}>
                Status do tipo de documento
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
                Vinculo do tipo de documento:
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

  let documentTypes: DocumentType[] | null = null
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
      `http://localhost:3000/api/professionals/documents`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (response.ok) {
      documentTypes = await response.json()
    } else {
      throw new Error('Falha em recuperar dados dos tipos de documento')
    }
  } catch (error) {
    console.error('Falha em recuperar dados do estabelecimento: ', error)
  }

  return {
    props: { documentTypes, establishmentList },
  }
}
