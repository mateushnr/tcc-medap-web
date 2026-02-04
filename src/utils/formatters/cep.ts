import { ChangeEvent } from 'react'

export function handleCepChange(e: ChangeEvent<HTMLInputElement>) {
  const formattedOnlyDigits = e.target.value.replace(/\D/g, '')

  const formattedWithHyphen =
    formattedOnlyDigits.length > 5
      ? `${formattedOnlyDigits.slice(0, 5)}-${formattedOnlyDigits.slice(5)}`
      : formattedOnlyDigits

  e.target.value = formattedWithHyphen
}
