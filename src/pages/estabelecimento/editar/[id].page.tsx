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
  EstablishmentData,
  EstablishmentDataFields,
  EstablishmentDataHeader,
  EstablishmentStatusField,
  AddressDataCoordinateFields,
  EstablishmentTargetCustomerField,
  FillWithCepContainer,
  EditEstablishmentForm,
  EditEstablishmentContainer,
  EstablishmentBeingEditedContainer,
  EstablishmentInfoContainer,
  EstablishmentNameInfo,
  ContainerCancelAction,
  EditingLabel,
  EstablishmentTypeField,
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
  establishmentStatus,
  establishmentTargetCustomers,
} from '@/utils/constants/selectInputData'
import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { searchAddressWithPostCode } from '@/lib/postCode.api'
import { viaCepResponseType } from '@/@types/address'
import { selectData } from '@/@types/selectData'
import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import establishmentIcon from '@/assets/images/establishmentIcon.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import type { EstablishmentType } from '../incluir/index.page'
import { resolveEstablishmentTypesToSelectInputType } from '@/utils/resolvers/resolveDataToSelectInputType'

export interface ResponseEstablishmentWithAddress {
  id?: string
  name: string
  abbreviation: string
  cnpj: string
  establishmentType: string
  especiality?: string
  mainPhone: string
  secondaryPhone?: string
  targetCustomer: string
  email: string
  status: string
  establishmentAddress?: string
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

const EditEstablishmentSchema = z.object({
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
  establishmentType: z.string().min(1, 'Escolha o tipo de estabelecimento'),
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

export type EditEstablishmentData = z.infer<typeof EditEstablishmentSchema>

interface EditEstablishmentProps {
  establishmentToEditData: ResponseEstablishmentWithAddress | null
  establishmentTypes: EstablishmentType[]
}

export default function EditEstablishment({
  establishmentToEditData,
  establishmentTypes,
}: EditEstablishmentProps) {
  const { register, handleSubmit, formState, watch, setValue, setError } =
    useForm<EditEstablishmentData>({
      mode: 'onSubmit',
      resolver: zodResolver(EditEstablishmentSchema),
    })

  const [fillWithCepFeedbackMessage, setFillWithCepFeedbackMessage] =
    useState<string>('')

  const [fillWithCepButtonLoadingState, setFillWithCepButtonLoadingState] =
    useState<boolean>(false)

  const [stateSelectData, setStateSelectData] =
    useState<selectData[]>(addressBrazilStates)

  const [establishmentTypeSelectData, setEstablishmentTypeSelectData] =
    useState<selectData[]>(
      resolveEstablishmentTypesToSelectInputType(establishmentTypes),
    )

  const [
    establishmentTargetCustomerSelectData,
    setEstablishmentTargetCustomerSelectData,
  ] = useState<selectData[]>(establishmentTargetCustomers)

  const [establishmentStatusSelectData, setEstablishmentStatusSelectData] =
    useState<selectData[]>(establishmentStatus)

  const [
    editedEstablishmentFeedbackMessage,
    setEditedEstablishmentFeedbackMessage,
  ] = useState<ToastFeedbackMessageType | null>(null)

  const [addNewEstablishmentTypeDialog, setAddNewEstablishmentTypeDialog] =
    useState<boolean>(false)

  const AddNewEstablishmentTypeTooltipRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const handleCancelEditEstablishment = () => {
    router.back()
  }

  const fillAllFieldsWithEstablishmentData = useCallback(() => {
    if (establishmentToEditData) {
      setValue('name', establishmentToEditData.name)
      setValue('abbreviation', establishmentToEditData.abbreviation)
      setValue('cnpj', establishmentToEditData.cnpj)
      setValue('mainPhone', establishmentToEditData.mainPhone)
      setValue('email', establishmentToEditData.email)
      setValue('secondaryPhone', establishmentToEditData.secondaryPhone)
      setValue('especiality', establishmentToEditData?.especiality)

      setEstablishmentTypeSelectData((prev) => {
        return prev.map((option) => {
          return option.value === establishmentToEditData.establishmentType
            ? { text: option.text, value: option.value, selected: true }
            : option
        })
      })
      setValue('establishmentType', establishmentToEditData.establishmentType)

      setEstablishmentTargetCustomerSelectData((prev) => {
        return prev.map((option) => {
          return option.value === establishmentToEditData.targetCustomer
            ? { text: option.text, value: option.value, selected: true }
            : option
        })
      })
      setValue('targetCustomer', establishmentToEditData.targetCustomer)

      setEstablishmentStatusSelectData((prev) => {
        return prev.map((option) => {
          return option.value === establishmentToEditData.status
            ? { text: option.text, value: option.value, selected: true }
            : option
        })
      })
      setValue('status', establishmentToEditData.status)

      setValue('postCode', establishmentToEditData.postCode)
      setValue('street', establishmentToEditData.street || '')
      setValue('neighborhood', establishmentToEditData.neighborhood || '')
      setValue('city', establishmentToEditData.city || '')

      setStateSelectData((prev) => {
        return prev.map((option) => {
          return option.value === establishmentToEditData.state
            ? { text: option.text, value: option.value, selected: true }
            : option
        })
      })
      setValue('state', establishmentToEditData.state || '')
      setValue('compliment', establishmentToEditData.compliment || '')
      setValue('number', establishmentToEditData.number || null)
      setValue('latitude', establishmentToEditData.latitude || null)
      setValue('longitude', establishmentToEditData.longitude || null)
    }
  }, [establishmentToEditData, setValue])

  const checkIfAnyDataChanged = (data: EditEstablishmentData) => {
    if (!establishmentToEditData) return false

    const establishmentDataWithoutId = { ...establishmentToEditData }
    delete establishmentDataWithoutId.id
    delete establishmentDataWithoutId.establishmentAddress

    const establishmentToEditOldData = Object.entries(
      establishmentDataWithoutId,
    )

    const establishmentToEditNewData = Object.entries(data)

    const hasChanges = establishmentToEditNewData.some(([key, newValue]) => {
      const oldValue = establishmentToEditOldData.find(([newKey]) => {
        return newKey === key
      })?.[1]

      if (!oldValue && !newValue) {
        return false
      }

      return oldValue !== newValue
    })

    return hasChanges
  }

  const handleEditEstablishment = async (data: EditEstablishmentData) => {
    const { 'medap.token': token } = parseCookies()
    setEditedEstablishmentFeedbackMessage(null)

    if (!checkIfAnyDataChanged(data)) {
      setTimeout(() => {
        setEditedEstablishmentFeedbackMessage({
          state: 'warning',
          message: 'Nada foi modificado para ser atualizado',
        })
      }, 1)

      return
    }

    if (establishmentToEditData?.id) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/establishments/?id=${router.query.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...data }),
          },
        )

        switch (response.status) {
          case 200: {
            setEditedEstablishmentFeedbackMessage({
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

            setEditedEstablishmentFeedbackMessage({
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
                setEditedEstablishmentFeedbackMessage({
                  state: 'error',
                  message: 'Houve um conflito inesperado',
                })
                break
              }
            }

            break
          }
          default: {
            const errorData = await response.json()
            const errorMessage = errorData.message
            console.log(errorMessage)
            setEditedEstablishmentFeedbackMessage({
              state: 'error',
              message: 'Ocorreu um erro inesperado, tente novamente.',
            })
          }
        }
      } catch (error) {
        setEditedEstablishmentFeedbackMessage({
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
    fillAllFieldsWithEstablishmentData()
  }, [fillAllFieldsWithEstablishmentData])

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
      <HeaderUser title="Editar estabelecimento" />
      <EditEstablishmentContainer>
        <Box width={'full'}>
          <EstablishmentBeingEditedContainer>
            <EstablishmentInfoContainer>
              <Image
                priority
                src={establishmentIcon}
                alt="Logo medap"
                height={60}
                width={60}
              />
              <EstablishmentNameInfo>
                <Text color={'gray_700'} size={'2xlarge'}>
                  {establishmentToEditData?.name}
                </Text>
                <Text color={'gray_600'} size={'xlarge'}>
                  {establishmentToEditData?.abbreviation}
                </Text>
              </EstablishmentNameInfo>
            </EstablishmentInfoContainer>
            <ContainerCancelAction>
              <EditingLabel>
                <Pencil />
                <Text color={'warning_500'} size={'xlarge'}>
                  Editando estabelecimento
                </Text>
              </EditingLabel>
              <Button
                onClick={handleCancelEditEstablishment}
                variant={'danger_secondary'}
              >
                Cancelar
              </Button>
            </ContainerCancelAction>
          </EstablishmentBeingEditedContainer>
          <EditEstablishmentForm
            onSubmit={handleSubmit(handleEditEstablishment)}
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
                      optionsList={establishmentTypeSelectData}
                      isRequired
                      inputPlaceholder="Tipo estabelecimento"
                      inputWidth="full"
                      {...register('establishmentType')}
                      controlledPlaceholderState={!watch('establishmentType')}
                      errorMessage={formState.errors.establishmentType?.message}
                      handleSelectedInputChange={(selectedValue: string) => {
                        setValue('establishmentType', selectedValue)
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
                    optionsList={establishmentTargetCustomerSelectData}
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
                    optionsList={establishmentStatusSelectData}
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
            <Button>Editar estabelecimento</Button>
          </EditEstablishmentForm>
        </Box>
      </EditEstablishmentContainer>
      {editedEstablishmentFeedbackMessage ? (
        <Toast
          message={editedEstablishmentFeedbackMessage.message}
          hasTimer={true}
          type={editedEstablishmentFeedbackMessage.state}
        />
      ) : null}
    </DefaultLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'medap.token': token } = parseCookies(context)

  let isUserAuthenticated = false

  const user = await recoverUserAuthData(token)

  let establishmentToEditData: EditEstablishmentData | null = null
  let establishmentTypes: EstablishmentType[] | null = null
  let establishmentTypesActivated: EstablishmentType[] | null = null

  const routeParams = context.params

  if (user != null) {
    isUserAuthenticated = true

    if (routeParams) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/establishments/?id=${routeParams.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.ok) {
          establishmentToEditData = await response.json()
        } else {
          throw new Error('Falha em recuperar dados do estabelecimento')
        }
      } catch (error) {
        console.error('Falha em recuperar dados do estabelecimento: ', error)
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
  }

  if (establishmentTypes) {
    establishmentTypesActivated = establishmentTypes.filter(
      (establishmentType) => {
        return establishmentType.status === 'ACTIVE'
      },
    )
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
      establishmentToEditData,
      establishmentTypes: establishmentTypesActivated,
    },
  }
}
