import { Heading } from '@medap-ui/react'
import { HeaderContainer, UserInfo } from './styles'
import { UserRound } from 'lucide-react'
import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

interface HeaderUserProps {
  title: string
}

export default function HeaderUser({ title }: HeaderUserProps) {
  const { user } = useContext(AuthContext)

  return (
    <HeaderContainer>
      <Heading
        size={{ '@initial': '4xlarge', '@bp2': '2xlarge' }}
        color={'gray_700'}
      >
        {title}
      </Heading>

      <UserInfo>
        <UserRound size={28} />
        <Heading
          size={{ '@initial': 'xlarge', '@bp2': 'medium' }}
          color={'brand_800'}
        >
          {user?.name}
        </Heading>
      </UserInfo>
    </HeaderContainer>
  )
}
