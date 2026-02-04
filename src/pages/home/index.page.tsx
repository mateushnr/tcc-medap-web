import Header from '@/components/PageStructure/Header'
import {
  AdvantageItem,
  Advantages,
  AdvantagesList,
  Bullet,
  BulletDetail,
  ContainerBulletDetail,
  ContainerSystemCreatedFor,
  Content,
  ContentContainer,
  EmailContactContainer,
  EmailSentNotification,
  Figure,
  HeaderAdvantageItem,
  HeaderInfo,
  HeaderSystemCreatedFor,
  ImageDetail,
  Introduction,
  ListEstablishments,
  ListItem,
  PhoneInfo,
  SeparatorDetail,
  SystemCreatedFor,
} from './styles'
import doctorPrescribingOnline from '@/assets/images/doctor-prescribing-online.jpg'
import Image from 'next/image'
import {
  Heading,
  Text,
  Button,
  Modal,
  TextInput,
  TextArea,
} from '@medap-ui/react'
import {
  AtSign,
  Blocks,
  Mail,
  MailCheck,
  MailX,
  NotebookPen,
  Phone,
  Pill,
  Plus,
  Printer,
  UserRound,
} from 'lucide-react'
import Footer from '@/components/PageStructure/Footer'
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendContactForm } from '@/lib/mail.api'

interface FeedbackContactForm {
  success: boolean
  message: string
}

