export interface ResponseCustomer {
  id: string
  name: string
  cpf?: string
  email?: string
  cns?: string
  otherDocument?: string
  birthDate?: string
  mainPhone?: string
  secondaryPhone?: string
  isPatient: boolean
  isResponsible: boolean
  isTutor: boolean
  status: 'ACTIVE' | 'DEACTIVATED'

  customerAddress?: string
  customerEstablishment: string
}

export interface ResponseCustomerWithAddress {
  id: string
  name: string
  cpf?: string
  email?: string
  cns?: string
  otherDocument?: string
  birthDate?: string
  mainPhone?: string
  secondaryPhone?: string
  isPatient: boolean
  isResponsible: boolean
  isTutor: boolean
  status: 'ACTIVE' | 'DEACTIVATED'

  customerAddress?: string
  customerEstablishment: string

  patientResponsibleList?: string[]

  postCode?: string
  street?: string
  neighborhood?: string
  number?: number
  state?: string
  latitude?: number
  longitude?: number
  city?: string
  compliment?: string
}

export interface ResponseCustomerWithPagination {
  data: ResponseCustomer[]
  totalCount: number
}
