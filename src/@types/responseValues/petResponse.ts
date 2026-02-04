export interface ResponsePet {
  id: string
  petName: string
  specie: string
  breed?: string
  age?: string
  size: 'SMALL' | 'MEDIUM' | 'LARGE'
  sex: 'MALE' | 'FEMALE'
  status: 'ACTIVE' | 'DEACTIVATED'

  establishmentRegistered: string
  customerOwner: string
  cpfOwner?: string
  documentOwner?: string
  nameOwner?: string
}

export interface ResponsePetWithPagination {
  data: ResponsePet[]
  totalCount: number
}