const ContactSchema = z.object({
  name: z.string().min(1, 'Informe seu nome'),
  email: z
    .string()
    .min(1, 'Informe seu email')
    .refine((value) => {
      const regex =
        /^[a-zA-Z0-9!#$%&'*/=?^._+\-`{|}~\\]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
      return regex.test(value)
    }, 'Email inválido'),
  message: z
    .string()
    .min(1, 'Nenhuma mensagem para ser enviada')
    .min(10, 'Nos conte com mais detalhes o motivo do contato'),
})

export type ContactFormData = z.infer<typeof ContactSchema>

export default function Home() {
  const { register, handleSubmit, formState, watch, reset } =
    useForm<ContactFormData>({
      mode: 'onSubmit',
      resolver: zodResolver(ContactSchema),
    })

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showFeedbackMessage, setShowFeedbackMessage] = useState<boolean>(false)
  const [feedbackMessage, setFeedbackMessage] = useState<FeedbackContactForm>({
    success: false,
    message: '',
  })

  const handleCloseModal = () => setModalOpen(false)
  const handleOpenModal = () => setModalOpen(true)

  const handleContactForm = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      setFeedbackMessage(await sendContactForm(data))
      reset()
    } finally {
      setIsSubmitting(false)
      setShowFeedbackMessage(true)
      setTimeout(() => {
        setShowFeedbackMessage(false)
        setFeedbackMessage({ success: false, message: '' })
      }, 3000)
    }
  }

  return (
    <>
      <Header openModalClick={handleOpenModal} />
      <main>
        <Introduction>
          <Content>
            <Heading
              as="strong"
              color={'brand_800'}
              size={{ '@initial': '2xlarge', '@bp2': 'xlarge' }}
              fontWeight={'light'}
            >
              Gerencie seu estabelecimento de saúde
            </Heading>
            <Heading
              as="h1"
              color={'brand_dark'}
              size={{ '@initial': '8xlarge', '@bp2': '4xlarge' }}
              fontWeight={'regular'}
            >
              Emita o receituário de forma ágil
            </Heading>
            <Text
              color={'gray_900'}
              size={{ '@initial': 'xlarge', '@bp2': 'medium' }}
              fontWeight={'light'}
            >
              Conecte seu estabelecimento de saúde no nosso sistema, assim você
              poderá organizar suas unidades, profissionais, pacientes e
              medicamentos. Além de claro, criar prescrições de forma digital
              agilizando o processo de emissão e reduzindo erros
            </Text>
            <Button
              variant={'brand_gradient'}
              size={{ '@initial': 'big', '@bp2': 'medium' }}
              onClick={() => {
                setModalOpen(true)
              }}
            >
              Fazer parte!
            </Button>
          </Content>
          <Figure>
            <Image
              priority
              src={doctorPrescribingOnline}
              width={268}
              height={338}
              quality={100}
              alt="Médico utilizando um computador"
            />
            <ImageDetail />
          </Figure>
        </Introduction>

        <SystemCreatedFor>
          <ContainerSystemCreatedFor>
            <ContainerBulletDetail>
              <BulletDetail />
              <BulletDetail />
              <BulletDetail />
              <BulletDetail />
              <BulletDetail visibility={'hidden'} />
              <BulletDetail />
            </ContainerBulletDetail>
            <ContainerBulletDetail side={'right'}>
              <BulletDetail />
              <BulletDetail visibility={'hidden'} />
              <BulletDetail />
              <BulletDetail />
              <BulletDetail />
              <BulletDetail />
            </ContainerBulletDetail>

            <HeaderSystemCreatedFor>
              <Heading
                color={'brand_light'}
                size={{ '@initial': '6xlarge', '@bp2': '2xlarge' }}
                fontWeight={'regular'}
              >
                Sistema criado para
              </Heading>
              <Heading
                as={'strong'}
                color={'brand_100'}
                size={{
                  '@initial': '2xlarge',
                  '@bp2': 'xlarge',
                  '@bp1': 'medium',
                }}
                fontWeight={'light'}
              >
                Estabelecimentos de saúde que prescrevem medicamentos
              </Heading>
            </HeaderSystemCreatedFor>
            <ListEstablishments>
              <ListItem>
                <Bullet />
                Unidades básicas de saúde
              </ListItem>
              <ListItem>
                <Bullet />
                Clínicas médica
              </ListItem>
              <ListItem>
                <Bullet />
                Clínicas odontológica
              </ListItem>
              <ListItem>
                <Bullet />
                Clínicas veterinária
              </ListItem>
            </ListEstablishments>

            <ListItem>
              <Plus strokeWidth={3} size={20} />
              outros tipos de estabelecimentos
            </ListItem>
          </ContainerSystemCreatedFor>
        </SystemCreatedFor>
        <Advantages>
          <Heading
            color={'brand_dark'}
            size={{ '@initial': '8xlarge', '@bp2': '4xlarge' }}
            fontWeight={'regular'}
          >
            Benefícios
          </Heading>

          <AdvantagesList>
            <AdvantageItem>
              <HeaderAdvantageItem>
                <NotebookPen size={60} strokeWidth={1.2} />
                <Heading
                  as="strong"
                  color={'brand_800'}
                  size={{ '@initial': '4xlarge', '@bp2': '2xlarge' }}
                >
                  Praticidade na criação de prescrição
                </Heading>
              </HeaderAdvantageItem>
              <SeparatorDetail />
              <Text color={'gray_800'} fontWeight={'regular'}>
                Crie rapidamente as prescrições dos medicamentos, aumentando o
                foco na sua consulta com o paciente.
              </Text>
            </AdvantageItem>

            <AdvantageItem>
              <HeaderAdvantageItem>
                <Printer size={60} strokeWidth={1.2} />
                <Heading
                  as="strong"
                  color={'brand_800'}
                  size={{ '@initial': '4xlarge', '@bp2': '2xlarge' }}
                >
                  Simplicidade na emissão da receita
                </Heading>
              </HeaderAdvantageItem>
              <SeparatorDetail />
              <Text color={'gray_800'} fontWeight={'regular'}>
                Após a criação da receita imprima e assine para entregar ao seu
                paciente.
              </Text>
            </AdvantageItem>

            <AdvantageItem>
              <HeaderAdvantageItem>
                <Blocks size={60} strokeWidth={1.2} />
                <Heading
                  as="strong"
                  color={'brand_800'}
                  size={{ '@initial': '4xlarge', '@bp2': '2xlarge' }}
                >
                  Flexibilidade no gerenciamento
                </Heading>
              </HeaderAdvantageItem>
              <SeparatorDetail />
              <Text color={'gray_800'} fontWeight={'regular'}>
                Cadastre unidades especificas para seu estabelecimento, assim
                como diversos tipos de profissionais da saúde.
              </Text>
            </AdvantageItem>

            <AdvantageItem>
              <HeaderAdvantageItem>
                <Pill size={60} strokeWidth={1.2} />
                <Heading
                  as="strong"
                  color={'brand_800'}
                  size={{ '@initial': '4xlarge', '@bp2': '2xlarge' }}
                >
                  Acompanhe suas estatísticas
                </Heading>
              </HeaderAdvantageItem>
              <SeparatorDetail />
              <Text color={'gray_800'} fontWeight={'regular'}>
                Veja estatísticas sobre o seu estabelecimento através de um
                dashboard com diversos gráficos.
              </Text>
            </AdvantageItem>
          </AdvantagesList>
        </Advantages>
      </main>
      <Footer />

      <Modal modalOpen={modalOpen} closeModal={handleCloseModal}>
        <ContentContainer>
          <HeaderInfo>
            <Heading
              size={{ '@initial': '6xlarge', '@bp2': '4xlarge' }}
              color={'gray_700'}
            >
              Tenho interesse em fazer parte
            </Heading>
            <Text
              size={{ '@initial': 'xlarge', '@bp2': 'medium' }}
              color={'gray_600'}
              fontWeight={'regular'}
            >
              Mande mensagem no nosso número contando como é seu estabelecimento
              e o motivo pelo qual deseja utilizar o sistema medap
            </Text>
          </HeaderInfo>
          <PhoneInfo>
            <Phone size={24} />
            <Text
              size={{ '@initial': '2xlarge', '@bp2': 'xlarge' }}
              color={'brand_800'}
              fontWeight={'regular'}
            >
              (18) 99735-8117
            </Text>
          </PhoneInfo>
        </ContentContainer>
        <EmailContactContainer onSubmit={handleSubmit(handleContactForm)}>
          <Text
            size={{ '@initial': 'xlarge', '@bp2': 'medium' }}
            color={'gray_600'}
            fontWeight={'regular'}
          >
            Ou nos contate via email
          </Text>
          <TextInput
            icon={<UserRound strokeWidth={1.5} />}
            inputWidth="full"
            inputPlaceholder="Seu nome"
            isRequired
            controlledPlaceholderState={!watch('name')}
            {...register('name')}
            errorMessage={formState.errors.name?.message}
          />
          <TextInput
            icon={<AtSign strokeWidth={1.5} />}
            inputWidth="full"
            inputPlaceholder="Seu email"
            isRequired
            controlledPlaceholderState={!watch('email')}
            {...register('email')}
            errorMessage={formState.errors.email?.message}
          />
          <TextArea
            textAreaWidth="full"
            textAreaHeight="medium"
            icon={<Mail strokeWidth={1.5} />}
            textAreaPlaceholder="Mensagem"
            isRequired
            controlledPlaceholderState={!watch('message')}
            {...register('message')}
            errorMessage={formState.errors.message?.message}
          />
          <Button isLoading={isSubmitting}>Enviar email</Button>
        </EmailContactContainer>
      </Modal>

      {showFeedbackMessage ? (
        <EmailSentNotification isSuccess={feedbackMessage.success}>
          {feedbackMessage.success ? <MailCheck /> : <MailX />}
          <Text color={'gray_800'}>{feedbackMessage.message}</Text>
        </EmailSentNotification>
      ) : null}
    </>
  )
}
