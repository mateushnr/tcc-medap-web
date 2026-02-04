import { ChangeEvent } from 'react'

export function handleOnlyDigitsChange(e: ChangeEvent<HTMLInputElement>) {
  const formattedOnlyDigits = e.target.value.replace(/\D/g, '')

  e.target.value = formattedOnlyDigits
}
