import DefaultLayout from '@/layouts/DefaultLayout'
import {
  Box,
  Button,
  DateInput,
  Heading,
  IconButton,
  Modal,
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
  CreateProfessionalContainer,
  CreateProfessionalForm,
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
  AddPatientResponsibleContainer,
  PatientsSelectedContainer,
  PatientsSelectedOptionContainer,
  PatientDocumentsContainer,
  PatientDocumentsFieldsContainer,
  PatientIdentifierDocumentSelected,
  CheckboxContainer,
  Checkbox,
  Label,
  PetsListContainer,
  PetsListHeader,
  PetItemContainer,
  PetItemHeader,
  PetItemHeaderInfo,
  PetItemHeaderInfoContainer,
  PetItemContentContainer,
  PetInputContainer,
  PetRadioContainer,
  PetRadioItem,
  IncludePetForm,
} from './styles'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { recoverUserAuthData } from '@/contexts/AuthContext'
import Navigation from '@/components/PageStructure/Navigation'
import { List, Plus, X } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { handlePhoneChange } from '@/utils/formatters/phone'
import { handleFloatNumberChange } from '@/utils/formatters/floatNumber'
import { handleOnlyDigitsChange } from '@/utils/formatters/onlyDigits'
import { handleCepChange } from '@/utils/formatters/cep'
import petIcon from '@/assets/images/icon-pet.svg'
import {
  addressBrazilStates,
  customerStatus,
  professionalStatus,
} from '@/utils/constants/selectInputData'
import { MouseEvent, useState } from 'react'
import { searchAddressWithPostCode } from '@/lib/postCode.api'
import { viaCepResponseType } from '@/@types/address'
import { selectData } from '@/@types/selectData'
import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import type { ResponseEstablishment } from '@/@types/responseValues/establishmentResponse'
import { handleCpfChange, isValidCPF } from '@/utils/formatters/cpf'
import type { ResponseCustomer } from '@/@types/responseValues/customerResponse'
import Image from 'next/image'
import type { Pet } from '@/@types/pet'
import {
  resolvePetSexValue,
  resolvePetSizeValue,
} from '@/utils/resolvers/resolveSelectValuesToText'

export interface CustomerDataToSendProps {
  name: string
  documentType?: string
  cpf?: string
  otherDocument?: string
  email?: string
  cns?: string
  birthDate?: string
  mainPhone?: string
  secondaryPhone?: string
  isPatient: boolean
  isResponsible: boolean
  isTutor: boolean
  status: string
  establishmentBounded: string
  postCode?: string
  street?: string
  number?: number
  neighborhood?: string
  city?: string
  state?: string
  compliment?: string
  latitude?: number
  longitude?: number
  patientSelected?: string
  patientsResponsibleIdList?: string[]
  petsList?: Pet[]
}

