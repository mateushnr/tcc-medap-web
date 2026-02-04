import { ChangeEvent } from 'react'

export function handleFloatNumberChange(e: ChangeEvent<HTMLInputElement>) {
  const inputValue = e.target.value

  let formattedValue = inputValue.replace(/[^0-9.-]/g, '')

  if (formattedValue.includes('-') && formattedValue.lastIndexOf('-') !== 0) {
    const lastHyphenIndex = formattedValue.lastIndexOf('-')
    formattedValue =
      formattedValue.slice(0, lastHyphenIndex) +
      formattedValue.slice(lastHyphenIndex + 1)
  }

  if (formattedValue.includes('.') && formattedValue.indexOf('.') === 0) {
    const dotIndex = formattedValue.indexOf('.')
    formattedValue =
      formattedValue.slice(0, dotIndex) + formattedValue.slice(dotIndex + 1)
  }

  if (formattedValue.includes('.') && formattedValue.indexOf('.') === 0) {
    const dotIndex = formattedValue.indexOf('.')
    formattedValue =
      formattedValue.slice(0, dotIndex) + formattedValue.slice(dotIndex + 1)
  }

  if (
    formattedValue.includes('.') &&
    formattedValue.indexOf('.') === 1 &&
    formattedValue.charAt(0) === '-'
  ) {
    const dotIndex = formattedValue.indexOf('.')
    formattedValue =
      formattedValue.slice(0, dotIndex) + formattedValue.slice(dotIndex + 1)
  }

  const dotCount = formattedValue.split('.').length - 1

  if (dotCount > 1) {
    const lastDotIndex = formattedValue.lastIndexOf('.')
    formattedValue =
      formattedValue.slice(0, lastDotIndex) +
      formattedValue.slice(lastDotIndex + 1)
  }

  e.target.value = formattedValue
}
