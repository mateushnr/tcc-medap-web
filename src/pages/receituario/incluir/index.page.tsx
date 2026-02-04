import DefaultLayout from '@/layouts/DefaultLayout'
import {
  Box,
  Button,
  DateInput,
  Heading,
  Modal,
  RadioInput,
  SelectInput,
  Text,
  TextArea,
  TextInput,
} from '@medap-ui/react'
import HeaderUser from '@/components/PageStructure/HeaderUser'
import {
  LineDetail,
  MedicineDataHeader,
  ContainerHeader,
  MultistepPrescriptionContainer,
  MultistepItem,
  StepInfoContainer,
  CreatePrescriptionContainer,
  CreatePrescriptionForm,
  MultistepFormContent,
  EstablishmentPrescriptionSelectContainer,
  MultistepFormContainer,
  MultistepActionsContainer,
  PrescriptionDataFieldsContainer,
  PrescriptionData,
  PrescriptionMedicineData,
  InfoPersonContainer,
  PrescriptionDateContainer,
  PrescriptionDateField,
  PrescriptionObservationField,
  PrescriptionMedicineDataHeader,
  PrescriptionItemContainer,
  PrescriptionItemAmount,
  PrescriptionAmountInfo,
  PrescriptionItemInfo,
  PrescriptionNameAndAdministrationInfo,
  RemoveMedicineButton,
  PrescriptionItemSelectDataContainer,
  PrescriptionMedicineDosageContainer,
  FeedbackMedicinePrescribedContainer,
  PrescriptionFinalDataContainer,
  MedicinePrescribedFinalDataContainer,
  Detail,
  FinalData,
  FinalDataContainer,
  FinalDataHeader,
  FinalDataInfo,
  PrescriptionEnvolvedDataContainer,
  PrescriptionDateInfoContainer,
  PrescriptionDateInfo,
  PrescriptionObservationInfoContainer,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableDataCell,
  TableRowHead,
  PrescriptionTypeContainer,
} from './styles'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { recoverUserAuthData } from '@/contexts/AuthContext'
import Navigation from '@/components/PageStructure/Navigation'
import { CalendarCheck2, CalendarX2, Plus, X } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import userIcon from '@/assets/images/icon-user.svg'
import petIcon from '@/assets/images/icon-pet.svg'
import healthProfessionalIcon from '@/assets/images/icon-health-professional.svg'
import establishmentIcon from '@/assets/images/establishmentIcon.svg'

import { medicinePrescribedAdministrationWay } from '@/utils/constants/selectInputData'
import { MouseEvent, useEffect, useState } from 'react'

import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import {
  resolveCustomersListToSelectInputType,
  resolveEstablishmentListToSelectInputType,
  resolveMedicineListToSelectInputType,
  resolvePetsListToSelectInputType,
  resolveProfessionalsListToSelectInputType,
} from '@/utils/resolvers/resolveDataToSelectInputType'

import type { ResponseEstablishment } from '@/@types/responseValues/establishmentResponse'
import type { ResponseProfessional } from '@/@types/responseValues/professionalResponse'
import type { ResponseCustomer } from '@/@types/responseValues/customerResponse'
import type { ResponseAddress } from '@/@types/address'
import type { ResponseMedicine } from '@/@types/responseValues/medicineResponse'
import { resolvePrescribedAdministrationWayValue } from '@/utils/resolvers/resolveSelectValuesToText'
import Image from 'next/image'
import { formatDate } from '@/utils/formatters/date'
import { useRouter } from 'next/router'
import type { ResponsePet } from '@/@types/responseValues/petResponse'

const CreatePrescriptionSchema = z.object({
  establishmentRegistered: z.string().min(1, 'Selecione o estabelecimento'),
  patient: z.string().optional(),
  tutor: z.string().optional(),
  pet: z.string().optional(),
  healthProfessional: z.string().min(1, 'Selecione o profissional'),
  emissionDate: z.string().min(1, 'Informe a data de emissão'),
  expirationDate: z.string().min(1, 'Informe a data de vencimento'),
  observation: z.string().optional(),
  prescriptionType: z.enum(['VETERINARY', 'MEDIC']),

  medicine: z.string().optional(),
  administrationWay: z.string().optional(),
  totalAmount: z.string().optional(),
  dosage: z.string().optional(),
})

export type CreatePrescriptionData = z.infer<typeof CreatePrescriptionSchema>

interface CreatePrescriptionProps {
  establishmentList: ResponseEstablishment[] | null
  medicineList: ResponseMedicine[] | null
}

interface MultistepDataType {
  description: string
  state: 'waiting' | 'current' | 'completed'
}

interface FeedbackMedicinePrescribed {
  message?: string
  status: 'empty' | 'warning'
}

interface PrescriptionCurrentContentType {
  patientName?: string
  patientCpf?: string
  patientDocument?: string
  tutorName?: string
  tutorCpf?: string
  tutorDocument?: string
  petName?: string
  petSpecie?: string
  professionalName?: string
  professionalCpf?: string
  establishmentName?: string
  establishmentPhone?: string
  establishmentTargetCustomer?: string
  establishmentAddress?: ResponseAddress
}

interface MedicinePrescribed {
  idMedicine?: string
  medicineName?: string
  administrationWay?: string
  totalAmount?: string
  dosage?: string
}

