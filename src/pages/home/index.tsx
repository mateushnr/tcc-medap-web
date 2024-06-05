import Header from '@/components/Header'
import {
  AdvantageItem,
  Advantages,
  AdvantagesList,
  Bullet,
  BulletDetail,
  ContainerBulletDetail,
  ContainerSystemCreatedFor,
  Content,
  Figure,
  HeaderAdvantageItem,
  HeaderSystemCreatedFor,
  Highlight,
  ImageDetail,
  Introduction,
  ListEstablishments,
  ListItem,
  SeparatorDetail,
  SystemCreatedFor,
} from './styles'
import doctorPrescribingOnline from '@/assets/images/doctor-prescribing-online.jpg'
import Image from 'next/image'
import { Heading, Text, Button } from '@medap-ui/react'
import { Blocks, NotebookPen, Pill, Plus, Printer } from 'lucide-react'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Introduction>
          <Content>
            <Heading
              as="strong"
              color={'brand_800'}
              size={{ '@initial': '2xlarge', '@bp2': 'xlarge' }}
              fontWeight={'light'}
            >
              Acompanhe a medicação do seu paciente
            </Heading>
            <Heading
              as="h1"
              color={'brand_dark'}
              size={{ '@initial': '8xlarge', '@bp2': '4xlarge' }}
              fontWeight={'regular'}
            >
              Emita e compartilhe o receituário de forma ágil
            </Heading>
            <Text
              color={'gray_900'}
              size={{ '@initial': 'xlarge', '@bp2': 'medium' }}
              fontWeight={'light'}
            >
              Conecte seu estabelecimento de saúde no nosso sistema, assim você
              poderá organizar suas unidades e profissionais. Além de claro,
              criar e emitir prescrições compartilhadas com a conta do seu
              paciente no aplicativo mobile do
              <Highlight> Medap</Highlight>.
            </Text>
            <Button
              variant={'brand_gradient'}
              size={{ '@initial': 'big', '@bp2': 'medium' }}
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
                Crie rapidamente as prescrições dos medicamentos com opções
                pré-fornecidas pelo sistemas, aumentando o foco na sua consulta
                com o paciente.
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
                paciente. Além disso compartilhe a prescrição via whatsapp ou
                email!
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
                  Integração com o aplicativo
                </Heading>
              </HeaderAdvantageItem>
              <SeparatorDetail />
              <Text color={'gray_800'} fontWeight={'regular'}>
                No momento em que foi criada a receita, a prescrição é
                compartilhada com a conta do paciente no aplicativo, tornando
                muito mais fácil gerenciar os medicamentos.
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
                  Acompanhe a medicação do paciente
                </Heading>
              </HeaderAdvantageItem>
              <SeparatorDetail />
              <Text color={'gray_800'} fontWeight={'regular'}>
                A partir dos registros de estoque e alarmes do tratamento no
                aplicativo, você poderá acompanhar o progresso de medicação do
                seu paciente.
              </Text>
            </AdvantageItem>
          </AdvantagesList>
        </Advantages>
      </main>
      <Footer />
    </>
  )
}
