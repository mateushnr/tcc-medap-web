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
  CreateUnityContainer,
  CreateUnityForm,
  FormContainer,
  LineDetail,
  UnityData,
  UnityDataFields,
  UnityDataHeader,
  UnityStatusField,
  AddressDataCoordinateFields,
  UnityTargetCustomerField,
  FillWithCepContainer,
  UnityEstablishmentField,
  UnityTypeField,
  AddNewEstablishmentTypeButtonContainer,
  AddNewEstablishmentTypeDialog,
  AddNewEstablishmentTypeDialogInfo,
  AddNewEstablishmentTypeDialogActions,
} from './styles'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { recoverUserAuthData } from '@/contexts/AuthContext'
import Navigation from '@/components/PageStructure/Navigation'
import { List, Plus } from 'lucide-react'
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
import { MouseEvent, useEffect, useRef, useState } from 'react'
import { searchAddressWithPostCode } from '@/lib/postCode.api'
import { viaCepResponseType } from '@/@types/address'
import { selectData } from '@/@types/selectData'
import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import type { ResponseEstablishment } from '@/@types/responseValues/establishmentResponse'
import { resolveEstablishmentTypesToSelectInputType } from '@/utils/resolvers/resolveDataToSelectInputType'
import { useRouter } from 'next/router'

const CreateUnitySchema = z.object({
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
  boundedTo: z.string().uuid('Víncule a unidade a alguma organização'),
  unityType: z.string().min(1, 'Escolha qual o tipo de unidade'),
  targetCustomer: z.string().refine(
    (value) => {
      return unityTargetCustomers.find((option) => {
        return option.value === value
      })
    },
    {
      message: 'Informe quem a unidade atende',
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
  number: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  compliment: z.string().optional(),
  latitude: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  longitude: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined)),
})

export type CreateUnityData = z.infer<typeof CreateUnitySchema>

export interface EstablishmentType {
  id: string
  name: string
  availableFor: string
  status: string
  establishmentRegistered?: string
}

interface CreateUnityProps {
  establishmentList: selectData[] | null
  unityTypes: EstablishmentType[]
}

