import DefaultLayout from '@/layouts/DefaultLayout'
import {
  Box,
  Button,
  Heading,
  IconButton,
  SelectInput,
  Text,
  TextArea,
  TextInput,
} from '@medap-ui/react'
import HeaderUser from '@/components/PageStructure/HeaderUser'
import {
  AddressData,
  AddressDataFields,
  AddressDataHeader,
  FormContainer,
  LineDetail,
  UnityData,
  UnityDataFields,
  UnityDataHeader,
  UnityStatusField,
  AddressDataCoordinateFields,
  UnityTargetCustomerField,
  FillWithCepContainer,
  EditUnityForm,
  EditUnityContainer,
  UnityBeingEditedContainer,
  UnityInfoContainer,
  UnityNameInfo,
  UnityEstablishmentField,
  ContainerCancelAction,
  EditingLabel,
  UnityTypeField,
  AddNewEstablishmentTypeButtonContainer,
  AddNewEstablishmentTypeDialog,
  AddNewEstablishmentTypeDialogInfo,
  AddNewEstablishmentTypeDialogActions,
} from './styles'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { recoverUserAuthData } from '@/contexts/AuthContext'
import { Pencil, Plus } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { handlePhoneChange } from '@/utils/formatters/phone'
import { handleCnpjChange, isValidCNPJ } from '@/utils/formatters/cnpj'
import { handleFloatNumberChange } from '@/utils/formatters/floatNumber'
import { handleOnlyDigitsChange } from '@/utils/formatters/onlyDigits'
import { handleCepChange } from '@/utils/formatters/cep'
import {
  addressBrazilStates,
  unityStatus,
  unityTargetCustomers,
} from '@/utils/constants/selectInputData'
import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { searchAddressWithPostCode } from '@/lib/postCode.api'
import { viaCepResponseType } from '@/@types/address'
import { selectData } from '@/@types/selectData'
import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import unityIcon from '@/assets/images/unityIcon.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import type { ResponseEstablishment } from '@/@types/responseValues/establishmentResponse'
import type { EstablishmentType } from '../incluir/index.page'

