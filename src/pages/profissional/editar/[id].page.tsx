import DefaultLayout from '@/layouts/DefaultLayout'
import {
  Box,
  Button,
  DateInput,
  Heading,
  IconButton,
  RadioInput,
  SelectInput,
  Text,
  TextArea,
  TextInput,
} from '@medap-ui/react'
import HeaderUser from '@/components/PageStructure/HeaderUser'
import {
  AddressData,
  AddressDataFields,
  FormContainer,
  LineDetail,
  ProfessionalData,
  ProfessionalDataHeader,
  AddressDataCoordinateFields,
  FillWithCepContainer,
  ProfessionalDataFields,
  ProfessionalBirthDateField,
  ProfessionalStatusField,
  TabLink,
  FormTabContent,
  FormTabMenuNavigation,
  FormTabMenuContainer,
  ProfessionalBirthDateAndStatusContainer,
  ProfessionalCredentialsContainer,
  ProfessionalEstablishmentField,
  ProfessionalUnityField,
  BoundToUnityContainer,
  ContainerOptionsBoundToUnity,
  RadioOptionContainer,
  RadioOption,
  LabelRadioOption,
  ProfessionalRoleField,
  Detail,
  ProfessionalDocumentFields,
  DocumentTypeField,
  AddNewDocumentTypeButtonContainer,
  AddNewDocumentTypeDialog,
  AddNewDocumentTypeDialogInfo,
  AddNewDocumentTypeDialogActions,
  EditProfessionalContainer,
  ProfessionalBeingEditedContainer,
  ProfessionalInfoContainer,
  ProfessionalNameInfo,
  ContainerCancelAction,
  EditingLabel,
  EditProfessionalForm,
  RadioContainer,
} from './styles'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { recoverUserAuthData } from '@/contexts/AuthContext'
import { Pencil, Plus } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { handlePhoneChange } from '@/utils/formatters/phone'
import { handleFloatNumberChange } from '@/utils/formatters/floatNumber'
import { handleOnlyDigitsChange } from '@/utils/formatters/onlyDigits'
import { handleCepChange } from '@/utils/formatters/cep'
import {
  addressBrazilStates,
  professionalRoles,
  professionalStatus,
  unityStatus,
} from '@/utils/constants/selectInputData'
import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { searchAddressWithPostCode } from '@/lib/postCode.api'
import { viaCepResponseType } from '@/@types/address'
import { selectData } from '@/@types/selectData'
import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import type { ResponseEstablishment } from '@/@types/responseValues/establishmentResponse'
import { handleCpfChange, isValidCPF } from '@/utils/formatters/cpf'
import { useRouter } from 'next/router'
import type { DocumentType } from '../documento/index.page'
import userIcon from '@/assets/images/icon-user.svg'
import {
  resolveDocumentTypesToSelectInputType,
  resolveUnityListToSelectInputType,
} from '@/utils/resolvers/resolveDataToSelectInputType'
import Image from 'next/image'

export interface UnityFromEstablishmentResponse {
  id: string
  name: string
  abbreviation?: string
  cnpj?: string
  email: string
  especiality?: string
  mainPhone: string
  secondaryPhone?: string
  status: string
  targetCustomer: string
  type: string
  unityAddress?: string
  unityEstablishment: string
}

export interface ResponseProfessionalWithAddress {
  id?: string
  name: string
  email: string
  phone: string
  cpf: string
  especiality?: string
  birthDate?: string
  role: string
  status: string
  boundedTo: 'ESTABLISHMENT' | 'UNITY'
  regionalDocumentType?: string
  regionalDocument?: string
  stateDocumentIssued?: string
  unityBounded?: string
  establishmentBounded: string
  professionalAddress?: string
  postCode?: string
  street?: string
  neighborhood?: string
  number?: number
  state?: string
  latitude?: number
  longitude?: number
  city?: string
  compliment?: string
}

