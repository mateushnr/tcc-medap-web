export interface Pet {
  petName: string
  specie: string
  breed?: string
  age?: string
  size: 'SMALL' | 'MEDIUM' | 'LARGE'
  sex: 'MALE' | 'FEMALE'
  status: string
}
