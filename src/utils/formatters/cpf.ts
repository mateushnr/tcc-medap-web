import { ChangeEvent } from 'react'

export function handleCpfChange(e: ChangeEvent<HTMLInputElement>) {
  const formattedOnlyDigits = e.target.value.replace(/\D/g, '')

  let formattedCpf = formattedOnlyDigits
  if (formattedOnlyDigits.length > 3) {
    formattedCpf = `${formattedOnlyDigits.slice(0, 3)}.${formattedOnlyDigits.slice(3)}`
  }
  if (formattedOnlyDigits.length > 6) {
    formattedCpf = `${formattedCpf.slice(0, 7)}.${formattedOnlyDigits.slice(6)}`
  }
  if (formattedOnlyDigits.length > 9) {
    formattedCpf = `${formattedCpf.slice(0, 11)}-${formattedOnlyDigits.slice(9)}`
  }

  e.target.value = formattedCpf
}

export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, '')

  if (cpf.length !== 11) {
    return false
  }

  if (/^(\d)\1+$/.test(cpf)) {
    return false
  }

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let remainder = sum % 11
  const firstDigit = remainder < 2 ? 0 : 11 - remainder

  if (parseInt(cpf.charAt(9)) !== firstDigit) {
    return false
  }

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  remainder = sum % 11
  const secondDigit = remainder < 2 ? 0 : 11 - remainder

  if (parseInt(cpf.charAt(10)) !== secondDigit) {
    return false
  }

  return true
}