export default function CreatePrescription({
  establishmentList,
  medicineList,
}: CreatePrescriptionProps) {
  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<CreatePrescriptionData>({
    mode: 'onSubmit',
    resolver: zodResolver(CreatePrescriptionSchema),
    defaultValues: {
      prescriptionType: 'MEDIC',
      emissionDate: new Date().toISOString().split('T')[0],
    },
  })

  const router = useRouter()

  const [
    createdPrescriptionFeedbackMessage,
    setCreatedPrescriptionFeedbackMessage,
  ] = useState<ToastFeedbackMessageType | null>(null)

  const [
    patientsFromEstablishmentSelected,
    setPatientsFromEstablishmentSelected,
  ] = useState<ResponseCustomer[] | null>(null)

  const [tutorsFromEstablishmentSelected, setTutorsFromEstablishmentSelected] =
    useState<ResponseCustomer[] | null>(null)

  const [
    healthProfessionalsFromEstablishmentSelected,
    setHealthProfessionalsFromEstablishmentSelected,
  ] = useState<ResponseProfessional[] | null>(null)

  const [medicineListSelected, setMedicineListSelected] = useState<
    ResponseMedicine[] | null
  >(medicineList)

  const [feedbackMedicinePrescribedInfo, setFeedbackMedicinePrescribedInfo] =
    useState<FeedbackMedicinePrescribed>({
      message: 'Nenhum medicamento prescrito',
      status: 'empty',
    })

  const [prescriptionCurrentContent, setPrescriptionCurrentContent] =
    useState<PrescriptionCurrentContentType | null>(null)

  const [currentMedicinePrescribedList, setCurrentMedicinePrescribedList] =
    useState<MedicinePrescribed[] | null>(null)

  const [petsFromTutorSelected, setPetsFromTutorSelected] = useState<
    ResponsePet[] | null
  >(null)

  const [
    establishmentTargetCustomerSelected,
    setEstablishmentTargetCustomerSelected,
  ] = useState<string>('HUMAN')

  const [multistepData, setMultistepData] = useState<MultistepDataType[]>([
    {
      description: 'Selecionando o estabelecimento',
      state: 'current',
    },
    {
      description: 'Selecionando envolvidos',
      state: 'waiting',
    },
    {
      description: 'Gerando a prescrição',
      state: 'waiting',
    },
    {
      description: 'Confirmação',
      state: 'waiting',
    },
  ])

  function handlePreviousStepClick(e: MouseEvent) {
    e.preventDefault()
    if (currentStep > 0) {
      setCurrentStep((prev) => {
        return prev - 1
      })
    }
  }

  function handleRemoveMedicinePrescribedClick(
    idMedicinePrescribedToRemove: string | undefined,
    e: MouseEvent,
  ) {
    e.preventDefault()

    let medicinePrescribedRemoved: ResponseMedicine | null = null

    if (medicineList) {
      medicinePrescribedRemoved = medicineList.filter((medicine) => {
        return medicine.id === idMedicinePrescribedToRemove
      })[0]
    }

    setCurrentMedicinePrescribedList((prev) => {
      if (prev) {
        return prev.filter((medicine) => {
          return medicine.idMedicine !== idMedicinePrescribedToRemove
        })
      }

      return null
    })

    setMedicineListSelected((prev) => {
      if (medicinePrescribedRemoved) {
        if (prev) {
          return [...prev, { ...medicinePrescribedRemoved }]
        }
        return [{ ...medicinePrescribedRemoved }]
      }
      return prev
    })

    if (currentMedicinePrescribedList?.length === 1) {
      setFeedbackMedicinePrescribedInfo({
        message: 'Nenhum medicamento prescrito',
        status: 'empty',
      })
    }
  }

  async function handleUpdateEstablishment() {
    const { 'medap.token': token } = parseCookies()

    clearErrors(['patient', 'pet', 'tutor', 'healthProfessional'])

    setValue('patient', '')
    setValue('tutor', '')
    setValue('pet', '')
    setValue('healthProfessional', '')
    setPetsFromTutorSelected(null)

    setValue('emissionDate', new Date().toISOString().split('T')[0])
    setValue('expirationDate', '')
    setValue('observation', '')
    setPrescriptionCurrentContent(null)
    setCurrentMedicinePrescribedList(null)
    setMedicineListSelected(medicineList)

    let professionals: ResponseProfessional[] | null = null
    let patients: ResponseCustomer[] | null = null
    let tutors: ResponseCustomer[] | null = null

    try {
      const response = await fetch(
        `http://localhost:3000/api/customers/?fromEstablishment=${watch('establishmentRegistered')}&type=patient`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        patients = await response.json()
      } else {
        throw new Error('Falha em recuperar dados dos pacientes')
      }
    } catch (error) {
      console.error('Falha em recuperar dados dos pacientes: ', error)
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/customers/?fromEstablishment=${watch('establishmentRegistered')}&type=tutor`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        tutors = await response.json()
      } else {
        throw new Error('Falha em recuperar dados dos pacientes')
      }
    } catch (error) {
      console.error('Falha em recuperar dados dos pacientes: ', error)
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/professionals/?fromEstablishment=${watch('establishmentRegistered')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        professionals = await response.json()
      } else {
        throw new Error('Falha em recuperar dados dos profissionais')
      }
    } catch (error) {
      console.error('Falha em recuperar dados dos profissionais: ', error)
    }

    setPatientsFromEstablishmentSelected(patients)
    setTutorsFromEstablishmentSelected(tutors)
    setHealthProfessionalsFromEstablishmentSelected(professionals)

    setSelectInputKeyTutor((prev) => {
      return prev + 1
    })
    setSelectInputKeyPatient((prev) => {
      return prev + 1
    })
    setSelectInputKeyPet((prev) => prev + 1)
    setSelectInputKey((prev) => {
      return prev + 1
    })
  }

  async function handleUpdatePets() {
    const { 'medap.token': token } = parseCookies()

    let pets: ResponsePet[] | null = null

    try {
      const response = await fetch(
        `http://localhost:3000/api/pets?ownerId=${watch('tutor')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        pets = await response.json()
      } else {
        throw new Error('Falha em recuperar dados dos pets')
      }
    } catch (error) {
      console.error('Falha em recuperar dados dos pets: ', error)
    }

    setPetsFromTutorSelected(pets)
    setSelectInputKeyPet((prev) => prev + 1)
  }

  function handleNextStepClick(e: MouseEvent) {
    e.preventDefault()

    switch (currentStep) {
      case 0: {
        if (!watch('establishmentRegistered')) {
          setError('establishmentRegistered', {
            message: 'Selecione algum estabelecimento',
          })
          return
        }

        let establishmentSelected: ResponseEstablishment | undefined

        if (watch('establishmentRegistered') && establishmentList) {
          establishmentSelected = establishmentList.find((establishment) => {
            return establishment.id === watch('establishmentRegistered')
          })
        }

        if (establishmentSelected) {
          switch (establishmentSelected.targetCustomer) {
            case 'HUMAN': {
              setValue('prescriptionType', 'MEDIC')
              setPrescriptionTypeSelected('MEDIC')

              break
            }
            case 'ANIMAL': {
              setValue('prescriptionType', 'VETERINARY')
              setPrescriptionTypeSelected('VETERINARY')

              break
            }
            default: {
              setValue('prescriptionType', 'MEDIC')
              setPrescriptionTypeSelected('MEDIC')
            }
          }

          setEstablishmentTargetCustomerSelected(
            establishmentSelected.targetCustomer,
          )

          setPrescriptionCurrentContent({
            establishmentName: establishmentSelected?.name,
            establishmentPhone: establishmentSelected?.mainPhone,
            establishmentTargetCustomer: establishmentSelected?.targetCustomer,
            establishmentAddress: {
              city: establishmentSelected?.city,
              compliment: establishmentSelected?.compliment,
              latitude: establishmentSelected?.latitude,
              longitude: establishmentSelected?.longitude,
              neighborhood: establishmentSelected?.neighborhood,
              number: establishmentSelected?.number,
              postCode: establishmentSelected?.postCode,
              state: establishmentSelected?.state,
              street: establishmentSelected?.street,
            },
          })
        }

        break
      }
      case 1: {
        if (
          watch('prescriptionType') === 'MEDIC' &&
          (!watch('patient') || !watch('healthProfessional'))
        ) {
          if (!watch('patient')) {
            setError('patient', {
              message: 'Selecione algum paciente',
            })
          }

          if (!watch('healthProfessional')) {
            setError('healthProfessional', {
              message: 'Selecione algum profissional da saúde',
            })
          }

          return
        }

        if (
          watch('prescriptionType') === 'VETERINARY' &&
          (!watch('tutor') || !watch('pet') || !watch('healthProfessional'))
        ) {
          if (!watch('tutor')) {
            setError('tutor', {
              message: 'Selecione algum tutor',
            })
          }

          if (!watch('pet')) {
            setError('pet', {
              message: 'Selecione algum pet',
            })
          }

          if (!watch('healthProfessional')) {
            setError('healthProfessional', {
              message: 'Selecione algum profissional da saúde',
            })
          }

          return
        }

        let patientDataSelected: ResponseCustomer | undefined
        let tutorDataSelected: ResponseCustomer | undefined
        let petDataSelected: ResponsePet | undefined
        let professionalDataSelected: ResponseProfessional | undefined

        if (patientsFromEstablishmentSelected) {
          patientDataSelected = patientsFromEstablishmentSelected.find(
            (patient) => {
              return patient.id === watch('patient')
            },
          )
        }

        if (tutorsFromEstablishmentSelected) {
          tutorDataSelected = tutorsFromEstablishmentSelected.find((tutor) => {
            return tutor.id === watch('tutor')
          })
        }

        if (petsFromTutorSelected) {
          petDataSelected = petsFromTutorSelected.find((pet) => {
            return pet.id === watch('pet')
          })
        }

        if (healthProfessionalsFromEstablishmentSelected) {
          professionalDataSelected =
            healthProfessionalsFromEstablishmentSelected.find(
              (professional) => {
                return professional.id === watch('healthProfessional')
              },
            )
        }

        setPrescriptionCurrentContent((prev) => {
          return {
            ...prev,
            patientName: patientDataSelected?.name,
            patientCpf: patientDataSelected?.cpf,
            patientDocument: patientDataSelected?.otherDocument,
            petName: petDataSelected?.petName,
            petSpecie: petDataSelected?.specie,
            tutorName: tutorDataSelected?.name,
            tutorCpf: tutorDataSelected?.cpf,
            tutorDocument: tutorDataSelected?.otherDocument,
            professionalName: professionalDataSelected?.name,
            professionalCpf: professionalDataSelected?.cpf,
          }
        })

        break
      }
      case 2: {
        const emissionDateStr = watch('emissionDate')
        const expirationDateStr = watch('expirationDate')
        let expirationDateIsAboveThanEmissionDate: boolean = true

        if (emissionDateStr && expirationDateStr) {
          const emissionDate = new Date(emissionDateStr)
          const expirationDate = new Date(expirationDateStr)

          if (expirationDate <= emissionDate) {
            expirationDateIsAboveThanEmissionDate = false
          }
        }

        if (
          !emissionDateStr ||
          !expirationDateStr ||
          !currentMedicinePrescribedList?.length ||
          !expirationDateIsAboveThanEmissionDate
        ) {
          if (!emissionDateStr) {
            setError('emissionDate', {
              message: 'Informe a data de emissão',
            })
          } else {
            clearErrors(['emissionDate'])
          }

          if (!expirationDateStr) {
            setError('expirationDate', {
              message: 'Informe a data de vencimento',
            })
          } else {
            clearErrors(['expirationDate'])
          }

          if (!currentMedicinePrescribedList?.length) {
            setFeedbackMedicinePrescribedInfo({
              message: 'Prescreva pelo menos um medicamento',
              status: 'warning',
            })
          }

          if (!expirationDateIsAboveThanEmissionDate) {
            setError('expirationDate', {
              message: 'A data deve ser posterior à data de emissão',
            })
          } else {
            clearErrors(['expirationDate'])
          }

          return
        }
      }
    }

    setCurrentStep((prev) => {
      return prev + 1
    })
  }

  const [currentStep, setCurrentStep] = useState(0)

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const [selectInputKey, setSelectInputKey] = useState(0)
  const [selectInputKeyTutor, setSelectInputKeyTutor] = useState(3)
  const [selectInputKeyPatient, setSelectInputKeyPatient] = useState(5)
  const [selectInputKeyPet, setSelectInputKeyPet] = useState(0)
  const [
    selectPrescribedMedicineInputKey,
    setSelectPrescribedMedicineInputKey,
  ] = useState(0)

  const [prescriptionTypeSelected, setPrescriptionTypeSelected] =
    useState<string>('MEDIC')

  const handleRadioOptionClick = (e: MouseEvent<HTMLInputElement>) => {
    const radioOption = e.target as HTMLInputElement

    setValue('patient', '')
    setValue('tutor', '')
    setValue('healthProfessional', '')
    setValue('pet', '')

    setPetsFromTutorSelected(null)

    setSelectInputKeyPatient((prev) => prev + 1)
    setSelectInputKeyTutor((prev) => prev + 1)
    setSelectInputKeyPet((prev) => prev + 1)
    setSelectInputKey((prev) => prev + 1)

    clearErrors(['patient', 'pet', 'tutor', 'healthProfessional'])
    setPrescriptionTypeSelected(radioOption.value)
  }

  const clearPrescribedMedicineForm = () => {
    setValue('medicine', '')
    setValue('administrationWay', '')
    setValue('totalAmount', '')
    setValue('dosage', '')

    setSelectPrescribedMedicineInputKey((prevKey) => prevKey + 1)
    clearErrors(['medicine', 'administrationWay', 'totalAmount', 'dosage'])
  }

  const handleModalOpen = (e: MouseEvent) => {
    e.preventDefault()
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    clearPrescribedMedicineForm()

    setModalOpen(false)
  }

  const handleInsertPrescribedMedicineClick = (e: MouseEvent) => {
    e.preventDefault()

    let hasError: boolean = false

    let medicineId: string | undefined
    let medicineName: string | undefined
    let administrationWay: string | undefined
    let totalAmount: string | undefined
    let dosage: string | undefined

    if (!watch('medicine')) {
      setError('medicine', { message: 'Selecione um medicamento' })
      hasError = true
    } else {
      medicineId = watch('medicine')
      clearErrors(['medicine'])
    }

    if (!watch('administrationWay')) {
      setError('administrationWay', {
        message: 'Selecione uma via de administração',
      })
      hasError = true
    } else {
      clearErrors(['administrationWay'])
      administrationWay = watch('administrationWay')
    }

    if (!watch('totalAmount')) {
      setError('totalAmount', { message: 'Informe a quantidade' })
      hasError = true
    } else {
      clearErrors(['totalAmount'])
      totalAmount = watch('totalAmount')
    }

    if (!watch('dosage')) {
      setError('dosage', { message: 'Informe a posologia' })
      hasError = true
    } else {
      clearErrors(['dosage'])
      dosage = watch('dosage')
    }

    if (medicineList !== null && medicineId !== undefined) {
      const medicineSelected: ResponseMedicine | undefined = medicineList.find(
        (medicine) => {
          return medicine.id === medicineId
        },
      )

      medicineName = medicineSelected?.name
    }

    if (!hasError) {
      setCurrentMedicinePrescribedList((prev) => {
        if (prev) {
          return [
            ...prev,
            {
              idMedicine: medicineId,
              medicineName,
              administrationWay,
              totalAmount,
              dosage,
            },
          ]
        } else {
          return [
            {
              idMedicine: medicineId,
              medicineName,
              administrationWay,
              totalAmount,
              dosage,
            },
          ]
        }
      })

      setMedicineListSelected((prev) => {
        if (prev) {
          return prev.filter((medicine) => {
            return medicine.id !== medicineId
          })
        }
        return prev
      })

      setFeedbackMedicinePrescribedInfo({
        message: undefined,
        status: 'empty',
      })

      clearPrescribedMedicineForm()
    }
  }

  const handleCreatePrescription = async (data: CreatePrescriptionData) => {
    const { 'medap.token': token } = parseCookies()
    setCreatedPrescriptionFeedbackMessage(null)

    let medicinesPrescribedList

    if (currentMedicinePrescribedList) {
      medicinesPrescribedList = currentMedicinePrescribedList.map(
        (medicinePrescribed) => {
          return {
            medicineId: medicinePrescribed.idMedicine,
            dosage: medicinePrescribed.dosage,
            totalAmount: medicinePrescribed.totalAmount,
            administrationWay: medicinePrescribed.administrationWay,
          }
        },
      )
    }

    const dataToSend = {
      patientPrescription: data.patient,
      tutorPrescription: data.tutor,
      petPrescription: data.pet,
      prescriptionType: data.prescriptionType,
      professionalPrescription: data.healthProfessional,
      establishmentPrescription: data.establishmentRegistered,
      emissionDate: data.emissionDate,
      expirationDate: data.expirationDate,
      observation: data.observation,
      medicinesPrescribedList,
    }

    console.log(dataToSend)

    let prescriptionCreatedId: { prescriptionCreatedId: string }

    try {
      const response = await fetch(`http://localhost:3000/api/prescriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      })

      switch (response.status) {
        case 201: {
          setCreatedPrescriptionFeedbackMessage({
            state: 'success',
            message: 'Prescrição cadastrado com sucesso!',
          })

          prescriptionCreatedId = await response.json()

          setTimeout(() => {
            if (prescriptionCreatedId) {
              router.push(
                `/receituario/detalhes/${prescriptionCreatedId.prescriptionCreatedId}`,
              )
            } else {
              router.reload()
            }
          }, 2000)

          break
        }
        default: {
          setCreatedPrescriptionFeedbackMessage({
            state: 'error',
            message: 'Ocorreu um erro inesperado, tente novamente.',
          })
        }
      }
    } catch (error) {
      setCreatedPrescriptionFeedbackMessage({
        state: 'error',
        message: 'Ocorreu um erro no servidor',
      })
    }
  }

  useEffect(() => {
    switch (currentStep) {
      case 0: {
        setMultistepData([
          {
            description: 'Selecionando o estabelecimento',
            state: 'current',
          },
          {
            description: 'Selecionando envolvidos',
            state: 'waiting',
          },
          {
            description: 'Gerando a prescrição',
            state: 'waiting',
          },
          {
            description: 'Confirmação',
            state: 'waiting',
          },
        ])
        break
      }
      case 1: {
        setMultistepData([
          {
            description: 'Selecionando o estabelecimento',
            state: 'completed',
          },
          {
            description: 'Selecionando envolvidos',
            state: 'current',
          },
          {
            description: 'Gerando a prescrição',
            state: 'waiting',
          },
          {
            description: 'Confirmação',
            state: 'waiting',
          },
        ])
        break
      }
      case 2: {
        setMultistepData([
          {
            description: 'Selecionando o estabelecimento',
            state: 'completed',
          },
          {
            description: 'Selecionando envolvidos',
            state: 'completed',
          },
          {
            description: 'Gerando a prescrição',
            state: 'current',
          },
          {
            description: 'Confirmação',
            state: 'waiting',
          },
        ])
        break
      }
      case 3: {
        setMultistepData([
          {
            description: 'Selecionando o estabelecimento',
            state: 'completed',
          },
          {
            description: 'Selecionando envolvidos',
            state: 'completed',
          },
          {
            description: 'Gerando a prescrição',
            state: 'completed',
          },
          {
            description: 'Confirmação',
            state: 'current',
          },
        ])
        break
      }
    }
  }, [currentStep])

  return (
    <DefaultLayout activePage="PRESCRIPTION">
      <HeaderUser title="Gerenciar receituário" />
      <CreatePrescriptionContainer>
        <Navigation
          LinkList={[
            {
              link: '/receituario/incluir',
              active: true,
              icon: <Plus size={20} strokeWidth={2.5} />,
              text: 'Incluir nova receita',
            },
          ]}
        />
        <Box width={'full'}>
          <CreatePrescriptionForm
            onSubmit={handleSubmit(handleCreatePrescription)}
          >
            <MedicineDataHeader>
              <ContainerHeader>
                <Heading size={'4xlarge'} color={'gray_600'}>
                  Incluir receituário
                </Heading>
                <MultistepPrescriptionContainer>
                  {multistepData.map((multistepItem, index) => {
                    return (
                      <MultistepItem
                        key={multistepItem.description}
                        state={multistepItem.state}
                      >
                        <StepInfoContainer>{index + 1}</StepInfoContainer>
                        <Heading>{multistepItem.description}</Heading>
                      </MultistepItem>
                    )
                  })}
                </MultistepPrescriptionContainer>
              </ContainerHeader>
              <LineDetail />
            </MedicineDataHeader>

            <MultistepFormContainer>
              <MultistepFormContent active={currentStep === 0}>
                <EstablishmentPrescriptionSelectContainer>
                  <Text size={'xlarge'} color={'gray_600'}>
                    Selecione o estabelecimento:
                  </Text>
                  <SelectInput
                    optionsList={
                      resolveEstablishmentListToSelectInputType(
                        establishmentList,
                      ) || undefined
                    }
                    isRequired
                    inputPlaceholder="Selecionar o estabelecimento"
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
                      handleUpdateEstablishment()
                    }}
                  />
                </EstablishmentPrescriptionSelectContainer>
              </MultistepFormContent>
              <MultistepFormContent active={currentStep === 1}>
                {establishmentTargetCustomerSelected === 'MIXED' ? (
                  <PrescriptionTypeContainer>
                    <RadioInput
                      radioId="medic"
                      labelText="Prescrição médica"
                      variant="box"
                      radioSize={'small'}
                      {...register('prescriptionType')}
                      value="MEDIC"
                      onClick={handleRadioOptionClick}
                    />
                    <RadioInput
                      radioId="veterinary"
                      labelText="Prescrição veterinária"
                      variant="box"
                      radioSize={'small'}
                      {...register('prescriptionType')}
                      value="VETERINARY"
                      onClick={handleRadioOptionClick}
                    />
                  </PrescriptionTypeContainer>
                ) : null}
                {prescriptionTypeSelected === 'MEDIC' ? (
                  <>
                    <EstablishmentPrescriptionSelectContainer>
                      <Text size={'xlarge'} color={'gray_600'}>
                        Selecione o paciente:
                      </Text>
                      <SelectInput
                        key={selectInputKeyPatient}
                        optionsList={
                          resolveCustomersListToSelectInputType(
                            patientsFromEstablishmentSelected,
                          ) || undefined
                        }
                        isRequired
                        inputPlaceholder="Selecionar o paciente"
                        inputWidth="full"
                        hasSearch={true}
                        {...register('patient')}
                        controlledPlaceholderState={!watch('patient')}
                        errorMessage={formState.errors.patient?.message}
                        handleSelectedInputChange={(selectedValue: string) => {
                          setValue('patient', selectedValue)
                          setError('patient', { message: '' })
                        }}
                      />
                    </EstablishmentPrescriptionSelectContainer>
                  </>
                ) : (
                  <>
                    <EstablishmentPrescriptionSelectContainer>
                      <Text size={'xlarge'} color={'gray_600'}>
                        Selecione o tutor:
                      </Text>
                      <SelectInput
                        key={selectInputKeyTutor}
                        optionsList={
                          resolveCustomersListToSelectInputType(
                            tutorsFromEstablishmentSelected,
                          ) || undefined
                        }
                        isRequired
                        inputPlaceholder="Selecionar tutor"
                        inputWidth="full"
                        hasSearch={true}
                        {...register('tutor')}
                        controlledPlaceholderState={!watch('tutor')}
                        errorMessage={formState.errors.tutor?.message}
                        handleSelectedInputChange={(selectedValue: string) => {
                          setValue('tutor', selectedValue)
                          setError('tutor', { message: '' })
                          handleUpdatePets()
                        }}
                      />
                    </EstablishmentPrescriptionSelectContainer>
                    <EstablishmentPrescriptionSelectContainer>
                      <Text size={'xlarge'} color={'gray_600'}>
                        Selecione o pet:
                      </Text>
                      <SelectInput
                        key={selectInputKeyPet}
                        optionsList={
                          resolvePetsListToSelectInputType(
                            petsFromTutorSelected,
                          ) || undefined
                        }
                        isRequired
                        inputPlaceholder="Selecionar pet"
                        inputWidth="full"
                        hasSearch={true}
                        {...register('pet')}
                        controlledPlaceholderState={!watch('pet')}
                        errorMessage={formState.errors.pet?.message}
                        handleSelectedInputChange={(selectedValue: string) => {
                          setValue('pet', selectedValue)
                          setError('pet', { message: '' })
                        }}
                      />
                    </EstablishmentPrescriptionSelectContainer>
                  </>
                )}
                <EstablishmentPrescriptionSelectContainer>
                  <Text size={'xlarge'} color={'gray_600'}>
                    Selecione o profissional da saúde:
                  </Text>
                  <SelectInput
                    key={selectInputKey}
                    optionsList={
                      resolveProfessionalsListToSelectInputType(
                        healthProfessionalsFromEstablishmentSelected,
                      ) || undefined
                    }
                    isRequired
                    inputPlaceholder="Selecionar profissional"
                    inputWidth="full"
                    hasSearch={true}
                    {...register('healthProfessional')}
                    controlledPlaceholderState={!watch('healthProfessional')}
                    errorMessage={formState.errors.healthProfessional?.message}
                    handleSelectedInputChange={(selectedValue: string) => {
                      setValue('healthProfessional', selectedValue)
                      setError('healthProfessional', { message: '' })
                    }}
                  />
                </EstablishmentPrescriptionSelectContainer>{' '}
              </MultistepFormContent>
              <MultistepFormContent active={currentStep === 2}>
                <PrescriptionDataFieldsContainer>
                  <PrescriptionData>
                    <Heading size={'2xlarge'} color={'gray_700'}>
                      Dados da prescrição
                    </Heading>
                    {prescriptionTypeSelected === 'MEDIC' ? (
                      <InfoPersonContainer>
                        <Heading size={'xlarge'} color={'gray_600'}>
                          Paciente:{' '}
                          <Text color={'gray_600'} size={'xlarge'}>
                            {prescriptionCurrentContent?.patientName}
                          </Text>
                        </Heading>
                        <Text size={'medium'} color={'gray_500'}>
                          {prescriptionCurrentContent?.patientCpf
                            ? prescriptionCurrentContent?.patientCpf
                            : prescriptionCurrentContent?.patientDocument}
                        </Text>
                      </InfoPersonContainer>
                    ) : (
                      <>
                        <InfoPersonContainer>
                          <Heading size={'xlarge'} color={'gray_600'}>
                            Tutor:{' '}
                            <Text color={'gray_600'} size={'xlarge'}>
                              {prescriptionCurrentContent?.tutorName}
                            </Text>
                          </Heading>
                          <Text size={'medium'} color={'gray_500'}>
                            {prescriptionCurrentContent?.tutorCpf
                              ? prescriptionCurrentContent?.tutorCpf
                              : prescriptionCurrentContent?.tutorDocument}
                          </Text>
                        </InfoPersonContainer>{' '}
                        <InfoPersonContainer>
                          <Heading size={'xlarge'} color={'gray_600'}>
                            Pet:{' '}
                            <Text color={'gray_600'} size={'xlarge'}>
                              {prescriptionCurrentContent?.petName}
                            </Text>
                          </Heading>
                          <Text size={'medium'} color={'gray_500'}>
                            {prescriptionCurrentContent?.petSpecie}
                          </Text>
                        </InfoPersonContainer>
                      </>
                    )}

                    <InfoPersonContainer>
                      <Heading size={'xlarge'} color={'gray_700'}>
                        Emitente:{' '}
                        <Text color={'gray_600'} size={'xlarge'}>
                          {prescriptionCurrentContent?.professionalName}
                        </Text>
                      </Heading>
                      <Text size={'medium'} color={'gray_500'}>
                        {prescriptionCurrentContent?.professionalCpf}
                      </Text>
                    </InfoPersonContainer>
                    <PrescriptionDateContainer>
                      <PrescriptionDateField>
                        <Text size={'xlarge'} color={'gray_600'}>
                          Data de emissão
                        </Text>
                        <DateInput
                          inputWidth="full"
                          {...register('emissionDate')}
                          errorMessage={formState.errors.emissionDate?.message}
                        />
                      </PrescriptionDateField>
                      <PrescriptionDateField>
                        <Text size={'xlarge'} color={'gray_600'}>
                          Data de vencimento
                        </Text>
                        <DateInput
                          inputWidth="full"
                          {...register('expirationDate')}
                          errorMessage={
                            formState.errors.expirationDate?.message
                          }
                        />
                      </PrescriptionDateField>
                    </PrescriptionDateContainer>
                    <PrescriptionObservationField>
                      <TextArea
                        textAreaPlaceholder="Observação"
                        textAreaWidth="full"
                        textAreaHeight="medium"
                        {...register('observation')}
                        controlledPlaceholderState={!watch('observation')}
                        errorMessage={formState.errors.observation?.message}
                      />
                    </PrescriptionObservationField>
                  </PrescriptionData>
                  <PrescriptionMedicineData>
                    <PrescriptionMedicineDataHeader>
                      <Heading size={'2xlarge'} color={'gray_700'}>
                        Medicamentos prescritos
                      </Heading>
                      <Button onClick={handleModalOpen} disabled={!currentStep}>
                        Adicionar medicamento
                      </Button>
                    </PrescriptionMedicineDataHeader>
                    <Box variant={'box_secondary'}>
                      {feedbackMedicinePrescribedInfo.message ? (
                        <FeedbackMedicinePrescribedContainer
                          status={feedbackMedicinePrescribedInfo.status}
                        >
                          <Heading size={'xlarge'} fontWeight={'regular'}>
                            {feedbackMedicinePrescribedInfo.message}
                          </Heading>
                        </FeedbackMedicinePrescribedContainer>
                      ) : null}
                      {currentMedicinePrescribedList
                        ? currentMedicinePrescribedList.map(
                            (prescribedMedicine) => {
                              return (
                                <PrescriptionItemContainer
                                  key={prescribedMedicine.idMedicine}
                                >
                                  <PrescriptionItemAmount>
                                    <Text
                                      color={'gray_50'}
                                      fontWeight={'regular'}
                                    >
                                      Administração
                                    </Text>
                                    <PrescriptionAmountInfo>
                                      <Text
                                        size={'medium'}
                                        color={'white'}
                                        fontWeight={'black'}
                                      >
                                        {resolvePrescribedAdministrationWayValue(
                                          prescribedMedicine.administrationWay,
                                        )}
                                      </Text>
                                    </PrescriptionAmountInfo>
                                  </PrescriptionItemAmount>
                                  <PrescriptionItemInfo>
                                    <PrescriptionNameAndAdministrationInfo>
                                      <Text
                                        size={'medium'}
                                        color={'brand_800'}
                                        fontWeight={'black'}
                                      >
                                        {prescribedMedicine.medicineName}
                                      </Text>
                                      <RemoveMedicineButton
                                        onClick={(e) => {
                                          handleRemoveMedicinePrescribedClick(
                                            prescribedMedicine.idMedicine,
                                            e,
                                          )
                                        }}
                                      >
                                        <X />
                                      </RemoveMedicineButton>
                                    </PrescriptionNameAndAdministrationInfo>
                                    <Text
                                      size={'medium'}
                                      color={'gray_800'}
                                      fontWeight={'regular'}
                                    >
                                      <Text
                                        as={'b'}
                                        size={'medium'}
                                        color={'gray_600'}
                                        fontWeight={'black'}
                                      >
                                        Quantidade total:{' '}
                                      </Text>
                                      {prescribedMedicine.totalAmount}
                                    </Text>
                                    <Text
                                      size={'medium'}
                                      color={'gray_800'}
                                      fontWeight={'regular'}
                                    >
                                      <Text
                                        as={'b'}
                                        size={'medium'}
                                        color={'gray_600'}
                                        fontWeight={'black'}
                                      >
                                        Posologia:{' '}
                                      </Text>
                                      {prescribedMedicine.dosage}
                                    </Text>
                                  </PrescriptionItemInfo>
                                </PrescriptionItemContainer>
                              )
                            },
                          )
                        : null}
                    </Box>
                  </PrescriptionMedicineData>
                </PrescriptionDataFieldsContainer>
              </MultistepFormContent>
              <MultistepFormContent active={currentStep === 3}>
                <PrescriptionDataFieldsContainer>
                  <PrescriptionEnvolvedDataContainer>
                    <Heading color={'brand_800'} size={'2xlarge'}>
                      Envolvidos
                    </Heading>
                    <FinalDataContainer>
                      <FinalDataHeader>
                        <Heading color={'gray_700'} size={'xlarge'}>
                          Estabelecimento emitente
                        </Heading>
                        <Detail />
                      </FinalDataHeader>
                      <FinalData>
                        <Image
                          priority
                          src={establishmentIcon}
                          alt="Ícone estabelecimento"
                          height={48}
                          width={48}
                        />

                        <FinalDataInfo>
                          <Text color={'gray_600'} size={'xlarge'}>
                            {prescriptionCurrentContent?.establishmentName}
                          </Text>

                          <Text size={'medium'} color={'gray_500'}>
                            {
                              prescriptionCurrentContent?.establishmentAddress
                                ?.street
                            }
                            {prescriptionCurrentContent?.establishmentAddress
                              ?.number &&
                            prescriptionCurrentContent?.establishmentAddress
                              ?.street
                              ? `, ${prescriptionCurrentContent?.establishmentAddress?.number}`
                              : null}
                            {prescriptionCurrentContent?.establishmentAddress
                              ?.city
                              ? ` - ${prescriptionCurrentContent?.establishmentAddress?.city}`
                              : null}
                            {prescriptionCurrentContent?.establishmentAddress
                              ?.state
                              ? ` (${prescriptionCurrentContent?.establishmentAddress?.state})`
                              : null}
                          </Text>
                        </FinalDataInfo>
                      </FinalData>
                    </FinalDataContainer>
                    {prescriptionTypeSelected === 'MEDIC' ? (
                      <>
                        <FinalDataContainer>
                          <FinalDataHeader>
                            <Heading color={'gray_700'} size={'xlarge'}>
                              Paciente
                            </Heading>
                            <Detail />
                          </FinalDataHeader>
                          <FinalData>
                            <Image
                              priority
                              src={userIcon}
                              alt="Ícone usuário"
                              height={48}
                              width={48}
                            />

                            <FinalDataInfo>
                              <Text color={'gray_600'} size={'xlarge'}>
                                {prescriptionCurrentContent?.patientName}
                              </Text>

                              <Text size={'medium'} color={'gray_500'}>
                                {prescriptionCurrentContent?.patientCpf}
                              </Text>
                            </FinalDataInfo>
                          </FinalData>
                        </FinalDataContainer>
                      </>
                    ) : (
                      <>
                        <FinalDataContainer>
                          <FinalDataHeader>
                            <Heading color={'gray_700'} size={'xlarge'}>
                              Tutor
                            </Heading>
                            <Detail />
                          </FinalDataHeader>
                          <FinalData>
                            <Image
                              priority
                              src={userIcon}
                              alt="Ícone usuário"
                              height={48}
                              width={48}
                            />

                            <FinalDataInfo>
                              <Text color={'gray_600'} size={'xlarge'}>
                                {prescriptionCurrentContent?.tutorName}
                              </Text>

                              <Text size={'medium'} color={'gray_500'}>
                                {prescriptionCurrentContent?.tutorCpf}
                              </Text>
                            </FinalDataInfo>
                          </FinalData>
                        </FinalDataContainer>
                        <FinalDataContainer>
                          <FinalDataHeader>
                            <Heading color={'gray_700'} size={'xlarge'}>
                              Tutor
                            </Heading>
                            <Detail />
                          </FinalDataHeader>
                          <FinalData>
                            <Image
                              priority
                              src={petIcon}
                              alt="Ícone pet"
                              height={48}
                              width={48}
                            />

                            <FinalDataInfo>
                              <Text color={'gray_600'} size={'xlarge'}>
                                {prescriptionCurrentContent?.petName}
                              </Text>

                              <Text size={'medium'} color={'gray_500'}>
                                {prescriptionCurrentContent?.petSpecie}
                              </Text>
                            </FinalDataInfo>
                          </FinalData>
                        </FinalDataContainer>
                      </>
                    )}

                    <FinalDataContainer>
                      <FinalDataHeader>
                        <Heading color={'gray_700'} size={'xlarge'}>
                          Profissional emitente
                        </Heading>
                        <Detail />
                      </FinalDataHeader>
                      <FinalData>
                        <Image
                          priority
                          src={healthProfessionalIcon}
                          alt="Ícone profissional da saúde"
                          height={48}
                          width={48}
                        />

                        <FinalDataInfo>
                          <Text color={'gray_600'} size={'xlarge'}>
                            {prescriptionCurrentContent?.professionalName}
                          </Text>

                          <Text size={'medium'} color={'gray_500'}>
                            {prescriptionCurrentContent?.professionalCpf}
                          </Text>
                        </FinalDataInfo>
                      </FinalData>
                    </FinalDataContainer>
                  </PrescriptionEnvolvedDataContainer>
                  <PrescriptionFinalDataContainer>
                    <Heading color={'brand_800'} size={'2xlarge'}>
                      Dados da prescrição
                    </Heading>
                    <Box variant={'box_secondary'}>
                      <PrescriptionDateInfoContainer>
                        <Text size={'xlarge'} color={'gray_700'}>
                          Tipo da prescrição
                        </Text>
                        <PrescriptionDateInfo>
                          <Text
                            size={'xlarge'}
                            color={'brand_700'}
                            fontWeight={'black'}
                          >
                            {prescriptionTypeSelected === 'MEDIC'
                              ? 'Médica'
                              : 'Veterinária'}
                          </Text>
                        </PrescriptionDateInfo>
                      </PrescriptionDateInfoContainer>

                      <PrescriptionDateInfoContainer>
                        <Text size={'xlarge'} color={'gray_700'}>
                          Data de emissão
                        </Text>
                        <PrescriptionDateInfo>
                          <CalendarCheck2 color={'#2A844C'} />
                          <Text
                            size={'medium'}
                            color={'gray_700'}
                            fontWeight={'black'}
                          >
                            {formatDate(watch('emissionDate'))}
                          </Text>
                        </PrescriptionDateInfo>
                      </PrescriptionDateInfoContainer>
                      <PrescriptionDateInfoContainer>
                        <Text size={'xlarge'} color={'gray_700'}>
                          Data de vencimento
                        </Text>
                        <PrescriptionDateInfo>
                          <CalendarX2 color={'#B81D1D'} />
                          <Text
                            size={'medium'}
                            color={'gray_700'}
                            fontWeight={'black'}
                          >
                            {formatDate(watch('expirationDate'))}
                          </Text>
                        </PrescriptionDateInfo>
                      </PrescriptionDateInfoContainer>
                      <PrescriptionObservationInfoContainer>
                        <Text size={'xlarge'} color={'gray_700'}>
                          Observação
                        </Text>
                        <Text size={'medium'} color={'gray_800'}>
                          {watch('observation')}
                        </Text>
                      </PrescriptionObservationInfoContainer>
                    </Box>
                  </PrescriptionFinalDataContainer>
                  <MedicinePrescribedFinalDataContainer>
                    <Heading color={'brand_800'} size={'2xlarge'}>
                      Medicação prescrita
                    </Heading>

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRowHead>
                            <TableHeaderCell>Medicamento</TableHeaderCell>
                            <TableHeaderCell>
                              Via de administração
                            </TableHeaderCell>
                            <TableHeaderCell>Quantidade total</TableHeaderCell>
                            <TableHeaderCell>Posologia</TableHeaderCell>
                          </TableRowHead>
                        </TableHead>
                        <TableBody>
                          {currentMedicinePrescribedList
                            ? currentMedicinePrescribedList.map(
                                (medicinePrescribed) => {
                                  return (
                                    <TableRow
                                      key={medicinePrescribed.idMedicine}
                                    >
                                      <TableDataCell>
                                        {medicinePrescribed.medicineName}
                                      </TableDataCell>
                                      <TableDataCell>
                                        {resolvePrescribedAdministrationWayValue(
                                          medicinePrescribed.administrationWay,
                                        )}
                                      </TableDataCell>
                                      <TableDataCell>
                                        {medicinePrescribed.totalAmount}
                                      </TableDataCell>
                                      <TableDataCell>
                                        {medicinePrescribed.dosage}
                                      </TableDataCell>
                                    </TableRow>
                                  )
                                },
                              )
                            : null}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </MedicinePrescribedFinalDataContainer>
                </PrescriptionDataFieldsContainer>
              </MultistepFormContent>

              <MultistepActionsContainer>
                <Button
                  onClick={handlePreviousStepClick}
                  disabled={!currentStep}
                >
                  Voltar
                </Button>
                {currentStep === 3 ? (
                  <Button>Registrar prescrição</Button>
                ) : (
                  <>
                    <Button onClick={handleNextStepClick}>Próximo</Button>
                  </>
                )}
              </MultistepActionsContainer>
            </MultistepFormContainer>
            <Modal
              modalOpen={modalOpen}
              variant="withHeader"
              closeModal={handleCloseModal}
              childrenHeader={
                <Heading size={'2xlarge'} color={'gray_800'}>
                  Incluir medicamento prescrito
                </Heading>
              }
            >
              <EstablishmentPrescriptionSelectContainer>
                <Text size={'xlarge'} color={'gray_600'}>
                  Medicamento:
                </Text>
                <SelectInput
                  key={selectPrescribedMedicineInputKey}
                  optionsList={
                    resolveMedicineListToSelectInputType(
                      medicineListSelected,
                    ) || undefined
                  }
                  isRequired
                  inputPlaceholder="Selecionar medicamento"
                  inputWidth="full"
                  hasSearch={true}
                  {...register('medicine')}
                  controlledPlaceholderState={!watch('medicine')}
                  errorMessage={formState.errors.medicine?.message}
                  handleSelectedInputChange={(selectedValue: string) => {
                    setValue('medicine', selectedValue)
                    setError('medicine', { message: '' })
                  }}
                />
              </EstablishmentPrescriptionSelectContainer>

              <PrescriptionItemSelectDataContainer>
                <SelectInput
                  key={selectPrescribedMedicineInputKey}
                  optionsList={medicinePrescribedAdministrationWay}
                  isRequired
                  inputPlaceholder="Via de administração"
                  inputWidth="full"
                  hasSearch={true}
                  {...register('administrationWay')}
                  controlledPlaceholderState={!watch('administrationWay')}
                  errorMessage={formState.errors.administrationWay?.message}
                  handleSelectedInputChange={(selectedValue: string) => {
                    setValue('administrationWay', selectedValue)
                    setError('administrationWay', { message: '' })
                  }}
                />

                <TextInput
                  inputPlaceholder="Quantidade total"
                  inputWidth="full"
                  isRequired={true}
                  {...register('totalAmount')}
                  controlledPlaceholderState={!watch('totalAmount')}
                  errorMessage={formState.errors.totalAmount?.message}
                />
              </PrescriptionItemSelectDataContainer>
              <PrescriptionMedicineDosageContainer>
                <TextArea
                  textAreaPlaceholder="Posologia"
                  textAreaWidth="full"
                  isRequired
                  textAreaHeight="medium"
                  {...register('dosage')}
                  controlledPlaceholderState={!watch('dosage')}
                  errorMessage={formState.errors.dosage?.message}
                />
              </PrescriptionMedicineDosageContainer>

              <Button onClick={handleInsertPrescribedMedicineClick}>
                Incluir medicamento prescrito
              </Button>
            </Modal>
          </CreatePrescriptionForm>
        </Box>
      </CreatePrescriptionContainer>
      {createdPrescriptionFeedbackMessage ? (
        <Toast
          message={createdPrescriptionFeedbackMessage.message}
          hasTimer={true}
          type={createdPrescriptionFeedbackMessage.state}
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
  let medicines: ResponseMedicine[] | null = null

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
    const response = await fetch(`http://localhost:3000/api/establishments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      establishments = await response.json()
    } else {
      throw new Error('Falha em recuperar dados do estabelecimento')
    }
  } catch (error) {
    console.error('Falha em recuperar dados do estabelecimento: ', error)
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/medicines/?availableFor=establishment`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (response.ok) {
      medicines = await response.json()
    } else {
      throw new Error('Falha em recuperar dados dos medicamentos')
    }
  } catch (error) {
    console.error('Falha em recuperar dados dos medicamentos: ', error)
  }

  return {
    props: {
      establishmentList: establishments,
      medicineList: medicines,
    },
  }
}
