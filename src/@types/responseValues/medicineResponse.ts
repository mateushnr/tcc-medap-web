export interface ResponseMedicine {
  id: string
  name: string
  pharmaceuticalForm: string
  regulatoryCategory?: string
  activeIngredient?: string
  forUse: string
  status: 'ACTIVE' | 'DEACTIVATED'

  establishmentRegistered?: string
  establishmentRegisteredName?: string
  establishmentRegisteredAbbreviation?: string
}

export interface ResponseMedicineWithPagination {
  data: ResponseMedicine[]
  totalCount: number
}
