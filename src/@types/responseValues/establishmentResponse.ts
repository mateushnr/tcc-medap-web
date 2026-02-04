export interface ResponseEstablishment {
  id: string
  name: string
  abbreviation: string
  cnpj: string
  establishmentType: string
  especiality?: string
  mainPhone: string
  secondaryPhone?: string
  targetCustomer: string
  email: string
  status: string
  establishmentAddress?: string

  postCode?: string
  street?: string
  number?: number
  neighborhood?: string
  city?: string
  state?: string
  compliment?: string
  latitude?: number
  longitude?: number
}

export interface ResponseEstablishmentWithPagination {
  data: ResponseEstablishment[]
  totalCount: number
}
