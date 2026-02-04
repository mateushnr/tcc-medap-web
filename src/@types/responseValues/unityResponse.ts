export interface ResponseUnity {
  id: string
  name: string
  abbreviation?: string
  cnpj?: string
  type: string
  especiality?: string
  mainPhone: string
  secondaryPhone?: string
  targetCustomer: string
  email: string
  establishmentBoundedName: string
  establishmentBoundedAbbreviation: string
  status: string
}

export interface ResponseUnityWithPagination {
  data: ResponseUnity[]
  totalCount: number
}