export interface ResponseUnityWithAddress {
  id?: string
  name: string
  abbreviation?: string
  cnpj?: string
  unityType: string
  especiality?: string
  mainPhone: string
  secondaryPhone?: string
  targetCustomer: string
  email: string
  unityEstablishment: string
  status: string
  unityAddress?: string
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

const EditUnitySchema = z.object({
  name: z.string().min(1, 'Informe o nome da unidade'),
  abbreviation: z.string().optional(),
  cnpj: z
    .string()
    .refine((cnpj) => cnpj === '' || isValidCNPJ(cnpj), 'CNPJ inválido')
    .optional(),
  mainPhone: z
    .string()
    .min(1, 'Informe o telefone')
    .min(13, 'Telefone incompleto'),
  email: z
    .string()
    .min(1, 'Informe o email de contato')
    .refine((value) => {
      const regex =
        /^[a-zA-Z0-9!#$%&'*/=?^._+\-`{|}~\\]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
      return regex.test(value)
    }, 'Email inválido'),
  secondaryPhone: z.string().optional(),
  especiality: z.string().optional(),
  unityEstablishment: z.string().uuid('Víncule a unidade a alguma organização'),
  unityType: z.string().min(1, 'Escolha o tipo de unidade'),
  targetCustomer: z.string().refine(
    (value) => {
      return unityTargetCustomers.find((option) => {
        return option.value === value
      })
    },
    {
      message: 'Informe a quem a unidade atende',
    },
  ),
  status: z.string().refine(
    (value) => {
      return unityStatus.find((option) => {
        return option.value === value
      })
    },
    {
      message: 'Informe a situação da unidade',
    },
  ),
  postCode: z.string().optional(),
  street: z.string().optional(),
  number: z.any().transform((val) => (val ? parseInt(val) : null)),
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

export type EditUnityData = z.infer<typeof EditUnitySchema>

interface EditUnityProps {
  unityToEditData: ResponseUnityWithAddress | null
  establishmentList: selectData[] | null
  unityTypes: EstablishmentType[]
}

export default function EditUnity({
  unityToEditData,
  establishmentList,
  unityTypes,
}: EditUnityProps) {
  const { register, handleSubmit, formState, watch, setValue, setError } =
    useForm<EditUnityData>({
      mode: 'onSubmit',
      resolver: zodResolver(EditUnitySchema),
    })

  const [fillWithCepFeedbackMessage, setFillWithCepFeedbackMessage] =
    useState<string>('')

  const [fillWithCepButtonLoadingState, setFillWithCepButtonLoadingState] =
    useState<boolean>(false)

  const [stateSelectData, setStateSelectData] =
    useState<selectData[]>(addressBrazilStates)

  const [unityTypeSelectData, setUnityTypeSelectData] = useState<selectData[]>(
    unityTypes.map((establishmentType) => {
      return { text: establishmentType.name, value: establishmentType.id }
    }),
  )

  const [unityTargetCustomerSelectData, setUnityTargetCustomerSelectData] =
    useState<selectData[]>(unityTargetCustomers)

  const [unityStatusSelectData, setUnityStatusSelectData] =
    useState<selectData[]>(unityStatus)

  const [
    unityBoundedEstablishmentSelectData,
    setUnityBoundedEstablishmentSelectData,
  ] = useState<selectData[] | null>(establishmentList)

  const [editedUnityFeedbackMessage, setEditedUnityFeedbackMessage] =
    useState<ToastFeedbackMessageType | null>(null)

  const [addNewEstablishmentTypeDialog, setAddNewEstablishmentTypeDialog] =
    useState<boolean>(false)

  const AddNewEstablishmentTypeTooltipRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const handleCancelEditUnity = () => {
    router.back()
  }

  const fillAllFieldsWithUnityData = useCallback(() => {
    if (unityToEditData) {
      setValue('name', unityToEditData.name)
      setValue('abbreviation', unityToEditData.abbreviation)
      setValue('cnpj', unityToEditData.cnpj || '')
      setValue('mainPhone', unityToEditData.mainPhone)
      setValue('email', unityToEditData.email)
      setValue('secondaryPhone', unityToEditData.secondaryPhone)
      setValue('especiality', unityToEditData?.especiality)

      setUnityTypeSelectData((prev) => {
        return prev.map((option) => {
          return option.value === unityToEditData.unityType
            ? { text: option.text, value: option.value, selected: true }
            : option
        })
      })
      setValue('unityType', unityToEditData.unityType)

      setUnityBoundedEstablishmentSelectData((prev) => {
        if (prev) {
          return prev.map((option) => {
            return option.value === unityToEditData.unityEstablishment
              ? { text: option.text, value: option.value, selected: true }
              : option
          })
        }

        return null
      })
      setValue('unityEstablishment', unityToEditData.unityEstablishment)

      setUnityTargetCustomerSelectData((prev) => {
        return prev.map((option) => {
          return option.value === unityToEditData.targetCustomer
            ? { text: option.text, value: option.value, selected: true }
            : option
        })
      })
      setValue('targetCustomer', unityToEditData.targetCustomer)

      setUnityStatusSelectData((prev) => {
        return prev.map((option) => {
          return option.value === unityToEditData.status
            ? { text: option.text, value: option.value, selected: true }
            : option
        })
      })
      setValue('status', unityToEditData.status)

      setValue('postCode', unityToEditData.postCode)
      setValue('street', unityToEditData.street || '')
      setValue('neighborhood', unityToEditData.neighborhood || '')
      setValue('city', unityToEditData.city || '')

      setStateSelectData((prev) => {
        return prev.map((option) => {
          return option.value === unityToEditData.state
            ? { text: option.text, value: option.value, selected: true }
            : option
        })
      })
      setValue('state', unityToEditData.state || '')

      setValue('compliment', unityToEditData.compliment || '')
      setValue('number', unityToEditData.number || null)
      setValue('latitude', unityToEditData.latitude || null)
      setValue('longitude', unityToEditData.longitude || null)
    }
  }, [unityToEditData, setValue])

  const checkIfAnyDataChanged = (data: EditUnityData) => {
    if (!unityToEditData) return false

    const unityDataWithoutId = { ...unityToEditData }
    delete unityDataWithoutId.id
    delete unityDataWithoutId.unityAddress

    const unityToEditOldData = Object.entries(unityDataWithoutId)

    const unityToEditNewData = Object.entries(data)

    const hasChanges = unityToEditNewData.some(([key, newValue]) => {
      const oldValue = unityToEditOldData.find(([newKey]) => {
        return newKey === key
      })?.[1]

      if (!oldValue && !newValue) {
        return false
      }

      return oldValue !== newValue
    })

    return hasChanges
  }

  const handleEditUnity = async (data: EditUnityData) => {
    const { 'medap.token': token } = parseCookies()
    setEditedUnityFeedbackMessage(null)

    if (!checkIfAnyDataChanged(data)) {
      setTimeout(() => {
        setEditedUnityFeedbackMessage({
          state: 'warning',
          message: 'Nada foi modificado para ser atualizado',
        })
      }, 1)

      return
    }

    if (unityToEditData?.id) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/units/?id=${router.query.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          },
        )

        switch (response.status) {
          case 200: {
            setEditedUnityFeedbackMessage({
              state: 'success',
              message: 'Dados do estabelecimento alterado!',
            })

            setTimeout(() => {
              router.back()
            }, 2000)
            break
          }
          case 409: {
            const errorData = await response.json()
            const errorMessage = errorData.message

            setEditedUnityFeedbackMessage({
              state: 'warning',
              message: 'Houve um conflito com os dados cadastrados.',
            })

            switch (errorMessage) {
              case 'Unity with same name already exists': {
                setError(
                  'name',
                  { message: 'Nome já cadastrado' },
                  { shouldFocus: true },
                )
                break
              }
              case 'Unity with same abbreviation already exists': {
                setError(
                  'abbreviation',
                  { message: 'Sigla já cadastrada' },
                  { shouldFocus: true },
                )
                break
              }
              case 'Unity with same cnpj already exists': {
                setError(
                  'cnpj',
                  { message: 'CNPJ já cadastrado' },
                  { shouldFocus: true },
                )
                break
              }
              case 'Unity with same email already exists': {
                setError(
                  'email',
                  { message: 'Email já cadastrado' },
                  { shouldFocus: true },
                )
                break
              }
              default: {
                setEditedUnityFeedbackMessage({
                  state: 'error',
                  message: 'Houve um conflito inesperado',
                })
                break
              }
            }

            break
          }
          default: {
            setEditedUnityFeedbackMessage({
              state: 'error',
              message: 'Ocorreu um erro inesperado, tente novamente.',
            })
          }
        }
      } catch (error) {
        setEditedUnityFeedbackMessage({
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

  const handleCreateEstablishmentTypeDialog = async (e: MouseEvent) => {
    e.preventDefault()
    setAddNewEstablishmentTypeDialog(true)
  }

  const handleConfirmEstablishmentTypeDialog = async (e: MouseEvent) => {
    e.preventDefault()
    router.push(`/estabelecimento/tipo`)
  }

  const handleCancelEstablishmentTypeDialog = async (e: MouseEvent) => {
    e.preventDefault()
    setAddNewEstablishmentTypeDialog(false)
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
    fillAllFieldsWithUnityData()
  }, [fillAllFieldsWithUnityData])

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (!AddNewEstablishmentTypeTooltipRef) return

      if (
        AddNewEstablishmentTypeTooltipRef.current &&
        !AddNewEstablishmentTypeTooltipRef.current.contains(
          event.target as Node,
        )
      ) {
        setAddNewEstablishmentTypeDialog(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [addNewEstablishmentTypeDialog])

  return (
    <DefaultLayout activePage="UNITY">
      <HeaderUser title="Editar unidade" />
      <EditUnityContainer>
        <Box width={'full'}>
          <UnityBeingEditedContainer>
            <UnityInfoContainer>
              <Image
                priority
                src={unityIcon}
                alt="Logo medap"
                height={60}
                width={60}
              />
              <UnityNameInfo>
                <Text color={'gray_700'} size={'2xlarge'}>
                  {unityToEditData?.name}
                </Text>
                <Text color={'gray_600'} size={'xlarge'}>
                  {unityToEditData?.abbreviation}
                </Text>
              </UnityNameInfo>
            </UnityInfoContainer>
            <ContainerCancelAction>
              <EditingLabel>
                <Pencil />
                <Text color={'warning_500'} size={'xlarge'}>
                  Editando unidade
                </Text>
              </EditingLabel>
              <Button
                onClick={handleCancelEditUnity}
                variant={'danger_secondary'}
              >
                Cancelar
              </Button>
            </ContainerCancelAction>
          </UnityBeingEditedContainer>
          <EditUnityForm onSubmit={handleSubmit(handleEditUnity)}>
            <FormContainer>
              <UnityData>
                <UnityDataHeader>
                  <Heading size={'4xlarge'} color={'gray_600'}>
                    Dados da unidade
                  </Heading>
                  <LineDetail />
                </UnityDataHeader>
                <UnityDataFields>
                  <TextInput
                    inputPlaceholder="Nome"
                    inputWidth="full"
                    isRequired={true}
                    {...register('name')}
                    controlledPlaceholderState={!watch('name')}
                    errorMessage={formState.errors.name?.message}
                  />
                  <TextInput
                    inputPlaceholder="Sigla"
                    inputWidth="full"
                    {...register('abbreviation')}
                    controlledPlaceholderState={!watch('abbreviation')}
                    errorMessage={formState.errors.abbreviation?.message}
                  />
                  <TextInput
                    inputPlaceholder="CNPJ"
                    inputWidth="full"
                    {...register('cnpj', { onChange: handleCnpjChange })}
                    controlledPlaceholderState={!watch('cnpj')}
                    errorMessage={formState.errors.cnpj?.message}
                    maxLength={18}
                  />
                  <TextInput
                    inputPlaceholder="Telefone principal"
                    inputWidth="full"
                    isRequired={true}
                    {...register('mainPhone', { onChange: handlePhoneChange })}
                    controlledPlaceholderState={!watch('mainPhone')}
                    errorMessage={formState.errors.mainPhone?.message}
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
                  <TextInput
                    inputPlaceholder="Telefone secundário"
                    inputWidth="full"
                    {...register('secondaryPhone', {
                      onChange: handlePhoneChange,
                    })}
                    controlledPlaceholderState={!watch('secondaryPhone')}
                    errorMessage={formState.errors.secondaryPhone?.message}
                    maxLength={13}
                  />
                  <TextInput
                    inputPlaceholder="Especialidade"
                    inputWidth="full"
                    {...register('especiality')}
                    controlledPlaceholderState={!watch('especiality')}
                    errorMessage={formState.errors.especiality?.message}
                  />

                  <UnityTypeField>
                    <SelectInput
                      optionsList={unityTypeSelectData}
                      isRequired
                      inputPlaceholder="Tipo estabelecimento"
                      inputWidth="full"
                      {...register('unityType')}
                      controlledPlaceholderState={!watch('unityType')}
                      errorMessage={formState.errors.unityType?.message}
                      handleSelectedInputChange={(selectedValue: string) => {
                        setValue('unityType', selectedValue)
                      }}
                    />
                    <AddNewEstablishmentTypeButtonContainer>
                      <IconButton onClick={handleCreateEstablishmentTypeDialog}>
                        <Plus />
                      </IconButton>
                      {addNewEstablishmentTypeDialog ? (
                        <AddNewEstablishmentTypeDialog
                          ref={AddNewEstablishmentTypeTooltipRef}
                        >
                          <AddNewEstablishmentTypeDialogInfo>
                            <Text color={'gray_700'}>
                              Não encontrou o tipo de estabelecimento desejado?
                            </Text>
                          </AddNewEstablishmentTypeDialogInfo>

                          <AddNewEstablishmentTypeDialogActions>
                            <Button
                              size={'small'}
                              onClick={handleConfirmEstablishmentTypeDialog}
                            >
                              Cadastrar novo tipo
                            </Button>
                            <Button
                              variant={'danger_secondary'}
                              size={'small'}
                              onClick={handleCancelEstablishmentTypeDialog}
                            >
                              Cancelar
                            </Button>
                          </AddNewEstablishmentTypeDialogActions>
                        </AddNewEstablishmentTypeDialog>
                      ) : null}
                    </AddNewEstablishmentTypeButtonContainer>
                  </UnityTypeField>
                </UnityDataFields>
                <UnityEstablishmentField>
                  <Text size={'xlarge'} color={'gray_600'}>
                    Vínculo da unidade
                  </Text>
                  <SelectInput
                    optionsList={
                      unityBoundedEstablishmentSelectData || undefined
                    }
                    isRequired
                    inputPlaceholder="Selecione o estabelecimento"
                    inputWidth="full"
                    hasSearch={true}
                    {...register('unityEstablishment')}
                    controlledPlaceholderState={!watch('unityEstablishment')}
                    errorMessage={formState.errors.unityEstablishment?.message}
                    handleSelectedInputChange={(selectedValue: string) => {
                      setValue('unityEstablishment', selectedValue)
                      setError('unityEstablishment', { message: '' })
                    }}
                  />
                </UnityEstablishmentField>
                <UnityTargetCustomerField>
                  <Text size={'xlarge'} color={'gray_600'}>
                    Público da unidade
                  </Text>
                  <SelectInput
                    optionsList={unityTargetCustomerSelectData}
                    isRequired
                    inputWidth="full"
                    {...register('targetCustomer')}
                    controlledPlaceholderState={!watch('targetCustomer')}
                    errorMessage={formState.errors.targetCustomer?.message}
                    handleSelectedInputChange={(selectedValue: string) => {
                      setValue('targetCustomer', selectedValue)
                    }}
                  />
                </UnityTargetCustomerField>
                <UnityStatusField>
                  <Text size={'xlarge'} color={'gray_600'}>
                    Status da unidade
                  </Text>
                  <SelectInput
                    optionsList={unityStatusSelectData}
                    isRequired
                    {...register('status')}
                    controlledPlaceholderState={!watch('status')}
                    errorMessage={formState.errors.status?.message}
                    handleSelectedInputChange={(selectedValue: string) => {
                      setValue('status', selectedValue)
                    }}
                  />
                </UnityStatusField>
              </UnityData>

              <AddressData>
                <AddressDataHeader>
                  <Heading size={'4xlarge'} color={'gray_600'}>
                    Dados de endereço
                  </Heading>
                  <LineDetail />
                </AddressDataHeader>
                <AddressDataFields>
                  <TextInput
                    inputPlaceholder="CEP"
                    inputWidth="full"
                    {...register('postCode', { onChange: handleCepChange })}
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
                  ></SelectInput>
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
            </FormContainer>
            <Button>Editar unidade</Button>
          </EditUnityForm>
        </Box>
      </EditUnityContainer>
      {editedUnityFeedbackMessage ? (
        <Toast
          message={editedUnityFeedbackMessage.message}
          hasTimer={true}
          type={editedUnityFeedbackMessage.state}
        />
      ) : null}
    </DefaultLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'medap.token': token } = parseCookies(context)

  let isUserAuthenticated = false

  const user = await recoverUserAuthData(token)

  let unityToEditData: EditUnityData | null = null

  let establishments: ResponseEstablishment[] | null = null
  let establishmentList: selectData[] | null = null
  let unityTypes: EstablishmentType[] | null = null
  let unityTypesActivated: EstablishmentType[] | null = null

  const routeParams = context.params

  if (user != null) {
    isUserAuthenticated = true

    try {
      const response = await fetch(
        `http://localhost:3000/api/establishments/types/?availableFor=unity`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        unityTypes = await response.json()
      } else {
        throw new Error('Falha em recuperar dados dos tipos de estabelecimento')
      }
    } catch (error) {
      console.error('Falha em recuperar dados do estabelecimento: ', error)
    }

    const response = await fetch('http://localhost:3000/api/establishments', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    establishments = await response.json()

    if (establishments) {
      establishmentList = establishments.map((establishment) => {
        return { text: establishment.name, value: establishment.id }
      })
    }

    if (unityTypes) {
      unityTypesActivated = unityTypes.filter((unityType) => {
        return unityType.status === 'ACTIVE'
      })
    }

    if (routeParams) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/units/?id=${routeParams.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.ok) {
          unityToEditData = await response.json()
        } else {
          throw new Error('Falha em recuperar dados da unidade')
        }
      } catch (error) {
        console.error('Falha em recuperar dados da unidade: ', error)
      }
    }
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
      unityToEditData,
      establishmentList,
      unityTypes: unityTypesActivated,
    },
  }
}
