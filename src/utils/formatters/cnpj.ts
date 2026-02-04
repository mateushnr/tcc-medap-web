import { ChangeEvent } from 'react'

export function handleCnpjChange(e: ChangeEvent<HTMLInputElement>) {
  const formattedOnlyDigits = e.target.value.replace(/\D/g, '')

  let formattedCnpj = formattedOnlyDigits
  if (formattedOnlyDigits.length > 2) {
    formattedCnpj = `${formattedOnlyDigits.slice(0, 2)}.${formattedOnlyDigits.slice(2)}`
  }
  if (formattedOnlyDigits.length > 5) {
    formattedCnpj = `${formattedCnpj.slice(0, 6)}.${formattedOnlyDigits.slice(5)}`
  }
  if (formattedOnlyDigits.length > 8) {
    formattedCnpj = `${formattedCnpj.slice(0, 10)}/${formattedOnlyDigits.slice(8)}`
  }
  if (formattedOnlyDigits.length > 12) {
    formattedCnpj = `${formattedCnpj.slice(0, 15)}-${formattedOnlyDigits.slice(12, 14)}`
  }

  e.target.value = formattedCnpj
}

export function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, '')

  if (cnpj.length !== 14) {
    return false
  }

  if (/^(\d)\1+$/.test(cnpj)) {
    return false
  }

  let size = cnpj.length - 2
  let numbers = cnpj.substring(0, size)
  const digits = cnpj.substring(size)
  let sum = 0
  let pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) {
      pos = 9
    }
  }

  let resultado = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (resultado !== parseInt(digits.charAt(0))) {
    return false
  }

  size++
  numbers = cnpj.substring(0, size)
  sum = 0
  pos = size - 7

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) {
      pos = 9
    }
  }

  resultado = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (resultado !== parseInt(digits.charAt(1))) {
    return false
  }

  return true
}