const CreateCustomerSchema = z
  .object({
    name: z.string().min(1, 'Informe o nome do cliente'),
    cpf: z.string().refine((cpf) => {
      return cpf === '' || isValidCPF(cpf)
    }, 'CPF inválido'),
    email: z.string().refine((email) => {
      const regexEmail =
        /^[a-zA-Z0-9!#$%&'*/=?^._+\-`{|}~\\]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
      return email === '' || regexEmail.test(email)
    }, 'Email inválido'),
    cns: z.string().optional(),
    documentType: z.enum(['CPF', 'OTHER']),
    otherDocument: z.string().optional(),
    birthDate: z.string().optional(),
    mainPhone: z.string().optional(),
    secondaryPhone: z.string().optional(),
    isPatient: z.preprocess((value) => value === 'isPatient', z.boolean()),
    isResponsible: z.boolean(),
    isTutor: z.boolean(),
    status: z.string().refine(
      (value) => {
        return customerStatus.find((option) => {
          return option.value === value
        })
      },
      {
        message: 'Informe a situação do cliente',
      },
    ),
    establishmentBounded: z
      .string()
      .uuid('Selecione algum estabelecimento para vincular ao cliente'),
    patientSelected: z.string().optional(),
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
    patientsResponsibleIdList: z.array(z.string()).optional(),
  })
  .refine(
    (data) =>
      (data.documentType === 'CPF' && data.cpf !== '') ||
      data.documentType === 'OTHER',
    {
      message: 'Preencha o CPF do cliente',
      path: ['cpf'],
    },
  )
  .refine(
    (data) =>
      (data.documentType === 'OTHER' && data.otherDocument !== '') ||
      data.documentType === 'CPF',
    {
      message: 'Preencha o documento do cliente',
      path: ['otherDocument'],
    },
  )

export type CreateCustomerData = z.infer<typeof CreateCustomerSchema>

const IncludePetSchema = z.object({
  petName: z.string().min(1, 'Informe o nome do pet'),
  specie: z.string().min(1, 'Informe a espécie do pet'),
  breed: z.string().optional(),
  age: z.string().optional(),
  size: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
  sex: z.enum(['MALE', 'FEMALE']),
  status: z.string().refine(
    (value) => {
      return customerStatus.find((option) => {
        return option.value === value
      })
    },
    {
      message: 'Informe a situação do pet',
    },
  ),
})

export type IncludePetData = z.infer<typeof IncludePetSchema>

interface CreateCustomerProps {
  establishmentList: selectData[] | null
}

export default function CreateCustomer({
  establishmentList,
}: CreateCustomerProps) {
  const {
    register: customerRegister,
    handleSubmit: handleCustomerSubmit,
    formState: customerFormState,
    watch: watchCustomer,
    setValue: setCustomerValue,
    setError: setCustomerError,
  } = useForm<CreateCustomerData>({
    mode: 'onSubmit',
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      isResponsible: false,
      isTutor: false,
      documentType: 'CPF',
      otherDocument: '',
    },
  })

  const {
    register: petRegister,
    handleSubmit: handlePetSubmit,
    formState: petFormState,
    watch: watchPet,
    setValue: setPetValue,
  } = useForm<IncludePetData>({
    mode: 'onSubmit',
    resolver: zodResolver(IncludePetSchema),
    defaultValues: {
      size: 'SMALL',
      sex: 'MALE',
    },
  })

  const [fillWithCepFeedbackMessage, setFillWithCepFeedbackMessage] =
    useState<string>('')

  const [fillWithCepButtonLoadingState, setFillWithCepButtonLoadingState] =
    useState<boolean>(false)

  const [petsList, setPetsList] = useState<Pet[]>([])

  const [stateSelectData, setStateSelectData] =
    useState<selectData[]>(addressBrazilStates)

  const [
    createdProfessionalFeedbackMessage,
    setCreatedProfessionalFeedbackMessage,
  ] = useState<ToastFeedbackMessageType | null>(null)

  const [currentFormTab, setCurrentFormTab] = useState<string>('address')

  const [selectInputKey, setSelectInputKey] = useState(0)
  const [selectPetInputKey, setSelectPetInputKey] = useState(0)
  const [inputKey, setInputKey] = useState(0)

  const [isEstablishmentSelected, setIsEstablishmentSelected] =
    useState<boolean>(false)

  const [selectPatientListInputKey, setSelectPatientListInputKey] = useState(0)

  const [documentIdentifierTypeSelected, setDocumentIdentifierTypeSelected] =
    useState<string>(watchCustomer('documentType'))

  const [patientsListData, setPatientsListData] = useState<selectData[] | null>(
    null,
  )

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const [selectPatientsListData, setSelectPatientsListData] = useState<
    selectData[] | null
  >(null)

  const [patientsResponsibleSelectedList, setPatientsResponsibleSelectedList] =
    useState<selectData[]>([])

  const handleModalOpen = (e: MouseEvent) => {
    e.preventDefault()
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    clearPetForm()

    setModalOpen(false)
  }

  const clearPetForm = () => {
    setPetValue('petName', '')
    setPetValue('specie', '')
    setPetValue('breed', '')
    setPetValue('age', '')
    setPetValue('size', 'SMALL')
    setPetValue('sex', 'MALE')
    setPetValue('status', 'ACTIVE')
    setSelectPetInputKey((prevKey) => prevKey + 1)
  }

  const clearAllFields = () => {
    setCustomerValue('name', '')
    setCustomerValue('cpf', '')
    setCustomerValue('otherDocument', '')
    setCustomerValue('cns', '')
    setCustomerValue('mainPhone', '')
    setCustomerValue('secondaryPhone', '')
    setCustomerValue('email', '')
    setCustomerValue('birthDate', '')
    setCustomerValue('status', 'ACTIVE')
    setCustomerValue('establishmentBounded', '')
    setCustomerValue('patientSelected', '')
    setCustomerValue('isPatient', false)
    setCustomerValue('documentType', 'CPF')
    setDocumentIdentifierTypeSelected('CPF')

    setCustomerValue('postCode', '')
    setCustomerValue('street', '')
    setCustomerValue('number', undefined)
    setCustomerValue('neighborhood', '')
    setCustomerValue('city', '')
    setCustomerValue('state', '')
    setCustomerValue('compliment', '')
    setCustomerValue('latitude', undefined)
    setCustomerValue('longitude', undefined)
    setCustomerValue('patientsResponsibleIdList', undefined)

    setStateSelectData(addressBrazilStates)
    setSelectInputKey((prevKey) => prevKey + 1)

    setCurrentFormTab('address')
    setIsEstablishmentSelected(false)
    setSelectPatientListInputKey((prev) => prev + 1)
    setSelectPatientsListData(null)
    setPatientsListData(null)
    setPatientsResponsibleSelectedList([])
    setPetsList([])
  }

  const handleGetPatientsFromEstablishmentSelected = async (
    idEstablishmentSelected: string,
  ) => {
    const { 'medap.token': token } = parseCookies()

    let patients: ResponseCustomer[] | null = null
    let patientsList: selectData[] | null = null

    const responsePatients = await fetch(
      `http://localhost:3000/api/customers?type=patient&fromEstablishment=${idEstablishmentSelected}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    patients = await responsePatients.json()

    if (patients) {
      patientsList = patients.map((patient) => {
        return { text: patient.name, value: patient.id }
      })
    }

    setSelectPatientsListData(patientsList)
    setPatientsListData(patientsList)
    setSelectPatientListInputKey((prev) => {
      return prev + 1
    })
  }

  const handleIncludePet = (data: IncludePetData) => {
    setPetsList([...petsList, data])
    setModalOpen(false)
    clearPetForm()
  }

  const handleRemovePet = (indexToRemove: number, e: MouseEvent) => {
    e.preventDefault()
    setPetsList((prevList) =>
      prevList.filter((_, index) => index !== indexToRemove),
    )
  }

  const handleCreateCustomer = async (data: CreateCustomerData) => {
    const { 'medap.token': token } = parseCookies()
    setCreatedProfessionalFeedbackMessage(null)

    const customerDataToSend: CustomerDataToSendProps = {
      ...data,
      patientsResponsibleIdList: patientsResponsibleSelectedList.map(
        (patient) => {
          return patient.value
        },
      ),
      petsList,
      isResponsible: patientsResponsibleSelectedList.length > 0,
      isTutor: petsList.length > 0,
    }

    delete customerDataToSend.documentType
    delete customerDataToSend.patientSelected

    try {
      const response = await fetch(`http://localhost:3000/api/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(customerDataToSend),
      })

      switch (response.status) {
        case 201: {
          setCreatedProfessionalFeedbackMessage({
            state: 'success',
            message: 'Cliente cadastrado com sucesso!',
          })
          clearAllFields()
          updatePatientsListData(token)
          break
        }
        case 409: {
          const errorData = await response.json()
          const errorMessage = errorData.message

          setCreatedProfessionalFeedbackMessage({
            state: 'warning',
            message: 'Houve um conflito com os dados cadastrados.',
          })

          switch (errorMessage) {
            case 'Customer with same CPF already exists.': {
              setCustomerValue('documentType', 'CPF')
              setCustomerError(
                'cpf',
                { message: 'CPF já cadastrado' },
                { shouldFocus: true },
              )
              break
            }
            case 'Customer with same document already exists.': {
              setCustomerValue('documentType', 'OTHER')
              setCustomerError(
                'otherDocument',
                { message: 'Documento já cadastrado' },
                { shouldFocus: true },
              )
              break
            }
            case 'Customer with same email already exists.': {
              setCustomerError(
                'email',
                { message: 'Email já cadastrado' },
                { shouldFocus: true },
              )
              break
            }
            default: {
              setCreatedProfessionalFeedbackMessage({
                state: 'error',
                message: 'Houve um conflito inesperado',
              })
              break
            }
          }

          break
        }
        default: {
          setCreatedProfessionalFeedbackMessage({
            state: 'error',
            message: 'Ocorreu um erro inesperado, tente novamente.',
          })
        }
      }
    } catch (error) {
      setCreatedProfessionalFeedbackMessage({
        state: 'error',
        message: 'Ocorreu um erro no servidor',
      })
    }
  }

  const fillAddressFormWithCepData = (addressData: viaCepResponseType) => {
    setCustomerValue('street', addressData.logradouro)
    setCustomerValue('neighborhood', addressData.bairro)
    setCustomerValue('city', addressData.localidade)
    setCustomerValue('state', addressData.uf?.toLocaleUpperCase())

    setStateSelectData((prev) => {
      return prev.map((option) => {
        return option.value === addressData.uf
          ? { text: option.text, value: option.value, selected: true }
          : option
      })
    })
  }

  const updatePatientsListData = async (token: string) => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/customers/?type=patient',
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
          const patientsListDataUpdated = await response.json()
          const patientsUpdateSelectList: selectData[] =
            patientsListDataUpdated.map((patient: ResponseCustomer) => {
              return { text: patient.name, value: patient.id }
            })
          setSelectPatientsListData(patientsUpdateSelectList)

          break
        }
      }
    } catch (error) {
      throw new Error('Erro ocorrido: ' + error)
    }
  }

  const handleFillWithPostCode = async (e: MouseEvent) => {
    e.preventDefault()

    const postCodeValue = watchCustomer('postCode')

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

  const handleRadioOptionDocumentIdentifierTypeClick = (
    e: MouseEvent<HTMLInputElement>,
  ) => {
    const radioOption = e.target as HTMLInputElement

    setInputKey((prev) => {
      return prev + 1
    })

    setDocumentIdentifierTypeSelected(radioOption.value)
  }

  const handleRemovePatientFromSelectedListClick = (
    idPatientToRemove: string,
    e: MouseEvent,
  ) => {
    e.preventDefault()

    let patientSelectedName: string
    if (patientsListData) {
      patientSelectedName =
        patientsListData.find((patient) => {
          return idPatientToRemove === patient.value
        })?.text || ''
    }

    setSelectPatientsListData((prev) => {
      if (prev) {
        return [
          ...prev,
          { value: idPatientToRemove, text: patientSelectedName },
        ]
      }

      return prev
    })

    setPatientsResponsibleSelectedList((prev) => {
      if (prev) {
        return prev.filter((option) => {
          return option.value !== idPatientToRemove
        })
      }

      return prev
    })

    setCustomerValue('patientSelected', '')
    setSelectPatientListInputKey((prev) => prev + 1)
  }

  const handleAddPatientToResponsibleListClick = (e: MouseEvent) => {
    e.preventDefault()

    const patientSelectedId = watchCustomer('patientSelected')

    if (!patientSelectedId) {
      return
    }

    let patientSelectedName: string
    if (patientsListData) {
      patientSelectedName =
        patientsListData.find((patient) => {
          return patientSelectedId === patient.value
        })?.text || ''
    }

    setSelectPatientsListData((prev) => {
      if (prev) {
        return prev.filter((option) => {
          return option.value !== patientSelectedId
        })
      }

      return prev
    })

    setPatientsResponsibleSelectedList((prev) => {
      if (patientSelectedId !== undefined) {
        return [
          ...prev,
          { value: patientSelectedId, text: patientSelectedName },
        ]
      }

      return prev
    })

    setCustomerValue('patientSelected', '')
    setSelectPatientListInputKey((prev) => prev + 1)
  }

  return (
    <DefaultLayout activePage="PATIENT">
      <HeaderUser title="Gerenciar paciente" />
      <CreateProfessionalContainer>
        <Navigation
          LinkList={[
            {
              link: '/paciente/incluir',
              active: true,
              icon: <Plus size={20} strokeWidth={2.5} />,
              text: 'Incluir novo cliente',
            },
            {
              link: '/paciente/listar',
              active: false,
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
          <Text fontWeight={'light'} size={'xlarge'} color={'gray_900'}>
            Insira os dados do cliente que será cadastrado no sistema
          </Text>
          <CreateProfessionalForm
            onSubmit={handleCustomerSubmit(handleCreateCustomer)}
          >
            <FormContainer>
              <ProfessionalData>
                <ProfessionalDataHeader>
                  <Heading size={'4xlarge'} color={'gray_600'}>
                    Dados do cliente
                  </Heading>
                  <LineDetail />
                </ProfessionalDataHeader>
                <ProfessionalDataFields>
                  <TextInput
                    inputPlaceholder="Nome"
                    inputWidth="full"
                    isRequired={true}
                    {...customerRegister('name')}
                    controlledPlaceholderState={!watchCustomer('name')}
                    errorMessage={customerFormState.errors.name?.message}
                  />
                  <TextInput
                    inputPlaceholder="Email"
                    inputWidth="full"
                    {...customerRegister('email')}
                    controlledPlaceholderState={!watchCustomer('email')}
                    errorMessage={customerFormState.errors.email?.message}
                  />
                  <TextInput
                    inputPlaceholder="Telefone"
                    inputWidth="full"
                    {...customerRegister('mainPhone', {
                      onChange: handlePhoneChange,
                    })}
                    controlledPlaceholderState={!watchCustomer('mainPhone')}
                    errorMessage={customerFormState.errors.mainPhone?.message}
                    maxLength={13}
                  />

                  <TextInput
                    inputPlaceholder="Telefone secundário"
                    inputWidth="full"
                    {...customerRegister('secondaryPhone', {
                      onChange: handlePhoneChange,
                    })}
                    controlledPlaceholderState={
                      !watchCustomer('secondaryPhone')
                    }
                    errorMessage={
                      customerFormState.errors.secondaryPhone?.message
                    }
                    maxLength={13}
                  />
                  <TextInput
                    inputPlaceholder="CNS"
                    inputWidth="full"
                    {...customerRegister('cns')}
                    controlledPlaceholderState={!watchCustomer('cns')}
                    errorMessage={customerFormState.errors.cns?.message}
                  />

                  <CheckboxContainer>
                    <Checkbox
                      id="isPatient"
                      type="checkbox"
                      {...customerRegister('isPatient')}
                      value="isPatient"
                    />
                    <Label htmlFor="isPatient">
                      O cliente será cadastrado como um{' '}
                      <Text fontWeight={'black'} color={'brand_600'}>
                        paciente
                      </Text>{' '}
                      do sistema
                    </Label>
                  </CheckboxContainer>
                </ProfessionalDataFields>

                <PatientDocumentsContainer>
                  <Text size={'xlarge'} color={'gray_600'}>
                    Documento identificador
                  </Text>
                  <PatientDocumentsFieldsContainer>
                    <PatientIdentifierDocumentSelected>
                      <RadioInput
                        radioId="cpf"
                        {...customerRegister('documentType')}
                        value="CPF"
                        labelText="CPF"
                        variant="default"
                        radioSize="small"
                        onClick={handleRadioOptionDocumentIdentifierTypeClick}
                      />
                      <RadioInput
                        radioId="other"
                        {...customerRegister('documentType')}
                        value="OTHER"
                        labelText="Outro documento"
                        variant="default"
                        radioSize="small"
                        onClick={handleRadioOptionDocumentIdentifierTypeClick}
                      />
                    </PatientIdentifierDocumentSelected>

                    {documentIdentifierTypeSelected === 'CPF' ? (
                      <TextInput
                        key={inputKey}
                        inputPlaceholder="CPF"
                        inputWidth="full"
                        isRequired={true}
                        {...customerRegister('cpf', {
                          onChange: handleCpfChange,
                        })}
                        controlledPlaceholderState={!watchCustomer('cpf')}
                        errorMessage={customerFormState.errors.cpf?.message}
                        maxLength={14}
                      />
                    ) : (
                      <TextInput
                        key={inputKey}
                        inputPlaceholder="Documento"
                        inputWidth="full"
                        isRequired={true}
                        {...customerRegister('otherDocument')}
                        controlledPlaceholderState={
                          !watchCustomer('otherDocument')
                        }
                        errorMessage={
                          customerFormState.errors.otherDocument?.message
                        }
                      />
                    )}
                  </PatientDocumentsFieldsContainer>
                </PatientDocumentsContainer>

                <ProfessionalBirthDateAndStatusContainer>
                  <ProfessionalBirthDateField>
                    <Text size={'xlarge'} color={'gray_600'}>
                      Data de nascimento
                    </Text>
                    <DateInput
                      inputWidth="full"
                      {...customerRegister('birthDate')}
                      errorMessage={customerFormState.errors.birthDate?.message}
                    />
                  </ProfessionalBirthDateField>
                  <ProfessionalStatusField>
                    <Text size={'xlarge'} color={'gray_600'}>
                      Status
                    </Text>
                    <SelectInput
                      key={selectInputKey}
                      optionsList={professionalStatus}
                      inputWidth="full"
                      isRequired
                      {...customerRegister('status')}
                      controlledPlaceholderState={!watchCustomer('status')}
                      errorMessage={customerFormState.errors.status?.message}
                      handleSelectedInputChange={(selectedValue: string) => {
                        setCustomerValue('status', selectedValue)
                      }}
                    />
                  </ProfessionalStatusField>
                </ProfessionalBirthDateAndStatusContainer>
                <ProfessionalCredentialsContainer>
                  <Text size={'xlarge'} color={'gray_600'}>
                    Estabelecimento vinculado
                  </Text>
                  <SelectInput
                    key={selectInputKey}
                    optionsList={establishmentList || undefined}
                    isRequired
                    inputPlaceholder="Selecione o estabelecimento"
                    inputWidth="full"
                    hasSearch={true}
                    {...customerRegister('establishmentBounded')}
                    controlledPlaceholderState={
                      !watchCustomer('establishmentBounded')
                    }
                    errorMessage={
                      customerFormState.errors.establishmentBounded?.message
                    }
                    handleSelectedInputChange={(selectedValue: string) => {
                      setCustomerValue('establishmentBounded', selectedValue)
                      setCustomerError('establishmentBounded', { message: '' })
                      setIsEstablishmentSelected(true)
                      handleGetPatientsFromEstablishmentSelected(selectedValue)
                    }}
                  />
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
                      setCurrentFormTab('responsible')
                    }}
                    active={currentFormTab === 'responsible'}
                  >
                    <Heading fontWeight={'light'}>
                      Atribuir paciente responsável
                    </Heading>
                  </TabLink>
                  <TabLink
                    onClick={() => {
                      setCurrentFormTab('pet')
                    }}
                    active={currentFormTab === 'pet'}
                  >
                    <Heading fontWeight={'light'}>Incluir pet</Heading>
                  </TabLink>
                </FormTabMenuNavigation>
                <FormTabContent active={currentFormTab === 'address'}>
                  <AddressData>
                    <AddressDataFields>
                      <TextInput
                        inputPlaceholder="CEP"
                        inputWidth="full"
                        {...customerRegister('postCode', {
                          onChange: handleCepChange,
                        })}
                        controlledPlaceholderState={!watchCustomer('postCode')}
                        errorMessage={
                          customerFormState.errors.postCode?.message
                        }
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
                        {...customerRegister('street')}
                        controlledPlaceholderState={!watchCustomer('street')}
                        errorMessage={customerFormState.errors.street?.message}
                      />
                      <TextInput
                        inputPlaceholder="Número"
                        inputWidth="full"
                        {...customerRegister('number', {
                          onChange: handleOnlyDigitsChange,
                        })}
                        controlledPlaceholderState={!watchCustomer('number')}
                        errorMessage={customerFormState.errors.number?.message}
                      />
                      <TextInput
                        inputPlaceholder="Bairro"
                        inputWidth="full"
                        {...customerRegister('neighborhood')}
                        controlledPlaceholderState={
                          !watchCustomer('neighborhood')
                        }
                        errorMessage={
                          customerFormState.errors.neighborhood?.message
                        }
                      />
                      <TextInput
                        inputPlaceholder="Cidade"
                        inputWidth="full"
                        {...customerRegister('city')}
                        controlledPlaceholderState={!watchCustomer('city')}
                        errorMessage={customerFormState.errors.city?.message}
                      />
                      <SelectInput
                        key={selectInputKey}
                        optionsList={stateSelectData}
                        inputPlaceholder="Estado"
                        inputWidth="full"
                        {...customerRegister('state')}
                        controlledPlaceholderState={!watchCustomer('state')}
                        errorMessage={customerFormState.errors.state?.message}
                        handleSelectedInputChange={(selectedValue: string) => {
                          setCustomerValue('state', selectedValue)
                        }}
                      />
                      <TextArea
                        textAreaPlaceholder="Complemento"
                        textAreaWidth="full"
                        textAreaHeight="medium"
                        {...customerRegister('compliment')}
                        controlledPlaceholderState={
                          !watchCustomer('compliment')
                        }
                        errorMessage={
                          customerFormState.errors.compliment?.message
                        }
                      />
                    </AddressDataFields>
                    <AddressDataCoordinateFields>
                      <TextInput
                        inputPlaceholder="Latitude"
                        inputWidth="full"
                        {...customerRegister('latitude', {
                          onChange: handleFloatNumberChange,
                        })}
                        controlledPlaceholderState={!watchCustomer('latitude')}
                        errorMessage={
                          customerFormState.errors.latitude?.message
                        }
                      />
                      <TextInput
                        inputPlaceholder="Longitude"
                        inputWidth="full"
                        {...customerRegister('longitude', {
                          onChange: handleFloatNumberChange,
                        })}
                        controlledPlaceholderState={!watchCustomer('longitude')}
                        errorMessage={
                          customerFormState.errors.longitude?.message
                        }
                      />
                    </AddressDataCoordinateFields>
                  </AddressData>
                </FormTabContent>

                <FormTabContent active={currentFormTab === 'responsible'}>
                  <ProfessionalEstablishmentField>
                    {isEstablishmentSelected ? (
                      <>
                        <Text size={'xlarge'} color={'gray_600'}>
                          Selecione o paciente para atribuir como responsável:
                        </Text>
                        <AddPatientResponsibleContainer>
                          <SelectInput
                            key={selectPatientListInputKey}
                            optionsList={selectPatientsListData || undefined}
                            isRequired
                            inputPlaceholder="Selecione o paciente"
                            inputWidth="full"
                            hasSearch={true}
                            {...customerRegister('patientSelected')}
                            controlledPlaceholderState={
                              !watchCustomer('patientSelected')
                            }
                            errorMessage={
                              customerFormState.errors.patientSelected?.message
                            }
                            handleSelectedInputChange={(
                              selectedValue: string,
                            ) => {
                              setCustomerValue('patientSelected', selectedValue)
                              setCustomerError('patientSelected', {
                                message: '',
                              })
                            }}
                          />
                          <Button
                            onClick={handleAddPatientToResponsibleListClick}
                            variant={'brand_secondary'}
                          >
                            Adicionar paciente
                          </Button>
                        </AddPatientResponsibleContainer>
                        <PatientsSelectedContainer>
                          {patientsResponsibleSelectedList.map((patient) => {
                            return (
                              <PatientsSelectedOptionContainer
                                key={patient.value}
                              >
                                <IconButton
                                  variant={'icon_danger'}
                                  size={'small'}
                                  onClick={(e) =>
                                    handleRemovePatientFromSelectedListClick(
                                      patient.value,
                                      e,
                                    )
                                  }
                                >
                                  <X />
                                </IconButton>
                                <Text>{patient.text}</Text>
                              </PatientsSelectedOptionContainer>
                            )
                          })}
                        </PatientsSelectedContainer>
                      </>
                    ) : (
                      <Text size={'xlarge'} color={'danger_500'}>
                        Selecione um estabelecimento para o cliente primeiro
                      </Text>
                    )}
                  </ProfessionalEstablishmentField>
                </FormTabContent>
                <FormTabContent active={currentFormTab === 'pet'}>
                  <ProfessionalEstablishmentField>
                    <PetsListHeader>
                      <Text size={'xlarge'} color={'gray_600'}>
                        Pets a serem incluídos
                      </Text>
                      <Button
                        onClick={handleModalOpen}
                        variant={'brand_secondary'}
                      >
                        Adicionar Pet
                      </Button>
                    </PetsListHeader>
                    <PetsListContainer>
                      {petsList.map((pet, index) => (
                        <PetItemContainer key={index}>
                          <PetItemHeader>
                            <PetItemHeaderInfoContainer>
                              <Image
                                priority
                                src={petIcon}
                                alt="Ícone pet"
                                height={48}
                                width={48}
                              />
                              <PetItemHeaderInfo>
                                <div>
                                  <Text
                                    fontWeight={'black'}
                                    color={'brand_dark'}
                                  >
                                    Nome:
                                  </Text>{' '}
                                  {pet.petName}
                                </div>
                                <div>
                                  <Text
                                    fontWeight={'black'}
                                    color={'brand_dark'}
                                  >
                                    Espécie:
                                  </Text>{' '}
                                  {pet.specie}
                                </div>
                              </PetItemHeaderInfo>
                            </PetItemHeaderInfoContainer>
                            <IconButton
                              variant={'icon_danger'}
                              size={'small'}
                              onClick={(e) => handleRemovePet(index, e)}
                            >
                              <X />
                            </IconButton>
                          </PetItemHeader>
                          <LineDetail />
                          <PetItemContentContainer>
                            <div>
                              <Text fontWeight={'black'} color={'brand_dark'}>
                                Raça:
                              </Text>{' '}
                              {pet.breed || '-'}
                            </div>
                            <div>
                              <Text fontWeight={'black'} color={'brand_dark'}>
                                Porte:
                              </Text>{' '}
                              {resolvePetSizeValue(pet.size)}
                            </div>
                            <div>
                              <Text fontWeight={'black'} color={'brand_dark'}>
                                Sexo:
                              </Text>{' '}
                              {resolvePetSexValue(pet.sex)}
                            </div>
                            <div>
                              <Text fontWeight={'black'} color={'brand_dark'}>
                                Idade:
                              </Text>{' '}
                              {pet.age}
                            </div>
                          </PetItemContentContainer>
                        </PetItemContainer>
                      ))}
                    </PetsListContainer>
                  </ProfessionalEstablishmentField>
                </FormTabContent>
              </FormTabMenuContainer>
            </FormContainer>
            <Button>Cadastrar cliente</Button>
          </CreateProfessionalForm>
        </Box>
      </CreateProfessionalContainer>
      {createdProfessionalFeedbackMessage ? (
        <Toast
          message={createdProfessionalFeedbackMessage.message}
          hasTimer={true}
          type={createdProfessionalFeedbackMessage.state}
        />
      ) : null}

      <Modal
        modalOpen={modalOpen}
        variant="withHeader"
        closeModal={handleCloseModal}
        childrenHeader={
          <Heading size={'2xlarge'} color={'gray_800'}>
            Incluir pet
          </Heading>
        }
      >
        <IncludePetForm onSubmit={handlePetSubmit(handleIncludePet)}>
          <TextInput
            inputPlaceholder="Nome"
            inputWidth="full"
            isRequired={true}
            {...petRegister('petName')}
            controlledPlaceholderState={!watchPet('petName')}
            errorMessage={petFormState.errors.petName?.message}
          />

          <TextInput
            inputPlaceholder="Espécie"
            inputWidth="full"
            isRequired={true}
            {...petRegister('specie')}
            controlledPlaceholderState={!watchPet('specie')}
            errorMessage={petFormState.errors.specie?.message}
          />

          <TextInput
            inputPlaceholder="Raça"
            inputWidth="full"
            {...petRegister('breed')}
            controlledPlaceholderState={!watchPet('breed')}
            errorMessage={petFormState.errors.breed?.message}
          />

          <TextInput
            inputPlaceholder="Idade (aproximada)"
            inputWidth="full"
            {...petRegister('age')}
            controlledPlaceholderState={!watchPet('age')}
            errorMessage={petFormState.errors.age?.message}
          />
          <PetInputContainer>
            <Text size={'xlarge'} color={'gray_600'}>
              Porte:
            </Text>
            <PetRadioContainer>
              <PetRadioItem>
                <RadioInput
                  radioId="small"
                  value="SMALL"
                  labelText="Pequeno"
                  variant="default"
                  radioSize="small"
                  {...petRegister('size')}
                />
              </PetRadioItem>
              <PetRadioItem>
                <RadioInput
                  radioId="medium"
                  value="MEDIUM"
                  labelText="Médio"
                  variant="default"
                  radioSize="small"
                  {...petRegister('size')}
                />
              </PetRadioItem>
              <PetRadioItem>
                <RadioInput
                  radioId="large"
                  value="LARGE"
                  labelText="Grande"
                  variant="default"
                  radioSize="small"
                  {...petRegister('size')}
                />
              </PetRadioItem>
            </PetRadioContainer>
          </PetInputContainer>

          <PetInputContainer>
            <Text size={'xlarge'} color={'gray_600'}>
              Sexo:
            </Text>
            <PetRadioContainer>
              <PetRadioItem>
                <RadioInput
                  radioId="male"
                  value="MALE"
                  labelText="Macho"
                  variant="default"
                  radioSize="small"
                  {...petRegister('sex')}
                />
              </PetRadioItem>
              <PetRadioItem>
                <RadioInput
                  radioId="female"
                  value="FEMALE"
                  labelText="Fêmea"
                  variant="default"
                  radioSize="small"
                  {...petRegister('sex')}
                />
              </PetRadioItem>
            </PetRadioContainer>
          </PetInputContainer>
          <PetInputContainer>
            <Text size={'xlarge'} color={'gray_600'}>
              Status
            </Text>
            <SelectInput
              key={selectPetInputKey}
              optionsList={professionalStatus}
              inputWidth="full"
              isRequired
              {...petRegister('status')}
              controlledPlaceholderState={!watchPet('status')}
              errorMessage={petFormState.errors.status?.message}
              handleSelectedInputChange={(selectedValue: string) => {
                setPetValue('status', selectedValue)
              }}
            />
          </PetInputContainer>

          <Button>Adicionar</Button>
        </IncludePetForm>
      </Modal>
    </DefaultLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'medap.token': token } = parseCookies(context)

  let isUserAuthenticated = false

  const user = await recoverUserAuthData(token)
  let establishments: ResponseEstablishment[] | null = null
  let establishmentList: selectData[] | null = null

  if (user != null) {
    isUserAuthenticated = true

    const responseEstablishments = await fetch(
      'http://localhost:3000/api/establishments',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    establishments = await responseEstablishments.json()
  }

  if (establishments) {
    establishmentList = establishments.map((establishment) => {
      return { text: establishment.name, value: establishment.id }
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
    },
  }
}