const EditProfessionalSchema = z
  .object({
    name: z.string().min(1, 'Informe o nome do profissional'),
    email: z
      .string()
      .min(1, 'Informe o email')
      .refine((value) => {
        const regex =
          /^[a-zA-Z0-9!#$%&'*/=?^._+\-`{|}~\\]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
        return regex.test(value)
      }, 'Email inválido'),
    phone: z
      .string()
      .min(1, 'Informe o telefone')
      .min(13, 'Telefone incompleto'),
    cpf: z.string().min(1, 'Informe o cpf').refine(isValidCPF, 'CPF inválido'),
    password: z
      .string()
      .refine(
        (password) => password === '' || password.length >= 6,
        'A senha deve ter no mínimo 6 digitos',
      )
      .optional(),
    confirmPassword: z.string().optional(),
    especiality: z.string().optional(),
    birthDate: z.string().optional(),
    role: z.string().refine(
      (value) => {
        return professionalRoles.find((option) => {
          return option.value === value
        })
      },
      {
        message: 'Selecione alguma função',
      },
    ),
    regionalDocumentType: z.string().optional(),
    regionalDocument: z.string().optional(),
    stateDocumentIssued: z.string().optional(),
    establishmentBounded: z
      .string()
      .uuid('Selecione algum estabelecimento para vincular ao profissional'),
    unityBounded: z.string().optional(),
    boundedTo: z.enum(['ESTABLISHMENT', 'UNITY']),
    status: z.string().refine(
      (value) => {
        return unityStatus.find((option) => {
          return option.value === value
        })
      },
      {
        message: 'Informe a situação do profissional',
      },
    ),
    passwordState: z.enum(['KEEP', 'CHANGE']).optional(),
    postCode: z.string().optional(),
    street: z.string().optional(),
    number: z
      .any()
      .optional()
      .transform((val) => (val ? parseInt(val) : null)),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    compliment: z.string().optional(),
    latitude: z
      .any()
      .optional()
      .transform((val) => (val ? parseFloat(val) : null)),
    longitude: z
      .any()
      .optional()
      .transform((val) => (val ? parseFloat(val) : null)),
  })
  .refine(
    (data) =>
      (data.passwordState === 'CHANGE' && data.password !== '') ||
      (data.passwordState === 'KEEP' &&
        data.password === '' &&
        data.confirmPassword === ''),
    {
      message: 'Preencha a nova senha',
      path: ['password'],
    },
  )
  .refine(
    (data) =>
      (data.passwordState === 'CHANGE' &&
        data.password === data.confirmPassword &&
        data.password !== '') ||
      (data.passwordState === 'CHANGE' && data.password === '') ||
      (data.passwordState === 'KEEP' &&
        data.password === '' &&
        data.confirmPassword === ''),
    {
      message: 'A confirmação da nova senha não confere',
      path: ['confirmPassword'],
    },
  )

export type EditProfessionalData = z.infer<typeof EditProfessionalSchema>

interface EditProfessionalProps {
  professionalToEditData: ResponseProfessionalWithAddress | null
  establishmentList: selectData[] | null
  documentTypes: DocumentType[]
}

export default function EditProfessional({
  professionalToEditData,
  establishmentList,
  documentTypes,
}: EditProfessionalProps) {
  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<EditProfessionalData>({
    mode: 'onSubmit',
    resolver: zodResolver(EditProfessionalSchema),
    defaultValues: {
      boundedTo: 'ESTABLISHMENT',
      passwordState: 'KEEP',
    },
  })

  const [fillWithCepFeedbackMessage, setFillWithCepFeedbackMessage] =
    useState<string>('')

  const [fillWithCepButtonLoadingState, setFillWithCepButtonLoadingState] =
    useState<boolean>(false)

  const [stateSelectData, setStateSelectData] =
    useState<selectData[]>(addressBrazilStates)

  const [documentStateIssuedSelectData, setDocumentStateIssuedSelectData] =
    useState<selectData[]>(addressBrazilStates)

  const [statusSelectData, setStatusSelectData] =
    useState<selectData[]>(professionalStatus)

  const [establishmentBoundedSelectData, setEstablishmentBoundedSelectData] =
    useState<selectData[] | null>(establishmentList)

  const [roleSelectData, setRoleSelectData] =
    useState<selectData[]>(professionalRoles)

  const [unityBoundedSelectData, setUnityBoundedSelectData] = useState<
    selectData[] | null
  >(null)

  const [documentTypeSelectData, setDocumentTypeSelectData] = useState<
    selectData[] | null
  >(resolveDocumentTypesToSelectInputType(documentTypes))

  const [passwordChangeOptionSelected, setPasswordChangeOptionSelected] =
    useState<string>('ALL')

  const handleRadioOptionClick = (e: MouseEvent<HTMLInputElement>) => {
    const radioOption = e.target as HTMLInputElement
    setPasswordChangeOptionSelected(radioOption.value)

    if (radioOption.value === 'KEEP') {
      setValue('password', '')
      setValue('confirmPassword', '')

      clearErrors(['password', 'confirmPassword'])
    }
  }

  const [
    editedProfessionalFeedbackMessage,
    setEditedProfessionalFeedbackMessage,
  ] = useState<ToastFeedbackMessageType | null>(null)

  const [currentFormTab, setCurrentFormTab] =
    useState<string>('especialization')

  const [selectUnityInputKey, setSelectUnityInputKey] = useState(0)

  const [establishmentSelected, setEstablishmentSelected] = useState<
    string | undefined
  >(professionalToEditData?.establishmentBounded)

  const [roleSelected, setRoleSelected] = useState<string>(watch('role'))

  const [addNewDocumentTypeDialog, setAddNewDocumentTypeDialog] =
    useState<boolean>(false)

  const AddNewDocumentTypeTooltipRef = useRef<HTMLDivElement>(null)

  const roleHealthProfessionalTarget = [
    'RESPONSIBLE',
    'MANAGER',
    'HEALTH_PROFESSIONAL',
  ]

  const router = useRouter()

  const handleCancelEditProfessional = () => {
    router.back()
  }

  const fillAllFieldsWithProfessionalData = useCallback(async () => {
    if (professionalToEditData) {
      let unitsFromEstablishmentList: UnityFromEstablishmentResponse[] | null =
        null

      let unitsFromEstablishmentListSelectData: selectData[] | null = null

      if (professionalToEditData.establishmentBounded) {
        const { 'medap.token': token } = parseCookies()

        const response = await fetch(
          `http://localhost:3000/api/units/from-establishment/?id=${professionalToEditData.establishmentBounded}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        unitsFromEstablishmentList = await response.json()

        unitsFromEstablishmentListSelectData =
          resolveUnityListToSelectInputType(unitsFromEstablishmentList)
      }

      setValue('name', professionalToEditData.name)
      setValue('email', professionalToEditData.email)
      setValue('phone', professionalToEditData.phone)
      setValue('cpf', professionalToEditData.cpf)
      setValue('especiality', professionalToEditData.especiality || '')
      setValue('birthDate', professionalToEditData.birthDate || '')
      setValue(
        'regionalDocument',
        professionalToEditData.regionalDocument || '',
      )
      setValue('password', '')
      setValue('confirmPassword', '')

      setValue('boundedTo', professionalToEditData.boundedTo)

      setUnityBoundedSelectData(() => {
        if (unitsFromEstablishmentListSelectData?.length) {
          return unitsFromEstablishmentListSelectData.map((option) => {
            return option.value === professionalToEditData.unityBounded
              ? { text: option.text, value: option.value, selected: true }
              : option
          })
        }

        return null
      })
      setValue('unityBounded', professionalToEditData.unityBounded || '')

      setEstablishmentBoundedSelectData((prev) => {
        if (prev) {
          return prev.map((option) => {
            return option.value === professionalToEditData.establishmentBounded
              ? { text: option.text, value: option.value, selected: true }
              : option
          })
        }

        return null
      })
      setValue(
        'establishmentBounded',
        professionalToEditData.establishmentBounded,
      )

      setDocumentStateIssuedSelectData((prev) => {
        return prev.map((option) => {
          return option.value === professionalToEditData.stateDocumentIssued
            ? { text: option.text, value: option.value, selected: true }
            : option
        })
      })
      setValue(
        'stateDocumentIssued',
        professionalToEditData.stateDocumentIssued || '',
      )

      setRoleSelectData((prev) => {
        return prev.map((option) => {
          return option.value === professionalToEditData.role
            ? { text: option.text, value: option.value, selected: true }
            : option
        })
      })
      setValue('role', professionalToEditData.role)
      setRoleSelected(professionalToEditData.role)

      setStatusSelectData((prev) => {
        return prev.map((option) => {
          return option.value === professionalToEditData.status
            ? { text: option.text, value: option.value, selected: true }
            : option
        })
      })
      setValue('status', professionalToEditData.status)

      setDocumentTypeSelectData((prev) => {
        if (prev) {
          return prev.map((option) => {
            return option.value === professionalToEditData.regionalDocumentType
              ? { text: option.text, value: option.value, selected: true }
              : option
          })
        }

        return null
      })
      setValue(
        'regionalDocumentType',
        professionalToEditData.regionalDocumentType || '',
      )

      setValue('postCode', professionalToEditData.postCode)
      setValue('street', professionalToEditData.street || '')
      setValue('neighborhood', professionalToEditData.neighborhood || '')
      setValue('city', professionalToEditData.city || '')

      setStateSelectData((prev) => {
        return prev.map((option) => {
          return option.value === professionalToEditData.state
            ? { text: option.text, value: option.value, selected: true }
            : option
        })
      })
      setValue('state', professionalToEditData.state || '')

      setValue('compliment', professionalToEditData.compliment || '')
      setValue('number', professionalToEditData.number || null)
      setValue('latitude', professionalToEditData.latitude || null)
      setValue('longitude', professionalToEditData.longitude || null)
    }
  }, [professionalToEditData, setValue])

  const checkIfAnyDataChanged = (data: EditProfessionalData) => {
    if (!professionalToEditData) return false

    const oldProfessionalDataWithoutIrrelevantFields = {
      ...professionalToEditData,
    }
    delete oldProfessionalDataWithoutIrrelevantFields.id
    delete oldProfessionalDataWithoutIrrelevantFields.professionalAddress

    const newProfessionalDataWithoutIrrelevantFields = {
      ...data,
    }
    delete newProfessionalDataWithoutIrrelevantFields.password
    delete newProfessionalDataWithoutIrrelevantFields.confirmPassword
    delete newProfessionalDataWithoutIrrelevantFields.passwordState

    const professionalToEditOldData = Object.entries(
      oldProfessionalDataWithoutIrrelevantFields,
    )

    const professionalToEditNewData = Object.entries(
      newProfessionalDataWithoutIrrelevantFields,
    )

    const hasChanges = professionalToEditNewData.some(([key, newValue]) => {
      const oldValue = professionalToEditOldData.find(([newKey]) => {
        return newKey === key
      })?.[1]

      if (!oldValue && !newValue) {
        return false
      }

      return oldValue !== newValue
    })

    return hasChanges || data.passwordState === 'CHANGE'
  }

  const getUnitsFromEstablishment = useCallback(
    async (idEstablishmentSelected: string) => {
      const { 'medap.token': token } = parseCookies()

      let unitsFromEstablishmentList = null

      const response = await fetch(
        `http://localhost:3000/api/units/from-establishment/?id=${idEstablishmentSelected}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      unitsFromEstablishmentList = await response.json()

      return unitsFromEstablishmentList
    },
    [],
  )

  useEffect(() => {
    const fetchUnits = async () => {
      if (establishmentSelected) {
        const units: UnityFromEstablishmentResponse[] =
          await getUnitsFromEstablishment(establishmentSelected)

        const unitsFromEstablishmentList = units.map((unity) => {
          return { text: unity.name, value: unity.id }
        })

        if (!unitsFromEstablishmentList.length) {
          setUnityBoundedSelectData(null)
          setValue('unityBounded', '')
        } else {
          setUnityBoundedSelectData(unitsFromEstablishmentList)
        }

        setSelectUnityInputKey((prev) => {
          return prev + 1
        })
      }
    }

    fetchUnits()
  }, [establishmentSelected, getUnitsFromEstablishment, setValue])

  const handleEditProfessional = async (data: EditProfessionalData) => {
    const { 'medap.token': token } = parseCookies()
    setEditedProfessionalFeedbackMessage(null)

    const professionalDataToSend = { ...data }
    delete professionalDataToSend.confirmPassword
    delete professionalDataToSend.passwordState

    if (!professionalDataToSend.regionalDocumentType) {
      professionalDataToSend.regionalDocumentType = undefined
    }

    let unitsFromEstablishmentList: UnityFromEstablishmentResponse[] | null =
      null

    if (professionalToEditData) {
      const response = await fetch(
        `http://localhost:3000/api/units/from-establishment/?id=${professionalDataToSend.establishmentBounded}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      unitsFromEstablishmentList = await response.json()
    }

    if (
      professionalDataToSend.boundedTo === 'UNITY' &&
      !professionalDataToSend.unityBounded &&
      unitsFromEstablishmentList?.length
    ) {
      setError(
        'unityBounded',
        { message: 'Não há unidade selecionada' },
        { shouldFocus: true },
      )

      return
    } else if (
      watch('boundedTo') === 'UNITY' &&
      !professionalDataToSend.unityBounded &&
      !unitsFromEstablishmentList
    ) {
      professionalDataToSend.boundedTo = 'ESTABLISHMENT'
      delete professionalDataToSend.unityBounded
      setValue('boundedTo', 'ESTABLISHMENT')
    }

    if (!checkIfAnyDataChanged(data)) {
      setTimeout(() => {
        setEditedProfessionalFeedbackMessage({
          state: 'warning',
          message: 'Nada foi modificado para ser atualizado',
        })
      }, 1)

      return
    }

    if (professionalToEditData?.id) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/professionals/?id=${router.query.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(professionalDataToSend),
          },
        )

        switch (response.status) {
          case 200: {
            setEditedProfessionalFeedbackMessage({
              state: 'success',
              message: 'Profissional editado com sucesso!',
            })

            setTimeout(() => {
              router.back()
            }, 2000)
            break
          }
          case 409: {
            const errorData = await response.json()
            const errorMessage = errorData.message

            setEditedProfessionalFeedbackMessage({
              state: 'warning',
              message: 'Houve um conflito com os dados cadastrados.',
            })

            switch (errorMessage) {
              case 'Professional with same CPF already exists.': {
                setError(
                  'cpf',
                  { message: 'CPF já cadastrado' },
                  { shouldFocus: true },
                )
                break
              }
              case 'Professional with same email already exists.': {
                setError(
                  'email',
                  { message: 'Email já cadastrado' },
                  { shouldFocus: true },
                )
                break
              }
              default: {
                setEditedProfessionalFeedbackMessage({
                  state: 'error',
                  message: 'Houve um conflito inesperado',
                })
                break
              }
            }

            break
          }
          default: {
            setEditedProfessionalFeedbackMessage({
              state: 'error',
              message: 'Ocorreu um erro inesperado, tente novamente.',
            })
          }
        }
      } catch (error) {
        setEditedProfessionalFeedbackMessage({
          state: 'error',
          message: 'Ocorreu um erro no servidor',
        })
      }
    }
  }

  const fillAddressFormWithCepData = (addressData: viaCepResponseType) => {
    setValue('street', addressData.logradouro)
    setValue('neighborhood', addressData.bairro)
    setValue('city', addressData.localidade)
    setValue('state', addressData.uf?.toLocaleUpperCase())

    setStateSelectData((prev) => {
      return prev.map((option) => {
        return option.value === addressData.uf
          ? { text: option.text, value: option.value, selected: true }
          : option
      })
    })
  }

  const handleCreateDocumentTypeDialog = async (e: MouseEvent) => {
    e.preventDefault()
    setAddNewDocumentTypeDialog(true)
  }

  const handleConfirmDocumentTypeDialog = async (e: MouseEvent) => {
    e.preventDefault()
    router.push(`/profissional/documento`)
  }

  const handleCancelDocumentTypeDialog = async (e: MouseEvent) => {
    e.preventDefault()
    setAddNewDocumentTypeDialog(false)
  }

  const handleFillWithPostCode = async (e: MouseEvent) => {
    e.preventDefault()

    const postCodeValue = watch('postCode')

    if (postCodeValue === undefined || postCodeValue.length < 9) {
      setFillWithCepFeedbackMessage('Cep incompleto')
    } else if (postCodeValue !== undefined && postCodeValue.length === 9) {
      setFillWithCepFeedbackMessage('')
      setFillWithCepButtonLoadingState(true)
      const formattedPostCodeValue = postCodeValue.replace('-', '')

      const addressData: viaCepResponseType | undefined =
        await searchAddressWithPostCode(formattedPostCodeValue)

      setFillWithCepButtonLoadingState(false)
      if (addressData?.erro) {
        setFillWithCepFeedbackMessage('Cep inválido')
      } else if (addressData) {
        fillAddressFormWithCepData(addressData)
      } else {
        setFillWithCepFeedbackMessage('Erro ao buscar CEP')
      }
    }
  }

  useEffect(() => {
    fillAllFieldsWithProfessionalData()
  }, [fillAllFieldsWithProfessionalData])

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (!AddNewDocumentTypeTooltipRef) return

      if (
        AddNewDocumentTypeTooltipRef.current &&
        !AddNewDocumentTypeTooltipRef.current.contains(event.target as Node)
      ) {
        setAddNewDocumentTypeDialog(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [addNewDocumentTypeDialog])

  return (
    <DefaultLayout activePage="PROFESSIONAL">
      <HeaderUser title="Editar profissional" />
      <EditProfessionalContainer>
        <Box width={'full'}>
          <ProfessionalBeingEditedContainer>
            <ProfessionalInfoContainer>
              <Image
                priority
                src={userIcon}
                alt="Logo medap"
                height={60}
                width={60}
              />
              <ProfessionalNameInfo>
                <Text color={'gray_700'} size={'2xlarge'}>
                  {professionalToEditData?.name}
                </Text>
                <Text color={'gray_600'} size={'xlarge'}>
                  {professionalToEditData?.cpf}
                </Text>
              </ProfessionalNameInfo>
            </ProfessionalInfoContainer>
            <ContainerCancelAction>
              <EditingLabel>
                <Pencil />
                <Text color={'warning_500'} size={'xlarge'}>
                  Editando profissional
                </Text>
              </EditingLabel>
              <Button
                onClick={handleCancelEditProfessional}
                variant={'danger_secondary'}
              >
                Cancelar
              </Button>
            </ContainerCancelAction>
          </ProfessionalBeingEditedContainer>
          <EditProfessionalForm onSubmit={handleSubmit(handleEditProfessional)}>
            <FormContainer>
              <ProfessionalData>
                <ProfessionalDataHeader>
                  <Heading size={'4xlarge'} color={'gray_600'}>
                    Dados do profissional
                  </Heading>
                  <LineDetail />
                </ProfessionalDataHeader>
                <ProfessionalDataFields>
                  <TextInput
                    inputPlaceholder="Nome"
                    inputWidth="full"
                    isRequired={true}
                    {...register('name')}
                    controlledPlaceholderState={!watch('name')}
                    errorMessage={formState.errors.name?.message}
                  />
                  <TextInput
                    inputPlaceholder="CPF"
                    inputWidth="full"
                    isRequired={true}
                    {...register('cpf', { onChange: handleCpfChange })}
                    controlledPlaceholderState={!watch('cpf')}
                    errorMessage={formState.errors.cpf?.message}
                    maxLength={14}
                  />
                  <TextInput
                    inputPlaceholder="Telefone"
                    inputWidth="full"
                    isRequired={true}
                    {...register('phone', { onChange: handlePhoneChange })}
                    controlledPlaceholderState={!watch('phone')}
                    errorMessage={formState.errors.phone?.message}
                    maxLength={13}
                  />
                  <TextInput
                    inputPlaceholder="Email"
                    inputWidth="full"
                    isRequired={true}
                    {...register('email')}
                    controlledPlaceholderState={!watch('email')}
                    errorMessage={formState.errors.email?.message}
                  />
                </ProfessionalDataFields>

                <ProfessionalBirthDateAndStatusContainer>
                  <ProfessionalBirthDateField>
                    <Text size={'xlarge'} color={'gray_600'}>
                      Data de nascimento
                    </Text>
                    <DateInput
                      inputWidth="full"
                      {...register('birthDate')}
                      errorMessage={formState.errors.birthDate?.message}
                    />
                  </ProfessionalBirthDateField>
                  <ProfessionalStatusField>
                    <Text size={'xlarge'} color={'gray_600'}>
                      Status
                    </Text>
                    <SelectInput
                      optionsList={statusSelectData}
                      inputWidth="full"
                      isRequired
                      {...register('status')}
                      controlledPlaceholderState={!watch('status')}
                      errorMessage={formState.errors.status?.message}
                      handleSelectedInputChange={(selectedValue: string) => {
                        setValue('status', selectedValue)
                      }}
                    />
                  </ProfessionalStatusField>
                </ProfessionalBirthDateAndStatusContainer>

                <ProfessionalCredentialsContainer>
                  <Text size={'xlarge'} color={'gray_600'}>
                    Credenciais
                  </Text>
                  <RadioContainer>
                    <RadioInput
                      radioId="keepPassword"
                      labelText="Manter a mesma senha"
                      variant="default"
                      radioSize={'medium'}
                      {...register('passwordState')}
                      value="KEEP"
                      onClick={handleRadioOptionClick}
                    />
                    <RadioInput
                      radioId="changePassword"
                      labelText="Alterar a senha"
                      variant="default"
                      radioSize={'medium'}
                      {...register('passwordState')}
                      value="CHANGE"
                      onClick={handleRadioOptionClick}
                    />
                  </RadioContainer>
                  {passwordChangeOptionSelected === 'CHANGE' ? (
                    <>
                      <TextInput
                        inputPlaceholder="Nova senha"
                        inputWidth="full"
                        type="password"
                        isRequired={true}
                        showPasswordOption
                        {...register('password')}
                        controlledPlaceholderState={!watch('password')}
                        errorMessage={formState.errors.password?.message}
                      />
                      <TextInput
                        inputPlaceholder="Confirmar nova senha"
                        inputWidth="full"
                        type="password"
                        isRequired={true}
                        showPasswordOption
                        {...register('confirmPassword')}
                        controlledPlaceholderState={!watch('confirmPassword')}
                        errorMessage={formState.errors.confirmPassword?.message}
                      />
                    </>
                  ) : null}
                </ProfessionalCredentialsContainer>
              </ProfessionalData>
              <FormTabMenuContainer>
                <FormTabMenuNavigation>
                  <TabLink
                    onClick={() => {
                      setCurrentFormTab('address')
                    }}
                    active={currentFormTab === 'address'}
                  >
                    <Heading fontWeight={'light'}>Endereço</Heading>
                  </TabLink>
                  <TabLink
                    onClick={() => {
                      setCurrentFormTab('especialization')
                    }}
                    active={currentFormTab === 'especialization'}
                  >
                    <Heading fontWeight={'light'}>Especialização</Heading>
                  </TabLink>
                </FormTabMenuNavigation>
                <FormTabContent active={currentFormTab === 'address'}>
                  <AddressData>
                    <AddressDataFields>
                      <TextInput
                        inputPlaceholder="CEP"
                        inputWidth="full"
                        {...register('postCode', {
                          onChange: handleCepChange,
                        })}
                        controlledPlaceholderState={!watch('postCode')}
                        errorMessage={formState.errors.postCode?.message}
                        maxLength={9}
                      />
                      <FillWithCepContainer>
                        <Button
                          variant={'brand_secondary'}
                          size={'small'}
                          width={'full'}
                          onClick={handleFillWithPostCode}
                          isLoading={fillWithCepButtonLoadingState}
                        >
                          Preencher com cep
                        </Button>
                        <Text color={'danger_400'} size={'small'}>
                          {fillWithCepFeedbackMessage}
                        </Text>
                      </FillWithCepContainer>

                      <TextInput
                        inputPlaceholder="Rua/Endereço"
                        inputWidth="full"
                        {...register('street')}
                        controlledPlaceholderState={!watch('street')}
                        errorMessage={formState.errors.street?.message}
                      />
                      <TextInput
                        inputPlaceholder="Número"
                        inputWidth="full"
                        {...register('number', {
                          onChange: handleOnlyDigitsChange,
                        })}
                        controlledPlaceholderState={!watch('number')}
                        errorMessage={formState.errors.number?.message}
                      />
                      <TextInput
                        inputPlaceholder="Bairro"
                        inputWidth="full"
                        {...register('neighborhood')}
                        controlledPlaceholderState={!watch('neighborhood')}
                        errorMessage={formState.errors.neighborhood?.message}
                      />
                      <TextInput
                        inputPlaceholder="Cidade"
                        inputWidth="full"
                        {...register('city')}
                        controlledPlaceholderState={!watch('city')}
                        errorMessage={formState.errors.city?.message}
                      />
                      <SelectInput
                        optionsList={stateSelectData}
                        inputPlaceholder="Estado"
                        inputWidth="full"
                        {...register('state')}
                        controlledPlaceholderState={!watch('state')}
                        errorMessage={formState.errors.state?.message}
                        handleSelectedInputChange={(selectedValue: string) => {
                          setValue('state', selectedValue)
                        }}
                      />
                      <TextArea
                        textAreaPlaceholder="Complemento"
                        textAreaWidth="full"
                        textAreaHeight="medium"
                        {...register('compliment')}
                        controlledPlaceholderState={!watch('compliment')}
                        errorMessage={formState.errors.compliment?.message}
                      />
                    </AddressDataFields>
                    <AddressDataCoordinateFields>
                      <TextInput
                        inputPlaceholder="Latitude"
                        inputWidth="full"
                        {...register('latitude', {
                          onChange: handleFloatNumberChange,
                        })}
                        controlledPlaceholderState={!watch('latitude')}
                        errorMessage={formState.errors.latitude?.message}
                      />
                      <TextInput
                        inputPlaceholder="Longitude"
                        inputWidth="full"
                        {...register('longitude', {
                          onChange: handleFloatNumberChange,
                        })}
                        controlledPlaceholderState={!watch('longitude')}
                        errorMessage={formState.errors.longitude?.message}
                      />
                    </AddressDataCoordinateFields>
                  </AddressData>
                </FormTabContent>

                <FormTabContent active={currentFormTab === 'especialization'}>
                  <ProfessionalEstablishmentField>
                    <Text size={'xlarge'} color={'gray_600'}>
                      Onde trabalha
                    </Text>
                    <SelectInput
                      optionsList={establishmentBoundedSelectData || undefined}
                      isRequired
                      inputPlaceholder="Selecione o estabelecimento"
                      inputWidth="full"
                      hasSearch={true}
                      {...register('establishmentBounded')}
                      controlledPlaceholderState={
                        !watch('establishmentBounded')
                      }
                      errorMessage={
                        formState.errors.establishmentBounded?.message
                      }
                      handleSelectedInputChange={(selectedValue: string) => {
                        setValue('establishmentBounded', selectedValue)
                        setValue('unityBounded', '')
                        setError('establishmentBounded', { message: '' })
                        setEstablishmentSelected(watch('establishmentBounded'))
                      }}
                    />
                  </ProfessionalEstablishmentField>

                  {unityBoundedSelectData ? (
                    <ProfessionalUnityField>
                      <Text size={'xlarge'} color={'gray_600'}>
                        Unidades pertencentes ao estabelecimento selecionado
                      </Text>
                      <BoundToUnityContainer>
                        <SelectInput
                          key={selectUnityInputKey}
                          optionsList={unityBoundedSelectData || undefined}
                          inputPlaceholder="Selecione a unidade"
                          inputWidth="large"
                          hasSearch={true}
                          {...register('unityBounded')}
                          controlledPlaceholderState={!watch('unityBounded')}
                          errorMessage={formState.errors.unityBounded?.message}
                          handleSelectedInputChange={(
                            selectedValue: string,
                          ) => {
                            setValue('unityBounded', selectedValue)
                            setError('unityBounded', { message: '' })
                          }}
                        />
                        <ContainerOptionsBoundToUnity>
                          <RadioOptionContainer>
                            <RadioOption
                              type="radio"
                              {...register('boundedTo')}
                              id="establishmentBound"
                              value="ESTABLISHMENT"
                            />
                            <LabelRadioOption htmlFor="establishmentBound">
                              Manter vinculado ao estabelecimento
                            </LabelRadioOption>
                          </RadioOptionContainer>
                          <RadioOptionContainer>
                            <RadioOption
                              type="radio"
                              {...register('boundedTo')}
                              id="unityBound"
                              value="UNITY"
                            />
                            <LabelRadioOption htmlFor="unityBound">
                              Vincular a unidade selecionada
                            </LabelRadioOption>
                          </RadioOptionContainer>
                        </ContainerOptionsBoundToUnity>
                      </BoundToUnityContainer>
                    </ProfessionalUnityField>
                  ) : null}
                  <ProfessionalRoleField>
                    <Text size={'xlarge'} color={'gray_600'}>
                      Função
                    </Text>
                    <SelectInput
                      optionsList={roleSelectData}
                      isRequired
                      inputPlaceholder="Selecione a função"
                      inputWidth="full"
                      {...register('role')}
                      controlledPlaceholderState={!watch('role')}
                      errorMessage={formState.errors.role?.message}
                      handleSelectedInputChange={(selectedValue: string) => {
                        setValue('role', selectedValue)
                        setError('role', { message: '' })
                        setRoleSelected(watch('role'))
                      }}
                    />
                  </ProfessionalRoleField>
                  {roleHealthProfessionalTarget.includes(roleSelected) ? (
                    <>
                      <ProfessionalRoleField>
                        <Text size={'xlarge'} color={'gray_600'}>
                          Tipo de documento do Conselho Regional
                        </Text>
                        <DocumentTypeField>
                          <SelectInput
                            optionsList={documentTypeSelectData || undefined}
                            inputPlaceholder="Selecione o tipo de documento"
                            inputWidth="full"
                            {...register('regionalDocumentType')}
                            controlledPlaceholderState={
                              !watch('regionalDocumentType')
                            }
                            errorMessage={
                              formState.errors.regionalDocumentType?.message
                            }
                            handleSelectedInputChange={(
                              selectedValue: string,
                            ) => {
                              setValue('regionalDocumentType', selectedValue)
                              setError('regionalDocumentType', { message: '' })
                            }}
                          />
                          <AddNewDocumentTypeButtonContainer>
                            <IconButton
                              onClick={handleCreateDocumentTypeDialog}
                            >
                              <Plus />
                            </IconButton>
                            {addNewDocumentTypeDialog ? (
                              <AddNewDocumentTypeDialog
                                ref={AddNewDocumentTypeTooltipRef}
                              >
                                <AddNewDocumentTypeDialogInfo>
                                  <Text color={'gray_700'}>
                                    Não encontrou o tipo de documento desejado?
                                  </Text>
                                </AddNewDocumentTypeDialogInfo>

                                <AddNewDocumentTypeDialogActions>
                                  <Button
                                    size={'small'}
                                    onClick={handleConfirmDocumentTypeDialog}
                                  >
                                    Cadastrar novo tipo
                                  </Button>
                                  <Button
                                    variant={'danger_secondary'}
                                    size={'small'}
                                    onClick={handleCancelDocumentTypeDialog}
                                  >
                                    Cancelar
                                  </Button>
                                </AddNewDocumentTypeDialogActions>
                              </AddNewDocumentTypeDialog>
                            ) : null}
                          </AddNewDocumentTypeButtonContainer>
                        </DocumentTypeField>
                      </ProfessionalRoleField>
                      <Detail />

                      <ProfessionalDocumentFields>
                        <TextInput
                          inputPlaceholder="Documento Regional"
                          inputWidth="full"
                          {...register('regionalDocument')}
                          controlledPlaceholderState={
                            !watch('regionalDocument')
                          }
                          errorMessage={
                            formState.errors.regionalDocument?.message
                          }
                        />
                        <SelectInput
                          optionsList={documentStateIssuedSelectData}
                          inputPlaceholder="UF documento"
                          inputWidth="full"
                          {...register('stateDocumentIssued')}
                          controlledPlaceholderState={
                            !watch('stateDocumentIssued')
                          }
                          errorMessage={
                            formState.errors.stateDocumentIssued?.message
                          }
                          handleSelectedInputChange={(
                            selectedValue: string,
                          ) => {
                            setValue('stateDocumentIssued', selectedValue)
                          }}
                        />
                        <TextInput
                          inputPlaceholder="Especialidade"
                          inputWidth="full"
                          {...register('especiality')}
                          controlledPlaceholderState={!watch('especiality')}
                          errorMessage={formState.errors.especiality?.message}
                        />
                      </ProfessionalDocumentFields>
                    </>
                  ) : null}
                </FormTabContent>
              </FormTabMenuContainer>
            </FormContainer>
            <Button>Editar profissional</Button>
          </EditProfessionalForm>
        </Box>
      </EditProfessionalContainer>
      {editedProfessionalFeedbackMessage ? (
        <Toast
          message={editedProfessionalFeedbackMessage.message}
          hasTimer={true}
          type={editedProfessionalFeedbackMessage.state}
        />
      ) : null}
    </DefaultLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'medap.token': token } = parseCookies(context)

  let isUserAuthenticated = false

  const user = await recoverUserAuthData(token)

  let professionalToEditData: EditProfessionalData | null = null

  let establishments: ResponseEstablishment[] | null = null
  let establishmentList: selectData[] | null = null
  let documentTypes: DocumentType[] | null = null
  let documentTypesActivated: DocumentType[] | null = null

  const routeParams = context.params

  if (routeParams) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/professionals/?id=${routeParams.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        professionalToEditData = await response.json()
      } else {
        throw new Error('Falha em recuperar dados do profissional')
      }
    } catch (error) {
      console.error('Falha em recuperar dados do profissional: ', error)
    }
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/professionals/documents/?availableFor=establishment`,
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
    console.error('Falha em recuperar dados do tipo de documento: ', error)
  }

  if (user != null) {
    isUserAuthenticated = true

    const response = await fetch('http://localhost:3000/api/establishments', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    establishments = await response.json()
  }

  if (establishments) {
    establishmentList = establishments.map((establishment) => {
      return { text: establishment.name, value: establishment.id }
    })
  }

  if (documentTypes) {
    documentTypesActivated = documentTypes.filter((documentType) => {
      return documentType.status === 'ACTIVE'
    })
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
      professionalToEditData,
      establishmentList,
      documentTypes: documentTypesActivated,
    },
  }
}
