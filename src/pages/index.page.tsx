import { recoverUserAuthData } from '@/contexts/AuthContext'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'

export { default } from './home/index.page'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'medap.token': token } = parseCookies(context)

  let isUserAuthenticated = false

  const user = await recoverUserAuthData(token)

  if (user != null) {
    isUserAuthenticated = true
  }

  if (isUserAuthenticated) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
