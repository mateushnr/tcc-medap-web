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
  CreateEstablishmentContainer,
  CreateEstablishmentForm,
  FormContainer,
  LineDetail,
  EstablishmentData,
  EstablishmentDataFields,
  EstablishmentDataHeader,
  EstablishmentStatusField,
  AddressDataCoordinateFields,
  EstablishmentTargetCustomerField,
  FillWithCepContainer,
  EstablishmentTypeField,
  AddNewEstablishmentTypeButtonContainer,
  AddNewEstablishmentTypeDialog,
  AddNewEstablishmentTypeDialogInfo,
  AddNewEstablishmentTypeDialogActions,
} from './styles'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { recoverUserAuthData } from '@/contexts/AuthContext'
import Navigation from '@/components/PageStructure/Navigation'
import { Hospital, List, Plus } from 'lucide-react'
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
  establishmentStatus,
  establishmentTargetCustomers,
} from '@/utils/constants/selectInputData'
import { MouseEvent, useEffect, useRef, useState } from 'react'
import { searchAddressWithPostCode } from '@/lib/postCode.api'
import { viaCepResponseType } from '@/@types/address'
import { selectData } from '@/@types/selectData'
import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import { resolveEstablishmentTypesToSelectInputType } from '@/utils/resolvers/resolveDataToSelectInputType'
import { useRouter } from 'next/router'

