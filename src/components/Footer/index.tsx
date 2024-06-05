import Image from 'next/image'
import medapLogo from '@/assets/images/medapLogoHorizontalDark.svg'
import {
  Attributions,
  BrandSlogan,
  BrandSloganContainer,
  FooterContainer,
  Contact,
  DetailSeparator,
  Info,
  AttributionsContainer,
} from './styles'
import { Heading, Text } from '@medap-ui/react'
import { Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <FooterContainer>
      <BrandSlogan>
        <BrandSloganContainer>
          <Image
            priority
            src={medapLogo}
            alt="Logo medap"
            height={64}
            width={170}
          />
          <DetailSeparator />
          <Heading
            as={'strong'}
            color={'brand_100'}
            size={{ '@initial': '2xlarge', '@bp3': 'xlarge', '@bp2': 'medium' }}
          >
            O Sistema feito para melhorar o seu relacionamento com seus
            pacientes
          </Heading>
        </BrandSloganContainer>
      </BrandSlogan>
      <Contact>
        <Heading
          as={'h3'}
          color={'gray_900'}
          size={{ '@initial': '6xlarge', '@bp2': '4xlarge' }}
        >
          Contato
        </Heading>
        <Info>
          <Text
            color={'gray_700'}
            size={{ '@initial': '2xlarge', '@bp4': 'xlarge' }}
          >
            <Mail />
            medap@contato.com
          </Text>
          <Text
            color={'gray_700'}
            size={{ '@initial': '2xlarge', '@bp4': 'xlarge' }}
          >
            <Phone />
            (18) 99735-8117
          </Text>
        </Info>
      </Contact>
      <Attributions>
        <AttributionsContainer>
          <Text
            color={'brand_100'}
            fontWeight={'light'}
            size={{ '@initial': 'medium', '@bp2': 'small' }}
          >
            Imagem retirada do <strong>FreePik</strong>
          </Text>
          <Text
            color={'brand_100'}
            fontWeight={'light'}
            size={{ '@initial': 'medium', '@bp2': 'small' }}
          >
            Ícones retirados da biblioteca <strong>Lucide</strong>
          </Text>
        </AttributionsContainer>
      </Attributions>
    </FooterContainer>
  )
}
