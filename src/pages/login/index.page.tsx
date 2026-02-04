import Image from 'next/image'
import medapLogoLight from '@/assets/images/medapLogoLight.svg'
import {
  ErrorMessage,
  LoginContainer,
  LoginFieldsContainer,
  LoginFooter,
  LoginForm,
  LoginHeader,
  LoginPageContainer,
  WelcomeContainer,
  WelcomeContent,
} from './styles'
import { Button, Heading, Text, TextInput } from '@medap-ui/react'
import Link from 'next/link'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { signIn } from '@/lib/signIn'
import { recoverUserAuthData } from '@/contexts/AuthContext'

type StatusUserLogin = {
  failed: boolean
  errorMessage: string | null
}

const LoginSchema = z.object({
  organization: z.string().min(1, 'Informe a sua organização'),
  email: z
    .string()
    .min(1, 'Informe seu email')
    .refine((value) => {
      const regex =
        /^[a-zA-Z0-9!#$%&'*/=?^._+\-`{|}~\\]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
      return regex.test(value)
    }, 'Email inválido'),
  password: z
    .string()
    .min(1, 'Informe sua senha')
    .min(6, 'A senha possui no mínimo 6 caracteres'),
})

export type LoginFormData = z.infer<typeof LoginSchema>

export default function Login() {
  const { register, handleSubmit, formState, watch } = useForm<LoginFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(LoginSchema),
  })

  const [loginUserStatus, setLoginUserStatus] = useState<StatusUserLogin>({
    failed: false,
    errorMessage: null,
  })

  const router = useRouter()

  const handleLoginForm = async (data: LoginFormData) => {
    const msgStatusLogin = await signIn(data)

    if (msgStatusLogin !== null) {
      setLoginUserStatus({ failed: true, errorMessage: msgStatusLogin })
    } else {
      setLoginUserStatus({ failed: false, errorMessage: null })
      router.reload()
    }
  }

  return (
    <LoginPageContainer>
      <Link href="/">
        <Image
          priority
          src={medapLogoLight}
          alt="Logo medap"
          height={32}
          width={32}
        />
      </Link>
      <LoginContainer>
        <LoginForm onSubmit={handleSubmit(handleLoginForm)}>
          <LoginHeader>
            <Heading
              as="h1"
              color={'brand_550'}
              size={{ '@initial': '8xlarge', '@bp2': '6xlarge' }}
              fontWeight={'black'}
            >
              Faça Login
            </Heading>
            <Heading color={'gray_600'} size={'medium'}>
              Preencha o nome da sua unidade ou do seu estabelecimento no campo
              organização
            </Heading>
          </LoginHeader>

          <LoginFieldsContainer>
            <TextInput
              inputPlaceholder="Organização"
              isRequired
              inputWidth="large"
              controlledPlaceholderState={!watch('organization')}
              {...register('organization')}
              errorMessage={formState.errors.organization?.message}
            />
            <TextInput
              inputPlaceholder="Email"
              isRequired
              inputWidth="large"
              controlledPlaceholderState={!watch('email')}
              {...register('email')}
              errorMessage={formState.errors.email?.message}
            />
            <TextInput
              inputPlaceholder="Senha"
              type="password"
              isRequired
              inputWidth="large"
              controlledPlaceholderState={!watch('password')}
              {...register('password')}
              errorMessage={formState.errors.password?.message}
            />
          </LoginFieldsContainer>

          <LoginFooter>
            <Button>Acessar sistema</Button>

            {loginUserStatus.failed ? (
              <ErrorMessage>{loginUserStatus.errorMessage}</ErrorMessage>
            ) : null}
          </LoginFooter>
        </LoginForm>
      </LoginContainer>
      <WelcomeContainer>
        <WelcomeContent>
          <Heading
            as="strong"
            color={'white'}
            size={{ '@initial': '8xlarge', '@bp2': '6xlarge' }}
            fontWeight={'black'}
          >
            Bem-vindo!
          </Heading>
          <Heading
            as="h2"
            color={'gray_100'}
            size={'2xlarge'}
            fontWeight={'regular'}
          >
            Ainda não faz parte do medap?
          </Heading>
          <Text color={'gray_200'} size={'xlarge'} fontWeight={'light'}>
            Organize seu estabelecimento, agilize o processo de emissão de
            receita e acompanhe o tratamento do seu paciente!
          </Text>
          <Link href="/">
            <Button variant={'brand_secondary_light'}>Veja mais</Button>
          </Link>
        </WelcomeContent>
      </WelcomeContainer>
    </LoginPageContainer>
  )
}

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
