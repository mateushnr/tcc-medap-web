import DefaultLayout from '@/layouts/DefaultLayout'
import {
  Box,
  Button,
  Heading,
  RadioInput,
  SelectInput,
  Text,
  TextInput,
} from '@medap-ui/react'
import HeaderUser from '@/components/PageStructure/HeaderUser'
import {
  FormContainer,
  LineDetail,
  MedicineBoundField,
  RadioContainer,
  MedicineSelectBoundField,
  MedicineDataSection,
  CreateMedicineContainer,
  CreateMedicineForm,
  MedicineData,
  MedicineDataHeader,
  MedicineDataFields,
  MedicineStatusField,
  MedicineSelectField,
} from './styles'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { recoverUserAuthData } from '@/contexts/AuthContext'
import Navigation from '@/components/PageStructure/Navigation'
import { List, Plus } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  establishmentStatus,
  medicineForUse,
  medicinePharmaceuticalForm,
  medicineRegulatoryCategory,
  medicineStatus,
} from '@/utils/constants/selectInputData'
import { MouseEvent, useState } from 'react'

import { selectData } from '@/@types/selectData'
import Toast, { ToastFeedbackMessageType } from '@/components/Toast'
import { resolveEstablishmentListToSelectInputType } from '@/utils/resolvers/resolveDataToSelectInputType'

import type { ResponseEstablishment } from '@/@types/responseValues/establishmentResponse'

const CreateMedicineSchema = z.object({
  name: z.string().min(1, 'Informe o nome do medicamento'),
  pharmaceuticalForm: z.string().refine(
    (value) => {
      return medicinePharmaceuticalForm.find((option) => {
        return option.value === value
      })
    },
    {
      message: 'Selecione a forma farmacêutica',
    },
  ),
  regulatoryCategory: z.string().refine(
    (value) => {
      return (
        medicineRegulatoryCategory.find((option) => {
          return option.value === value
        }) || !value
      )
    },
    {
      message: 'Selecione a categoria regulatória',
    },
  ),
  activeIngredient: z.string().optional(),
  forUse: z.string().refine(
    (value) => {
      return medicineForUse.find((option) => {
        return option.value === value
      })
    },
    {
      message: 'Selecione para qual uso é destinado o medicamento',
    },
  ),
  status: z.string().refine(
    (value) => {
      return medicineStatus.find((option) => {
        return option.value === value
      })
    },
    {
      message: 'Selecione a situação do medicamento',
    },
  ),
  establishmentRegistered: z.string().optional(),
  boundedTo: z.enum(['ALL', 'ESTABLISHMENT']),
})

export type CreateMedicineData = z.infer<typeof CreateMedicineSchema>

interface CreateMedicineProps {
  establishmentList: selectData[] | null
}

