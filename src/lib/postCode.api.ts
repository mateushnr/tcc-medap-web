import { viaCepResponseType } from '@/@types/address'

export const searchAddressWithPostCode = async (
  postCode: string,
): Promise<viaCepResponseType | undefined> => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${postCode}/json/`)

    switch (response.status) {
      case 200: {
        const data = await response.json()
        return data
      }
      default: {
        return undefined
      }
    }
  } catch (error) {
    return undefined
  }
}
