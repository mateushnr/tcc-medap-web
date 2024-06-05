import Image from 'next/image'
import { Button } from '@medap-ui/react'
import { HeaderContainer, Navigation } from './styles'
import medapLogo from '@/assets/images/medapLogoHorizontalLight.svg'
import Link from 'next/link'
import { LogIn } from 'lucide-react'

export default function Header() {
  return (
    <HeaderContainer>
      <Link href="/">
        <Image
          priority
          src={medapLogo}
          alt="Logo medap"
          height={48}
          width={128}
        />
      </Link>

      <Navigation>
        <Button
          variant="brand_secondary"
          size={{ '@initial': 'medium', '@bp2': 'small' }}
        >
          Quero fazer parte!
        </Button>

        <Link href="/login">
          <Button
            variant="brand_primary"
            size={{ '@initial': 'medium', '@bp2': 'small' }}
          >
            Entrar <LogIn strokeWidth={3} />
          </Button>
        </Link>
      </Navigation>
    </HeaderContainer>
  )
}