export default function CreateMedicine({
  establishmentList,
}: CreateMedicineProps) {
  const { register, handleSubmit, formState, watch, setValue, setError } =
    useForm<CreateMedicineData>({
      mode: 'onSubmit',
      resolver: zodResolver(CreateMedicineSchema),
      defaultValues: {
        boundedTo: 'ALL',
      },
    })

  const [createdMedicineFeedbackMessage, setcreatedMedicineFeedbackMessage] =
    useState<ToastFeedbackMessageType | null>(null)

  const [selectInputKey, setSelectInputKey] = useState(0)

  const [boundSelected, setBoundSelected] = useState<string>('ALL')

  const handleRadioOptionClick = (e: MouseEvent<HTMLInputElement>) => {
    const radioOption = e.target as HTMLInputElement
    setBoundSelected(radioOption.value)
  }

  const clearAllFields = () => {
    setValue('name', '')
    setValue('activeIngredient', '')
    setValue('pharmaceuticalForm', '')
    setValue('regulatoryCategory', '')
    setValue('forUse', 'HUMAN')
    setValue('status', 'ACTIVE')
    setValue('establishmentRegistered', '')

    setValue('boundedTo', 'ALL')
    setBoundSelected('all')

    setSelectInputKey((prevKey) => prevKey + 1)
  }

  const handleCreateMedicine = async (data: CreateMedicineData) => {
    const { 'medap.token': token } = parseCookies()
    setcreatedMedicineFeedbackMessage(null)

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
      activeIngredient: data.activeIngredient,
      pharmaceuticalForm: data.pharmaceuticalForm,
      regulatoryCategory: data.regulatoryCategory,
      forUse: data.forUse,
      status: data.status,
      establishmentRegistered,
    }

    try {
      const response = await fetch(`http://localhost:3000/api/medicines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      })

      switch (response.status) {
        case 201: {
          setcreatedMedicineFeedbackMessage({
            state: 'success',
            message: 'Medicamento cadastrado com sucesso!',
          })
          clearAllFields()
          break
        }
        case 409: {
          const errorData = await response.json()
          const errorMessage = errorData.message

          setcreatedMedicineFeedbackMessage({
            state: 'warning',
            message: 'Houve um conflito com os dados cadastrados.',
          })

          switch (errorMessage) {
            case 'Medicine with same name already exists': {
              setError(
                'name',
                { message: 'Nome já cadastrado' },
                { shouldFocus: true },
              )
              break
            }
            default: {
              setcreatedMedicineFeedbackMessage({
                state: 'error',
                message: 'Houve um conflito inesperado',
              })
              break
            }
          }

          break
        }
        default: {
          setcreatedMedicineFeedbackMessage({
            state: 'error',
            message: 'Ocorreu um erro inesperado, tente novamente.',
          })
        }
      }
    } catch (error) {
      setcreatedMedicineFeedbackMessage({
        state: 'error',
        message: 'Ocorreu um erro no servidor',
      })
    }
  }

  return (
    <DefaultLayout activePage="MEDICINE">
      <HeaderUser title="Gerenciar medicamento" />
      <CreateMedicineContainer>
        <Navigation
          LinkList={[
            {
              link: '/medicamento/incluir',
              active: true,
              icon: <Plus size={20} strokeWidth={2.5} />,
              text: 'Incluir novo medicamento',
            },
            {
              link: '/medicamento/listar',
              active: false,
              icon: <List size={20} strokeWidth={2.5} />,
              text: 'Lista de medicamento',
            },
          ]}
        />
        <Box width={'full'}>
          <Text fontWeight={'light'} size={'xlarge'} color={'gray_900'}>
            Insira os dados do medicamento que será cadastrado
          </Text>
          <CreateMedicineForm onSubmit={handleSubmit(handleCreateMedicine)}>
            <FormContainer>
              <MedicineData>
                <MedicineDataHeader>
                  <Heading size={'4xlarge'} color={'gray_600'}>
                    Dados do medicamento
                  </Heading>
                  <LineDetail />
                </MedicineDataHeader>
                <MedicineDataSection>
                  <MedicineDataFields>
                    <TextInput
                      inputPlaceholder="Nome"
                      inputWidth="full"
                      isRequired={true}
                      {...register('name')}
                      controlledPlaceholderState={!watch('name')}
                      errorMessage={formState.errors.name?.message}
                    />
                    <TextInput
                      inputPlaceholder="Princípio ativo"
                      inputWidth="full"
                      {...register('activeIngredient')}
                      controlledPlaceholderState={!watch('activeIngredient')}
                      errorMessage={formState.errors.activeIngredient?.message}
                    />
                    <MedicineStatusField>
                      <Text size={'xlarge'} color={'gray_600'}>
                        Para uso:
                      </Text>
                      <SelectInput
                        key={selectInputKey}
                        optionsList={medicineForUse}
                        isRequired
                        {...register('forUse')}
                        controlledPlaceholderState={!watch('forUse')}
                        errorMessage={formState.errors.forUse?.message}
                        handleSelectedInputChange={(selectedValue: string) => {
                          setValue('forUse', selectedValue)
                        }}
                      />
                    </MedicineStatusField>
                  </MedicineDataFields>

                  <MedicineDataFields>
                    <MedicineSelectField>
                      <SelectInput
                        key={selectInputKey}
                        inputPlaceholder="Forma farmacêutica"
                        optionsList={medicinePharmaceuticalForm}
                        isRequired
                        inputWidth="full"
                        {...register('pharmaceuticalForm')}
                        controlledPlaceholderState={
                          !watch('pharmaceuticalForm')
                        }
                        errorMessage={
                          formState.errors.pharmaceuticalForm?.message
                        }
                        handleSelectedInputChange={(selectedValue: string) => {
                          setValue('pharmaceuticalForm', selectedValue)
                        }}
                      />
                    </MedicineSelectField>
                    <MedicineStatusField>
                      <SelectInput
                        key={selectInputKey}
                        inputPlaceholder="Categoria regulatória"
                        optionsList={medicineRegulatoryCategory}
                        {...register('regulatoryCategory')}
                        controlledPlaceholderState={
                          !watch('regulatoryCategory')
                        }
                        errorMessage={
                          formState.errors.regulatoryCategory?.message
                        }
                        handleSelectedInputChange={(selectedValue: string) => {
                          setValue('regulatoryCategory', selectedValue)
                          setError('regulatoryCategory', { message: '' })
                        }}
                      />
                    </MedicineStatusField>
                    <MedicineStatusField>
                      <Text size={'xlarge'} color={'gray_600'}>
                        Status do medicamento
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
                    </MedicineStatusField>
                  </MedicineDataFields>

                  <MedicineBoundField>
                    <Text size={'xlarge'} color={'gray_600'}>
                      Vinculo do medicamento:
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
                      <MedicineSelectBoundField>
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
                          handleSelectedInputChange={(
                            selectedValue: string,
                          ) => {
                            setValue('establishmentRegistered', selectedValue)
                            setError('establishmentRegistered', { message: '' })
                          }}
                        />
                      </MedicineSelectBoundField>
                    ) : null}
                  </MedicineBoundField>
                </MedicineDataSection>
              </MedicineData>
            </FormContainer>
            <Button>Cadastrar medicamento</Button>
          </CreateMedicineForm>
        </Box>
      </CreateMedicineContainer>
      {createdMedicineFeedbackMessage ? (
        <Toast
          message={createdMedicineFeedbackMessage.message}
          hasTimer={true}
          type={createdMedicineFeedbackMessage.state}
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

  return {
    props: {
      establishmentList:
        resolveEstablishmentListToSelectInputType(establishments),
    },
  }
}
