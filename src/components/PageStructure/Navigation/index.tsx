import { LinkContainer, NavigationContainer } from './styles'
import { Box, Text } from '@medap-ui/react'
import Link from 'next/link'
import { ReactNode } from 'react'

interface LinkItem {
  link: string
  text: string
  icon: ReactNode
  active: boolean
}

interface NavigationProps {
  LinkList: LinkItem[]
}

export default function Navigation({ LinkList }: NavigationProps) {
  return (
    <NavigationContainer>
      <Box variant={'box_secondary'} width={'full'}>
        {LinkList.map((linkItem) => {
          return linkItem.active ? (
            <LinkContainer key={linkItem.text} active={true}>
              {linkItem.icon}
              <Text>{linkItem.text}</Text>
            </LinkContainer>
          ) : (
            <Link key={linkItem.text} href={linkItem.link}>
              <LinkContainer>
                {linkItem.icon}
                <Text>{linkItem.text}</Text>
              </LinkContainer>
            </Link>
          )
        })}
      </Box>
    </NavigationContainer>
  )
}