const CreateEstablishmentSchema = z.object({
  name: z.string().min(1, 'Informe o nome da organização'),
  abbreviation: z.string().min(1, 'Informe a sigla da organização'),
  cnpj: z
    .string()
    .min(1, 'Informe o cnpj da organização')
    .refine(isValidCNPJ, 'CNPJ inválido'),
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
  type: z.string().min(1, 'Escolha qual o tipo de estabelecimento'),
  targetCustomer: z.string().refine(
    (value) => {
      return establishmentTargetCustomers.find((option) => {
        return option.value === value
      })
    },
    {
      message: 'Informe a quem sua organização atende',
    },
  ),
  status: z.string().refine(
    (value) => {
      return establishmentStatus.find((option) => {
        return option.value === value
      })
    },
    {
      message: 'Informe a situação do estabelecimento',
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

export type CreateEstablishmentData = z.infer<typeof CreateEstablishmentSchema>

export interface EstablishmentType {
  id: string
  name: string
  availableFor: string
  status: string
  establishmentRegistered?: string
}

interface CreateEstablishmentProps {
  establishmentTypes: EstablishmentType[]
}

export default function CreateEstablishment({
  establishmentTypes,
}: CreateEstablishmentProps) {
  const { register, handleSubmit, formState, watch, setValue, setError } =
    useForm<CreateEstablishmentData>({
      mode: 'onSubmit',
      resolver: zodResolver(CreateEstablishmentSchema),
    })

  const [fillWithCepFeedbackMessage, setFillWithCepFeedbackMessage] =
    useState<string>('')

  const [fillWithCepButtonLoadingState, setFillWithCepButtonLoadingState] =
    useState<boolean>(false)

  const [stateSelectData, setStateSelectData] =
    useState<selectData[]>(addressBrazilStates)

  const [
    createdEstablishmentFeedbackMessage,
    setCreatedEstablishmentFeedbackMessage,
  ] = useState<ToastFeedbackMessageType | null>(null)

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
    setValue('type', '')
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

  const handleCreateEstablishment = async (data: CreateEstablishmentData) => {
    const { 'medap.token': token } = parseCookies()
    setCreatedEstablishmentFeedbackMessage(null)

    try {
      const response = await fetch(`http://localhost:3000/api/establishments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, establishmentType: data.type }),
      })

      switch (response.status) {
        case 201: {
          setCreatedEstablishmentFeedbackMessage({
            state: 'success',
            message: 'Estabelecimento cadastrado com sucesso!',
          })
          clearAllFields()
          break
        }
        case 409: {
          const errorData = await response.json()
          const errorMessage = errorData.message

          setCreatedEstablishmentFeedbackMessage({
            state: 'warning',
            message: 'Houve um conflito com os dados cadastrados.',
          })

          switch (errorMessage) {
            case 'Establishment with same name already exists': {
              setError(
                'name',
                { message: 'Nome já cadastrado' },
                { shouldFocus: true },
              )
              break
            }
            case 'Establishment with same abbreviation already exists': {
              setError(
                'abbreviation',
                { message: 'Sigla já cadastrada' },
                { shouldFocus: true },
              )
              break
            }
            case 'Establishment with same cnpj already exists': {
              setError(
                'cnpj',
                { message: 'CNPJ já cadastrado' },
                { shouldFocus: true },
              )
              break
            }
            case 'Establishment with same email already exists': {
              setError(
                'email',
                { message: 'Email já cadastrado' },
                { shouldFocus: true },
              )
              break
            }
            default: {
              setCreatedEstablishmentFeedbackMessage({
                state: 'error',
                message: 'Houve um conflito inesperado',
              })
              break
            }
          }

          break
        }
        default: {
          setCreatedEstablishmentFeedbackMessage({
            state: 'error',
            message: 'Ocorreu um erro inesperado, tente novamente.',
          })
        }
      }
    } catch (error) {
      setCreatedEstablishmentFeedbackMessage({
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
    router.push(`tipo`)
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
    <DefaultLayout activePage="ESTABLISHMENT">
      <HeaderUser title="Gerenciar estabelecimento" />
      <CreateEstablishmentContainer>
        <Navigation
          LinkList={[
            {
              link: '/estabelecimento/incluir',
              active: true,
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
              active: false,
              icon: <Hospital size={20} strokeWidth={2} />,
              text: 'Gerenciar tipo de estabelecimento',
            },
          ]}
        />
        <Box width={'full'}>
          <Text fontWeight={'light'} size={'xlarge'} color={'gray_900'}>
            Insira os dados do estabelecimento que será cadastrado no sistema
          </Text>
          <CreateEstablishmentForm
            onSubmit={handleSubmit(handleCreateEstablishment)}
          >
            <FormContainer>
              <EstablishmentData>
                <EstablishmentDataHeader>
                  <Heading size={'4xlarge'} color={'gray_600'}>
                    Dados do estabelecimento
                  </Heading>
                  <LineDetail />
                </EstablishmentDataHeader>
                <EstablishmentDataFields>
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
                    isRequired={true}
                    {...register('abbreviation')}
                    controlledPlaceholderState={!watch('abbreviation')}
                    errorMessage={formState.errors.abbreviation?.message}
                  />
                  <TextInput
                    inputPlaceholder="CNPJ"
                    inputWidth="full"
                    isRequired={true}
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

                  <EstablishmentTypeField>
                    <SelectInput
                      key={selectInputKey}
                      optionsList={resolveEstablishmentTypesToSelectInputType(
                        establishmentTypes,
                      )}
                      isRequired
                      inputPlaceholder="Tipo estabelecimento"
                      inputWidth="full"
                      {...register('type')}
                      controlledPlaceholderState={!watch('type')}
                      errorMessage={formState.errors.type?.message}
                      handleSelectedInputChange={(selectedValue: string) => {
                        setValue('type', selectedValue)
                        setError('type', { message: '' })
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
                  </EstablishmentTypeField>
                </EstablishmentDataFields>
                <EstablishmentTargetCustomerField>
                  <Text size={'xlarge'} color={'gray_600'}>
                    Público do estabelecimento
                  </Text>
                  <SelectInput
                    key={selectInputKey}
                    optionsList={establishmentTargetCustomers}
                    isRequired
                    inputWidth="full"
                    {...register('targetCustomer')}
                    controlledPlaceholderState={!watch('targetCustomer')}
                    errorMessage={formState.errors.targetCustomer?.message}
                    handleSelectedInputChange={(selectedValue: string) => {
                      setValue('targetCustomer', selectedValue)
                    }}
                  />
                </EstablishmentTargetCustomerField>
                <EstablishmentStatusField>
                  <Text size={'xlarge'} color={'gray_600'}>
                    Status do estabelecimento
                  </Text>
                  <SelectInput
                    key={selectInputKey}
                    optionsList={establishmentStatus}
                    isRequired
                    {...register('status')}
                    controlledPlaceholderState={!watch('status')}
                    errorMessage={formState.errors.status?.message}
                    handleSelectedInputChange={(selectedValue: string) => {
                      setValue('status', selectedValue)
                    }}
                  />
                </EstablishmentStatusField>
              </EstablishmentData>

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
            <Button>Cadastrar estabelecimento</Button>
          </CreateEstablishmentForm>
        </Box>
      </CreateEstablishmentContainer>
      {createdEstablishmentFeedbackMessage ? (
        <Toast
          message={createdEstablishmentFeedbackMessage.message}
          hasTimer={true}
          type={createdEstablishmentFeedbackMessage.state}
        />
      ) : null}
    </DefaultLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'medap.token': token } = parseCookies(context)

  let isUserAuthenticated = false

  const user = await recoverUserAuthData(token)

  let establishmentTypes: EstablishmentType[] | null = null
  let establishmentTypesActivated: EstablishmentType[] | null = null

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
    const response = await fetch(
      `http://localhost:3000/api/establishments/types/?availableFor=establishment`,
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

  if (establishmentTypes) {
    establishmentTypesActivated = establishmentTypes.filter(
      (establishmentType) => {
        return establishmentType.status === 'ACTIVE'
      },
    )
  }

  return {
    props: { establishmentTypes: establishmentTypesActivated },
  }
}