export default function CreateUnity({
  establishmentList,
  unityTypes,
}: CreateUnityProps) {
  const { register, handleSubmit, formState, watch, setValue, setError } =
    useForm<CreateUnityData>({
      mode: 'onSubmit',
      resolver: zodResolver(CreateUnitySchema),
    })

  const [fillWithCepFeedbackMessage, setFillWithCepFeedbackMessage] =
    useState<string>('')

  const [fillWithCepButtonLoadingState, setFillWithCepButtonLoadingState] =
    useState<boolean>(false)

  const [stateSelectData, setStateSelectData] =
    useState<selectData[]>(addressBrazilStates)

  const [createdUnityFeedbackMessage, setCreatedUnityFeedbackMessage] =
    useState<ToastFeedbackMessageType | null>(null)

  const [addNewEstablishmentTypeDialog, setAddNewEstablishmentTypeDialog] =
    useState<boolean>(false)

  const [selectInputKey, setSelectInputKey] = useState(0)

  const AddNewEstablishmentTypeTooltipRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const clearAllFields = () => {
    setValue('name', '')
    setValue('abbreviation', '')
    setValue('cnpj', '')
    setValue('mainPhone', '')
    setValue('email', '')
    setValue('secondaryPhone', '')
    setValue('especiality', '')
    setValue('unityType', '')
    setValue('boundedTo', '')
    setValue('targetCustomer', 'HUMAN')
    setValue('status', 'ACTIVE')
    setValue('postCode', '')
    setValue('street', '')
    setValue('number', undefined)
    setValue('neighborhood', '')
    setValue('city', '')
    setValue('state', '')
    setValue('compliment', '')
    setValue('latitude', undefined)
    setValue('longitude', undefined)

    setSelectInputKey((prevKey) => prevKey + 1)
  }

  const handleCreateUnity = async (data: CreateUnityData) => {
    const { 'medap.token': token } = parseCookies()
    setCreatedUnityFeedbackMessage(null)

    try {
      const response = await fetch(`http://localhost:3000/api/units`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      switch (response.status) {
        case 201: {
          setCreatedUnityFeedbackMessage({
            state: 'success',
            message: 'Unidade cadastrada com sucesso!',
          })
          clearAllFields()
          break
        }
        case 409: {
          const errorData = await response.json()
          const errorMessage = errorData.message

          setCreatedUnityFeedbackMessage({
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
              setCreatedUnityFeedbackMessage({
                state: 'error',
                message: 'Houve um conflito inesperado',
              })
              break
            }
          }

          break
        }
        default: {
          setCreatedUnityFeedbackMessage({
            state: 'error',
            message: 'Ocorreu um erro inesperado, tente novamente.',
          })
        }
      }
    } catch (error) {
      setCreatedUnityFeedbackMessage({
        state: 'error',
        message: 'Ocorreu um erro no servidor',
      })
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
      <HeaderUser title="Gerenciar unidade" />
      <CreateUnityContainer>
        <Navigation
          LinkList={[
            {
              link: '/unidade/incluir',
              active: true,
              icon: <Plus size={20} strokeWidth={2.5} />,
              text: 'Incluir nova unidade',
            },
            {
              link: '/unidade/listar',
              active: false,
              icon: <List size={20} strokeWidth={2.5} />,
              text: 'Lista de unidades',
            },
          ]}
        />
        <Box width={'full'}>
          <Text fontWeight={'light'} size={'xlarge'} color={'gray_900'}>
            Insira os dados da unidade que será cadastrada no sistema
          </Text>
          <CreateUnityForm onSubmit={handleSubmit(handleCreateUnity)}>
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
                      key={selectInputKey}
                      optionsList={resolveEstablishmentTypesToSelectInputType(
                        unityTypes,
                      )}
                      isRequired
                      inputPlaceholder="Tipo unidade"
                      inputWidth="full"
                      {...register('unityType')}
                      controlledPlaceholderState={!watch('unityType')}
                      errorMessage={formState.errors.unityType?.message}
                      handleSelectedInputChange={(selectedValue: string) => {
                        setValue('unityType', selectedValue)
                        setError('unityType', { message: '' })
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
                    key={selectInputKey}
                    optionsList={establishmentList || undefined}
                    isRequired
                    inputPlaceholder="Selecione o estabelecimento"
                    inputWidth="full"
                    hasSearch={true}
                    {...register('boundedTo')}
                    controlledPlaceholderState={!watch('boundedTo')}
                    errorMessage={formState.errors.boundedTo?.message}
                    handleSelectedInputChange={(selectedValue: string) => {
                      setValue('boundedTo', selectedValue)
                      setError('boundedTo', { message: '' })
                    }}
                  />
                </UnityEstablishmentField>
                <UnityTargetCustomerField>
                  <Text size={'xlarge'} color={'gray_600'}>
                    Público da unidade
                  </Text>
                  <SelectInput
                    key={selectInputKey}
                    optionsList={unityTargetCustomers}
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
                    key={selectInputKey}
                    optionsList={unityStatus}
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
                    key={selectInputKey}
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
            <Button>Cadastrar unidade</Button>
          </CreateUnityForm>
        </Box>
      </CreateUnityContainer>
      {createdUnityFeedbackMessage ? (
        <Toast
          message={createdUnityFeedbackMessage.message}
          hasTimer={true}
          type={createdUnityFeedbackMessage.state}
        />
      ) : null}
    </DefaultLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'medap.token': token } = parseCookies(context)

  let isUserAuthenticated = false

  const user = await recoverUserAuthData(token)

  let establishments: ResponseEstablishment[] | null = null
  let establishmentList: selectData[] | null = null
  let unityTypes: EstablishmentType[] | null = null
  let unityTypesActivated: EstablishmentType[] | null = null

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

  if (unityTypes) {
    unityTypesActivated = unityTypes.filter((unityType) => {
      return unityType.status === 'ACTIVE'
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
      establishmentList,
      unityTypes: unityTypesActivated,
    },
  }
}
