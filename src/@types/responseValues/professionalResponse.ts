export interface ResponseProfessional {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  especiality?: string
  role: string
  birthDate?: string
  status: string
  boundedTo: string
  regionalDocumentType?: string
  regionalDocument?: string
  stateDocumentIssued?: string
  establishmentBoundedName: string
  establishmentBoundedAbbreviation: string
}

export interface ResponseProfessionalWithPagination {
  data: ResponseProfessional[]
  totalCount: number
}
