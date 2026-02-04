import {
  CircleAlert,
  CircleCheck,
  CircleX,
  TriangleAlert,
  X,
} from 'lucide-react'
import {
  CloseToastButton,
  ToastContainer,
  ToastInfo,
  ToastInfoContainer,
  ToastTimer,
} from './styles'
import { Heading, Text } from '@medap-ui/react'
import { useState } from 'react'

type toastType = 'success' | 'error' | 'warning'

export interface ToastFeedbackMessageType {
  state: toastType
  message: string
}

interface ToastProps {
  hasTimer: boolean
  message: string
  type: toastType
}

export default function Toast({ hasTimer, message, type }: ToastProps) {
  const [toastActive, setToastActive] = useState<boolean>(true)

  const handleCloseToastMessage = () => {
    setToastActive(false)
  }

  const translateTypeToTitle = (type: toastType) => {
    switch (type) {
      case 'success':
        return 'Sucesso'
      case 'error':
        return 'Erro'
      case 'warning':
        return 'Aviso'
      default:
        return 'Mensagem'
    }
  }

  const resolveToastIcon = (type: toastType) => {
    switch (type) {
      case 'success':
        return <CircleCheck strokeWidth={2.5} />
      case 'error':
        return <CircleX strokeWidth={2.5} />
      case 'warning':
        return <TriangleAlert strokeWidth={2.5} />
      default:
        return <CircleAlert strokeWidth={2.5} />
    }
  }

  return (
    <ToastContainer type={type} active={toastActive} hasTimer={hasTimer}>
      <ToastInfoContainer>
        {resolveToastIcon(type)}
        <ToastInfo>
          <Heading
            size={{ '@initial': 'xlarge', '@bp3': 'medium' }}
            color={'gray_900'}
          >
            {translateTypeToTitle(type)}
          </Heading>
          <Text
            color={'gray_800'}
            size={{ '@initial': 'medium', '@bp3': 'small' }}
          >
            {message}
          </Text>
        </ToastInfo>
      </ToastInfoContainer>

      {hasTimer ? <ToastTimer></ToastTimer> : null}
      <CloseToastButton onClick={handleCloseToastMessage}>
        <X size={20} />
      </CloseToastButton>
    </ToastContainer>
  )
}
